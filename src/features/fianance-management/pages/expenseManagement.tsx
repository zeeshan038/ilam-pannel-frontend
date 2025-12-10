import { Table, Modal } from "antd";
import { DeleteButton, EditButton, ViewButton } from "@/components/icons/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoneyBagIcon, TotalExpenses } from "@/components/icons/expense";
import { useCreateExpenseMutation, useGetAllExpensesQuery, useGetExpenseSummaryQuery, useUpdateExpenseMutation, useDeleteExpenseMutation } from "../api/expenseApi";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";

const ExpenseManagement = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
    const [viewData, setViewData] = useState<any>(null);

    // Query Params State
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [oldest, setOldest] = useState("");
    const [date, setDate] = useState("");

    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
    const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

    const limit = 10;

    const { data: allExpensesData, isLoading: isExpensesLoading } = useGetAllExpensesQuery({
        search,
        page,
        limit,
        oldest,
        date
    });

    const { data: expenseSummaryData, isLoading: isExpenseSummaryLoading } = useGetExpenseSummaryQuery({});
    console.log("expenseSummaryData", expenseSummaryData)

    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            if (selectedExpenseId) {
                await updateExpense({
                    id: selectedExpenseId,
                    ...formData,
                    amount: Number(formData.amount)
                }).unwrap();
                toast.success("Expense updated successfully");
            } else {
                await createExpense({
                    ...formData,
                    amount: Number(formData.amount)
                }).unwrap();
                toast.success("Expense created successfully");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save expense:", error);
            toast.error("Failed to save expense");
        }
    };

    const resetForm = () => {
        setFormData({
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split('T')[0]
        });
        setSelectedExpenseId(null);
    };

    const handleEdit = (record: any) => {
        setFormData({
            amount: record.amount,
            category: record.category,
            description: record.description,
            date: new Date(record.date).toISOString().split('T')[0]
        });
        setSelectedExpenseId(record._id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setSelectedExpenseId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedExpenseId) return;
        try {
            await deleteExpense(selectedExpenseId).unwrap();
            toast.success("Expense deleted successfully");
            setIsDeleteModalOpen(false);
            setSelectedExpenseId(null);
        } catch (error) {
            console.error("Failed to delete expense:", error);
            toast.error("Failed to delete expense");
        }
    };

    const handleView = (record: any) => {
        setViewData(record);
        setIsViewModalOpen(true);
    };

    const categories = [
        "Food",
        "Transportation",
        "Utilities",
        "Entertainment",
        "Office Supplies",
        "Maintenance",
        "Salary"
    ];

    const columns = [
        {
            title: "SNO",
            key: "sno",
            render: (_: any, __: any, index: number) => (
                <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                    #{((page - 1) * limit) + index + 1}
                </span>
            ),
        },
        {
            title: "DESCRIPTION",
            key: "description",
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <span className="font-medium">{record.category}</span>
                    <span className="text-gray-500 text-[10px]">{record.description}</span>
                </div>
            ),
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => (
                <span className="font-semibold text-emerald-600">
                    PKR {amount.toLocaleString()}
                </span>
            ),
        },
        {
            title: "DATE",
            dataIndex: "date",
            key: "date",
            render: (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
        {
            title: "TIME",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },

        {
            title: "ACTIONS",
            key: "actions",
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
                        onClick={() => handleView(record)}
                    >
                        <ViewButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
                        onClick={() => handleEdit(record)}
                    >
                        <EditButton />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer p-0 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(record._id)}
                    >
                        <DeleteButton />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Expense Management</h1>
                        <p className="text-sm text-gray-500">
                            Manage daily expenses and track spending
                        </p>

                    </div>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span role="img" aria-label="wallet" className="text-sm">
                            💵
                        </span>
                        <span>Add Expense</span>
                    </Button>
                </div>

                {/* Top card: stats + add button */}
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 md:px-6 md:py-5 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            <div className="rounded-xl bg-gray-50 border  rounded-md px-4 py-3 flex flex-col md:flex-row gap-2 items-center">
                                <MoneyBagIcon width={42} height={42} />
                                <div>
                                    <p className="text-xs font-medium ">Total Expenses</p>
                                    <p className="mt-1 text-center text-2xl font-bold ">
                                        {isExpenseSummaryLoading ? "..." : expenseSummaryData?.summary?.totalExpensesCount || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-xl border bg-green-50 px-4 py-3 flex  flex-col md:flex-row ">
                                <TotalExpenses width={42} height={42} />
                                <div>
                                    <p className="text-xs font-medium ">Total Amount</p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {isExpenseSummaryLoading ? "..." : `PKR ${expenseSummaryData?.summary?.totalExpenses?.toLocaleString() || 0}`}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Search + sort + filters */}
                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                placeholder="Search expenses..."
                                className="w-full"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                            <select
                                className="w-40 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                onChange={(e) => {
                                    setOldest(e.target.value === "Oldest First" ? "true" : "");
                                    setPage(1);
                                }}
                            >
                                <option>Latest First</option>
                                <option>Oldest First</option>
                            </select>

                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4"
                                onClick={() => setShowFilters((prev) => !prev)}
                            >
                                Filters
                            </Button>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                    >
                        <div className="flex flex-col md:flex-row gap-3 md:items-end border-t border-gray-100 pt-4">
                            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                                <p className="text-xs font-medium text-gray-600">Date</p>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        className="text-xs"
                                        value={date}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex md:items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50 w-full md:w-auto"
                                    onClick={() => {
                                        setSearch("");
                                        setDate("");
                                        setOldest("");
                                        setPage(1);
                                    }}
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={allExpensesData?.expenses || []}
                        loading={isExpensesLoading}
                        rowKey="_id"
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: page,
                            pageSize: limit,
                            total: allExpensesData?.total || 0,
                            onChange: (newPage) => setPage(newPage),
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} expenses`,
                        }}
                    />
                </div>
            </div>
            {/* Add/Edit Modal */}
            < Modal
                title={selectedExpenseId ? "Edit Expense" : "Add New Expense"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                footer={null}
                centered
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (PKR) <span className="text-red-500">*</span></Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="0.00"
                            required
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="category"
                                name="category"
                                list="category-options"
                                placeholder="Select or type category"
                                required
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                            <datalist id="category-options">
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="What was this expense for?"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={isCreating || isUpdating}
                        >
                            {isCreating || isUpdating ? "Saving..." : (selectedExpenseId ? "Update Expense" : "Add Expense")}
                        </Button>
                    </div>
                </form>
            </Modal >

            {/* View Modal */}
            < Modal
                title="Expense Details"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={
                    [
                        <Button key="close" onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                    ]}
                centered
            >
                {viewData && (
                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Amount</p>
                                <p className="text-lg font-bold text-emerald-600">PKR {viewData.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Date</p>
                                <p className="text-sm">{new Date(viewData.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Category</p>
                                <p className="text-sm font-medium">{viewData.category}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Created At</p>
                                <p className="text-sm">{new Date(viewData.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 font-medium">Description</p>
                                <p className="text-sm text-gray-700">{viewData.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal >

            {/* Delete Confirmation Modal */}
            < Modal
                title="Delete Expense"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onOk={confirmDelete}
                okText="Delete"
                okButtonProps={{ danger: true, loading: isDeleting }}
                centered
            >
                <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            </Modal >
        </>
    );
};

export default ExpenseManagement;