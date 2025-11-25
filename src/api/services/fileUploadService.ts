import apiClient from "../apiClient";
import type { Result } from "../../types/common";
import type {
    AttachmentFile,
    FileUploadResponse,
} from "../../types/fileUpload";

/**
 * File Upload Service
 * Handles all file upload operations
 */

export const uploadInvoiceFile = async (
    file: File
): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<FileUploadResponse>(
        "/Invoices/upload-file",
        formData,
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );
    return response.data;
};
