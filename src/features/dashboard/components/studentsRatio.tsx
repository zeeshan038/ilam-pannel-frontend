import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useGetStudentRatioQuery } from "../api/dashboardApi";

const StudentsRatio = () => {

    const { data, isLoading, isError } = useGetStudentRatioQuery({});

    // Get percentages from API data
    const male = data?.studentRatio?.malePercentage || 0;
    const female = data?.studentRatio?.femalePercentage || 0;

    // SVG circle math for smooth arcs
    const size = 220;
    const center = size / 2;

    const outerRadius = 90; // female
    const innerRadius = 70; // male

    const outerCircumference = 2 * Math.PI * outerRadius;
    const innerCircumference = 2 * Math.PI * innerRadius;

    const femaleLength = (female / 100) * outerCircumference;
    const maleLength = (male / 100) * innerCircumference;

    if (isLoading) {
        return (
            <Card className="border-0 rounded-3xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-6 pt-2">
                    {/* Circular skeleton */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="w-44 h-44 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="absolute w-20 h-20 rounded-full bg-white"></div>
                        <div className="absolute w-14 h-14 rounded-full bg-gray-300 animate-pulse"></div>
                    </div>
                    {/* Legend skeleton */}
                    <div className="flex items-center justify-between gap-10 mt-4 w-full px-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="border-0 rounded-3xl shadow-sm h-full flex items-center justify-center">
                <div className="text-red-500">Error loading data</div>
            </Card>
        );
    }

    return (
        <Card className=" border-0 rounded-3xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
                <CardTitle className="text-[18px] font-semibold text-[#1f2937]">
                    Students
                </CardTitle>

                {/* three dots */}
                <button className="text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="4" cy="10" r="1.3" />
                        <circle cx="10" cy="10" r="1.3" />
                        <circle cx="16" cy="10" r="1.3" />
                    </svg>
                </button>
            </CardHeader>

            <CardContent className="flex flex-col items-center pb-6 pt-2">
                {/* Orbital gauge */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="overflow-visible"
                    >
                        {/* subtle background arcs */}
                        <circle
                            cx={center}
                            cy={center}
                            r={outerRadius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth={10}
                            opacity={0.4}
                        />
                        <circle
                            cx={center}
                            cy={center}
                            r={innerRadius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth={10}
                            opacity={0.6}
                        />

                        {/* FEMALE arc (outer, purple/dark) */}
                        <g transform={`rotate(-135 ${center} ${center})`}>
                            <circle
                                cx={center}
                                cy={center}
                                r={outerRadius}
                                fill="none"
                                stroke="#374151"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeDasharray={`${femaleLength} ${outerCircumference}`}
                            />
                        </g>

                        {/* MALE arc (inner, orange) */}
                        <g transform={`rotate(-135 ${center} ${center})`}>
                            <circle
                                cx={center}
                                cy={center}
                                r={innerRadius}
                                fill="none"
                                stroke="#f97316"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeDasharray={`${maleLength} ${innerCircumference}`}
                            />
                        </g>

                        {/* center white pill */}
                        <circle
                            cx={center}
                            cy={center}
                            r={42}
                            fill="#ffffff"
                            opacity={0.9}
                        />

                        {/* center colored circle */}
                        <circle cx={center} cy={center} r={26} fill="black" />
                    </svg>

                    {/* Center icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                </div>

                {/* Legend / percentages */}
                <div className="flex items-center justify-between gap-10 mt-4 w-full px-6">
                    {/* Male */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-[#f97316]" />
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="text-[11px]">♂</span> Male
                            </span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-900">
                            {male}%
                        </div>
                    </div>

                    {/* Female */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-[#374151]" />
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="text-[11px]">♀</span> Female
                            </span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-900">
                            {female}%
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StudentsRatio;
