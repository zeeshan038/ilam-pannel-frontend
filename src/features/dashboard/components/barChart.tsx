import { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetFeeCollectionReportQuery } from "../api/dashboardApi";

const StdBarChart = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const { data, isLoading, isError } = useGetFeeCollectionReportQuery(selectedYear.toString());

    const years = [2024, 2025, 2026, 2027];

    // Map API data to chart format
    const chartData = data?.monthlyData?.map((item: any) => ({
        month: item.monthName.substring(0, 3),
        earnings: item.totalCollected || 0,
        expense: item.totalExpenses || 0,
    })) || [];

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                    </div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-end gap-6 mb-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-[300px] w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm h-full flex items-center justify-center">
                <div className="text-red-500">Error loading earnings data</div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-lg font-bold text-gray-800">Earnings</div>
                    {/* Year selector */}
                    <div className="relative mt-1">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer appearance-none pr-6"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Three dots menu */}
                <button className="text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="4" cy="10" r="1.3" />
                        <circle cx="10" cy="10" r="1.3" />
                        <circle cx="16" cy="10" r="1.3" />
                    </svg>
                </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                    <span className="text-xs text-gray-600">Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-xs text-gray-600">Expense</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                        barGap={2}
                    >
                        <CartesianGrid vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            labelStyle={{ fontWeight: 500 }}
                        />
                        <Bar
                            dataKey="earnings"
                            fill="black"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={20}
                        />
                        <Bar
                            dataKey="expense"
                            fill="gray"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StdBarChart;