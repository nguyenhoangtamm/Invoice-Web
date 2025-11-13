import React, { useState } from "react";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice } from "../types/invoice";
import { searchByCode, searchByContact, uploadXmlFile } from "../api/mockApi";

export default function Lookup() {
  const [result, setResult] = useState<Invoice | Invoice[] | null>(null);
  const [mode, setMode] = useState<"code" | "xml" | "contact">("code");
  const [code, setCode] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaSample] = useState("A7B9");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSearchByCode() {
    setMessage(null);
    if (!code) return setMessage("Vui lòng nhập mã tra cứu");
    if (!captcha) return setMessage("Vui lòng nhập mã xác thực");
    if (captcha.toUpperCase() !== captchaSample) return setMessage("Mã xác thực không đúng");
    setLoading(true);
    try {
      const res = await searchByCode(code.trim());
      setResult(res);
      if (!res) setMessage("Không tìm thấy kết quả");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchByContact() {
    setMessage(null);
    if (!contact) return setMessage("Vui lòng nhập email hoặc số điện thoại");
    setLoading(true);
    try {
      const res = await searchByContact(contact.trim());
      setResult(res);
      if (!res) setMessage("Không tìm thấy kết quả");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadXml() {
    setMessage(null);
    if (!file) return setMessage("Vui lòng chọn file XML");
    setLoading(true);
    try {
      const res = await uploadXmlFile(file);
      setResult(res);
      if (!res) setMessage("Không tìm thấy kết quả");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm bg-white/10 p-1">
                <button
                  onClick={() => setMode("code")}
                  className={`px-6 py-2 rounded-md font-medium text-sm ${mode === "code" ? "bg-white text-indigo-700" : "text-white/90 hover:bg-white/20"}`}>
                  Theo mã tra cứu
                </button>
                <button
                  onClick={() => setMode("xml")}
                  className={`px-6 py-2 rounded-md font-medium text-sm ${mode === "xml" ? "bg-white text-indigo-700" : "text-white/90 hover:bg-white/20"}`}>
                  Theo file XML
                </button>
                <button
                  onClick={() => setMode("contact")}
                  className={`px-6 py-2 rounded-md font-medium text-sm ${mode === "contact" ? "bg-white text-indigo-700" : "text-white/90 hover:bg-white/20"}`}>
                  Theo email / SĐT
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-stretch">
                <div className="flex-1 p-6">
                  {mode === "code" && (
                    <div>
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Nhập mã tra cứu..."
                        className="w-full px-4 py-4 border rounded-md text-lg focus:outline-none"
                      />
                    </div>
                  )}

                  {mode === "contact" && (
                    <div>
                      <input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Nhập email hoặc số điện thoại..."
                        className="w-full px-4 py-4 border rounded-md text-lg focus:outline-none"
                      />
                    </div>
                  )}

                  {mode === "xml" && (
                    <div className="flex items-center gap-4">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept=".xml"
                          onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          className="w-full"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="w-72 p-6 border-l">
                  {mode === "code" && (
                    <div>
                      <label className="block text-sm text-gray-500">Mã xác thực</label>
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Nhập mã xác thực"
                        className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none"
                      />
                      <div className="mt-2 text-sm text-indigo-600 font-medium">{captchaSample}</div>
                    </div>
                  )}

                  {mode === "xml" && (
                    <div>
                      <label className="block text-sm text-gray-500">Tải file XML</label>
                      <div className="mt-3">
                        <button
                          onClick={handleUploadXml}
                          disabled={loading}
                          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-60">
                          {loading ? "Đang xử lý..." : "Tải lên và tra cứu"}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "contact" && (
                    <div className="mt-6">
                      <button
                        onClick={handleSearchByContact}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-60">
                        {loading ? "Đang tìm..." : "Tra cứu"}
                      </button>
                    </div>
                  )}

                  {mode === "code" && (
                    <div className="mt-6">
                      <button
                        onClick={handleSearchByCode}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-60">
                        {loading ? "Đang tìm..." : "Tra cứu"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center text-white/90 mt-4">
              <p className="text-sm">Gợi ý: mã xác thực mẫu <span className="inline-block bg-white/20 px-2 py-1 rounded">{captchaSample}</span></p>
            </div>
            {message && (
              <div className="mt-4 text-center text-yellow-200">{message}</div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <InvoiceDetail data={result} />
          <section className="py-6">
            <div className="text-center text-gray-600">
              <p>Giao diện demo - dữ liệu giả lập. Khi backend sẵn sàng, thay mockApi bằng axios call tới API thực.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
