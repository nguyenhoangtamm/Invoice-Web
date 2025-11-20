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
  const [compareModalOpen, setCompareModalOpen] = useState(false);

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

  // Generate comparison data
  const getComparisonData = () => {
    // Simulate on-chain data with some differences
    const onChainData = {
      invoiceNumber: invoice.invoiceNumber,
      formNumber: invoice.formNumber,
      serial: invoice.serial,
      lookupCode: invoice.lookupCode,
      sellerName: 'CÔNG TY TNHH CÔNG NGHỆ ABC',
      sellerTaxId: '0123456789',
      customerName: invoice.customerName,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency || 'VND',
      issuedDate: invoice.issuedDate,
      immutableHash: '0x' + Math.random().toString(16).substr(2, 64),
      cid: 'Qm' + Math.random().toString(36).substr(2, 44),
      // Simulate some differences for demonstration
      verificationStatus: 'Verified',
      blockNumber: '19' + Math.floor(Math.random() * 1000000).toString(),
      // Simulate invoice lines with minor differences
      lines: invoice.lines?.map((line: any, index: number) => ({
        ...line,
        // Simulate some small differences in on-chain data
        unitPrice: index === 0 ? line.unitPrice + 1000 : line.unitPrice, // First item has price difference
        name: index === 1 ? line.name + ' (Blockchain)' : line.name // Second item has name difference
      })) || []
    };

    const compareField = (offChainValue: any, onChainValue: any) => {
      if (offChainValue === onChainValue) {
        return { match: true, icon: '✓', color: 'text-green-600' };
      } else {
        return { match: false, icon: '✗', color: 'text-red-600' };
      }
    };

    let comparisonData = [
      {
        field: 'Số hóa đơn',
        offChain: invoice.invoiceNumber || '-',
        onChain: onChainData.invoiceNumber || '-',
        comparison: compareField(invoice.invoiceNumber, onChainData.invoiceNumber)
      },
      {
        field: 'Mẫu số hóa đơn',
        offChain: invoice.formNumber || '-',
        onChain: onChainData.formNumber || '-',
        comparison: compareField(invoice.formNumber, onChainData.formNumber)
      },
      {
        field: 'Ký hiệu hóa đơn',
        offChain: invoice.serial || '-',
        onChain: onChainData.serial || '-',
        comparison: compareField(invoice.serial, onChainData.serial)
      },
      {
        field: 'Mã tra cứu',
        offChain: invoice.lookupCode || '-',
        onChain: onChainData.lookupCode || '-',
        comparison: compareField(invoice.lookupCode, onChainData.lookupCode)
      },
      {
        field: 'Tên người bán',
        offChain: 'CÔNG TY TNHH CÔNG NGHỆ ABC',
        onChain: onChainData.sellerName,
        comparison: compareField('CÔNG TY TNHH CÔNG NGHỆ ABC', onChainData.sellerName)
      },
      {
        field: 'MST người bán',
        offChain: '0123456789',
        onChain: onChainData.sellerTaxId,
        comparison: compareField('0123456789', onChainData.sellerTaxId)
      },
      {
        field: 'Tên người mua',
        offChain: invoice.customerName || '-',
        onChain: onChainData.customerName || '-',
        comparison: compareField(invoice.customerName, onChainData.customerName)
      },
      {
        field: 'Ngày phát hành',
        offChain: invoice.issuedDate || '-',
        onChain: onChainData.issuedDate || '-',
        comparison: compareField(invoice.issuedDate, onChainData.issuedDate)
      },
      {
        field: 'Tổng tiền',
        offChain: invoice.totalAmount?.toLocaleString('vi-VN') + ' ' + (invoice.currency || 'VND'),
        onChain: onChainData.totalAmount?.toLocaleString('vi-VN') + ' ' + onChainData.currency,
        comparison: compareField(invoice.totalAmount, onChainData.totalAmount)
      }
    ];

    // Add invoice lines comparison if available
    if (invoice.lines && invoice.lines.length > 0) {
      const offChainLines = invoice.lines;
      const onChainLines = onChainData.lines;

      // Compare number of lines
      comparisonData.push({
        field: '--- CHI TIẾT HÀNG HÓA ---',
        offChain: '--- --- ---',
        onChain: '--- --- ---',
        comparison: { match: true, icon: '---', color: 'text-gray-400' }
      });

      comparisonData.push({
        field: 'Số lượng dòng sản phẩm',
        offChain: offChainLines.length.toString() + ' dòng',
        onChain: onChainLines.length.toString() + ' dòng',
        comparison: compareField(offChainLines.length, onChainLines.length)
      });

      // Compare each line
      offChainLines.forEach((offLine: any, index: number) => {
        const onLine = onChainLines[index];
        const linePrefix = `Dòng ${index + 1}:`;

        // name comparison
        comparisonData.push({
          field: `${linePrefix} Tên`,
          offChain: offLine.name || '-',
          onChain: onLine?.name || '-',
          comparison: compareField(offLine.name, onLine?.name)
        });

        // Quantity comparison
        comparisonData.push({
          field: `${linePrefix} Số lượng`,
          offChain: `${offLine.quantity || 0} ${offLine.unit || ''}`.trim(),
          onChain: `${onLine?.quantity || 0} ${onLine?.unit || ''}`.trim(),
          comparison: compareField(offLine.quantity, onLine?.quantity)
        });

        // Unit price comparison
        comparisonData.push({
          field: `${linePrefix} Đơn giá`,
          offChain: (offLine.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
          onChain: (onLine?.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
          comparison: compareField(offLine.unitPrice, onLine?.unitPrice)
        });

        // Line total comparison
        comparisonData.push({
          field: `${linePrefix} Thành tiền`,
          offChain: (offLine.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
          onChain: (onLine?.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
          comparison: compareField(offLine.lineTotal, onLine?.lineTotal)
        });
      });
    }

    return comparisonData;
  };



  return (
    <>
      <Modal open={open} onClose={onClose} size="lg" style={{ overflowX: 'hidden' }}>
        <Modal.Body style={{ overflowX: 'auto', padding: '0' }}>
          <div className="vat-invoice-form bg-white">
            {/* Header cảnh báo */}
            <div className="warning-banner bg-green-500 text-white px-4 py-2 text-sm">
              <CheckCircle className="inline-block mr-2" /> Hóa đơn đã được xác thực và lưu trữ an toàn trên hệ thống Blockchain
            </div>

            <div className="p-6">
              {/* Blockchain Verification Result - Moved to top */}
              {blockchainStatus === 'verified' && blockchainDetails && (
                <Panel bordered className="mb-6" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#22c55e' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={24} className="text-green-600" />
                    <h3 className="text-lg font-medium text-green-800">Xác thực Blockchain thành công</h3>
                  </div>
                  <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item colspan={11}>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Transaction Hash:</label>
                          <p className="text-xs font-mono text-gray-900 break-all">{blockchainDetails.transactionHash}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Thời gian xác thực:</label>
                          <p className="text-xs text-gray-900">{new Date(blockchainDetails.timestamp).toLocaleString('vi-VN')}</p>
                        </div>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={12}>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Block Number:</label>
                          <p className="text-xs font-mono text-gray-900">{blockchainDetails.blockNumber}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Gas Used:</label>
                          <p className="text-xs font-mono text-gray-900">{blockchainDetails.gasUsed}</p>
                        </div>
                      </div>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </Panel>
              )}

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
                      <Table.Cell dataKey="name" />
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



              {/* Additional Notes */}
              {invoice.note && (
                <Panel bordered style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', borderColor: '#fde047' }}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú:</p>
                  <p className="text-sm text-gray-600">{invoice.note}</p>
                </Panel>
              )}

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ padding: '1rem', borderTop: '2px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex space-x-3">
            {blockchainStatus === null ? (
              <Button onClick={verifyBlockchain} appearance="primary">
                <CheckCircle size={16} className="mr-2" />
                Xác thực Blockchain
              </Button>
            ) : blockchainStatus === 'pending' ? (
              <Button appearance="primary" disabled>
                <Clock size={16} className="mr-2 animate-spin" />
                Đang xác thực...
              </Button>
            ) : blockchainStatus === 'verified' ? (
              <Button appearance="primary" color="green" disabled>
                <CheckCircle size={16} className="mr-2" />
                Đã xác thực
              </Button>
            ) : (
              <Button onClick={verifyBlockchain} appearance="primary" color="red">
                <AlertCircle size={16} className="mr-2" />
                Xác thực lại
              </Button>
            )}
            <Button onClick={handleBlockchainVerification} appearance="ghost">
              Xem chi tiết xác thực
            </Button>
            <Button onClick={() => setCompareModalOpen(true)} appearance="ghost">
              <AlertCircle size={16} className="mr-2" />
              Đối sánh
            </Button>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleDownload} appearance="primary">
              Tải hóa đơn
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Đóng
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Compare Modal */}
      <Modal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        size={1100}
      >
        <Modal.Header>
          <Modal.Title>Đối sánh dữ liệu hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Đối sánh dữ liệu Off-chain và On-chain</h2>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <Table
                data={getComparisonData()}
                autoHeight
                bordered
                cellBordered
                className="comparison-table"
              >
                <Table.Column width={200} align="left" fixed>
                  <Table.HeaderCell style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                    Trường dữ liệu
                  </Table.HeaderCell>
                  <Table.Cell dataKey="field" style={{ fontWeight: '600' }} />
                </Table.Column>

                <Table.Column width={300} align="left" flexGrow={1}>
                  <Table.HeaderCell style={{ background: '#e3f2fd', fontWeight: 'bold', color: '#1565c0' }}>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      Dữ liệu Off-chain
                    </div>
                  </Table.HeaderCell>
                  <Table.Cell dataKey="offChain" style={{ wordBreak: 'break-word' }} />
                </Table.Column>

                <Table.Column width={300} align="left" flexGrow={1}>
                  <Table.HeaderCell style={{ background: '#e8f5e8', fontWeight: 'bold', color: '#2e7d32' }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      Dữ liệu On-chain
                    </div>
                  </Table.HeaderCell>
                  <Table.Cell dataKey="onChain" style={{ wordBreak: 'break-word' }} />
                </Table.Column>

                <Table.Column width={120} align="center" fixed="right">
                  <Table.HeaderCell style={{ background: '#fff3e0', fontWeight: 'bold', color: '#ef6c00' }}>
                    Kết quả Đối sánh
                  </Table.HeaderCell>
                  <Table.Cell>
                    {(rowData: any) => (
                      <div className="flex items-center justify-center">
                        <span
                          className={`text-lg font-bold ${rowData.comparison.color}`}
                          title={rowData.comparison.match ? 'Trùng khớp' : rowData.comparison.icon === 'N/A' ? 'Không áp dụng' : 'Không trùng khớp'}
                        >
                          {rowData.comparison.icon}
                        </span>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Column>
              </Table>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {getComparisonData().filter(item => item.comparison.match).length}
                </div>
                <div className="text-sm text-green-700">Trùng khớp</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {getComparisonData().filter(item => !item.comparison.match && item.comparison.icon !== 'N/A').length}
                </div>
                <div className="text-sm text-red-700">Không trùng khớp</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {getComparisonData().filter(item => item.comparison.icon === 'N/A').length}
                </div>
                <div className="text-sm text-gray-700">Chỉ có On-chain</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-blue-600 w-5 h-5" />
                <h3 className="font-semibold text-blue-800">Giải thích ký hiệu</h3>
              </div>
              <div className="text-blue-700 text-sm space-y-1">
                <p><span className="text-green-600 font-bold">✓</span> - Dữ liệu trùng khớp hoàn toàn</p>
                <p><span className="text-red-600 font-bold">✗</span> - Dữ liệu không trùng khớp</p>
                <p><span className="text-gray-500 font-bold">N/A</span> - Trường dữ liệu chỉ tồn tại trên blockchain</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setCompareModalOpen(false)} appearance="subtle">
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
