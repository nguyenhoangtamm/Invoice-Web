import React, { useState } from "react";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice } from "../types/invoice";
import { Search, FileUp, Phone, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { getInvoiceByLookup } from "../api/services/invoiceService";

export default function Lookup() {
  const [result, setResult] = useState<Invoice | Invoice[] | null>(null);
  const [mode, setMode] = useState<"code" | "xml" | "contact">("code");
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSearchByCode() {
    setMessage(null);
    if (!code) return setMessage("Vui lòng nhập mã tra cứu");
    setLoading(true);
    try {
      const res = await getInvoiceByLookup(code.trim());
      setResult(res.data);
      if (!res) setMessage("Không tìm thấy kết quả");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchByContact() {
    // setMessage(null);
    // if (!contact) return setMessage("Vui lòng nhập email hoặc số điện thoại");
    // setLoading(true);
    // try {
    //   const res = await searchByContact(contact.trim());
    //   setResult(res);
    //   if (!res) setMessage("Không tìm thấy kết quả");
    // } finally {
    //   setLoading(false);
    // }
  }

  async function handleUploadXml() {
    // setMessage(null);
    // if (!file) return setMessage("Vui lòng chọn file XML");
    // setLoading(true);
    // try {
    //   const res = await uploadXmlFile(file);
    //   setResult(res);
    //   if (!res) setMessage("Không tìm thấy kết quả");
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/30 hover:bg-white/20 transition-colors">
                <Search size={20} className="text-blue-100" />
                <span className="text-blue-100 text-sm font-semibold">TrustInvoice</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">Tìm Kiếm Hóa Đơn</h1>
              <p className="text-blue-100 text-xl md:text-2xl font-light">Tra cứu thông tin hóa đơn của bạn một cách nhanh chóng, dễ dàng và an toàn</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-2xl shadow-2xl bg-white/15 backdrop-blur-md p-2 border border-white/30">
                <button
                  onClick={() => {
                    setMode("code");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-7 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 duration-300 ${mode === "code"
                    ? "bg-white text-indigo-700 shadow-xl scale-105"
                    : "text-white/90 hover:text-white/100 hover:bg-white/10"
                    }`}
                >
                  <Search size={18} />
                  Theo mã
                </button>
                <button
                  onClick={() => {
                    setMode("xml");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-7 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 duration-300 ${mode === "xml"
                    ? "bg-white text-indigo-700 shadow-xl scale-105"
                    : "text-white/90 hover:text-white/100 hover:bg-white/10"
                    }`}
                >
                  <FileUp size={18} />
                  File XML
                </button>
                <button
                  onClick={() => {
                    setMode("contact");
                    setResult(null);
                    setMessage(null);
                  }}
                  className={`px-7 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 duration-300 ${mode === "contact"
                    ? "bg-white text-indigo-700 shadow-xl scale-105"
                    : "text-white/90 hover:text-white/100 hover:bg-white/10"
                    }`}
                >
                  <Phone size={18} />
                  Liên hệ
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/50">
              <div className="p-8 md:p-12">
                <div className="space-y-6">
                  {/* Main Input */}
                  {mode === "code" && (
                    <div className="space-y-4">
                      <div>
                        <label className="flex text-sm font-bold text-gray-800 mb-3 items-center gap-2">
                          <Search size={18} className="text-blue-600" />
                          Mã Tra Cứu
                        </label>
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearchByCode()}
                          placeholder="Ví dụ: INV-2024-001"
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium"
                        />
                      </div>
                      <button
                        onClick={handleSearchByCode}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl text-base"
                      >
                        {loading ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Đang tìm...
                          </>
                        ) : (
                          <>
                            <Search size={20} />
                            Tra Cứu Ngay
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {mode === "contact" && (
                    <div className="space-y-4">
                      <div>
                        <label className="flex text-sm font-bold text-gray-800 mb-3 items-center gap-2">
                          <Phone size={18} className="text-purple-600" />
                          Email hoặc Số Điện Thoại
                        </label>
                        <input
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearchByContact()}
                          placeholder="example@email.com hoặc 0123456789"
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all placeholder-gray-400 font-medium"
                        />
                      </div>
                      <button
                        onClick={handleSearchByContact}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl text-base"
                      >
                        {loading ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Đang tìm...
                          </>
                        ) : (
                          <>
                            <Phone size={20} />
                            Tra Cứu Ngay
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {mode === "xml" && (
                    <div className="space-y-4">
                      <label className="flex text-sm font-bold text-gray-800 mb-3 items-center gap-2">
                        <FileUp size={18} className="text-indigo-600" />
                        Tải File XML
                      </label>
                      <label className="w-full px-8 py-8 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-4 group">
                        <FileUp size={40} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        <div className="text-center">
                          <p className="font-bold text-gray-700 group-hover:text-indigo-600 text-lg">{file ? file.name : "Chọn file XML"}</p>
                          <p className="text-sm text-gray-500 mt-1">Hoặc kéo thả file vào đây</p>
                        </div>
                        <input
                          type="file"
                          accept=".xml"
                          onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleUploadXml}
                        disabled={loading || !file}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl text-base"
                      >
                        {loading ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FileUp size={20} />
                            Tải Lên
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mt-6 flex items-center gap-3 p-5 rounded-xl bg-amber-50 border-l-4 border-amber-400 text-amber-800 animate-fadeIn shadow-md">
                <AlertCircle size={22} className="flex-shrink-0 text-amber-600" />
                <p className="font-semibold text-base">{message}</p>
              </div>
            )}

            {/* Helper Text */}
            <div className="mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 text-center">
              <p className="text-blue-100 text-base font-medium">
                💡 <span className="font-semibold">Gợi ý:</span> Chọn phương pháp tra cứu phù hợp và nhập thông tin để tìm kiếm hóa đơn
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {result && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <CheckCircle size={28} className="text-green-500" />
                <h2 className="text-3xl font-bold text-gray-900">Kết Quả Tra Cứu</h2>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-green-500 hover:shadow-3xl transition-shadow">
                <InvoiceDetail data={result} />
              </div>
            </div>
          )}

          {!result && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6 opacity-80">📋</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Sẵn sàng để tra cứu</h2>
              <p className="text-gray-600 text-lg">Chọn phương pháp tìm kiếm và nhập thông tin ở phần trên để bắt đầu</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Tra Cứu Theo Mã</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Nhập mã tra cứu của hóa đơn để nhanh chóng tìm kiếm thông tin</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Tải File XML</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Tải lên file XML của hóa đơn để tra cứu thông tin chi tiết</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Tra Cứu Theo Liên Hệ</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Tìm kiếm theo email hoặc số điện thoại để xem hóa đơn liên quan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
