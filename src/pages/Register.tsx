import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Github, Chrome, Wallet, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userName: '',
        fullname: '',
        gender: 'Nam',
        birthDate: '',
        address: '',
        bio: '',
        phoneNumber: '',
        confirmPassword: '',
        referralCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Calculate password strength
        if (name === 'password') {
            let strength = 0;
            if (value.length >= 8) strength++;
            if (/[A-Z]/.test(value)) strength++;
            if (/[a-z]/.test(value)) strength++;
            if (/[0-9]/.test(value)) strength++;
            if (/[^A-Za-z0-9]/.test(value)) strength++;
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (passwordStrength < 3) {
            setError('Mật khẩu cần mạnh hơn (ít nhất 8 ký tự, có chữ hoa, chữ thường, số)');
            return;
        }

        setIsLoading(true);

        try {
            const registerData = {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                username: formData.userName,
                fullName: formData.fullname,
                phone: formData.phoneNumber,
                agreeToTerms: true
            };

            const response = await register(registerData);

            // Register function now directly returns data or throws error
            // Redirect to dashboard on successful registration
            navigate('/dashboard');
        } catch (error) {
            setError('Có lỗi xảy ra trong quá trình đăng ký');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        console.log('Google register');
    };

    const handleGithubRegister = () => {
        console.log('GitHub register');
    };

    const handleWalletRegister = () => {
        console.log('Ethereum Wallet register');
    };

    const handleSSORegister = () => {
        console.log('SSO register');
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return { text: 'Yếu', color: 'text-red-500' };
            case 2:
            case 3:
                return { text: 'Trung bình', color: 'text-yellow-500' };
            case 4:
            case 5:
                return { text: 'Mạnh', color: 'text-green-500' };
            default:
                return { text: '', color: '' };
        }
    };

    const getPasswordStrengthWidth = () => {
        return `${(passwordStrength / 5) * 100}%`;
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>
                    <p className="text-gray-600">Tạo tài khoản mới để bắt đầu</p>
                </div>

                {/* Social register buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleRegister}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Chrome className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-gray-700">Đăng ký bằng Google</span>
                    </button>

                    <button
                        onClick={handleGithubRegister}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Github className="w-5 h-5 text-gray-900" />
                        <span className="font-medium text-gray-700">Đăng ký bằng GitHub</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleWalletRegister}
                            className="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Wallet className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-700 text-xs">Ethereum Wallet</span>
                        </button>

                        <button
                            onClick={handleSSORegister}
                            className="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <span className="font-medium text-gray-700 text-xs">SSO</span>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">hoặc đăng ký bằng email</span>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Register form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đăng nhập
                        </label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên
                        </label>
                        <input
                            id="fullname"
                            name="fullname"
                            type="text"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập email của bạn"
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
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
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
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength <= 1 ? 'bg-red-500' :
                                                passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: getPasswordStrengthWidth() }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                                        {getPasswordStrengthText().text}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Nhập lại mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                Giới tính
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày sinh
                            </label>
                            <input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập địa chỉ"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                            Giới thiệu bản thân (tùy chọn)
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Giới thiệu ngắn về bản thân"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Mã giới thiệu (tùy chọn)
                        </label>
                        <input
                            id="referralCode"
                            name="referralCode"
                            type="text"
                            value={formData.referralCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mã"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                required
                            />
                            <span className="text-sm text-gray-600">
                                Tôi đồng ý với{' '}
                                <Link to="/terms" className="text-blue-600 hover:underline">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-blue-600 hover:underline">
                                    Chính sách bảo mật
                                </Link>
                                .
                            </span>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={agreeMarketing}
                                onChange={(e) => setAgreeMarketing(e.target.checked)}
                                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                                Tôi đồng ý nhận thông tin cập nhật marketing từ Invoice API.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!agreeTerms || formData.password !== formData.confirmPassword || isLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </button>
                </form>

                {/* Footer links */}
                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;