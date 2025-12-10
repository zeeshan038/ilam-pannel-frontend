import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StaffIcon from "@/components/icons/staff";
import { Modal, Table, Spin, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, IdCard, FileText, DollarSign, GraduationCap } from "lucide-react";
import { useGetAllStaffQuery, useDeletestaffMutation, useUpdateStaffMutation, useCreateStaffMutation } from "../staffApi";
import { DeleteButton, EditButton, ViewButton } from "@/components/icons/action";
import toast from "react-hot-toast";

const ManageStaff = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [empId, setEmpId] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [CNIC, setCNIC] = useState("");
    const [salaryAmount, setSalaryAmount] = useState<string | number>("");
    const [role, setRole] = useState<string>("teacher");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classes, setClasses] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { data: allStaff, isLoading } = useGetAllStaffQuery({});

    const employees = allStaff?.employees || [];
    const teachers = employees.filter((e: any) => e.role === "teacher");

    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(id);
    }, [search]);

    const filteredTeachers = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        if (!q) return teachers;
        return teachers.filter((t: any) => {
            return [
                t?.name,
                t?.email,
                t?.empId,
                t?.phoneNo,
                t?.CNIC,
                t?.role,
            ]
                .filter(Boolean)
                .some((v: any) => String(v).toLowerCase().includes(q));
        });
    }, [teachers, debouncedSearch]);

    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteStaff, { isLoading: isDeleting }] = useDeletestaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
    const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
    const isEditMode = Boolean(selectedStaffId && isAddOpen);

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Emp ID", dataIndex: "empId", key: "empId" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phoneNo", key: "phoneNo" },
        { title: "CNIC", dataIndex: "CNIC", key: "CNIC" },
        { title: "Salary", dataIndex: "salaryAmount", key: "salaryAmount" },
        { title: "Status", dataIndex: "salaryStatus", key: "salaryStatus" },
        { title: "Role", dataIndex: "role", key: "role" },
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
                        onClick={() => { setSelectedStaffId(record.key); setIsViewOpen(true); }}
                    >
                        <ViewButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
                        onClick={() => { setSelectedStaffId(record.key); setIsAddOpen(true); }}
                    >
                        <EditButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => { setSelectedStaffId(record.key); setIsDeleteOpen(true); }}
                    >
                        <DeleteButton />
                    </Button>
                </div>
            ),
        },
    ];

    const tableData = filteredTeachers.map((t: any) => ({
        key: t._id,
        name: t.name,
        empId: t.empId,
        email: t.email,
        phoneNo: t.phoneNo,
        CNIC: t.CNIC,
        salaryAmount: t?.salary?.amount,
        salaryStatus: t.salaryStatus,
        role: t.role,
    }));

    const handleConfirmDelete = async () => {
        if (!selectedStaffId) return;
        try {
            const res: any = await deleteStaff(selectedStaffId).unwrap();
            toast.success(res?.msg || "Staff deleted successfully");
            setIsDeleteOpen(false);
            setSelectedStaffId(null);
        } catch (error: any) {
            const message = error?.data?.msg || error?.message || "Failed to delete staff";
            toast.error(message);
        }
    };

    // Prefill form when editing
    useEffect(() => {
        if (!isEditMode) return;
        const staff: any = employees.find((e: any) => e._id === selectedStaffId);
        if (!staff) return;
        setName(staff?.name || "");
        setEmail(staff?.email || "");
        setEmpId(staff?.empId || "");
        setPhoneNo(staff?.phoneNo || "");
        setCNIC(staff?.CNIC || "");
        setSalaryAmount(staff?.salary?.amount ?? "");
        setRole(staff?.role || "teacher");
        setClasses(Array.isArray(staff?.class) ? staff.class : []);
        setSubjects(Array.isArray(staff?.subject) ? staff.subject : []);
    }, [isEditMode, selectedStaffId, employees]);

    const handleSubmitStaff = async () => {
        try {
            const basePayload = {
                email,
                empId,
                name,
                phoneNo,
                CNIC,
                subjects: subjects,
                class: classes,
                salary: { amount: Number(salaryAmount) || 0 },
                role,
            };
            if (isEditMode && selectedStaffId) {
                const res: any = await updateStaff({ body: basePayload, staffId: selectedStaffId }).unwrap();
                toast.success(res?.msg || "Staff updated successfully");
            } else {
                const createPayload = { ...basePayload, password: email };
                const res: any = await createStaff(createPayload).unwrap();
                toast.success(res?.msg || "Staff created successfully");
            }
            setIsAddOpen(false);
            setSelectedStaffId(null);
        } catch (error: any) {
            const message = error?.data?.msg || error?.message || "Failed to create staff";
            toast.error(message);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl">Staff Management</h1>
                <Button
                    className="mt-2 px-8 cursor-pointer"
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                >
                    + Add Staff
                </Button>
            </div>

            {/* Top filter bar */}
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 md:px-6 md:py-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                <Input
                    placeholder="Search "
                    className="md:flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select className="w-full md:w-56 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select Subject</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                </select>

                <div className="w-full md:w-auto flex md:justify-end">
                    <div className="inline-flex items-center bg-gray-100  rounded-md px-4 py-2 text-xs font-medium ">
                        Total: {isLoading ? '...' : filteredTeachers.length}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-10 md:px-8 md:py-14 shadow-sm flex flex-col items-center justify-center text-center gap-3">
                    <Spin size="large" />
                    <p className="text-sm text-gray-500">Loading staff...</p>
                </div>
            ) : filteredTeachers.length > 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm">
                    <h2 className="text-base font-semibold mb-3">Teachers</h2>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        loading={isLoading}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </div>
            ) : (
                <div className="rounded-2xl  border border-gray-100 bg-white px-4 py-10 md:px-8 md:py-14 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <span className="text-2xl">
                            <StaffIcon width={24} height={24} />
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">No staff found</p>
                </div>
            )}

            {/* View staff modal */}
            {isViewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Staff Details</h2>
                            <button
                                type="button"
                                className="text-sm cursor-pointer text-gray-500 hover:text-gray-800"
                                onClick={() => { setIsViewOpen(false); setSelectedStaffId(null); }}
                            >
                                Close
                            </button>
                        </div>
                        {(() => {
                            const staff: any = employees.find((e: any) => e._id === selectedStaffId);
                            if (!staff) return <p className="text-sm text-gray-600">No details found.</p>;
                            return (
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{staff.name}</p></div>
                                        <div><p className="text-xs text-gray-500">Emp ID</p><p className="font-medium">{staff.empId}</p></div>
                                        <div><p className="text-xs text-gray-500">Email</p><p className="font-medium break-all">{staff.email}</p></div>
                                        <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{staff.phoneNo}</p></div>
                                        <div><p className="text-xs text-gray-500">CNIC</p><p className="font-medium">{staff.CNIC}</p></div>
                                        <div><p className="text-xs text-gray-500">Salary</p><p className="font-medium">{staff?.salary?.amount}</p></div>
                                        <div><p className="text-xs text-gray-500">Salary Status</p><p className="font-medium">{staff.salaryStatus}</p></div>
                                        <div><p className="text-xs text-gray-500">Role</p><p className="font-medium">{staff.role}</p></div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
                        <h2 className="text-base font-semibold mb-2">Delete Staff</h2>
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this staff? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => { setIsDeleteOpen(false); setSelectedStaffId(null); }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                title={isEditMode ? "Update Staff" : "Add Staff"}
                open={isAddOpen}
                centered
                onOk={handleSubmitStaff}
                onCancel={() => { setIsAddOpen(false); setSelectedStaffId(null); }}
                okText={isEditMode ? "Update" : "Save"}
                cancelText="Cancel"
                confirmLoading={isEditMode ? isUpdating : isCreating}
                okButtonProps={{
                    style: {
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                    },
                }}
                cancelButtonProps={{
                    className: 'btn-no-hover',
                }}
            >
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                    {/* Personal Information */}
                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
                            <span className="inline-flex items-center gap-2">
                                <StaffIcon width={12} height={12} />
                                <span>Personal Information</span>
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <User className="h-3 w-3 text-black" />
                                    <span>
                                        Full Name <span className="text-red-500">*</span>
                                    </span>
                                </p>
                                <Input placeholder="Enter teacher's full name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-black" />
                                    <span>
                                        Email Address <span className="text-red-500">*</span>
                                    </span>
                                </p>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {
                                    email && (
                                        <p className="text-xs text-blue-700">The email be used as password</p>
                                    )
                                }
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <IdCard className="h-3 w-3 text-black" />
                                    <span>Employee ID</span>
                                </p>
                                <Input placeholder="EMP-001" value={empId} onChange={(e) => setEmpId(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-black" />
                                    <span>Phone Number</span>
                                </p>
                                <Input placeholder="+923001234567" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-black" />
                                    <span>CNIC</span>
                                </p>
                                <Input placeholder="35202-1234567-1" value={CNIC} onChange={(e) => setCNIC(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-black" />
                                    <span>Salary (PKR)</span>
                                </p>
                                <Input type="number" placeholder="Amount" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <User className="h-3 w-3 text-black" />
                                    <span>Role</span>
                                </p>
                                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                    <option value="coordinator">Coordinator</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                <FileText className="h-3 w-3 text-black" />
                                <span>Classes</span>
                            </p>
                            {(() => {
                                const classOptions = ["Nursery", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(c => ({ label: c, value: c }));
                                return (
                                    <Select
                                        mode="multiple"
                                        placeholder="Select classes"
                                        value={classes}
                                        onChange={(vals) => setClasses(vals as string[])}
                                        options={classOptions}
                                        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                        className="w-full text-xs"
                                    />
                                );
                            })()}
                        </div>
                    </section>

                    {/* Subject Assignment */}
                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
                            <span className="inline-flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-black" />
                                <span>Subject Assignment</span>
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 text-xs">
                            {[
                                'English',
                                'Urdu',
                                'Islamiyat',
                                'Pakistan Studies (PST)',
                                'Social Studies (SST)',
                                'Science',
                                'Mathematics',
                                'Physics',
                                'Biology',
                                'Chemistry',
                            ].map((subj) => (
                                <label
                                    key={subj}
                                    className={`flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer transition-colors ${subjects.includes(subj)
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 bg-white hover:border-emerald-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={subjects.includes(subj)}
                                            onChange={(e) => {
                                                setSubjects((prev) => {
                                                    if (e.target.checked) return Array.from(new Set([...prev, subj]));
                                                    return prev.filter((s) => s !== subj);
                                                });
                                            }}
                                            className="h-3 w-3"
                                        />
                                        <span>{subj}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>
            </Modal>
        </div>
    )
}

export default ManageStaff;