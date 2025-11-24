import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const features = [
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8" />,
      title: "Tra cứu hóa đơn nhanh chóng",
      description: "Tra cứu và xác thực hóa đơn điện tử chỉ với một vài click, hỗ trợ tìm kiếm theo nhiều tiêu chí khác nhau."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Bảo mật tuyệt đối",
      description: "Sử dụng công nghệ blockchain để đảm bảo tính toàn vẹn và bảo mật cho tất cả các hóa đơn điện tử."
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: "Quản lý hóa đơn hiệu quả",
      description: "Hệ thống quản lý hóa đơn toàn diện với dashboard trực quan và báo cáo chi tiết."
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Phân tích dữ liệu",
      description: "Cung cấp các báo cáo và phân tích chuyên sâu để hỗ trợ ra quyết định kinh doanh."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản miễn phí để bắt đầu sử dụng hệ thống"
    },
    {
      step: "02", 
      title: "Tạo tổ chức",
      description: "Thiết lập thông tin tổ chức và cấu hình hệ thống"
    },
    {
      step: "03",
      title: "Bắt đầu sử dụng",
      description: "Tạo, quản lý và tra cứu hóa đơn một cách dễ dàng"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">InvoiceSystem</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/lookup"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Tra cứu hóa đơn
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hệ thống quản lý
              <span className="block text-yellow-300">Hóa đơn điện tử</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Giải pháp toàn diện cho việc tạo, quản lý và tra cứu hóa đơn điện tử với công nghệ blockchain tiên tiến
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/lookup"
                className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                Tra cứu hóa đơn ngay
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
              >
                Đăng ký miễn phí
                <ArrowRightIcon className="w-6 h-6 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng mạnh mẽ giúp bạn quản lý hóa đơn điện tử một cách hiệu quả
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookup Section - Highlighted */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tra cứu hóa đơn - Tính năng nổi bật nhất
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Không cần đăng nhập! Tra cứu và xác thực hóa đơn điện tử một cách nhanh chóng và chính xác
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <ClockIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-lg font-semibold mb-2">Tra cứu nhanh</h3>
                  <p className="text-sm opacity-80">Kết quả trong vòng vài giây</p>
                </div>
                <div className="text-center">
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-lg font-semibold mb-2">Xác thực chính xác</h3>
                  <p className="text-sm opacity-80">Đảm bảo tính xác thực 100%</p>
                </div>
                <div className="text-center">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-lg font-semibold mb-2">Miễn phí sử dụng</h3>
                  <p className="text-sm opacity-80">Không cần đăng ký tài khoản</p>
                </div>
              </div>
            </div>
            
            <Link
              to="/lookup"
              className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
              Bắt đầu tra cứu ngay
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn có thể bắt đầu sử dụng hệ thống
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng sử dụng hệ thống của chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Đăng ký miễn phí
              <ArrowRightIcon className="w-6 h-6 ml-2" />
            </Link>
            <Link
              to="/lookup"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
              Tra cứu hóa đơn
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">InvoiceSystem</h3>
              <p className="text-gray-300 mb-4">
                Hệ thống quản lý hóa đơn điện tử hiện đại, bảo mật và hiệu quả nhất cho doanh nghiệp.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li><Link to="/lookup" className="text-gray-300 hover:text-white">Tra cứu hóa đơn</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white">Đăng nhập</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white">Đăng ký</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Chính sách</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-300 hover:text-white">Điều khoản sử dụng</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white">Chính sách bảo mật</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} InvoiceSystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;