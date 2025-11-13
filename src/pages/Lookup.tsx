import React, { useState } from "react";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice } from "../types/invoice";
import { searchByCode, searchByContact, uploadXmlFile } from "../api/mockApi";
import { Search, FileUp, Phone, Loader, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/20">
                <Search size={18} className="text-blue-200" />
                <span className="text-blue-100 text-sm font-medium">Tra cứu Hóa đơn</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Tìm Kiếm Hóa Đơn</h1>
              <p className="text-blue-100 text-lg">Tra cứu thông tin hóa đơn của bạn một cách nhanh chóng và dễ dàng</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-xl shadow-lg bg-white/10 backdrop-blur-sm p-1.5 border border-white/20">
                <button
                  onClick={() => {
                    setMode("code");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    mode === "code"
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "text-white/80 hover:text-white/100 hover:bg-white/10"
                  }`}
                >
                  <Search size={16} />
                  Theo mã
                </button>
                <button
                  onClick={() => {
                    setMode("xml");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    mode === "xml"
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "text-white/80 hover:text-white/100 hover:bg-white/10"
                  }`}
                >
                  <FileUp size={16} />
                  File XML
                </button>
                <button
                  onClick={() => {
                    setMode("contact");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    mode === "contact"
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "text-white/80 hover:text-white/100 hover:bg-white/10"
                  }`}
                >
                  <Phone size={16} />
                  Liên hệ
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-0">
                {/* Main Input */}
                <div className="md:col-span-2 p-6 md:p-8 bg-gradient-to-br from-white to-slate-50">
                  {mode === "code" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Mã Tra Cứu</label>
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchByCode()}
                        placeholder="Nhập mã tra cứu..."
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400"
                      />
                    </div>
                  )}

                  {mode === "contact" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Email hoặc Số Điện Thoại</label>
                      <input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchByContact()}
                        placeholder="Nhập email hoặc số điện thoại..."
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400"
                      />
                    </div>
                  )}

                  {mode === "xml" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Tải File XML</label>
                      <label className="w-full px-5 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group">
                        <FileUp size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <div className="text-center">
                          <p className="font-medium text-gray-700 group-hover:text-blue-600">{file ? file.name : "Chọn file XML"}</p>
                          <p className="text-xs text-gray-500">Hoặc kéo thả file vào đây</p>
                        </div>
                        <input
                          type="file"
                          accept=".xml"
                          onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-t md:border-t-0 md:border-l-2 border-gray-100">
                  {mode === "code" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Mã Xác Thực</label>
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchByCode()}
                        placeholder="Nhập mã xác thực"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-lg font-semibold tracking-widest"
                      />
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-200 text-center">
                        <p className="text-xs text-gray-600 mb-2">Mã mẫu:</p>
                        <p className="text-2xl font-bold text-indigo-600 tracking-widest font-mono">{captchaSample}</p>
                      </div>
                      <button
                        onClick={handleSearchByCode}
                        disabled={loading}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Đang tìm...
                          </>
                        ) : (
                          <>
                            <Search size={18} />
                            Tra Cứu
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {mode === "contact" && (
                    <div>
                      <button
                        onClick={handleSearchByContact}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-12"
                      >
                        {loading ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Đang tìm...
                          </>
                        ) : (
                          <>
                            <Search size={18} />
                            Tra Cứu
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-600 text-center mt-3">Nhập email hoặc số điện thoại để tìm kiếm</p>
                    </div>
                  )}

                  {mode === "xml" && (
                    <div>
                      <button
                        onClick={handleUploadXml}
                        disabled={loading || !file}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
                      >
                        {loading ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FileUp size={18} />
                            Tải Lên
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-600 text-center mt-3">Chọn file XML để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-amber-800 animate-fadeIn">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="font-medium">{message}</p>
              </div>
            )}

            {/* Helper Text */}
            <div className="mt-6 text-center text-white/80 text-sm">
              <p>💡 Gợi ý: Sử dụng mã xác thực <span className="inline-block bg-white/10 px-3 py-1 rounded-full font-mono font-semibold mt-2">{captchaSample}</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {result && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={24} className="text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Kết Quả Tra Cứu</h2>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500">
                <InvoiceDetail data={result} />
              </div>
            </div>
          )}

          {!result && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Nhập thông tin để bắt đầu tra cứu</h2>
              <p className="text-gray-600">Chọn một trong ba phương pháp tìm kiếm ở trên</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Tra Cứu Theo Mã</h3>
              <p className="text-sm text-gray-700">Nhập mã tra cứu của hóa đơn kèm mã xác thực</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="font-semibold text-gray-900 mb-2">Tải File XML</h3>
              <p className="text-sm text-gray-700">Tải lên file XML của hóa đơn để tra cứu</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-900 mb-2">Tra Cứu Theo Liên Hệ</h3>
              <p className="text-sm text-gray-700">Tìm kiếm theo email hoặc số điện thoại</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
