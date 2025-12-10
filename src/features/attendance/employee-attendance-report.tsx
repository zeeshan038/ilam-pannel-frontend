import { useState } from 'react';
import { Table, Button, Input, DatePicker } from 'antd';
import { HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { useGetAttendanceByDateQuery } from './api/attendance';

interface AttendanceRecord {
    key: string;
    date: string;
    day: string;
    id: string;
    name: string;
    type: string;
    status: string;
    time: string;
}

const EmployeeAttendanceReport = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    // Fetch attendance data for selected date
    const { data: attendanceData, isLoading } = useGetAttendanceByDateQuery(
        selectedDate.format('YYYY-MM-DD')
    );

    // Map API data to table format
    const tableData: AttendanceRecord[] = attendanceData?.attendance?.map((record: any) => ({
        key: record._id,
        date: dayjs(record.date).format('DD-MM-YY'),
        day: record.day || dayjs(record.date).format('ddd'),
        id: record.empId,
        name: record.name,
        type: 'Employee',
        status: record.status,
        time: record.time || '',
    })) || [];

    // Filter data based on search
    const filteredData = tableData.filter((record) =>
        Object.values(record).some((value) =>
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['DATE', 'DAY', 'ID', 'NAME', 'TYPE', 'STATUS'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(row => [
                row.date,
                row.day,
                row.id,
                row.name,
                row.type,
                row.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_report_${selectedDate.format('YYYY-MM-DD')}.csv`;
        link.click();
    };

    // Export to Excel (using HTML table method)
    const exportToExcel = () => {
        const headers = ['DATE', 'DAY', 'ID', 'NAME', 'TYPE', 'STATUS'];
        const rows = filteredData.map(row => [row.date, row.day, row.id, row.name, row.type, row.status]);

        let html = '<table><thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';

        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_report_${selectedDate.format('YYYY-MM-DD')}.xls`;
        link.click();
    };

    // Export to PDF
    const exportToPDF = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        const htmlContent = `
            <html>
                <head>
                    <title>Attendance Report - ${selectedDate.format('DD MMM, YYYY')}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #4CAF50; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Employee Attendance Report</h1>
                    <p><strong>Date:</strong> ${selectedDate.format('DD MMM, YYYY')}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>DAY</th>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>TYPE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(row => `
                                <tr>
                                    <td>${row.date}</td>
                                    <td>${row.day}</td>
                                    <td>${row.id}</td>
                                    <td>${row.name}</td>
                                    <td>${row.type}</td>
                                    <td>${row.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    // Print
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        const htmlContent = `
            <html>
                <head>
                    <title>Attendance Report - ${selectedDate.format('DD MMM, YYYY')}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #4CAF50; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        @media print {
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Employee Attendance Report</h1>
                    <p><strong>Date:</strong> ${selectedDate.format('DD MMM, YYYY')}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>DAY</th>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>TYPE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(row => `
                                <tr>
                                    <td>${row.date}</td>
                                    <td>${row.day}</td>
                                    <td>${row.id}</td>
                                    <td>${row.name}</td>
                                    <td>${row.type}</td>
                                    <td>${row.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleExport = (action: string) => {
        switch (action) {
            case 'CSV':
                exportToCSV();
                break;
            case 'Excel':
                exportToExcel();
                break;
            case 'PDF':
                exportToPDF();
                break;
            case 'Print':
                handlePrint();
                break;
            default:
                break;
        }
    };

    const columns: ColumnsType<AttendanceRecord> = [
        {
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'DAY',
            dataIndex: 'day',
            key: 'day',
            sorter: (a, b) => a.day.localeCompare(b.day),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status: string) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'Present' ? 'bg-blue-100 text-blue-600' :
                    status === 'Leave' ? 'bg-purple-100 text-purple-600' :
                        status === 'Absent' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                    }`}>
                    {status}
                </span>
            ),
        }
    ];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <span className="font-bold text-gray-900">Attendance</span>
                <span className="text-gray-400">|</span>
                <HomeOutlined className="text-gray-400" />
                <span>-</span>
                <span>Employees Attendance Record</span>
            </div>

            {/* Date Picker */}
            <div className="w-full">
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date || dayjs())}
                    format="DD MMM, YYYY"
                    className="flex items-center justify-between gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors min-w-[250px]"
                    suffixIcon={<CalendarOutlined className="text-white" />}
                />
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['CSV', 'Excel', 'PDF', 'Print'].map((action) => (
                            <Button
                                key={action}
                                className="bg-gray-100 border-none hover:bg-gray-200 text-gray-600"
                                onClick={() => handleExport(action)}
                            >
                                {action}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Search:</span>
                        <Input
                            className="w-48 rounded-full"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    pagination={{
                        total: filteredData.length,
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        position: ['bottomLeft'],
                    }}
                    className="border-t border-gray-100"
                    rowClassName="hover:bg-gray-50"
                />
            </div>
        </div>
    );
};

export default EmployeeAttendanceReport;