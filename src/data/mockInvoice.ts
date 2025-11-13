import type { Invoice, User, Company, DashboardStats } from "../types/invoice";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "USR-001",
    email: "admin@company.vn",
    name: "Nguyễn Văn Admin",
    avatar: "https://via.placeholder.com/150",
    phone: "0901234567",
    role: "admin",
    company_id: "COMP-001",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-11-13T10:00:00Z",
    last_login: "2025-11-13T09:00:00Z"
  },
  {
    id: "USR-002",
    email: "user@company.vn",
    name: "Trần Thị User",
    phone: "0987654321",
    role: "user",
    company_id: "COMP-001",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-11-12T15:30:00Z",
    last_login: "2025-11-12T14:00:00Z"
  }
];

// Mock Company
export const mockCompany: Company = {
  id: "COMP-001",
  name: "CÔNG TY TNHH CÔNG NGHỆ ABC",
  address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  tax_code: "0123456789",
  email: "info@abc-tech.vn",
  phone: "028-12345678",
  logo: "https://via.placeholder.com/200x80",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-11-01T00:00:00Z"
};

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalInvoices: 1247,
  totalRevenue: 15420000000, // 15.42 tỷ VNĐ
  monthlyRevenue: 2340000000, // 2.34 tỷ VNĐ (tháng 11)
  pendingInvoices: 23,
  paidInvoices: 1198,
  overdueInvoices: 26
};

// Single mock invoice (keep existing for compatibility)
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
  immutable_hash: "0xFAE23BCDEF123456789...",
  created_at: "2025-11-08T08:30:00Z",
  updated_at: "2025-11-08T08:35:00Z",
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

// Multiple mock invoices for testing pagination and search
export const mockInvoices: Invoice[] = [
  mockInvoice,
  {
    invoice_number: "INV-2025-000124",
    form_number: "01GTKT0/002",
    serial: "AA/25E",
    CustomerName: "CÔNG TY CP XYZ",
    CustomerAddress: "456 Lê Văn Việt, Q.9, TP.HCM",
    CustomerEmail: "contact@xyz.vn",
    CustomerPhone: "0912345678",
    issued_date: "2025-11-09",
    subtotal: 2500000,
    tax_amount: 250000,
    discount_amount: 125000,
    total_amount: 2625000,
    currency: "VND",
    status: "Chờ thanh toán",
    tenant_organization_id: "ORG-001",
    issued_by_user_id: "USR-001",
    note: "Hóa đơn tháng 11/2025",
    batch_id: "BATCH-20251109",
    immutable_hash: "0x1234ABCD...",
    created_at: "2025-11-09T10:15:00Z",
    updated_at: "2025-11-09T10:20:00Z",
    lines: [
      {
        line_number: 1,
        description: "Dịch vụ tư vấn IT",
        unit: "Tháng",
        quantity: 1,
        unit_price: 2500000,
        tax_amount: 250000,
        line_total: 2750000
      }
    ]
  },
  {
    invoice_number: "INV-2025-000125",
    form_number: "01GTKT0/003",
    serial: "AA/25E",
    CustomerName: "DOANH NGHIỆP TƯ NHÂN DEF",
    CustomerAddress: "789 Võ Văn Tần, Q.3, TP.HCM",
    CustomerEmail: "info@def.vn",
    CustomerPhone: "0923456789",
    issued_date: "2025-11-10",
    subtotal: 850000,
    tax_amount: 85000,
    discount_amount: 0,
    total_amount: 935000,
    currency: "VND",
    status: "Đã thanh toán",
    tenant_organization_id: "ORG-001",
    issued_by_user_id: "USR-002",
    note: "Thanh toán ngay",
    batch_id: "BATCH-20251110",
    immutable_hash: "0x5678EFGH...",
    created_at: "2025-11-10T14:30:00Z",
    updated_at: "2025-11-10T16:45:00Z",
    lines: [
      {
        line_number: 1,
        description: "Phần mềm bản quyền",
        unit: "License",
        quantity: 1,
        unit_price: 850000,
        tax_amount: 85000,
        line_total: 935000
      }
    ]
  }
];
