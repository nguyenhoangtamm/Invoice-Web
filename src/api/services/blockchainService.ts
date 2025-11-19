import apiClient from "../apiClient";

export interface BlockchainVerificationResponse {
    message: string;
    succeeded: boolean;
    data: {
        isValid: boolean;
        message: string;
        offChainInvoice: {
            id: number;
            invoiceNumber: string;
            formNumber: string;
            serial: string;
            lookupCode: string;
            organizationId: number;
            issuedByUserId: number;
            sellerName: string;
            sellerTaxId: string;
            sellerAddress: string;
            sellerPhone: string;
            sellerEmail: string;
            customerName: string;
            customerTaxId: string;
            customerAddress: string;
            customerPhone: string;
            customerEmail: string;
            status: number;
            issuedDate: string;
            subTotal: number;
            taxAmount: number;
            discountAmount: number;
            totalAmount: number;
            currency: string;
            note: string;
            batchId: number;
            immutableHash: string;
            cid: string;
            cidHash: string;
            merkleProof: string;
            lines: Array<{
                id: number;
                invoiceId: number;
                lineNumber: number;
                description: string;
                quantity: number;
                unit: string;
                unitPrice: number;
                discount: number;
                taxRate: number;
                taxAmount: number;
                lineTotal: number;
            }>;
        };
        onChainInvoice: {
            id: number;
            invoiceNumber: string;
            formNumber: string;
            serial: string;
            lookupCode: string;
            organizationId: number;
            issuedByUserId: number;
            sellerName: string;
            sellerTaxId: string;
            sellerAddress: string;
            sellerPhone: string;
            sellerEmail: string;
            customerName: string;
            customerTaxId: string;
            customerAddress: string;
            customerPhone: string;
            customerEmail: string;
            status: number;
            issuedDate: string;
            subTotal: number;
            taxAmount: number;
            discountAmount: number;
            totalAmount: number;
            currency: string;
            note: string;
            batchId: number;
            immutableHash: string;
            cid: string;
            cidHash: string;
            merkleProof: string;
            lines: Array<{
                id: number;
                invoiceId: number;
                lineNumber: number;
                description: string;
                quantity: number;
                unit: string;
                unitPrice: number;
                discount: number;
                taxRate: number;
                taxAmount: number;
                lineTotal: number;
            }>;
        };
    };
    code: number;
}

export const blockchainService = {
    verifyInvoice: async (
        id: number
    ): Promise<BlockchainVerificationResponse> => {
        const response = await apiClient.get<BlockchainVerificationResponse>(
            `/Invoices/verify-invoice/${id}`
        );
        return response.data;
    },
};
