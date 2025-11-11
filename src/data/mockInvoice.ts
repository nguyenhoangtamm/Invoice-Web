import type { Invoice } from "../types/invoice";

export const mockInvoice: Invoice = {
  invoice_number: "INV-2025-000123",
  form_number: "01GTKT0/001",
  serial: "AA/25E",
  CustomerName: "CÔNG TY TNHH ABC",
  CustomerAddress: "123 Nguyễn Trãi, P.2, Q.5, TP.HCM",
  CustomerEmail: "kh@abc.vn",
  CustomerPhone: "0909123456",
  issued_date: "2025-11-08",
  subtotal: 1200000,
  tax_amount: 120000,
  discount_amount: 0,
  total_amount: 1320000,
  currency: "VND",
  status: "Đã phát hành",
  tenant_organization_id: "ORG-001",
  issued_by_user_id: "USR-002",
  note: "Thanh toán theo hợp đồng 2025-01",
  batch_id: "BATCH-20251108",
  immutable_hash: "0xFAE23BCDEF...",
  created_at: "2025-11-08T08:30:00",
  updated_at: "2025-11-08T08:35:00",
  lines: [
    {
      line_number: 1,
      description: "Sản phẩm A",
      unit: "Cái",
      quantity: 2,
      unit_price: 300000,
      tax_amount: 60000,
      line_total: 660000
    },
    {
      line_number: 2,
      description: "Dịch vụ B",
      unit: "Gói",
      quantity: 1,
      unit_price: 540000,
      tax_amount: 54000,
      line_total: 594000
    }
  ]
};
