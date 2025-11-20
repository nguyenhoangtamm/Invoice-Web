import React, { useState } from 'react';
import type { Invoice } from '../../types/invoice';
import InvoicesTab from '../Dashboard/InvoicesTab';
import InvoiceDetail from '../../components/InvoiceDetail';

const InvoicesPage = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const renderInvoiceDetail = () => {
        if (!selectedInvoice) return null;
        return <InvoiceDetail data={selectedInvoice} open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} />;
    };

    return (
        <>
            <InvoicesTab onSelectInvoice={setSelectedInvoice} />
            {renderInvoiceDetail()}
        </>
    );
};

export default InvoicesPage;