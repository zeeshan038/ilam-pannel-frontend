import { useState, useEffect } from 'react';
import { DatePicker, Table, Tag } from 'antd';
import { Button } from '../../components/ui/button';
import { HomeOutlined, CheckCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAttendanceMutation, useGetAttendanceByDateQuery } from './api/attendance';
import { useGetAllStaffQuery } from '../staff-management/staffApi';
import toast from 'react-hot-toast';

interface Employee {
    key: string;
    id: string;
    empId: string;
    name: string;
    fatherName: string;
    role: string;
    status: 'P' | 'L' | 'A' | '';
}

const EmployeeAttendance = () => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [attendanceData, setAttendanceData] = useState<Employee[]>([]);

    // Fetch staff data only when on step 2
    const { data: staffData, isLoading: staffLoading } = useGetAllStaffQuery({}, {
        skip: step === 1
    });

    // Fetch attendance data for selected date
    const { data: attendanceRecords } = useGetAttendanceByDateQuery(
        selectedDate.format('YYYY-MM-DD'),
        { skip: step === 1 }
    );

    const [attendanceMutation] = useAttendanceMutation();

    useEffect(() => {
        if (step === 2 && staffData?.employees) {
            const attendanceMap = new Map();
            if (attendanceRecords?.attendance) {
                attendanceRecords.attendance.forEach((record: any) => {
                    const statusMap: { [key: string]: 'P' | 'L' | 'A' } = {
                        'Present': 'P',
                        'Leave': 'L',
                        'Absent': 'A'
                    };
                    // Use teacherId to match with staff._id
                    attendanceMap.set(record.teacherId, statusMap[record.status] || '');
                });
            }

            const mappedData: Employee[] = staffData.employees.map((staff: any) => ({
                key: staff._id,
                id: staff._id,
                empId: staff.empId,
                name: staff.employeeName || staff.name || 'Unknown',
                fatherName: staff.fatherName || staff.guardianName || 'N/A',
                role: staff.designation || staff.role || 'Staff',
                status: attendanceMap.get(staff._id) || '' as const,
            }));
            setAttendanceData(mappedData);
        }
    }, [step, staffData, attendanceRecords]);

    const handleStatusChange = async (key: string, newStatus: 'P' | 'L' | 'A') => {

        const employee = attendanceData.find(item => item.key === key);
        if (!employee) return;

        // Map status to API format
        const statusMap = {
            'P': 'Present',
            'L': 'Leave',
            'A': 'Absent'
        };

        try {
            // Submit attendance to API
            await attendanceMutation({
                empId: employee.id,
                body: {
                    date: selectedDate.format('YYYY-MM-DD'),
                    status: statusMap[newStatus]
                }
            }).unwrap();

            // Update local state after successful submission
            setAttendanceData(prev => prev.map(item =>
                item.key === key ? { ...item, status: newStatus } : item
            ));

            toast.success(`Attendance marked as ${statusMap[newStatus]} for ${employee.name}`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to mark attendance');
            console.error('Attendance error:', error);
        }
    };

    const columns: ColumnsType<Employee> = [
        {
            title: 'Employee Id',
            dataIndex: 'empId',
            key: 'empId',
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="text-gray-600">{text}</span>,
        },
        {
            title: 'Employee Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleStatusChange(record.key, 'P')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${record.status === 'P'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-400 border-gray-300 hover:border-blue-500'
                            }`}
                    >
                        P
                    </button>
                    <button
                        onClick={() => handleStatusChange(record.key, 'L')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${record.status === 'L'
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white text-gray-400 border-gray-300 hover:border-purple-500'
                            }`}
                    >
                        L
                    </button>
                    <button
                        onClick={() => handleStatusChange(record.key, 'A')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${record.status === 'A'
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-400 border-gray-300 hover:border-red-500'
                            }`}
                    >
                        A
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <span className="font-bold text-gray-900">Attendance</span>
                <span className="text-gray-400">|</span>
                <HomeOutlined className="text-gray-400" />
                <span>-</span>
                <span>{step === 1 ? 'Mark or update Employees Attendance' : 'Add/update Attendance'}</span>
            </div>

            {step === 1 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-12 flex flex-col items-center justify-center space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Add/update attendance</h2>

                        </div>

                        <div className="w-full max-w-md space-y-2">
                            <div className="relative">
                                <div className="absolute -top-2.5 left-3 px-1 bg-white z-10">
                                    <span className="text-xs font-medium text-black px-2 py-0.5 rounded">Date*</span>
                                </div>
                                <DatePicker
                                    className="w-full h-12 rounded-lg border-purple-100 hover:border-purple-300 focus:border-purple-500"
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date || dayjs())}
                                    format="DD/MM/YYYY"
                                />
                            </div>
                        </div>

                        <Button
                            className="border-none px-8 cursor-pointer font-medium"
                            onClick={() => setStep(2)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col items-center space-y-6 mb-8">
                        <div className="flex items-center gap-2">
                            {attendanceRecords?.attendance && attendanceRecords.attendance.length > 0 && (
                                <Tag color="success" className="rounded-full px-2 border-none flex items-center gap-1">
                                    <CheckCircleFilled />
                                    Already taken
                                </Tag>
                            )}
                            <span className="font-bold text-indigo-600">Employees</span>
                            <span className="text-gray-400">{selectedDate.format('DD MMM, YYYY')}</span>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Update Attendance</h2>
                            <div className="flex items-center justify-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-6 h-1.5 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Present</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-6 h-1.5 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-600">On-leave</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-6 h-1.5 bg-red-400 rounded-full"></div>
                                    <span className="text-gray-600">Absent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={attendanceData}
                        pagination={false}
                        className="mb-8"
                        rowClassName="bg-gray-50/50"
                        loading={staffLoading}
                    />


                </div>
            )}
        </div>
    );
};

export default EmployeeAttendance;
