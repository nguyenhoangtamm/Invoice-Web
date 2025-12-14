import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow bg-gradient-to-b from-white to-gray-50">
        <Outlet />
      </main>
      {/* <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 TrustInvoice — Demo
      </footer> */}
    </div>
  );
}
