export interface InvoiceLine {
  line_number?: number;
  description?: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  tax_amount?: number;
  line_total?: number;
}

export interface Invoice {
  invoice_number?: string;
  form_number?: string;
  serial?: string;
  CustomerName?: string;
  CustomerAddress?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  issued_date?: string; // ISO date
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  currency?: string;
  status?: string;
  tenant_organization_id?: string;
  issued_by_user_id?: string;
  note?: string;
  batch_id?: string;
  immutable_hash?: string;
  created_at?: string;
  updated_at?: string;
  lines?: InvoiceLine[];
}
