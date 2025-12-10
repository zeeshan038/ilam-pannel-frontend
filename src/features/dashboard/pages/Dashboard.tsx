import { Expenses } from "@/components/icons/expense";
import StaffIcon from "@/components/icons/staff";
import { Fees } from "@/components/icons/fees";
import StdAreaChart from "../components/areaChart";
import StdBarChart from "../components/barChart";
import ChartPieDonut from "../components/pieChart";
import StudentsRatio from "../components/studentsRatio";
import { useGetAnalyticsQuery } from "../api/dashboardApi";

const AdminDashboard = () => {
    const { data, isLoading } = useGetAnalyticsQuery({});

    // Extract analytics data
    const totalStudents = data?.analytics?.totalStudents || 0;
    const totalStaff = data?.analytics?.totalStaff || 0;
    const currentMonthFees = data?.analytics?.currentMonthFeeCollected || 0;
    const currentMonthProfit = data?.analytics?.currentMonthProfit || 0;

    return (
        <div className="w-full">
            <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total Students */}
                <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-sm font-medium">Total Students</div>
                        <span className="text-xs text-gray-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L1 7L12 12L22 7L12 2ZM4.21 9.89V14.39C4.21 17.67 7.37 20 12 20C16.63 20 19.79 17.67 19.79 14.39V9.89L12 14L4.21 9.89Z" />
                            </svg>

                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            totalStudents
                        )}
                    </div>
                </div>

                {/* New Admissions */}
                <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-sm font-medium">Total Staff</div>
                        <span className="text-xs text-gray-400">
                            <StaffIcon width={20} height={20} />
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            totalStaff
                        )}
                    </div>
                </div>

                {/* Pending Fees */}
                <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-sm font-medium text-gray-500">Current Month Fees</div>
                        <span className="text-xs text-gray-400">
                            <Fees width={22} height={22} />
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            currentMonthFees
                        )}
                    </div>
                </div>

                {/* Present Today */}
                <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-sm font-medium">Current Month Profit</div>
                        <span className="text-xs text-gray-400">
                            <Expenses width={22} height={22} />
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            currentMonthProfit
                        )}
                    </div>
                </div>
            </div>
            {/* charts */}
            <div className="mt-10 flex flex-col lg:flex-row gap-6">
                {/* students area chart */}
                <div className="w-full lg:w-[70%]">
                    <StdBarChart />
                </div>


                {/* pie chart for feeColllection */}
                <div className="w-full lg:w-[30%]">
                    <ChartPieDonut />
                </div>

            </div>

            {/* 12‑month fees bar chart */}
            <div className="mt-10 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[80%]">
                    <StdAreaChart />
                </div>
                <div className="w-full lg:w-[20%]">
                    <StudentsRatio />
                </div>

            </div>
        </div>
    )
}

export default AdminDashboard;