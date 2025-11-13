import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
                        <h1 className="text-3xl font-bold text-gray-900">Điều khoản sử dụng</h1>
                    </div>

                    <div className="prose max-w-none text-gray-700">
                        <h2 className="text-xl font-semibold mb-4">1. Chấp nhận điều khoản</h2>
                        <p className="mb-6">
                            Bằng việc truy cập và sử dụng dịch vụ Invoice API, bạn đồng ý tuân thủ và bị ràng buộc bởi 
                            các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
                            bạn không được phép sử dụng dịch vụ của chúng tôi.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">2. Mô tả dịch vụ</h2>
                        <p className="mb-6">
                            Invoice API là một nền tảng cung cấp dịch vụ tra cứu và quản lý hóa đơn điện tử. 
                            Dịch vụ bao gồm nhưng không giới hạn ở việc tra cứu thông tin hóa đơn, lưu trữ và quản lý dữ liệu hóa đơn.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">3. Đăng ký tài khoản</h2>
                        <p className="mb-4">
                            Để sử dụng một số tính năng của dịch vụ, bạn cần tạo tài khoản. Khi đăng ký, bạn cam kết:
                        </p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                            <li>Bảo mật thông tin đăng nhập và chịu trách nhiệm cho tất cả hoạt động trong tài khoản</li>
                            <li>Thông báo ngay cho chúng tôi về bất kỳ việc sử dụng trái phép nào</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">4. Quyền và trách nhiệm của người dùng</h2>
                        <p className="mb-4">Bạn có trách nhiệm:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Sử dụng dịch vụ một cách hợp pháp và phù hợp</li>
                            <li>Không can thiệp vào hoạt động của hệ thống</li>
                            <li>Không sao chép, phân phối hoặc tạo ra các sản phẩm phái sinh từ dịch vụ</li>
                            <li>Tuân thủ tất cả các luật và quy định hiện hành</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-4">5. Quyền sở hữu trí tuệ</h2>
                        <p className="mb-6">
                            Tất cả nội dung, tính năng và chức năng của Invoice API (bao gồm nhưng không giới hạn ở văn bản, 
                            đồ họa, logo, biểu tượng, hình ảnh, âm thanh, video và phần mềm) là tài sản độc quyền của chúng tôi 
                            hoặc các bên cấp phép của chúng tôi.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">6. Bảo mật và quyền riêng tư</h2>
                        <p className="mb-6">
                            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Việc thu thập, sử dụng và bảo vệ thông tin 
                            của bạn được quy định trong Chính sách Bảo mật của chúng tôi.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">7. Giới hạn trách nhiệm</h2>
                        <p className="mb-6">
                            Trong phạm vi tối đa được pháp luật cho phép, Invoice API không chịu trách nhiệm đối với bất kỳ 
                            thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc do hậu quả nào phát sinh từ việc sử dụng 
                            hoặc không thể sử dụng dịch vụ.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">8. Chấm dứt</h2>
                        <p className="mb-6">
                            Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản của bạn ngay lập tức, mà không cần thông báo trước, 
                            nếu bạn vi phạm các điều khoản này.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">9. Thay đổi điều khoản</h2>
                        <p className="mb-6">
                            Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi 
                            có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">10. Liên hệ</h2>
                        <p className="mb-6">
                            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: 
                            support@invoiceapi.com
                        </p>

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

export default Terms;