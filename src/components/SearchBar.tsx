import React, { useState } from "react";
import { searchByCode, searchByContact, uploadXmlFile } from "../api/mockApi";
import type { Invoice } from "../types/invoice";

interface Props {
  onResult: (data: Invoice | Invoice[] | null) => void;
}

export default function SearchBar({ onResult }: Props) {
  const [mode, setMode] = useState<"code" | "xml" | "contact">("code");
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("A7B9"); // fake captcha
  const [captchaInput, setCaptchaInput] = useState("");

  const handleSearch = async () => {
    if (captchaInput.trim().toUpperCase() !== captcha) {
      alert("Mã xác thực không đúng (dùng mã giả: A7B9).");
      return;
    }

    setLoading(true);
    try {
      if (mode === "code") {
        const res = await searchByCode(value.trim());
        onResult(res);
      } else if (mode === "contact") {
        const res = await searchByContact(value.trim());
        onResult(res);
      }
    } catch (err) {
      console.error(err);
      onResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file XML.");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadXmlFile(file);
      onResult(res);
    } catch (err) {
      console.error(err);
      onResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(90deg, #1766d6 0%, #5b3bd5 100%)",
        color: "white",
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">TrustInvoice</h1>
        <p className="mb-6 opacity-90">
          Nhập mã tra cứu hoặc upload file XML để xem chi tiết
        </p>

        <div className="mb-6 inline-flex rounded-md bg-white/10 p-1">
          <button
            onClick={() => setMode("code")}
            className={`px-4 py-2 rounded-l-md ${mode === "code"
                ? "bg-white text-blue-700"
                : "text-white/90 hover:text-white"
              }`}
          >
            Theo mã tra cứu
          </button>
          <button
            onClick={() => setMode("xml")}
            className={`px-4 py-2 ${mode === "xml"
                ? "bg-white text-blue-700"
                : "text-white/90 hover:text-white"
              }`}
          >
            Theo file XML
          </button>
          <button
            onClick={() => setMode("contact")}
            className={`px-4 py-2 rounded-r-md ${mode === "contact"
                ? "bg-white text-blue-700"
                : "text-white/90 hover:text-white"
              }`}
          >
            Theo email / SĐT
          </button>
        </div>

        <div className="flex justify-center">
          {mode === "xml" ? (
            <div className="bg-white rounded-md w-2/3 p-4 flex items-center gap-3">
              <input
                type="file"
                accept=".xml"
                aria-label="Tải file XML hóa đơn"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <button
                onClick={handleUpload}
                disabled={loading}
                className="ml-auto bg-blue-600 px-4 py-2 rounded text-white"
              >
                {loading ? "Đang tải..." : "Upload & Tra cứu"}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-md w-2/3 flex items-center overflow-hidden shadow-lg">
              <input
                className="flex-grow px-4 py-3 text-gray-800 outline-none"
                placeholder={
                  mode === "code"
                    ? "Nhập mã tra cứu..."
                    : "Nhập email hoặc số điện thoại..."
                }
                aria-label={
                  mode === "code"
                    ? "Ô nhập mã tra cứu hóa đơn"
                    : "Ô nhập email hoặc số điện thoại khách hàng"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="px-3 flex items-center gap-3">
                <div className="text-sm text-gray-500 text-left">
                  <div className="mb-1">Mã xác thực</div>
                  <div className="bg-white text-blue-700 px-2 py-1 rounded font-mono">
                    {captcha}
                  </div>
                </div>
                <input
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="b-28 px-3 py-2 border rounded"
                  placeholder="Nhập mã xác thực"
                  aria-label="Ô nhập mã xác thực"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-blue-600 px-4 py-3 text-white"
                >
                  {loading ? "Đang..." : "Tra cứu"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-white/90 mt-4">
          Gợi ý: mã xác thực mẫu{" "}
          <span className="font-mono bg-white/10 px-1 rounded">A7B9</span>
        </div>
      </div>
    </section>
  );
}
