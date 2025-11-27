export enum InvoiceStatus {
    Draft = 0, // Bản nháp
    Uploaded = 1, // Đã upload
    IpfsStored = 2, // Đã lưu trên IPFS
    Batched = 3, // Đã tạo batch
    BlockchainConfirmed = 4, // Đã xác nhận trên blockchain
    Finalized = 5, // Hoàn tất
    IpfsFailed = 101, // Upload IPFS thất bại
    BlockchainFailed = 102, // Ghi blockchain thất bại
}

export enum InvoiceReportStatus {
    Pending = 1, // Đang chờ xử lý
    Reviewing = 2, // Đang xem xét
    Resolved = 3, // Đã giải quyết
    Rejected = 4, // Bị từ chối
    Closed = 5,
}

export enum InvoiceReportReason {
    IncorrectDetails = 1, // Thông tin sai lệch
    MissingInformation = 2, //Thiếu thông tin
    FraudulentActivity = 3, // Hoạt động gian lận
    Other = 4, // Khác
}
