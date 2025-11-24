# TrustInvoice - Invoice Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff.svg)

TrustInvoice là một hệ thống quản lý hóa đơn hiện đại được xây dựng bằng React, TypeScript và Vite. Hệ thống cung cấp các tính năng quản lý hóa đơn toàn diện với giao diện người dùng thân thiện và hiệu suất cao.

## 🚀 Tính năng chính

-   **Quản lý hóa đơn**: Tạo, chỉnh sửa, xem và xóa hóa đôn
-   **Tra cứu hóa đơn**: Tìm kiếm hóa đơn theo nhiều tiêu chí
-   **Xác thực Blockchain**: Xác minh tính xác thực của hóa đơn thông qua blockchain
-   **Quản lý tổ chức**: Quản lý thông tin các tổ chức
-   **Dashboard Analytics**: Biểu đồ và thống kê chi tiết
-   **Quản lý API Keys**: Bảo mật và quản lý quyền truy cập
-   **Hệ thống Admin**: Panel quản trị với đầy đủ quyền hạn
-   **Authentication**: Đăng nhập, đăng ký, quên mật khẩu
-   **Responsive Design**: Tương thích với mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Frontend Framework

-   **React 18.2.0** - UI Framework
-   **TypeScript 5.4.2** - Type Safety
-   **Vite 5.4.21** - Build Tool & Dev Server

### UI Libraries & Styling

-   **Tailwind CSS 3.4.14** - Utility-first CSS framework
-   **RSuite 5.0.0** - React Component Library
-   **Lucide React 0.553.0** - Icon Library

### State Management & Routing

-   **React Router DOM 7.9.5** - Client-side routing
-   **React Context API** - State management

### HTTP Client & APIs

-   **Axios 1.5.0** - HTTP requests
-   **Custom API Services** - Service layer architecture

## 📁 Cấu trúc dự án

```
src/
├── api/                    # API layer
│   ├── services/          # API service modules
│   │   ├── apiKeyService.ts
│   │   ├── authService.ts
│   │   ├── blockchainService.ts
│   │   ├── companyService.ts
│   │   ├── dashboardService.ts
│   │   ├── invoiceService.ts
│   │   ├── organizationService.ts
│   │   └── userService.ts
│   ├── apiClient.ts       # Main API client
│   ├── axiosClient.ts     # Axios configuration
│   ├── baseApiClient.ts   # Base API client
│   └── config.ts          # API configuration
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   │   ├── AdminGuard.tsx
│   │   ├── AuthGuard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Pagination.tsx
│   │   └── ToastProvider.tsx
│   ├── AddOrganizationModal.tsx
│   ├── CreateInvoiceModal.tsx
│   ├── InvoiceDetail.tsx
│   └── Navbar.tsx
├── contexts/             # React Context providers
│   └── AuthContext.tsx
├── hooks/                # Custom React hooks
│   ├── useAdminData.ts
│   └── useApi.ts
├── layouts/              # Layout components
│   ├── AdminLayout.tsx
│   └── DashboardLayout.tsx
├── pages/                # Page components
│   ├── Admin/           # Admin panel pages
│   ├── Dashboard/       # Dashboard tab components
│   ├── DashboardPages/  # Dashboard page components
│   ├── BlockchainVerification.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── routes/               # Routing configuration
│   └── routes.tsx
├── types/                # TypeScript type definitions
│   ├── apiKey.ts
│   ├── invoice.ts
│   ├── organization.ts
│   └── user.ts
├── utils/                # Utility functions
│   └── helpers.ts
├── styles/               # Global styles
│   ├── common.css
│   └── variables.css
└── enums/                # Enum definitions
    └── invoiceEnum.ts
```

## 🚦 Bắt đầu

### Yêu cầu hệ thống

-   Node.js >= 16.0.0
-   npm hoặc yarn
-   Git

### Cài đặt

1. **Clone repository**

    ```bash
    git clone https://github.com/nguyenhoangtamm/Invoice-Web.git
    cd Invoice-Web
    ```

2. **Cài đặt dependencies**

    ```bash
    npm install
    ```

3. **Cấu hình môi trường**

    ```bash
    cp .env.example .env
    # Chỉnh sửa file .env với các thông tin cấu hình của bạn
    ```

4. **Khởi chạy development server**

    ```bash
    npm run dev
    ```

5. **Truy cập ứng dụng**
    ```
    http://localhost:5173
    ```

### Scripts có sẵn

```bash
npm run dev      # Khởi chạy development server
npm run build    # Build ứng dụng cho production
npm run preview  # Preview build production locally
```

## 🏗️ Kiến trúc hệ thống

### Service Layer

-   **API Services**: Tách biệt logic API thành các service modules
-   **HTTP Client**: Wrapper around Axios với interceptors
-   **Error Handling**: Centralized error handling

