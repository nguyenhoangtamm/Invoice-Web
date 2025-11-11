import React from "react";
import type { Invoice } from "../types/invoice";

interface Props {
  data: Invoice | Invoice[] | null;
}

function fmtMoney(v?: number) {
  if (v === null || v === undefined) return "-";
  return v.toLocaleString("vi-VN");
}

export default function InvoiceDetail({ data }: Props) {
  if (!data) return null;

  // if array (search by contact), pick first for display
  const invoice = Array.isArray(data) ? data[0] : data;

  // download simulation (generates a small text file)
  const handleDownload = () => {
    const content = `Hóa đơn: ${invoice.invoice_number}\nTổng tiền: ${invoice.total_amount}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoice_number || "invoice"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-6 mt-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Chi tiết hóa đơn</h2>
            <div className="text-sm text-gray-500 mt-1">Hiển thị đầy đủ dữ liệu bảng INVOICES</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-50"
            >
              Tải hóa đơn
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              In hóa đơn
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="border rounded p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr><th className="text-left w-48 text-gray-600 py-1">Mã hóa đơn</th><td className="py-1">{invoice.invoice_number ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Mẫu số</th><td className="py-1">{invoice.form_number ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Ký hiệu</th><td className="py-1">{invoice.serial ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Ngày phát hành</th><td className="py-1">{invoice.issued_date ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Trạng thái</th><td className="py-1">{invoice.status ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Tiền tệ</th><td className="py-1">{invoice.currency ?? "VND"}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr><th className="text-left w-48 text-gray-600 py-1">Khách hàng</th><td className="py-1">{invoice.CustomerName ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Địa chỉ</th><td className="py-1">{invoice.CustomerAddress ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Email</th><td className="py-1">{invoice.CustomerEmail ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">SĐT</th><td className="py-1">{invoice.CustomerPhone ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Người phát hành (FK)</th><td className="py-1">{invoice.issued_by_user_id ?? "-"}</td></tr>
                <tr><th className="text-left text-gray-600 py-1">Tổ chức phát hành (FK)</th><td className="py-1">{invoice.tenant_organization_id ?? "-"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-2">Chi tiết tính toán</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Thành tiền (subtotal)</div>
              <div className="text-lg font-semibold">{fmtMoney(invoice.subtotal)}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Thuế (tax_amount)</div>
              <div className="text-lg font-semibold">{fmtMoney(invoice.tax_amount)}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-gray-500">Tổng cộng</div>
              <div className="text-lg font-semibold text-blue-700">{fmtMoney(invoice.total_amount)}</div>
            </div>
          </div>
        </div>

        {invoice.lines && invoice.lines.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Danh sách hàng hóa / dịch vụ</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Mô tả</th>
                    <th className="p-2 text-right">SL</th>
                    <th className="p-2 text-right">Đơn giá</th>
                    <th className="p-2 text-right">Thuế</th>
                    <th className="p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((l, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{l.line_number ?? idx + 1}</td>
                      <td className="p-2">{l.description}</td>
                      <td className="p-2 text-right">{l.quantity ?? "-"}</td>
                      <td className="p-2 text-right">{l.unit_price ? fmtMoney(l.unit_price) : "-"}</td>
                      <td className="p-2 text-right">{l.tax_amount ? fmtMoney(l.tax_amount) : "-"}</td>
                      <td className="p-2 text-right">{l.line_total ? fmtMoney(l.line_total) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <div>Mã batch: {invoice.batch_id ?? "-"}</div>
          <div>Hash: {invoice.immutable_hash ?? "-"}</div>
          <div>Tạo lúc: {invoice.created_at ?? "-"}</div>
          <div>Cập nhật: {invoice.updated_at ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}
