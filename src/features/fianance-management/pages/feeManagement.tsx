import { useState, useEffect } from "react";
import { Modal, Table } from "antd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BulkVoucher, Voucher } from "@/components/icons/voucher";
import { Balance, Fees, Overdue, PaidFees } from "@/components/icons/fees";
import { DeleteButton, EditButton, ViewButton } from "@/components/icons/action";
import { useGetAnalyticsQuery, useGetAllFeesQuery, useLazyGetMonthlyFeesVoucherQuery, useDeleteFeeMutation, useGetFeeQuery, useUpdateFeeMutation, useCreateFeeMutation } from "../api/feeApi";
import { useFindStudentBySerialNoQuery } from "../../student-management/studentApi";
import toast from "react-hot-toast";
import { FeeVoucherModal } from "../components/FeeVoucherModal";
import FeeVoucher from "../components/FeeVoucher";

const initialFormState = {
    studentSno: "",
    feeType: "",
    academicYear: "",
    amount: "",
    tuitionFee: "",
    admissionFee: "",
    transportFee: "",
    scholarship: "No Scholarship",
    class: "",
    section: "",
    paymentStatus: "",
    dueDate: "",
};

const FeeManagement = () => {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isCreateFeeModalOpen, setIsCreateFeeModalOpen] = useState(false);
    const [generationType, setGenerationType] = useState<"bulk" | "monthly">(
        "bulk",
    );
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [feeType, setFeeType] = useState("");
    const [feeStatus, setFeeStatus] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [formData, setFormData] = useState(initialFormState);
    const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [debouncedStudentSno, setDebouncedStudentSno] = useState("");
    const [selectedFeeType, setSelectedFeeType] = useState<string>("Monthly Fee");
    const [deleteFee, { isLoading: isDeleting }] = useDeleteFeeMutation();
    const [updateFee, { isLoading: isUpdating }] = useUpdateFeeMutation();
    const [createFee, { isLoading: isCreating }] = useCreateFeeMutation();

    // Voucher Modal State
    const [generatedVouchers, setGeneratedVouchers] = useState<any[]>([]);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    const [triggerGetMonthlyVoucher, { isLoading: isGeneratingVoucher }] = useLazyGetMonthlyFeesVoucherQuery();
    const { data: selectedFee, isLoading: isFeeLoading } = useGetFeeQuery(selectedFeeId, {
        skip: !selectedFeeId,
    });

    const {
        currentData: currentStudentData,
        isLoading: isLoadingStudent,
        isFetching: isFetchingStudent,
        isError: isStudentError,
        error: studentError,
    } = useFindStudentBySerialNoQuery(debouncedStudentSno, {
        skip: !debouncedStudentSno || !!selectedFeeId,
        refetchOnMountOrArgChange: true,
    });

    const { data: analyticsData, isLoading } = useGetAnalyticsQuery({});
    const { data: allFees, isLoading: allFeesLoading, isError: isFeesError } = useGetAllFeesQuery({
        search: debouncedSearch,
        feeType,
        feeStatus,
        page,
        limit,

    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (formData.studentSno && !selectedFeeId) {
            const timer = setTimeout(() => {
                setDebouncedStudentSno(formData.studentSno);
            }, 500);

            return () => clearTimeout(timer);
        } else if (!formData.studentSno) {
            setDebouncedStudentSno("");
        }
    }, [formData.studentSno, selectedFeeId]);

    useEffect(() => {
        if (currentStudentData?.status && currentStudentData?.student && !selectedFeeId) {
            const student = currentStudentData.student;
            setFormData(prev => ({
                ...prev,
                amount: student.feeAmount?.toString() || student.monthlyFee?.toString() || "",
                tuitionFee: student.feeAmount?.toString() || student.monthlyFee?.toString() || "",
                admissionFee: student.admissionFee?.toString() || student.addmissionFee?.toString() || "",
                transportFee: student.transportFee?.toString() || "",
                scholarship: student.scholarship || "No Scholarship",
                class: student.class || "",
                section: student.section || "",
                academicYear: student.sessionYear || student.year || student.academicYear || new Date().getFullYear().toString(),
                paymentStatus: "unpaid",
                feeType: "Monthly Fee",
            }));
        }
    }, [currentStudentData, selectedFeeId]);


    useEffect(() => {
        if (selectedFee && isCreateFeeModalOpen && selectedFeeId) {
            const feeData = selectedFee.fee || selectedFee;
            setFormData({
                studentSno: feeData.serialNumber || feeData.student?.serialNumber || "",
                feeType: feeData.feeType || "",
                academicYear: feeData.year?.toString() || "",
                dueDate: feeData.dueDate ? new Date(feeData.dueDate).toISOString().split('T')[0] : "",
                amount: feeData.amount?.toString() || "",
                tuitionFee: feeData.breakdown?.amount?.toString() || (feeData.amount?.toString()) || "",
                admissionFee: feeData.breakdown?.admissionFee?.toString() || "",
                transportFee: feeData.transportFee?.toString() || "",
                scholarship: feeData.scholarship || "No Scholarship",
                class: feeData.class || "",
                section: feeData.section || "",
                paymentStatus: feeData.paymentStatus || "",
            });
        } else if (isCreateFeeModalOpen && !selectedFeeId) {
            setFormData(initialFormState);
            setDebouncedStudentSno("");
        }
    }, [selectedFee, isCreateFeeModalOpen, selectedFeeId]);

    const handleSaveFee = async () => {
        console.log("Form Data:", formData);

        if (!formData.studentSno) {
            toast.error("Student SNO is required");
            return;
        }

        // Ensure student data is loaded for new fees
        if (!selectedFeeId && !currentStudentData?.student?._id) {
            toast.error("Please wait for student details to load");
            return;
        }

        if (!formData.feeType) {
            toast.error("Fee Type is required");
            return;
        }
        if (!formData.academicYear) {
            toast.error("Academic Year is required");
            return;
        }

        const tuitionFee = Number(formData.amount) || 0;
        const admissionFee = Number(formData.admissionFee) || 0;
        const transportFee = Number(formData.transportFee) || 0;
        const totalAmount = tuitionFee + admissionFee + transportFee;

        const payload = {
            serialNumber: formData.studentSno,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            class: formData.class,
            section: formData.section,
            amount: totalAmount,
            paidAmount: 0,
            feeType: formData.feeType,
            paymentStatus: "unpaid",
        };

        try {
            if (selectedFeeId) {
                const res = await updateFee({
                    id: selectedFeeId,
                    ...payload
                }).unwrap();
                toast.success(res.msg || "Fee updated successfully");
            } else {
                const res = await createFee({ studentId: currentStudentData?.student?._id, body: payload }).unwrap();
                toast.success(res.msg || "Fee created successfully");
            }
            setIsCreateFeeModalOpen(false);
            setSelectedFeeId(null);
        } catch (error: any) {
            console.error("Failed to save fee:", error);
            toast.error(error?.data?.message || "Failed to save fee");
        }

    };

    const handleGenerateVouchers = async () => {
        if (generationType === "monthly") {
            if (!selectedMonth || !selectedYear || !selectedFeeType) {
                toast.error("Please select month, year and fee type");
                return;
            }
            try {
                const res = await triggerGetMonthlyVoucher({
                    month: selectedMonth,
                    year: selectedYear,
                    feeType: selectedFeeType,
                    class: selectedClass
                }).unwrap();
                console.log("response", res);

                let vouchers = [];
                if (Array.isArray(res)) {
                    vouchers = res;
                } else if (res.fees && Array.isArray(res.fees)) {
                    vouchers = res.fees;
                } else if (res.data && Array.isArray(res.data)) {
                    vouchers = res.data;
                } else if (res.vouchers && Array.isArray(res.vouchers)) {
                    vouchers = res.vouchers;
                }

                if (vouchers.length > 0) {
                    setGeneratedVouchers(vouchers);
                    setIsVoucherModalOpen(true);
                    toast.success(res.msg || "Vouchers generated successfully");
                    setIsGenerateModalOpen(false);
                } else {
                    console.log("No vouchers found in response:", res);
                    toast.error("Vouchers generated but no data returned to display.");
                }

            } catch (error: any) {
                console.error("Voucher generation error:", error);
                toast.error("Failed to generate vouchers", error?.message);
            }
        }
    };

    const feeViewData = selectedFee?.fee || selectedFee;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClearFilters = () => {
        setSearch("");
        setFeeType("");
        setFeeStatus("");
        setPage(1);
    };

    const columns = [
        {
            title: "Serial No",
            dataIndex: "serialNumber",
            key: "serialNumber",
            render: (serialNumber: string) => serialNumber || "N/A",
        },
        {
            title: "Student Name",
            dataIndex: "name",
            key: "name",
            render: (name: string) => name || "N/A",
        },
        {
            title: "Class",
            dataIndex: "class",
            key: "class",
            render: (className: string) => className || "N/A",
        },
        {
            title: "Section",
            dataIndex: "section",
            key: "section",
            render: (section: string) => section || "N/A",
        },
        {
            title: "Month/Year",
            key: "monthYear",
            render: (_: any, record: any) => {
                if (record.month && record.year) {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return `${monthNames[record.month - 1]} ${record.year}`;
                }
                return "N/A";
            },
        },
        {
            title: "Fee Type",
            dataIndex: "feeType",
            key: "feeType",
            render: (feeType: string) => feeType || "N/A",
        },
        {
            title: "Transport Fee",
            dataIndex: "transportFee",
            key: "transportFee",
            render: (amount: number) => `Rs. ${amount?.toLocaleString() || 0}`,
        },
        {
            title: "Total Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `Rs. ${amount?.toLocaleString() || 0}`,
        },
        {
            title: "Paid Amount",
            dataIndex: "paidAmount",
            key: "paidAmount",
            render: (paidAmount: number) => `Rs. ${paidAmount?.toLocaleString() || 0}`,
        },
        {
            title: "Balance",
            key: "balance",
            render: (_: any, record: any) => {
                const balance = (record.amount || 0) - (record.paidAmount || 0);
                return `Rs. ${balance.toLocaleString()}`;
            },
        },
        {
            title: "Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status: string) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "paid"
                        ? "bg-green-100 text-green-800"
                        : status === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right" as const,
            width: 160,
            render: (_: any, record: any) => (
                <div className="flex gap-2 justify-end">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
                        onClick={() => {
                            setSelectedFeeId(record._id);
                            setIsViewModalOpen(true);
                        }}
                    >
                        <ViewButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
                        onClick={() => {
                            setSelectedFeeId(record._id);
                            setIsCreateFeeModalOpen(true);
                        }}
                    >
                        <EditButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                            setDeleteTargetId(record._id);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <DeleteButton />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full space-y-6" >
            {/* Header */}
            < div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3" >
                <div>
                    <h1 className="text-2xl font-semibold">Fee Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage student fees, payments, and generate vouchers
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        className="border-gray-300 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200"
                        onClick={() => {
                            setGenerationType("bulk");
                            setIsGenerateModalOpen(true);
                        }}
                    >
                        Generate Vouchers
                    </Button>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setIsCreateFeeModalOpen(true)}
                    >
                        Create Fee
                    </Button>
                </div>
            </div >

            {/* Summary cards */}
            < div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Fees width={32} height={32} />
                            <h1> Total Fees</h1>
                        </div>
                        <p className="mt-1 text-lg font-bold text-center">
                            {isLoading ? "..." : `Rs. ${analyticsData?.analytics?.totalFees?.toLocaleString() || 0}`}
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <PaidFees width={32} height={32} />
                            <p className="text-xs text-gray-500">Total Paid</p>
                        </div>
                        <p className="mt-1 text-lg font-bold text-center">
                            {isLoading ? "..." : `Rs. ${analyticsData?.analytics?.totalPaid?.toLocaleString() || 0}`}
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Balance width={32} height={32} />
                            <p className="text-xs text-gray-500">Balance</p>
                        </div>
                        <p className="mt-1 text-lg font-bold text-center">
                            {isLoading ? "..." : `Rs. ${analyticsData?.analytics?.balance?.toLocaleString() || 0}`}
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Overdue width={32} height={32} />
                            <p className="text-xs text-gray-500">Overdue</p>
                        </div>

                        <p className="mt-1 text-lg font-bold text-center">
                            {isLoading ? "..." : `Rs. ${analyticsData?.analytics?.overdue?.toLocaleString() || 0}`}
                        </p>
                    </div>
                </div>
            </div >

            {/* Filters */}
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-center" >
                <div className="flex-1 min-w-[200px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Student Name</p>
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 min-w-[160px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Status</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={feeStatus}
                        onChange={(e) => setFeeStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                    </select>
                </div>

                <div className="flex-1 min-w-[160px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Fee Type</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Monthly Fee">Monthly Fee</option>
                        <option value="Admission Fee">Admission Fee</option>
                        <option value="Transport Fee">Transport Fee</option>
                        <option value="Exam Fee">Exam Fee</option>
                    </select>
                </div>

                <div className="flex md:items-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full md:w-auto border-gray-300 cursor-pointer"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div >

            {/* Fee Table */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden" >
                <Table
                    columns={columns}
                    dataSource={allFees?.fees || []}
                    loading={allFeesLoading}
                    rowKey="_id"
                    scroll={{ x: "max-content" }}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: allFees?.total || 0,
                        onChange: (newPage) => {
                            setPage(newPage);
                        },
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} fees`,
                    }}
                />
                {isFeesError && <p className="text-red-500 p-4 text-sm">Failed to load fees.</p>}
            </div >

            <Modal
                title={
                    <div className="flex items-center gap-2 mb-6">
                        <Voucher width={24} height={24} />
                        <span className="font-bold  text-black">Generate Vouchers</span>
                    </div>
                }
                centered
                open={isGenerateModalOpen}
                onOk={handleGenerateVouchers}
                onCancel={() => setIsGenerateModalOpen(false)}
                okText={isGeneratingVoucher ? "Generating..." : "Generate Vouchers"}
                okButtonProps={{
                    loading: isGeneratingVoucher,
                    style: {
                        marginTop: "20px",
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                <div className="mt-2 space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">

                            Voucher Generation Type
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* <button
                                    type="button"
                                    onClick={() => setGenerationType("bulk")}
                                    className={`cursor-pointer rounded-md px-4 py-3 text-left transition-colors border  ${generationType === "bulk"
                                        ? "border-black bg-gray-100 hover:bg-gray-200"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <p className="text-sm flex items-center gap-1 font-semibold text-gray-900">

                                        <Voucher width={30} height={30} />

                                    </p>
                                    <div className="flex mt-2 flex-col justify-center items-center">
                                        <h1 className="font-bold">  Bulk Generation</h1>
                                        <p className="text-xs text-gray-500 text-center">
                                            Generate vouchers for fees matching current filters
                                        </p>
                                    </div>

                                </button> */}
                            <button
                                type="button"
                                onClick={() => setGenerationType("monthly")}
                                className={`rounded-md cursor-pointer px-4 py-3 text-left transition-colors border  ${generationType === "monthly"
                                    ? "border-black bg-gray-100 hover:bg-gray-200"
                                    : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <p className="text-sm  flex items-center gap-2 font-semibold text-gray-900">
                                    <BulkVoucher width={30} height={30} />

                                </p>
                                <div className="flex flex-col mt-2 justify-center items-center">
                                    <h1 className="font-bold"> Monthly Generation</h1>
                                    <p className="mt-1 text-xs text-center text-gray-500">
                                        Generate monthly vouchers for all active students
                                    </p>
                                </div>

                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-blue-black">
                        <span className="font-semibold">Note:</span> This will generate
                        vouchers for all active students for the selected month. If fee
                        records don't exist, they will be created automatically.
                    </div>

                    {
                        generationType === "monthly" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">
                                        Month <span className="text-red-500">*</span>
                                    </p>
                                    <select
                                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        <option value="">Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">
                                        Academic Year <span className="text-red-500">*</span>
                                    </p>
                                    <Input
                                        placeholder="2025"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">
                                        Class
                                    </p>
                                    <Input
                                        placeholder="Enter Class"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">
                                        Fee Type <span className="text-red-500">*</span>
                                    </p>
                                    <select
                                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={selectedFeeType}
                                        onChange={(e) => setSelectedFeeType(e.target.value)}
                                    >
                                        <option value="Monthly Fee">Monthly Fee</option>
                                        <option value="Admission Fee">Admission Fee</option>
                                        <option value="Transport Fee">Transport Fee</option>
                                        <option value="Exam Fee">Exam Fee</option>
                                    </select>
                                </div>
                            </div>
                        )
                    }
                </div>
            </Modal>

            <Modal
                title={selectedFeeId ? "Edit Fee" : "Create New Fee"}
                centered
                width={800}
                open={isCreateFeeModalOpen}
                onOk={handleSaveFee}
                onCancel={() => {
                    setIsCreateFeeModalOpen(false);
                    setSelectedFeeId(null);
                }}
                okText={isUpdating || isCreating ? "Saving..." : (selectedFeeId ? "Update Fee" : "Create Fee")}
                cancelText="Cancel"
                okButtonProps={{
                    loading: isUpdating || isCreating,
                    style: {
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                {selectedFeeId && isFeeLoading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-gray-500">Loading fee details...</p>
                    </div>
                ) : (
                    <div className="mt-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                    Student SNO <span className="text-red-500">*</span>
                                </p>
                                <Input
                                    placeholder="Enter Student SNO"
                                    value={formData.studentSno}
                                    onChange={(e) => handleInputChange("studentSno", e.target.value)}
                                />
                                {!selectedFeeId && formData.studentSno && (
                                    <div className="mt-2">
                                        {isLoadingStudent ||
                                            isFetchingStudent ||
                                            formData.studentSno !== debouncedStudentSno ? (
                                            <p className="text-xs text-gray-500">Loading student info...</p>
                                        ) : currentStudentData?.status && currentStudentData?.student ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2 space-y-1">
                                                <p className="text-xs font-medium text-emerald-800">
                                                    {currentStudentData.student.name}
                                                </p>
                                                <p className="text-xs text-emerald-700">
                                                    Class: {currentStudentData.student.class} | Section: {currentStudentData.student.section}
                                                </p>
                                                <p className="text-xs text-emerald-700">
                                                    Father: {currentStudentData.student.fatherName}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {currentStudentData && currentStudentData.status === false && (
                                                    <p className="text-xs text-red-500">
                                                        {currentStudentData.msg || "Student not found"}
                                                    </p>
                                                )}

                                                {isStudentError && !currentStudentData && (
                                                    <p className="text-xs text-red-500">
                                                        {(studentError as any)?.data?.msg || "Student not found"}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                    Fee Type <span className="text-red-500">*</span>
                                </p>
                                <select
                                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.feeType}
                                    onChange={(e) => handleInputChange("feeType", e.target.value)}
                                >
                                    <option value="">Select Fee Type</option>
                                    <option value="Monthly Fee">Monthly Fee</option>
                                    <option value="Admission Fee">Admission Fee</option>
                                    <option value="Exam Fee">Exam Fee</option>
                                    <option value="Transport Fee">Transport Fee</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                    Academic Year <span className="text-red-500">*</span>
                                </p>
                                <Input
                                    placeholder="2025-2026"
                                    value={formData.academicYear}
                                    onChange={(e) => handleInputChange("academicYear", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                    {formData.feeType === "Monthly Fee" ? "Month" : "Due Date"} <span className="text-red-500">*</span>
                                </p>
                                {formData.feeType === "Monthly Fee" ? (
                                    <select
                                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.dueDate ? new Date(formData.dueDate).getMonth() + 1 : ""}
                                        onChange={(e) => {
                                            const month = parseInt(e.target.value);
                                            const year = formData.academicYear ? parseInt(formData.academicYear.substring(0, 4)) : new Date().getFullYear();
                                            // Construct date: 10th of the selected month
                                            const newDate = new Date(year, month - 1, 10);
                                            // Format as YYYY-MM-DD
                                            const formattedDate = newDate.toISOString().split('T')[0];
                                            handleInputChange("dueDate", formattedDate);
                                        }}
                                    >
                                        <option value="">Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                ) : (
                                    <Input
                                        type="date"
                                        placeholder="dd/mm/yyyy"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Input
                                placeholder="Class"
                                value={formData.class}
                                onChange={(e) => handleInputChange("class", e.target.value)}
                            />
                            <Input
                                placeholder="Section"
                                value={formData.section}
                                onChange={(e) => handleInputChange("section", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">Fee Structure</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">Amount</p>
                                    <Input
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange("amount", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">Admission Fee</p>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.admissionFee}
                                        onChange={(e) => handleInputChange("admissionFee", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-600">Transport Fee</p>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.transportFee}
                                        onChange={(e) => handleInputChange("transportFee", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">Scholarship</p>
                                <select
                                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.scholarship}
                                    onChange={(e) => handleInputChange("scholarship", e.target.value)}
                                >
                                    <option>No Scholarship</option>
                                    <option>Merit Scholarship</option>
                                    <option>Need-based Scholarship</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">Payment Status</p>
                                <select
                                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.paymentStatus}
                                    onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
                                >
                                    <option>Upaid</option>
                                    <option>Partial</option>
                                    <option>Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </Modal >

            {/* Delete Confirmation Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
                            <h2 className="text-base font-semibold mb-2">Delete Fee</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to delete this fee record? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setDeleteTargetId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                                    disabled={isDeleting}
                                    onClick={async () => {
                                        if (deleteTargetId) {
                                            try {
                                                await deleteFee(deleteTargetId).unwrap();
                                                toast.success("Fee deleted successfully");
                                                setIsDeleteModalOpen(false);
                                                setDeleteTargetId(null);
                                            } catch (error) {
                                                console.error("Failed to delete fee:", error);
                                                toast.error("Failed to delete fee");
                                            }
                                        }
                                    }}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* View Fee Modal */}
            {
                isViewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl mx-auto p-6 relative my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Fee Voucher</h2>
                                <button
                                    type="button"
                                    className="text-sm cursor-pointer text-gray-500 hover:text-gray-800"
                                    onClick={() => {
                                        setIsViewModalOpen(false);
                                        setSelectedFeeId(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                            {isFeeLoading ? (
                                <div className="flex justify-center py-8">
                                    <p className="text-gray-500">Loading fee details...</p>
                                </div>
                            ) : feeViewData ? (
                                <FeeVoucher data={feeViewData} />
                            ) : (
                                <div className="flex justify-center py-8">
                                    <p className="text-gray-500">No fee details available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
            {/* Voucher Modal */}
            {isVoucherModalOpen && (
                <FeeVoucherModal
                    vouchers={generatedVouchers}
                    onClose={() => setIsVoucherModalOpen(false)}
                />
            )}
        </div>
    );
};


export default FeeManagement;