### Component Architecture

-   **Layout Components**: Quản lý layout chung (AdminLayout, DashboardLayout)
-   **Page Components**: Components cho từng trang
-   **Common Components**: Components tái sử dụng (AuthGuard, LoadingSpinner, Pagination)
-   **Modal Components**: Dialogs và modals

### State Management

-   **Auth Context**: Quản lý authentication state
-   **Custom Hooks**: Logic tái sử dụng (useApi, useAdminData)
-   **Local State**: Component-level state với useState

## 🔐 Authentication & Authorization

-   JWT-based authentication
-   Protected routes với AuthGuard
-   Admin routes với AdminGuard
-   Role-based access control

## 📊 Các module chính

### 1. Dashboard

-   **Analytics Tab**: Thống kê và biểu đồ
-   **Invoices Tab**: Quản lý hóa đơn
-   **Organizations Tab**: Quản lý tổ chức
-   **API Keys Tab**: Quản lý API keys
-   **Settings Tab**: Cài đặt hệ thống

### 2. Admin Panel

-   **Admin Dashboard**: Tổng quan hệ thống
-   **User Management**: Quản lý người dùng
-   **Invoice Management**: Quản lý hóa đơn
-   **Organization Management**: Quản lý tổ chức
-   **Role Management**: Quản lý vai trò
-   **Menu Management**: Quản lý menu

### 3. Public Pages

-   **Lookup**: Tra cứu hóa đơn công khai
-   **Blockchain Verification**: Xác thực blockchain
-   **Privacy & Terms**: Chính sách và điều khoản

## 📱 Responsive Design

-   Mobile-first approach
-   Tailwind CSS responsive utilities
-   RSuite responsive components
-   Cross-browser compatibility

## 🔧 Development Guidelines

### Code Style

-   ESLint configuration
-   TypeScript strict mode
-   Prettier formatting
-   Consistent naming conventions

### Component Guidelines

-   Functional components with hooks
-   Props interface definitions
-   Error boundaries
-   Loading states

### API Integration

-   Service layer pattern
-   Error handling
-   Loading states
-   Data validation

## 🚀 Deployment

### Build cho Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

Tạo file `.env` với các biến môi trường cần thiết:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_APP_TITLE=TrustInvoice
VITE_BLOCKCHAIN_ENDPOINT=your_blockchain_endpoint
# Thêm các biến môi trường khác...
```

## 📋 API Services

Hệ thống sử dụng kiến trúc service layer với các services chính:

-   **authService**: Xác thực và authorization
-   **invoiceService**: Quản lý hóa đơn
-   **organizationService**: Quản lý tổ chức
-   **userService**: Quản lý người dùng
-   **dashboardService**: Dữ liệu dashboard
-   **blockchainService**: Tích hợp blockchain
-   **apiKeyService**: Quản lý API keys

## 🧪 Testing

```bash
# Chạy tests
npm run test

# Test coverage
npm run test:coverage

# E2E testing
npm run test:e2e
```

## 📈 Performance

-   Lazy loading với React.lazy()
-   Code splitting
-   Optimized bundle size
-   Efficient state management
-   Memoization với useMemo và useCallback

## 🔍 Roadmap

-   [ ] PWA Support
-   [ ] Dark Mode
-   [ ] Multi-language Support (i18n)
-   [ ] Advanced Analytics Dashboard
-   [ ] Export/Import Features (PDF, Excel)
-   [ ] Email Notifications
-   [ ] Advanced Search Filters
-   [ ] Real-time Notifications
-   [ ] Audit Trail
-   [ ] Data Backup & Recovery

## 🐛 Bug Reports

Nếu bạn tìm thấy bug, vui lòng tạo issue trên GitHub với:

-   Mô tả chi tiết bug
-   Steps to reproduce
-   Expected vs actual behavior
-   Screenshots (nếu có)
-   Environment information

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Coding Standards

-   Tuân theo ESLint rules
-   Viết tests cho features mới
-   Cập nhật documentation
-   Sử dụng TypeScript types

## 📄 License

Dự án này được cấp phép dưới MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Tác giả

-   **Nguyễn Hoàng Tâm** - [nguyenhoangtamm](https://github.com/nguyenhoangtamm)

## 🆘 Hỗ trợ

Nếu bạn cần hỗ trợ:

-   Tạo issue trên GitHub
-   Email: support@trustinvoice.com
-   Documentation: [Wiki](https://github.com/nguyenhoangtamm/Invoice-Web/wiki)

## 🙏 Acknowledgments

-   React Team for the amazing framework
-   Vite team for the fast build tool
-   Tailwind CSS for the utility-first approach
-   RSuite for the component library
-   Lucide React for beautiful icons
-   All contributors and the open source community

---

**⭐ Nếu dự án này hữu ích, đừng quên cho một star trên GitHub! ⭐**
