import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 hover:text-white transition-colors duration-200"
          >
            Về trang chủ
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/lookup"
              className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            >
              Tra cứu hóa đơn
            </Link>
            <Link
              to="/login"
              className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4 text-gray-400">
          <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;