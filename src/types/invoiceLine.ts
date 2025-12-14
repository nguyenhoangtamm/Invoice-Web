// Invoice Line types based on API
export interface InvoiceLine {
    id: number;
    invoiceId: number;
    lineNumber: number;
    name?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
    taxAmount?: number;
    lineTotal: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateInvoiceLineRequest {
    invoiceId: number;
    lineNumber: number;
    name?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
    taxAmount?: number;
    lineTotal: number;
}

export interface UpdateInvoiceLineRequest extends CreateInvoiceLineRequest {
    id: number;
}
