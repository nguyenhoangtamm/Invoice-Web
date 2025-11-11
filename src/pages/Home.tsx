import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice } from "../types/invoice";

export default function Home() {
  const [result, setResult] = useState<Invoice | Invoice[] | null>(null);

  return (
    <div>
      <SearchBar onResult={setResult} />
      <InvoiceDetail data={result} />
      <section className="py-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>Giao diện demo - dữ liệu giả lập. Khi backend sẵn sàng, thay mockApi bằng axios call tới API thực.</p>
        </div>
      </section>
    </div>
  );
}
