import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceByLookupCode } from "../api/services/invoiceService";
import type { Invoice } from "../types/invoice";
import { Message, toaster, Button, Container } from "rsuite";
import InvoiceDetail from "../components/InvoiceDetail";
import { Share2, ArrowLeft } from "lucide-react";

export default function InvoiceLookupDetail() {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!invoiceId) {
            setError("Không tìm thấy mã hóa đơn");
            setLoading(false);
            return;
        }

        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const response = await getInvoiceByLookupCode(invoiceId);
                if (response.succeeded && response.data) {
                    setInvoice(response.data);
                    setError(null);
                } else {
                    setError(response.message || "Không tìm thấy hóa đơn");
                    setInvoice(null);
                }
            } catch (err) {
                console.error("Error fetching invoice:", err);
                setError("Có lỗi xảy ra khi tải hóa đơn");
                setInvoice(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    const handleShareLink = () => {
        const shareUrl = `${window.location.origin}/lookup/${invoiceId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            toaster.push(
                <Message type="success" showIcon closable>
                    Đã sao chép link chia sẻ: {shareUrl}
                </Message>
            );
        }).catch(() => {
            toaster.push(
                <Message type="error" showIcon closable>
                    Không thể sao chép link
                </Message>
            );
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <Container className="py-20">
                <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-red-600">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-red-800">Lỗi</h2>
                    </div>
                    <p className="text-red-700 mb-6">{error || "Không tìm thấy hóa đơn"}</p>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate("/lookup")}
                            appearance="primary"
                            color="red"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Quay lại trang Tra cứu
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <Container className="max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/lookup")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Chi tiết hóa đơn</h1>
                    <button
                        onClick={handleShareLink}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <Share2 size={18} />
                        Chia sẻ Link
                    </button>
                </div>

                {/* Invoice Detail */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <InvoiceDetail
                        data={invoice}
                        open={true}
                        onClose={() => {
                            navigate("/lookup");
                        }}
                    />
                </div>

                {/* Share Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Share2 size={20} className="text-blue-600" />
                        <div>
                            <h3 className="font-semibold text-blue-900">Chia sẻ hóa đơn</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Bạn có thể chia sẻ hóa đơn này với bất kỳ ai bằng cách gửi link trên.
                                Nhấn nút "Chia sẻ Link" ở trên để sao chép link vào bộ nhớ đệm.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
