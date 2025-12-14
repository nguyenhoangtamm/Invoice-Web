import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import * as passwordResetService from '../api/services/passwordResetService';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    const [email, setEmail] = useState(emailFromUrl || '');
    const [step, setStep] = useState<'email' | 'reset'>(token ? 'reset' : 'email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [isResetSuccess, setIsResetSuccess] = useState(false);

    // Auto-verify token and email from URL
    useEffect(() => {
        if (token && emailFromUrl) {
            // Verify token is valid by checking if we can proceed to reset form
            // The form will be shown and user can set new password
        }
    }, [token, emailFromUrl]);

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await passwordResetService.forgotPassword({ email });
            if (response.succeeded) {
                setIsEmailSubmitted(true);
            } else {
                setError(response.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

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
                setIsResetSuccess(true);
            } else {
                setError(response.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Submitted email state - show success message
    if (step === 'email' && isEmailSubmitted) {
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
                            onClick={() => {
                                setEmail('');
                                setError('');
                                setIsEmailSubmitted(false);
                            }}
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

    // Reset password success state
    if (step === 'reset' && isResetSuccess) {
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

    // Reset password form (when token is in URL)
    if (step === 'reset' && token) {
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
    }

    // Email input form
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

                {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
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
                            'Gửi'
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