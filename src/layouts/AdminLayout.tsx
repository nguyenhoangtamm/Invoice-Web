import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  FileText,
  List,
  Package,
  Key,
  BarChart3,
  Search,
  Bell,
  Github,
  Sun,
  User,
  Menu,
  LogOut
} from "lucide-react";
import { Dropdown } from "rsuite";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Người dùng', icon: Users },
    { path: '/admin/organizations', label: 'Tổ chức', icon: Building2 },
    { path: '/admin/roles', label: 'Vai trò', icon: Shield },
    { path: '/admin/invoices', label: 'Hóa đơn', icon: FileText },
    { path: '/admin/invoice-batches', label: 'Lô hóa đơn', icon: Package },
    { path: '/admin/invoice-reports', label: 'Báo cáo HĐ', icon: BarChart3 }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl">TrustInvoice</span>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Main Dashboard */}
          <div className="mb-1">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/admin/dashboard')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </div>

          {/* Pages Section */}
          <div className="mt-6 mb-2 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Hệ thống
            </span>
          </div>

          {navItems.slice(1, 4).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </div>
            );
          })}

          {/* User Interface Section */}
          <div className="mt-6 mb-2 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quản lý hóa đơn
            </span>
          </div>

          {navItems.slice(4).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 w-80">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-600 placeholder-gray-400"
              />
              <kbd className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                ⌘K
              </kbd>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              <Dropdown
                renderToggle={(props, ref) => (
                  <div
                    {...props}
                    ref={ref}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                placement="leftStart"
              >
                <Dropdown.Item panel style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}