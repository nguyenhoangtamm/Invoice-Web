import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
                    <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-300/25 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-200/30 rounded-full blur-xl"></div>
                </div>

                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kiểm tra email của bạn</h2>
                    
                    <p className="text-gray-600 mb-6">
                        Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ email:
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="font-medium text-gray-900">{email}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-8">
                        Nếu bạn không nhận được email trong vài phút, hãy kiểm tra thư mục spam hoặc thử lại.
                    </p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                        >
                            Gửi lại email
                        </button>
                        
                        <Link
                            to="/login"
                            className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-300/25 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-200/30 rounded-full blur-xl"></div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/login" 
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang gửi...
                            </div>
                        ) : (
                            'Gửi hướng dẫn đặt lại'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;