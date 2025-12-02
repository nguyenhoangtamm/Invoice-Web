import React, { useState } from 'react';
import type { Invoice } from '../../types/invoice';
import InvoicesTab from '../Dashboard/InvoicesTab';
import InvoiceDetail from '../../components/InvoiceDetail';

const InvoicesPage = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCloseInvoiceDetail = () => {
        setSelectedInvoice(null);
        // Trigger refresh of the invoices list
        setRefreshKey(prev => prev + 1);
    };

    const renderInvoiceDetail = () => {
        if (!selectedInvoice) return null;
        return <InvoiceDetail data={selectedInvoice} open={!!selectedInvoice} onClose={handleCloseInvoiceDetail} />;
    };

    return (
        <>
            <InvoicesTab onSelectInvoice={setSelectedInvoice} key={refreshKey} />
            {renderInvoiceDetail()}
        </>
    );
};

export default InvoicesPage;