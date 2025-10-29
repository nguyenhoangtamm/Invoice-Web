// Type definitions

export interface Invoice {
    id: number;
    number: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "cancelled";
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
