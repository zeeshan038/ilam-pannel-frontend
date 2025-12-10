import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useGetFeeCollectionQuery } from "../api/dashboardApi";

const ChartPieDonut = () => {
    const { data, isLoading, isError } = useGetFeeCollectionQuery({});
    console.log("fee", data);
    // Map API data to chart format
    const totalCollected = data?.report?.totalCollected || 0;
    const totalRemaining = data?.report?.totalRemaining || 0;
    const totalFeeAmount = data?.report?.totalFeeAmount || 0;

    const chartData = [
        { name: "Collections", value: totalCollected, fill: "black" },
        { name: "Remainings", value: totalRemaining, fill: "#808080" },
    ];

    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="flex-1 pb-1">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-center space-y-2">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                        </div>
                        <div className="w-full max-w-[200px] aspect-square bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex items-center justify-center gap-8 w-full">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-12 w-px bg-gray-200"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="flex flex-col h-full items-center justify-center">
                <div className="text-red-500">Error loading fee collection data</div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-xl font-bold">Estimated Fee This Month</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-1">
                <div className="flex flex-col items-center gap-4">
                    {/* Estimation Label */}
                    <div className="text-center">
                        <div className="text-black text-sm font-medium flex items-center gap-1 justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="8" cy="8" r="2" fill="currentColor" />
                            </svg>
                            Estimation
                        </div>
                        <div className="text-4xl font-bold text-black mt-1">$ {totalFeeAmount}</div>
                    </div>

                    {/* Chart */}
                    <div className="w-full max-w-[200px] aspect-square">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    strokeWidth={0}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-8 w-full">
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-gray-900">$ {totalCollected}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="3" width="12" height="10" rx="1" stroke="#f97316" strokeWidth="1.5" fill="none" />
                                    <path d="M5 6h6M5 9h4" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span className="text-[#f97316] font-medium">Collections</span>
                            </div>
                        </div>

                        <div className="h-12 w-px bg-gray-200"></div>

                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-gray-900">$ {totalRemaining}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-pink-400 font-medium">Remainings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChartPieDonut;

