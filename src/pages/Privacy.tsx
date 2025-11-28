import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Quay lại
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Chính sách bảo mật</h1>
                    </div>

                    <div className="prose max-w-none text-gray-700">
                        <h2 className="text-xl font-semibold mb-4">1. Giới thiệu</h2>
                        <p className="mb-6">
                            TrustInvoice cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách bảo mật này
                            giải thích cách chúng tôi thu thập, sử dụng, và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">2. Thông tin chúng tôi thu thập</h2>
                        <h3 className="text-lg font-medium mb-3">2.1. Thông tin cá nhân</h3>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Họ và tên</li>
                            <li>Địa chỉ email</li>
                            <li>Số điện thoại (nếu có)</li>
                            <li>Thông tin thanh toán (được mã hóa và bảo mật)</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">2.2. Thông tin kỹ thuật</h3>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Địa chỉ IP</li>
                            <li>Loại trình duyệt và thiết bị</li>
                            <li>Hệ điều hành</li>
                            <li>Dữ liệu sử dụng và tương tác với dịch vụ</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
                        <p className="mb-4">Chúng tôi sử dụng thông tin thu thập để:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Cung cấp và vận hành dịch vụ</li>
                            <li>Xử lý thanh toán và giao dịch</li>
                            <li>Liên lạc với bạn về tài khoản và dịch vụ</li>
                            <li>Cải thiện và tùy chỉnh trải nghiệm người dùng</li>
                            <li>Phát hiện và ngăn chặn gian lận</li>
                            <li>Tuân thủ các yêu cầu pháp lý</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">4. Chia sẻ thông tin</h2>
                        <p className="mb-4">Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Với sự đồng ý rõ ràng của bạn</li>
                            <li>Với các nhà cung cấp dịch vụ đáng tin cậy (dưới nghĩa vụ bảo mật nghiêm ngặt)</li>
                            <li>Để tuân thủ luật pháp hoặc lệnh của tòa án</li>
                            <li>Để bảo vệ quyền và an toàn của chúng tôi và người dùng khác</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">5. Bảo mật thông tin</h2>
                        <p className="mb-4">Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Mã hóa SSL/TLS cho tất cả truyền tải dữ liệu</li>
                            <li>Mã hóa dữ liệu tại nghỉ</li>
                            <li>Kiểm soát truy cập nghiêm ngặt</li>
                            <li>Giám sát an ninh 24/7</li>
                            <li>Đánh giá bảo mật định kỳ</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">6. Cookies và công nghệ theo dõi</h2>
                        <p className="mb-4">Chúng tôi sử dụng cookies và công nghệ tương tự để:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Duy trì phiên đăng nhập của bạn</li>
                            <li>Ghi nhớ tùy chọn của bạn</li>
                            <li>Phân tích việc sử dụng dịch vụ</li>
                            <li>Cải thiện hiệu suất và bảo mật</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">7. Quyền của bạn</h2>
                        <p className="mb-4">Bạn có quyền:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Truy cập và xem thông tin cá nhân của mình</li>
                            <li>Yêu cầu sửa đổi thông tin không chính xác</li>
                            <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                            <li>Từ chối nhận email marketing</li>
                            <li>Khiếu nại về việc xử lý dữ liệu</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">8. Lưu trữ dữ liệu</h2>
                        <p className="mb-6">
                            Chúng tôi chỉ lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để thực hiện các mục đích
                            đã nêu trong chính sách này hoặc theo yêu cầu của pháp luật. Dữ liệu sẽ được xóa an toàn khi không còn cần thiết.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">9. Chuyển giao dữ liệu quốc tế</h2>
                        <p className="mb-6">
                            Thông tin của bạn có thể được xử lý tại các quốc gia khác có luật bảo vệ dữ liệu khác với nước bạn.
                            Chúng tôi đảm bảo áp dụng các biện pháp bảo vệ phù hợp cho mọi chuyển giao dữ liệu.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">10. Thay đổi chính sách</h2>
                        <p className="mb-6">
                            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Các thay đổi quan trọng sẽ được
                            thông báo qua email hoặc thông báo nổi bật trên dịch vụ.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">11. Liên hệ</h2>
                        <p className="mb-6">
                            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện quyền của mình,
                            vui lòng liên hệ:
                        </p>
                        <ul className="list-none pl-0 mb-6">
                            <li><strong>Email:</strong> privacy@invoiceapi.com</li>
                            <li><strong>Điện thoại:</strong> 1900-xxx-xxx</li>
                            <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;