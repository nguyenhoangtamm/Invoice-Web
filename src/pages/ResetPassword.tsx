import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import * as passwordResetService from '../api/services/passwordResetService';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(true);

    // Validate token and email on component mount
    useEffect(() => {
        if (!token || !email) {
            setIsTokenValid(false);
            setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
        }
        setIsValidating(false);
    }, [token, email]);

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        try {
            if (!token) {
                setError('Token không hợp lệ');
                return;
            }

            const response = await passwordResetService.resetPassword({
                token,
                newPassword,
                confirmPassword,
            });

            if (response.succeeded) {
                setIsSuccess(true);
            } else {
                setError(response.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Đang xác nhận...</p>
                </div>
            </div>
        );
    }

    // Invalid token or email state
    if (!isTokenValid) {
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
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Link không hợp lệ</h2>

                    <p className="text-gray-600 mb-8">
                        Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một link mới.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 flex items-center justify-center"
                    >
                        Yêu cầu đặt lại mật khẩu
                    </Link>
                </div>
            </div>
        );
    }

    // Success state
    if (isSuccess) {
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

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Đặt lại mật khẩu thành công</h2>

                    <p className="text-gray-600 mb-8">
                        Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                    </p>

                    <Link
                        to="/login"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 flex items-center justify-center"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    // Reset password form
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
                    <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
                </div>

                {/* Email display */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>

                {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Xác nhận mật khẩu mới"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !newPassword || !confirmPassword}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </div>
                        ) : (
                            'Đặt lại mật khẩu'
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

export default ResetPassword;
