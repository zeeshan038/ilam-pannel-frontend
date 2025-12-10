import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

interface FeeVoucherModalProps {
    vouchers: any[];
    onClose: () => void;
}

export const FeeVoucherModal = ({ vouchers, onClose }: FeeVoucherModalProps) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print Vouchers</title>');
                printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>'); // Use CDN for tailwind in print window
                printWindow.document.write('</head><body >');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 1000);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Generated Vouchers</h2>
                        <p className="text-sm text-gray-500">{vouchers.length} vouchers generated</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                            <Printer size={16} /> Print All
                        </Button>
                        <Button variant="outline" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100" >
                    <div ref={printRef} className="space-y-8">
                        {vouchers.map((voucher, index) => (
                            <div key={index} className="bg-white p-0 shadow-sm print:shadow-none print:break-after-page mb-8 last:mb-0">
                                <VoucherTemplate data={voucher} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VoucherTemplate = ({ data }: { data: any }) => {
    // Helper to format currency
    const formatCurrency = (amount: number) => `Rs. ${amount?.toLocaleString() || 0}`;

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Voucher Copy Component
    const VoucherCopy = ({ title }: { title: string }) => (
        <div className="border border-gray-800 p-4 flex flex-col h-full bg-white text-black relative">
            {/* Watermark/Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <span className="text-6xl font-bold -rotate-45 whitespace-nowrap">TALEEM PRO</span>
            </div>

            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                    {/* Placeholder for Logo */}
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">TP</div>
                    <h1 className="text-lg font-bold uppercase tracking-wide">Taleem Pro School</h1>
                </div>
                <p className="text-[10px] text-gray-600">123 Education Avenue, Knowledge City</p>
                <p className="text-[10px] text-gray-600">Ph: +92 300 1234567 | Email: info@taleempro.com</p>
                <div className="mt-2 bg-black text-white py-0.5 px-3 inline-block rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {title} Copy
                </div>
            </div>

            {/* Info Grid */}
            <div className="flex justify-between text-[11px] mb-3">
                <div className="space-y-0.5">
                    <p><span className="font-bold">Voucher #:</span> {data._id?.substring(data._id.length - 6).toUpperCase()}</p>
                    <p><span className="font-bold">Issue Date:</span> {formatDate(new Date().toISOString())}</p>
                    <p><span className="font-bold">Due Date:</span> {formatDate(data.dueDate)}</p>
                </div>
                <div className="text-right space-y-0.5">
                    <p><span className="font-bold">Month:</span> {data.month}/{data.year}</p>
                    <p><span className="font-bold">Class:</span> {data.class} - {data.section}</p>
                    <p><span className="font-bold">Roll No:</span> {data.student?.rollNumber || data.serialNumber}</p>
                </div>
            </div>

            {/* Student Details */}
            <div className="mb-3 text-[11px] border-t border-b border-gray-200 py-2 space-y-0.5">
                <p><span className="font-bold">Student Name:</span> <span className="uppercase">{data.student?.name || data.name}</span></p>
                <p><span className="font-bold">Father Name:</span> <span className="uppercase">{data.student?.fatherName || data.fatherName}</span></p>
            </div>

            {/* Fee Table */}
            <div className="flex-1">
                <table className="w-full text-[11px] border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-t border-b border-gray-800">
                            <th className="py-1 text-left font-bold">Description</th>
                            <th className="py-1 text-right font-bold">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="py-1">{data.feeType}</td>
                            <td className="py-1 text-right">{formatCurrency(data.amount)}</td>
                        </tr>
                        {/* Example of breakdown if needed, hidden if 0 */}
                        {data.transportFee > 0 && (
                            <tr>
                                <td className="py-1">Transport Fee</td>
                                <td className="py-1 text-right">{formatCurrency(data.transportFee)}</td>
                            </tr>
                        )}
                        {data.admissionFee > 0 && (
                            <tr>
                                <td className="py-1">Admission Fee</td>
                                <td className="py-1 text-right">{formatCurrency(data.admissionFee)}</td>
                            </tr>
                        )}
                        {/* Arrears could go here */}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-800 font-bold">
                            <td className="py-2">Total Payable</td>
                            <td className="py-2 text-right">{formatCurrency(data.amount)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 text-[10px]">
                <div className="flex justify-between items-end">
                    <div className="text-center">
                        <div className="w-20 border-b border-gray-400 mb-1"></div>
                        <p>Cashier</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 border-b border-gray-400 mb-1"></div>
                        <p>Officer</p>
                    </div>
                </div>
                <p className="mt-2 text-[9px] text-center text-gray-500 italic">
                    * This is a computer generated voucher and does not require a stamp.
                </p>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-[210mm] mx-auto bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
                <VoucherCopy title="Bank" />
                <VoucherCopy title="School" />
                <VoucherCopy title="Student" />
            </div>
            {/* Cut Line for Print */}
            <div className="hidden print:block mt-4 border-b border-dashed border-gray-400 relative">
                <span className="absolute left-1/2 -top-2 bg-white px-2 text-xs text-gray-500">Cut Here</span>
            </div>
        </div>
    );
};
