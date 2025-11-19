import React, { useState } from 'react';
import type { Invoice } from '../../types/invoice';
import InvoicesTab from '../Dashboard/InvoicesTab';
import InvoiceDetailModal from '../Dashboard/InvoiceDetailModal';

const InvoicesPage = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const renderInvoiceDetail = () => {
        if (!selectedInvoice) return null;
        return <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />;
    };

    return (
        <>
            <InvoicesTab onSelectInvoice={setSelectedInvoice} />
            {renderInvoiceDetail()}
        </>
    );
};

export default InvoicesPage;