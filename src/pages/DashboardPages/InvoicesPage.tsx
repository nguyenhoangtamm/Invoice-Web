import React, { useState } from 'react';
import InvoicesTab from '../Dashboard/InvoicesTab';
import InvoiceDetail from '../../components/InvoiceDetail';

const InvoicesPage = () => {
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCloseInvoiceDetail = () => {
        setSelectedInvoiceId(null);
        // Trigger refresh of the invoices list
        setRefreshKey(prev => prev + 1);
    };

    const renderInvoiceDetail = () => {
        if (!selectedInvoiceId) return null;
        return <InvoiceDetail invoiceId={selectedInvoiceId} open={!!selectedInvoiceId} onClose={handleCloseInvoiceDetail} />;
    };

    return (
        <>
            <InvoicesTab onSelectInvoice={(invoice) => setSelectedInvoiceId(invoice.id)} key={refreshKey} />
            {renderInvoiceDetail()}
        </>
    );
};

export default InvoicesPage;