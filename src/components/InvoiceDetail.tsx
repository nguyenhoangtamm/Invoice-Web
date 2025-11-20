import React, { useState } from "react";
import type { Invoice } from "../types/invoice";
import { Button, Table, Panel, Grid, Row, Col, Modal, Divider, FlexboxGrid } from "rsuite";
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
      <Modal.Body style={{ overflowX: 'auto', padding: '0' }}>
        <div className="vat-invoice-form bg-white">
          {/* Header cảnh báo */}
          <div className="warning-banner bg-green-500 text-white px-4 py-2 text-sm">
            <CheckCircle className="inline-block mr-2" /> Hóa đơn đã được xác thực và lưu trữ an toàn trên hệ thống Blockchain
          </div>

          <div className="p-6">
            {/* Tiêu đề */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h1>
              <p className="text-gray-600">Ngày {invoice.issuedDate}</p>
            </div>

            <FlexboxGrid justify="space-between" className="mb-6">
              {/* Thông tin đơn vị bán hàng */}
              <FlexboxGrid.Item colspan={11}>
                <Panel bordered className="h-full">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị bán hàng:</label>
                      <p className="text-gray-900 font-medium">CÔNG TY TNHH CÔNG NGHỆ ABC</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế:</label>
                      <p className="text-gray-900">0123456789</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                      <p className="text-gray-900">123 Nguyễn Trãi, Quận 1, TP.HCM</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                      <p className="text-gray-900">info@abc-tech.vn</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại:</label>
                      <p className="text-gray-900">028-12345678</p>
                    </div>
                  </div>
                </Panel>
              </FlexboxGrid.Item>

              {/* Thông tin hóa đơn */}
              <FlexboxGrid.Item colspan={12}>
                <Panel bordered className="h-full">
                  <div className="space-y-3">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ký hiệu:</label>
                        <p className="text-gray-900 font-medium">{invoice.serial}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số:</label>
                      <p className="text-gray-900 font-medium text-lg">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mẫu số hóa đơn:</label>
                      <p className="text-gray-900">{invoice.formNumber}</p>
                    </div>
                    <div className="bg-green-100 border-l-4 border-green-500 p-3 text-sm">
                      <strong>✓ Hóa đơn hợp lệ và đã được xác thực trên Blockchain</strong>
                    </div>
                  </div>
                </Panel>
              </FlexboxGrid.Item>
            </FlexboxGrid>

            {/* Thông tin người mua */}
            <Panel bordered className="mb-6">
              <h3 className="text-lg font-medium mb-4">Thông tin người mua</h3>
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item colspan={11}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên đơn vị:</label>
                      <p className="text-gray-900">{invoice.customerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                      <p className="text-gray-900">{invoice.customerAddress}</p>
                    </div>
                  </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={12}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                      <p className="text-gray-900">{invoice.customerEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                      <p className="text-gray-900">{invoice.customerPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức TT:</label>
                      <p className="text-gray-900">Chuyển khoản</p>
                    </div>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Panel>

            <Divider />

            {/* Invoice Details */}
            <Row gutter={16} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
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
                  <p className="text-xs font-semibold text-gray-600 mb-1">Mã tra cứu</p>
                  <p className="text-lg font-bold text-gray-900">{invoice.lookupCode}</p>
                </Panel>
              </Col>
            </Row>

            {/* Bảng sản phẩm/dịch vụ */}
            {invoice.lines && invoice.lines.length > 0 && (
              <Panel bordered className="mb-6">
                <h3 className="text-lg font-medium mb-4">Chi tiết hàng hóa/dịch vụ</h3>

                <Table
                  data={invoice.lines}
                  autoHeight
                  bordered
                  cellBordered
                >
                  <Table.Column width={60} align="center">
                    <Table.HeaderCell>STT</Table.HeaderCell>
                    <Table.Cell dataKey="lineNumber" />
                  </Table.Column>
                  <Table.Column width={200}>
                    <Table.HeaderCell>Tên hàng hóa/Dịch vụ</Table.HeaderCell>
                    <Table.Cell dataKey="description" />
                  </Table.Column>
                  <Table.Column width={80} align="center">
                    <Table.HeaderCell>ĐVT</Table.HeaderCell>
                    <Table.Cell dataKey="unit">
                      {(rowData) => rowData.unit ?? "-"}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={100} align="right">
                    <Table.HeaderCell>Số lượng</Table.HeaderCell>
                    <Table.Cell dataKey="quantity" />
                  </Table.Column>
                  <Table.Column width={120} align="right">
                    <Table.HeaderCell>Đơn giá sau thuế</Table.HeaderCell>
                    <Table.Cell dataKey="unitPrice">
                      {(rowData) => rowData.unitPrice?.toLocaleString('vi-VN') ?? "-"}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={120} align="right">
                    <Table.HeaderCell>Thành tiền sau thuế</Table.HeaderCell>
                    <Table.Cell dataKey="lineTotal">
                      {(rowData) => rowData.lineTotal?.toLocaleString('vi-VN') ?? "-"}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column width={120} align="right">
                    <Table.HeaderCell>Thành tiền</Table.HeaderCell>
                    <Table.Cell dataKey="lineTotal">
                      {(rowData) => rowData.lineTotal?.toLocaleString('vi-VN') ?? "-"}
                    </Table.Cell>
                  </Table.Column>
                </Table>
              </Panel>
            )}

            {/* Tổng cộng */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div></div>
              <Panel bordered>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-medium">{invoice.subTotal?.toLocaleString('vi-VN') || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chiết khấu:</span>
                    <span className="font-medium">{invoice.discountAmount?.toLocaleString('vi-VN') || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền thuế GTGT:</span>
                    <span className="font-medium">{invoice.taxAmount?.toLocaleString('vi-VN') || '0'}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền thanh toán:</span>
                    <span>{invoice.totalAmount?.toLocaleString('vi-VN') || '0'}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Đơn vị: {invoice.currency}</p>
                </div>
              </Panel>
            </div>

            {/* Blockchain Verification */}
            <Panel bordered className="mb-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', borderColor: '#bfdbfe' }}>
              <h3 className="text-lg font-medium mb-4">Xác thực Blockchain</h3>
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
                  <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item colspan={11}>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">TX Hash:</p>
                        <p className="text-xs font-mono text-gray-900 truncate">{blockchainDetails.transactionHash}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Timestamp:</p>
                        <p className="text-xs text-gray-900">{new Date(blockchainDetails.timestamp).toLocaleString('vi-VN')}</p>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={12}>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Block Number:</p>
                        <p className="text-xs font-mono text-gray-900">{blockchainDetails.blockNumber}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Gas Used:</p>
                        <p className="text-xs font-mono text-gray-900">{blockchainDetails.gasUsed}</p>
                      </div>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
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
              <Panel bordered style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', borderColor: '#fde047' }}>
                <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú:</p>
                <p className="text-sm text-gray-600">{invoice.note}</p>
              </Panel>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={handleDownload} appearance="default">
                Tải hóa đơn
              </Button>
              <Button onClick={() => window.print()} appearance="primary">
                In hóa đơn
              </Button>
              <Button onClick={handleClose} appearance="subtle">
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
