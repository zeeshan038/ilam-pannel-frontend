import { useState } from "react";
import { Modal } from "antd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bonuses, DeductionIcon, GrossSalaryIcon, NetSalaryIcon } from "@/components/icons/salary";
import { FilterIcon } from "lucide-react";

const SalaryManagement = () => {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Search teachers, emails, notes, transaction IDs..."
                        className="w-full"
                    />
                </div>
                <div className="flex md:items-center">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer md:w-auto border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => setIsFilterModalOpen(true)}
                    >
                        <FilterIcon width={20} height={20} />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Empty state */}
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 md:px-8 md:py-16 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-4xl text-gray-300">$</div>
                <p className="text-sm font-medium text-gray-600">No salary records found</p>
                <p className="text-xs text-gray-400">
                    Get started by adding your first salary record
                </p>
            </div>

            <Modal
                title="Generate Salaries"
                centered
                open={isGenerateModalOpen}
                onOk={() => setIsGenerateModalOpen(false)}
                onCancel={() => setIsGenerateModalOpen(false)}
                okText="Generate"
                cancelText="Cancel"
                okButtonProps={{
                    style: {
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                <div className="mt-2 space-y-4">
                    <p className="text-xs text-gray-600">
                        Configure the period and filters for which you want to generate salaries.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Month</p>
                            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>Select Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Year</p>
                            <Input placeholder="2025" />
                        </div>
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

            <Modal
                title="Filter Salaries"
                centered
                open={isFilterModalOpen}
                onOk={() => setIsFilterModalOpen(false)}
                onCancel={() => setIsFilterModalOpen(false)}
                okText="Apply Filters"
                cancelText="Cancel"
                okButtonProps={{
                    style: {
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                    },
                }}
            >
                <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Teacher</p>
                            <Input placeholder="Search teacher" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Status</p>
                            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>All</option>
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SalaryManagement;