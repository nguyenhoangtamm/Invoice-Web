/**
 * Utility functions for formatting and data manipulation
 */

/**
 * Format currency in Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers (for dashboard stats)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + ' nghìn tỷ';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + ' tỷ';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + ' triệu';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + ' nghìn';
  }
  return num.toString();
}

/**
 * Format date in Vietnamese format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Format datetime in Vietnamese format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} giờ trước`;
  } else if (diffInMinutes < 10080) { // 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} ngày trước`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * Get invoice status badge color
 */
export function getInvoiceStatusColor(status?: string): string {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('đã phát hành') || statusLower.includes('hoàn thành')) {
    return 'bg-green-100 text-green-800';
  } else if (statusLower.includes('chờ') || statusLower.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (statusLower.includes('đã thanh toán')) {
    return 'bg-blue-100 text-blue-800';
  } else if (statusLower.includes('quá hạn') || statusLower.includes('overdue')) {
    return 'bg-red-100 text-red-800';
  } else if (statusLower.includes('hủy')) {
    return 'bg-gray-100 text-gray-800';
  }
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Vietnamese phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
}

/**
 * Generate random ID for mock data
 */
export function generateId(prefix = 'ID'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Generate random Vietnamese company name for mock data
 */
export function generateCompanyName(): string {
  const prefixes = ['CÔNG TY TNHH', 'CÔNG TY CP', 'DOANH NGHIỆP TƯ NHÂN', 'CÔNG TY CỔ PHẦN'];
  const names = [
    'ABC Technology', 'XYZ Solutions', 'Innovation Corp', 'Digital World', 
    'Smart Systems', 'Tech Pioneer', 'Future Vision', 'Elite Group',
    'Global Connect', 'Prime Services', 'Advanced Tech', 'NextGen Solutions'
  ];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return `${prefix} ${name}`;
}

/**
 * Generate random Vietnamese address
 */
export function generateAddress(): string {
  const streets = [
    'Nguyễn Trãi', 'Lê Văn Việt', 'Võ Văn Tần', 'Pasteur', 'Cống Quỳnh',
    'Hai Bà Trưng', 'Điện Biên Phủ', 'Cách Mạng Tháng 8', 'Nam Kỳ Khởi Nghĩa'
  ];
  const districts = ['Q.1', 'Q.3', 'Q.5', 'Q.7', 'Q.9', 'Q.10', 'Q.Bình Thạnh', 'Q.Phú Nhuận'];
  
  const number = Math.floor(Math.random() * 999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  
  return `${number} ${street}, ${district}, TP.HCM`;
}

/**
 * Local Storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};