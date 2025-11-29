import React, { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    BuildingOfficeIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon,
    ServerIcon,
    CircleStackIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import {
    getDashboardStats,
    getRevenueChart,
    getTopCustomers,
    getRecentActivity,
    type DashboardStatsDto,
    type RevenueChartDataDto,
    type TopCustomerDto,
    type RecentActivityDto
} from '../../api/services/dashboardService';

interface AdminDashboardStats {
    totalUsers: number;
    totalInvoices: number;
    pendingInvoices: number;
    totalRevenue: number;
    monthlyGrowth: number;
    totalOrganizations: number;
    avgInvoiceValue: number;
    totalCustomers: number;
}

interface SystemStatus {
    apiStatus: 'online' | 'offline' | 'warning';
    databaseStatus: 'online' | 'offline' | 'warning';
    blockchainStatus: 'online' | 'offline' | 'warning';
    lastBackup: string;
}

const getActivityTypeColor = (type: RecentActivityDto['type']) => {
    switch (type) {
        case 'invoice_created':
            return { bg: 'bg-blue-100', dot: 'bg-blue-500' };
        case 'payment_received':
            return { bg: 'bg-green-100', dot: 'bg-green-500' };
        case 'customer_added':
            return { bg: 'bg-purple-100', dot: 'bg-purple-500' };
        case 'invoice_updated':
            return { bg: 'bg-yellow-100', dot: 'bg-yellow-500' };
        default:
            return { bg: 'bg-gray-100', dot: 'bg-gray-500' };
    }
};

const getActivityDescription = (activity: RecentActivityDto) => {
    switch (activity.type) {
        case 'invoice_created':
            return 'Tạo hóa đơn mới';
        case 'payment_received':
            return 'Nhận thanh toán';
        case 'customer_added':
            return 'Thêm khách hàng mới';
        case 'invoice_updated':
            return 'Cập nhật hóa đơn';
        default:
            return activity.description;
    }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminDashboardStats>({
        totalUsers: 0,
        totalInvoices: 0,
        pendingInvoices: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        totalOrganizations: 0,
        avgInvoiceValue: 0,
        totalCustomers: 0
    });

    const [revenueData, setRevenueData] = useState<RevenueChartDataDto[]>([]);
    const [topCustomers, setTopCustomers] = useState<TopCustomerDto[]>([]);
    const [activities, setActivities] = useState<RecentActivityDto[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>({
        apiStatus: 'online',
        databaseStatus: 'online',
        blockchainStatus: 'online',
        lastBackup: new Date().toISOString()
    });

    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats
            const statsResult = await getDashboardStats();
            if (statsResult.succeeded && statsResult.data) {
                setStats({
                    totalUsers: statsResult.data.totalCustomers,
                    totalInvoices: statsResult.data.totalInvoices,
                    pendingInvoices: statsResult.data.pendingInvoices,
                    totalRevenue: statsResult.data.totalRevenue,
                    monthlyGrowth: statsResult.data.monthlyGrowth,
                    totalOrganizations: statsResult.data.totalOrganizations,
                    avgInvoiceValue: statsResult.data.avgInvoiceValue,
                    totalCustomers: statsResult.data.totalCustomers
                });
            }

            // Fetch revenue chart data
            const revenueResult = await getRevenueChart();
            if (revenueResult.succeeded && revenueResult.data) {
                setRevenueData(revenueResult.data);
            }

            // Fetch top customers
            const customersResult = await getTopCustomers();
            if (customersResult.succeeded && customersResult.data) {
                setTopCustomers(customersResult.data);
            }

            // Fetch recent activities
            const activitiesResult = await getRecentActivity();
            if (activitiesResult.succeeded && activitiesResult.data) {
                setActivities(activitiesResult.data);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set mock data on error for demo purposes
            setStats({
                totalUsers: 1234,
                totalInvoices: 5678,
                pendingInvoices: 42,
                totalRevenue: 125000,
                monthlyGrowth: 12.5,
                totalOrganizations: 48,
                avgInvoiceValue: 2500,
                totalCustomers: 890
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers.toLocaleString(),
            icon: UserGroupIcon,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-800',
            changeType: 'positive'
        },
        {
            title: 'Tổng hóa đơn',
            value: stats.totalInvoices.toLocaleString(),
            icon: DocumentTextIcon,
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            textColor: 'text-green-800',
            change: '+15.3%',
            changeType: 'positive'
        },
        {
            title: 'Hóa đơn chờ duyệt',
            value: stats.pendingInvoices.toString(),
            icon: ClockIcon,
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            textColor: 'text-yellow-800',
            change: '-2.1%',
            changeType: 'negative'
        },
        {
            title: 'Tổng doanh thu',
            value: `${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`,
            icon: CurrencyDollarIcon,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            textColor: 'text-purple-800',
            change: '+22.4%',
            changeType: 'positive'
        }
    ];

    const quickStats = [
        {
            title: 'Tăng trưởng hàng tháng',
            value: `${stats.monthlyGrowth.toFixed(1)}%`,
            icon: ArrowTrendingUpIcon,
            color: 'emerald'
        },
        {
            title: 'Tổng tổ chức',
            value: stats.totalOrganizations.toString(),
            icon: BuildingOfficeIcon,
            color: 'indigo'
        },
        {
            title: 'Giá trị HĐ trung bình',
            value: `${(stats.avgInvoiceValue / 1000).toFixed(0)}K`,
            icon: CurrencyDollarIcon,
            color: 'green'
        },
        {
            title: 'Tổng khách hàng',
            value: stats.totalCustomers.toString(),
            icon: UserGroupIcon,
            color: 'blue'
        }
    ];

    const systemStatusItems = [
        {
            title: 'API Service',
            status: systemStatus.apiStatus,
            icon: ServerIcon
        },
        {
            title: 'Database',
            status: systemStatus.databaseStatus,
            icon: CircleStackIcon
        },
        {
            title: 'Blockchain',
            status: systemStatus.blockchainStatus,
            icon: ShieldCheckIcon
        },
        {
            title: 'Last Backup',
            status: 'online',
            icon: CalendarDaysIcon,
            subtitle: new Date(systemStatus.lastBackup).toLocaleDateString('vi-VN')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening in your system.</p>
                    </div>
                    
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className={`${stat.bgColor} p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${stat.textColor} opacity-70`}>{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                                
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor} ring-1 ring-white ring-opacity-25`}>
                                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Stats and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                    <div className="space-y-4">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${stat.color === 'emerald' ? 'bg-emerald-100' :
                                            stat.color === 'indigo' ? 'bg-indigo-100' :
                                                stat.color === 'green' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color === 'emerald' ? 'text-emerald-600' :
                                                stat.color === 'indigo' ? 'text-indigo-600' :
                                                    stat.color === 'green' ? 'text-green-600' : 'text-blue-600'
                                            }`} />
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">{stat.title}</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Xem tất cả</button>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.length > 0 ? activities.map((activity) => {
                                const colors = getActivityTypeColor(activity.type);
                                return (
                                    <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className={`p-2 rounded-full mr-3 ${colors.bg}`}>
                                            <div className={`h-2 w-2 rounded-full ${colors.dot}`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{getActivityDescription(activity)}</p>
                                            <p className="text-xs text-gray-500">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                );
                            }) : (
                                <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* System Status & Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* System Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
                    <div className="space-y-4">
                        {systemStatusItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        <item.icon className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                                        {item.subtitle && (
                                            <p className="text-xs text-gray-500">{item.subtitle}</p>
                                        )}
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'online' ? 'bg-green-100 text-green-800' :
                                        item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {item.status === 'online' ? 'Hoạt động' :
                                        item.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Khách hàng hàng đầu</h3>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topCustomers.length > 0 ? topCustomers.map((customer, index) => (
                                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.invoiceCount} hóa đơn</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">
                                        {(customer.totalSpent / 1000000).toFixed(1)}M VNĐ
                                    </span>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center py-8">Chưa có dữ liệu khách hàng</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng doanh thu</h3>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : revenueData.length > 0 ? (
                        <div className="h-64">
                            {/* Simple revenue trend visualization */}
                            <div className="flex items-end h-full space-x-2 px-4">
                                {revenueData.slice(0, 7).map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="bg-blue-500 rounded-t"
                                            style={{
                                                height: `${Math.max(10, (data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200)}px`,
                                                width: '100%'
                                            }}
                                        ></div>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {new Date(data.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị tại đây</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Invoice Status Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ trạng thái hóa đơn</h3>
                    <div className="h-64">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-center items-center">
                                <CheckCircleIcon className="h-12 w-12 text-green-600 mb-2" />
                                <span className="text-2xl font-bold text-green-600">{stats.totalInvoices - stats.pendingInvoices}</span>
                                <span className="text-sm text-green-800">Đã hoàn thành</span>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 flex flex-col justify-center items-center">
                                <ClockIcon className="h-12 w-12 text-yellow-600 mb-2" />
                                <span className="text-2xl font-bold text-yellow-600">{stats.pendingInvoices}</span>
                                <span className="text-sm text-yellow-800">Đang chờ</span>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center items-center">
                                <DocumentTextIcon className="h-12 w-12 text-blue-600 mb-2" />
                                <span className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</span>
                                <span className="text-sm text-blue-800">Tổng cộng</span>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 flex flex-col justify-center items-center">
                                <CurrencyDollarIcon className="h-12 w-12 text-purple-600 mb-2" />
                                <span className="text-xl font-bold text-purple-600">{(stats.avgInvoiceValue / 1000).toFixed(0)}K</span>
                                <span className="text-sm text-purple-800">GT trung bình</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}