import { AreaChart, Area, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetStudentTrendQuery } from "../api/dashboardApi";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const StdAreaChart = () => {
    const { data, isLoading, isError } = useGetStudentTrendQuery({});

    // Map the API data to chart format
    const chartData = data?.studentTrend?.map((count: number, index: number) => ({
        month: months[index],
        students: count,
    })) || [];

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm h-96 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm h-96 flex items-center justify-center">
                <div className="text-red-500">Error loading student trend</div>
            </div>
        );
    }

    return (
        <div>
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm font-medium text-gray-700">Students Trend</div>
                        <div className="text-xs text-gray-400">Year {data?.year || 2025}</div>
                    </div>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 12 }}
                                labelStyle={{ fontWeight: 500 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="students"
                                stroke="#000000"
                                fill="#000000"
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StdAreaChart;