import { useState, useEffect } from "react";
import { Modal, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bonuses, DeductionIcon, GrossSalaryIcon, NetSalaryIcon } from "@/components/icons/salary";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { useGetAllSalariesQuery, useGenrateSalariesMutation, useCreateSalaryMutation, useGetAnalyticsQuery, useDeleteSalaryMutation } from "../api/salaryApi";
import toast from "react-hot-toast";

interface SalaryRecord {
    _id: string;
    name: string;
    empId: string;
    employeeId: {
        _id: string;
        email: string;
        empId: string;
        profileImage: string;
    };
    role: string;
    amount: number;
    bonus: number;
    deductionAmount: number;
    paymentMode: string;
    status: string;
    month: number;
    year: number;
    salaryPaidAmount: number;
    salaryPaidAt: string | null;
    createdAt: string;
}

const getMonthName = (month: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1] || "N/A";
};

const SalaryManagement = () => {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);

    // Generate Salary Modal states
    const [generateMonth, setGenerateMonth] = useState("");
    const [generateYear, setGenerateYear] = useState("");

    // Filter states
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    //post queries
    const [generateSalariesMutation, { isLoading: generateSalariesLoading }] = useGenrateSalariesMutation();
    const [addSalaryMutation, { isLoading: addSalaryLoading }] = useCreateSalaryMutation();
    const [deleteSalary, { isLoading: isDeleting }] = useDeleteSalaryMutation();

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    //get queries
    const { data: allSalaries, isLoading: allSalariesLoading } = useGetAllSalariesQuery({
        search: debouncedSearch,
        month,
        year,
        paymentMode,
        status,
        role,
        page,
        limit,
    });
    const { data: analyticsData, isLoading: analyticsLoading } = useGetAnalyticsQuery({});
    console.log("allSalaries", allSalaries);

    const salaryData = allSalaries?.salaries || [];

    const handleClearFilters = () => {
        setSearch("");
        setMonth("");
        setYear("");
        setPaymentMode("");
        setStatus("");
        setRole("");
        setPage(1);
    };

    const handleGenerateSalaries = async () => {
        if (!generateMonth || !generateYear) {
            toast.error("Please select both month and year");
            return;
        }

        try {
            const res = await generateSalariesMutation({
                month: parseInt(generateMonth),
                year: parseInt(generateYear),
            }).unwrap();

            toast.success(res.msg || "Salaries generated successfully");
            setIsGenerateModalOpen(false);
            setGenerateMonth("");
            setGenerateYear("");
        } catch (error: any) {
            console.error("Failed to generate salaries:", error);
            toast.error(error?.data?.message || error?.data?.msg || "Failed to generate salaries");
        }
    };

    const handleDeleteSalary = async () => {
        if (!deleteTargetId) return;

        try {
            const res = await deleteSalary(deleteTargetId).unwrap();
            toast.success(res.msg || "Salary deleted successfully");
            setIsDeleteModalOpen(false);
            setDeleteTargetId(null);
        } catch (error: any) {
            console.error("Failed to delete salary:", error);
            toast.error(error?.data?.message || error?.data?.msg || "Failed to delete salary");
        }
    };

    const columns: ColumnsType<SalaryRecord> = [
        {
            title: "Id",
            key: "employee",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{record.empId}</p>
                </div>
            ),
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{record.name}</p>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <span className="capitalize">{role}</span>
            ),
        },
        {
            title: "Period",
            key: "period",
            render: (_, record) => (
                <span>{getMonthName(record.month)} {record.year}</span>
            ),
        },
        {
            title: "Gross Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => (
                <span className="font-medium">PKR {amount?.toLocaleString() || 0}</span>
            ),
        },
        {
            title: "Bonus",
            dataIndex: "bonus",
            key: "bonus",
            render: (bonus: number) => (
                <span className="text-green-600">+PKR {bonus?.toLocaleString() || 0}</span>
            ),
        },
        {
            title: "Deductions",
            dataIndex: "deductionAmount",
            key: "deductionAmount",
            render: (deduction: number) => (
                <span className="text-red-500">-PKR {deduction?.toLocaleString() || 0}</span>
            ),
        },
        {
            title: "Net Salary",
            key: "netSalary",
            render: (_, record) => {
                const net = (record.amount || 0) + (record.bonus || 0) - (record.deductionAmount || 0);
                return <span className="font-semibold">PKR {net.toLocaleString()}</span>;
            },
        },
        {
            title: "Payment Mode",
            dataIndex: "paymentMode",
            key: "paymentMode",
            render: (mode: string) => (
                <span className="capitalize">{mode}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "paid" ? "green" : status === "pending" ? "orange" : "default"}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                        title="Delete"
                        onClick={() => {
                            setDeleteTargetId(record._id);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Salary Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage teacher salary records and payments
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        className="cursor-pointer bg-gray-200 text-gray-600 hover:bg-gray-300"
                        onClick={() => setIsGenerateModalOpen(true)}
                    >
                        Generate Salaries
                    </Button>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setIsAddSalaryModalOpen(true)}
                    >
                        Add Salary
                    </Button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GrossSalaryIcon width={34} height={34} />

                        <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Gross</p>
                            <p className="mt-1 font-bold text-center">PKR 0</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <NetSalaryIcon width={34} height={34} />
                        <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Net</p>
                            <p className="mt-1 font-bold text-center">PKR 0</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DeductionIcon width={34} height={34} />
                        <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Deductions</p>
                            <p className="mt-1 font-bold text-center">PKR 0</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bonuses width={34} height={34} />
                        <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Bonuses</p>
                            <p className="mt-1 font-bold text-center">PKR 0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-end flex-wrap">
                <div className="flex-1 min-w-[180px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Search</p>
                    <Input
                        placeholder="Search by name, ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="min-w-[130px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Month</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option value="">All Months</option>
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

                <div className="min-w-[100px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Year</p>
                    <Input
                        placeholder="2025"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>

                <div className="min-w-[120px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Status</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                <div className="min-w-[120px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Role</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="teacher">Teacher</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="min-w-[140px] space-y-1">
                    <p className="text-xs font-medium text-gray-600">Payment Mode</p>
                    <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="">All Modes</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank Transfer</option>
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
            </div>
            {/* Salary Table or Empty State */}
            {salaryData.length > 0 || allSalariesLoading ? (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={salaryData}
                        rowKey="_id"
                        loading={allSalariesLoading}
                        pagination={{
                            current: page,
                            pageSize: limit,
                            total: allSalaries?.total || 0,
                            onChange: (newPage) => setPage(newPage),
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} records`,
                        }}
                        scroll={{ x: 1200 }}
                    />
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 md:px-8 md:py-16 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                    <div className="text-4xl text-gray-300">$</div>
                    <p className="text-sm font-medium text-gray-600">No salary records found</p>
                    <p className="text-xs text-gray-400">
                        Get started by adding your first salary record
                    </p>
                </div>
            )}

            <Modal
                title="Generate Salaries"
                centered
                open={isGenerateModalOpen}
                onOk={handleGenerateSalaries}
                onCancel={() => {
                    setIsGenerateModalOpen(false);
                    setGenerateMonth("");
                    setGenerateYear("");
                }}
                okText={generateSalariesLoading ? "Generating..." : "Generate"}
                cancelText="Cancel"
                okButtonProps={{
                    loading: generateSalariesLoading,
                    style: {
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                <div className="mt-2 space-y-4">
                    <p className="text-xs text-gray-600">
                        Configure the period for which you want to generate salaries for all employees.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">
                                Month <span className="text-red-500">*</span>
                            </p>
                            <select
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={generateMonth}
                                onChange={(e) => setGenerateMonth(e.target.value)}
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
                                Year <span className="text-red-500">*</span>
                            </p>
                            <Input
                                placeholder="2025"
                                value={generateYear}
                                onChange={(e) => setGenerateYear(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-800">
                        <span className="font-semibold">Note:</span> This will generate salary records for all active employees for the selected month and year.
                    </div>
                </div>
            </Modal>

            <Modal
                title="Add New Salary Record"
                centered
                width={900}
                open={isAddSalaryModalOpen}
                onOk={() => setIsAddSalaryModalOpen(false)}
                onCancel={() => setIsAddSalaryModalOpen(false)}
                okText="Create Salary"
                cancelText="Cancel"
                okButtonProps={{
                    style: {
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Teacher</p>
                            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>Select a teacher</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Status</p>
                            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>Pending</option>
                                <option>Paid</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Gross Amount (PKR)</p>
                            <Input placeholder="Enter gross salary amount" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Payment Method</p>
                            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>Bank Transfer</option>
                                <option>Cash</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Salary Record"
                centered
                open={isDeleteModalOpen}
                onOk={handleDeleteSalary}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTargetId(null);
                }}
                okText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                okButtonProps={{
                    loading: isDeleting,
                    danger: true,
                }}
            >
                <div className="py-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete this salary record? This action cannot be undone.
                    </p>
                </div>
            </Modal>

        </div>
    );
};

export default SalaryManagement;