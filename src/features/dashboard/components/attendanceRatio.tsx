import { Card, CardContent } from "@/components/ui/card";

const attendanceData = [
    {
        label: "Today Present Students",
        percentage: 10,
        color: "#000000ff", // Blue
    },
    {
        label: "Today Present Employees",
        percentage: 20,
        color: "#ef4444", // Red
    },
    {
        label: "This Month Fee Collection",
        percentage: 10,
        color: "#000000ff", // Blue
    },
];

const AttendanceRatio = () => {
    return (
        <Card className="border-0 rounded-3xl shadow-sm">
            <CardContent className="p-6 space-y-6">
                {attendanceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm font-medium">
                                {item.label}
                            </span>
                            <span
                                className="text-2xl font-bold"
                                style={{ color: item.color }}
                            >
                                {item.percentage}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default AttendanceRatio;
