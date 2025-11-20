import React, { useState } from "react";
import type { Invoice } from "../types/invoice";
import { Button, Table, Panel, Grid, Row, Col, Modal, Divider } from "rsuite";
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';

interface Props {
  data: Invoice | Invoice[] | null;
  open: boolean;
  onClose: () => void;
}

function fmtMoney(v?: number) {
  if (v === null || v === undefined) return "-";
  return v.toLocaleString("vi-VN");
}

export default function InvoiceDetail({ data, open, onClose }: Props) {
  const navigate = useNavigate();
  const [blockchainStatus, setBlockchainStatus] = useState<'verified' | 'pending' | 'failed' | null>(null);
  const [blockchainDetails, setBlockchainDetails] = useState<{
    transactionHash: string;
    blockNumber: string;
    timestamp: string;
    gasUsed: string;
  } | null>(null);

  if (!data) return null;

  // if array (search by contact), pick first for display
  const invoice = Array.isArray(data) ? data[0] : data;

  const verifyBlockchain = async () => {
    // Simulate blockchain verification
    setBlockchainStatus('pending');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isVerified = Math.random() > 0.1; // 90% success rate

    if (isVerified) {
      setBlockchainStatus('verified');
      setBlockchainDetails({
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: '19' + Math.floor(Math.random() * 1000000).toString(),
        timestamp: new Date().toISOString(),
        gasUsed: (Math.random() * 50000 + 21000).toFixed(0)
      });
    } else {
      setBlockchainStatus('failed');
    }
  };

  const handleBlockchainVerification = () => {
    navigate(`/blockchain-verify/${invoice.id}`);
    onClose(); // Close the modal
  };

  const handleClose = () => {
    setBlockchainStatus(null);
    setBlockchainDetails(null);
    onClose();
  };

  // download simulation (generates a small text file)
  const handleDownload = () => {
    const content = `Hóa đơn: ${invoice.invoiceNumber}\nTổng tiền: ${invoice.totalAmount}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber || "invoice"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" style={{ overflowX: 'hidden' }}>
      <Modal.Header style={{ padding: '1.25rem', borderBottom: '2px solid #f0f0f0', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Modal.Title style={{ fontSize: '18px', fontWeight: '600', color: '#1890ff' }}>Chi tiết hóa đơn</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowX: 'auto', padding: '1.5rem 1rem' }}>
        {/* Company Info */}
        <Grid fluid>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Panel bordered header="Thông tin bán hàng" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '6px' }}>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">CÔNG TY TNHH CÔNG NGHỆ ABC</p>
                  <p className="text-sm text-gray-600">123 Nguyễn Trãi, Quận 1, TP.HCM</p>
                  <p className="text-sm text-gray-600">MST: 0123456789</p>
                  <p className="text-sm text-gray-600">Email: info@abc-tech.vn</p>
                  <p className="text-sm text-gray-600">Tel: 028-12345678</p>
                </div>
              </Panel>
            </Col>
            <Col xs={24} md={12}>
              <Panel bordered header="Thông tin khách hàng" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '6px' }}>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{invoice.customerName}</p>
                  <p className="text-sm text-gray-600">{invoice.customerAddress}</p>
                  <p className="text-sm text-gray-600">Email: {invoice.customerEmail}</p>
                  <p className="text-sm text-gray-600">Tel: {invoice.customerPhone}</p>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>

        <Divider />

        {/* Invoice Details */}
        <Row gutter={16} style={{ marginTop: '1rem' }}>
          <Col xs={24} md={8}>
            <Panel bordered style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '6px' }}>
              <p className="text-xs font-semibold text-gray-600 mb-1">Mẫu số hóa đơn</p>
              <p className="text-lg font-bold text-gray-900">{invoice.formNumber}</p>
            </Panel>
          </Col>
          <Col xs={24} md={8}>
            <Panel bordered style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '6px' }}>
              <p className="text-xs font-semibold text-gray-600 mb-1">Ký hiệu hóa đơn</p>
              <p className="text-lg font-bold text-gray-900">{invoice.serial}</p>
            </Panel>
          </Col>
          <Col xs={24} md={8}>
            <Panel bordered style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '6px' }}>
              <p className="text-xs font-semibold text-gray-600 mb-1">Ngày phát hành</p>
              <p className="text-lg font-bold text-gray-900">{invoice.issuedDate}</p>
            </Panel>
          </Col>
        </Row>

        {/* Line Items */}
        {invoice.lines && invoice.lines.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-4" style={{ fontSize: '16px', fontWeight: '600', color: '#1890ff' }}>Chi tiết hóa đơn</h3>
            <div style={{ overflowX: 'auto', width: '100%', marginRight: '-1rem', marginLeft: '-1rem', paddingRight: '1rem', paddingLeft: '1rem', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)' }}>
              <Table data={invoice.lines} autoHeight bordered style={{ width: '100%', minWidth: '700px' }}>
                <Table.Column width={60} align="center">
                  <Table.HeaderCell>STT</Table.HeaderCell>
                  <Table.Cell dataKey="lineNumber" />
                </Table.Column>
                <Table.Column width={200}>
                  <Table.HeaderCell>Nội dung</Table.HeaderCell>
                  <Table.Cell dataKey="description" />
                </Table.Column>
                <Table.Column width={80} align="center">
                  <Table.HeaderCell>ĐVT</Table.HeaderCell>
                  <Table.Cell dataKey="unit">
                    {(rowData) => rowData.unit ?? "-"}
                  </Table.Cell>
                </Table.Column>
                <Table.Column width={80} align="right">
                  <Table.HeaderCell>SL</Table.HeaderCell>
                  <Table.Cell dataKey="quantity" />
                </Table.Column>
                <Table.Column width={100} align="right">
                  <Table.HeaderCell>Đơn giá</Table.HeaderCell>
                  <Table.Cell dataKey="unitPrice">
                    {(rowData) => rowData.unitPrice?.toLocaleString('vi-VN') ?? "-"}
                  </Table.Cell>
                </Table.Column>
                <Table.Column width={120} align="right">
                  <Table.HeaderCell>Thành tiền</Table.HeaderCell>
                  <Table.Cell dataKey="lineTotal">
                    {(rowData) => rowData.lineTotal?.toLocaleString('vi-VN') ?? "-"}
                  </Table.Cell>
                </Table.Column>
              </Table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 flex justify-end">
          <Panel bordered style={{ width: '100%', maxWidth: '380px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', borderRadius: '6px', background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)' }}>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cộng tiền hàng:</span>
                <span className="text-gray-900 font-medium">{invoice.subTotal?.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chiết khấu:</span>
                <span className="text-gray-900 font-medium">{invoice.discountAmount?.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tiền thuế:</span>
                <span className="text-gray-900 font-medium">{invoice.taxAmount?.toLocaleString('vi-VN')}</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="text-gray-900 font-bold">Tổng cộng:</span>
                <span className="text-2xl font-bold" style={{ color: '#1890ff' }}>{invoice.totalAmount?.toLocaleString('vi-VN')}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">({invoice.currency})</p>
            </div>
          </Panel>
        </div>

        <Divider />

        {/* Blockchain Verification */}
        <Panel bordered style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', borderColor: '#bfdbfe', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', borderRadius: '6px', marginTop: '1rem' }}>
          {/* Verification Status */}
          {blockchainStatus === null ? (
            <div className="space-y-3">
              <Button onClick={verifyBlockchain} appearance="primary" block>
                <CheckCircle size={20} className="mr-2" />
                Xác thực trên Blockchain
              </Button>
              <Button onClick={handleBlockchainVerification} appearance="ghost" block>
                Xem chi tiết xác thực
              </Button>
            </div>
          ) : blockchainStatus === 'pending' ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <Clock size={20} className="text-yellow-600 animate-spin" />
              <span className="text-yellow-700 font-medium">Đang xác thực...</span>
            </div>
          ) : blockchainStatus === 'verified' && blockchainDetails ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle size={24} className="text-green-600" />
                <span className="text-green-700 font-medium">Xác thực thành công! Hóa đơn hợp lệ</span>
              </div>
              <Grid fluid>
                <Row gutter={16}>
                  <Col xs={12}>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">TX Hash:</p>
                      <p className="text-xs font-mono text-gray-900 truncate">{blockchainDetails.transactionHash}</p>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Block Number:</p>
                      <p className="text-xs font-mono text-gray-900">{blockchainDetails.blockNumber}</p>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Timestamp:</p>
                      <p className="text-xs text-gray-900">{new Date(blockchainDetails.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Gas Used:</p>
                      <p className="text-xs font-mono text-gray-900">{blockchainDetails.gasUsed}</p>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle size={24} className="text-red-600" />
              <span className="text-red-700 font-medium">Xác thực thất bại. Vui lòng thử lại.</span>
            </div>
          )}
        </Panel>

        {/* Additional Notes */}
        {invoice.note && (
          <Panel bordered style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', borderColor: '#fde047', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', borderRadius: '6px', marginTop: '1rem' }}>
            <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú:</p>
            <p className="text-sm text-gray-600">{invoice.note}</p>
          </Panel>
        )}
      </Modal.Body>
      <Modal.Footer style={{ padding: '1rem', borderTop: '2px solid #f0f0f0', background: '#fafafa' }}>
        <Button onClick={handleDownload} appearance="subtle">
          Tải hóa đơn
        </Button>
        <Button onClick={() => window.print()} appearance="primary">
          In hóa đơn
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
