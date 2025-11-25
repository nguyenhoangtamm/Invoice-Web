/**
 * File Upload Types
 */

export interface AttachmentFile {
    fileId: number;
    fileName: string;
    contentType: string;
    size: number;
    path: string;
}

export interface FileUploadResponse {
    message: string;
    succeeded: boolean;
    data: AttachmentFile;
    code: number;
}
