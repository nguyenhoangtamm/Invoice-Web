// Invoice Batch types
export interface InvoiceBatch {
    id: string | number;
    // Unique batch identifier (e.g. BATCH-1)
    batchId: string;
    // Optional human-friendly name and description
    batchName?: string;
    description?: string;
    // Number of invoices in the batch
    count: number;
    // Merkle root and optional content identifier
    merkleRoot?: string | null;
    batchCid?: string | null;
    // Blockchain / processing related fields
    status: number | "draft" | "processing" | "completed" | "failed";
    txHash?: string | null;
    blockNumber?: number | null;
    confirmedAt?: string | null;

    // Compatibility fields used elsewhere in the UI
    totalInvoices?: number;
    processedInvoices?: number;
    createdAt?: string;
    updatedAt?: string;
    createdByUserId?: string;
}

export interface CreateInvoiceBatchRequest {
    // For creating a batch we accept the identifier and payload fields
    batchId: string;
    batchName?: string;
    description?: string;
    count?: number;
    merkleRoot?: string | null;
    batchCid?: string | null;
    // Optional blockchain/processing fields that may be provided on create
    status?: number | string;
    txHash?: string | null;
    blockNumber?: number | null;
    confirmedAt?: string | Date | null;
}

export interface UpdateInvoiceBatchRequest {
    id: string | number;
    batchId?: string;
    batchName?: string;
    description?: string;
    count?: number;
    merkleRoot?: string | null;
    batchCid?: string | null;
    status?: number | string;
    confirmedAt?: string | Date | null;
}
