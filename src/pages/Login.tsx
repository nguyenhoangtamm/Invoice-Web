import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Github, Chrome, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await login({
                usernameOrEmail: usernameOrEmail,
                password: password
            });

            // Login function now directly returns data or throws error
            // Redirect to the page user was trying to access, or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            setError('Có lỗi xảy ra trong quá trình đăng nhập');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Xử lý đăng nhập bằng Google
        console.log('Google login');
    };

    const handleGithubLogin = () => {
        // Xử lý đăng nhập bằng GitHub
        console.log('GitHub login');
    };

    const handleWalletLogin = () => {
        // Xử lý đăng nhập bằng Ethereum Wallet
        console.log('Ethereum Wallet login');
    };

    const handleSSOLogin = () => {
        // Xử lý đăng nhập bằng SSO
        console.log('SSO login');
    };

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
                {/* Logo and title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">I</span>
                        </div>
                        <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Invoice API
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                    <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
                </div>

                {/* Social login buttons */}
                {/* <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Chrome className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-gray-700">Google</span>
                    </button>

                    <button
                        onClick={handleGithubLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Github className="w-5 h-5 text-gray-900" />
                        <span className="font-medium text-gray-700">GitHub</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleWalletLogin}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Wallet className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700 text-sm">Ethereum Wallet</span>
                        </button>

                        <button
                            onClick={handleSSOLogin}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <span className="font-medium text-gray-700 text-sm">Single Sign-On (SSO)</span>
                        </button>
                    </div>
                </div> */}

                {/* Divider */}
                {/* <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">hoặc đăng nhập bằng email</span>
                    </div>
                </div> */}

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Email hoặc Tên đăng nhập
                        </label>
                        <input
                            id="usernameOrEmail"
                            type="text"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập email hoặc tên đăng nhập"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Footer links */}
                <div className="mt-6 text-center space-y-2">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </Link>
                    <div className="text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;