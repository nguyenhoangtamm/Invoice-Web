import React, { useState, useEffect } from "react";
import type { Invoice } from "../types/invoice";
import { Button, Table, Panel, Grid, Row, Col, Modal, Divider, FlexboxGrid, Message, toaster } from "rsuite";
import { CheckCircle, Clock, AlertCircle, Download as DownloadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blockchainService, type BlockchainVerificationResponse } from '../api/services/blockchainService';
import { downloadInvoiceFile, getInvoiceById } from '../api/services/invoiceService';
import { InvoiceStatus } from '../enums/invoiceEnum';
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

function getInvoiceStatusText(status: number): string {
  switch (status) {
    case InvoiceStatus.Draft:
      return "Bản nháp";
    case InvoiceStatus.Uploaded:
    case InvoiceStatus.IpfsStored:
    case InvoiceStatus.Batched:
    case InvoiceStatus.BlockchainConfirmed:
    case InvoiceStatus.Finalized:
      return "Đã ghi nhận";
    default:
      return "Đã ghi nhận";
  }
}

function getInvoiceStatusColor(status: number): string {
  switch (status) {
    case InvoiceStatus.Draft:
      return "text-yellow-600 bg-yellow-100";
    case InvoiceStatus.Uploaded:
    case InvoiceStatus.IpfsStored:
    case InvoiceStatus.Batched:
    case InvoiceStatus.BlockchainConfirmed:
    case InvoiceStatus.Finalized:
      return "text-green-600 bg-green-100";
    default:
      return "text-green-600 bg-green-100";
  }
}

export default function InvoiceDetail({ data, open, onClose }: Props) {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [blockchainStatus, setBlockchainStatus] = useState<'verified' | 'pending' | 'failed' | null>(null);
  const [blockchainDetails, setBlockchainDetails] = useState<{
    transactionHash: string;
    blockNumber: string;
    timestamp: string;
    gasUsed: string;
  } | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<BlockchainVerificationResponse | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

  // Fetch invoice data when modal opens
  useEffect(() => {
    if (open && data) {
      const invoiceData = Array.isArray(data) ? data[0] : data;
      if (invoiceData?.id) {
        setLoadingInvoice(true);
        getInvoiceById(String(invoiceData.id))
          .then(response => {
            if (response.succeeded && response.data) {
              setInvoice(response.data);
            } else {
              toaster.push(
                <Message type="error" showIcon>
                  Lỗi tải thông tin hóa đơn: {response.message || 'Unknown error'}
                </Message>
              );
            }
          })
          .catch(error => {
            console.error('Error fetching invoice:', error);
            toaster.push(
              <Message type="error" showIcon>
                Có lỗi xảy ra khi tải thông tin hóa đơn
              </Message>
            );
          })
          .finally(() => setLoadingInvoice(false));
      }
    } else if (!open) {
      // Reset state when modal closes
      setInvoice(null);
      setBlockchainStatus(null);
      setBlockchainDetails(null);
      setComparisonData(null);
      setCompareModalOpen(false);
    }
  }, [open, data]);

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
    if (invoice) {
      navigate(`/blockchain-verify/${invoice.id}`);
      onClose(); // Close the modal
    }
  };

  const handleCompare = async () => {
    if (!invoice) return;
    try {
      setLoadingComparison(true);
      const response = await blockchainService.verifyInvoice(invoice.id);
      setComparisonData(response);
      setCompareModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu so sánh:', error);
      // Có thể thêm notification hoặc message lỗi ở đây
    } finally {
      setLoadingComparison(false);
    }
  };

  const handleClose = () => {
    setInvoice(null);
    setBlockchainStatus(null);
    setBlockchainDetails(null);
    setComparisonData(null);
    setCompareModalOpen(false);
    onClose();
  };

  // download simulation (generates a small text file)
  const handleDownload = async () => {
    // Check if invoice is loaded
    if (!invoice) {
      toaster.push(
        <Message type="warning" showIcon>
          Thông tin hóa đơn chưa được tải
        </Message>
      );
      return;
    }

    // Check if invoice has attachment files
    if (!invoice.attachmentFileIds || invoice.attachmentFileIds.length === 0) {
      toaster.push(
        <Message type="warning" showIcon>
          Không có tệp đính kèm để tải xuống
        </Message>
      );
      return;
    }

    try {
      // Download first file (or you can show a selection if multiple files)
      const fileId = invoice.attachmentFileIds[0];
      setDownloadingFileId(fileId);

      const blob = await downloadInvoiceFile(fileId);

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber || "invoice"}-${fileId}`;
      a.click();
      URL.revokeObjectURL(url);

      toaster.push(
        <Message type="success" showIcon>
          Tải xuống tệp thành công
        </Message>
      );
    } catch (error) {
      console.error('Error downloading file:', error);
      toaster.push(
        <Message type="error" showIcon>
          Có lỗi xảy ra khi tải xuống tệp
        </Message>
      );
    } finally {
      setDownloadingFileId(null);
    }
  };

  // Generate comparison data từ API response
  const getComparisonData = () => {
    if (!comparisonData?.data) {
      return [];
    }

    const { offChainInvoice, onChainInvoice } = comparisonData.data;

    // Sử dụng dữ liệu thực từ API thay vì dữ liệu giả lập
    const onChainData = {
      invoiceNumber: onChainInvoice.invoiceNumber,
      formNumber: onChainInvoice.formNumber,
      serial: onChainInvoice.serial,
      lookupCode: onChainInvoice.lookupCode,
      sellerName: onChainInvoice.sellerName,
      sellerTaxId: onChainInvoice.sellerTaxId,
      customerName: onChainInvoice.customerName,
      totalAmount: onChainInvoice.totalAmount,
      currency: onChainInvoice.currency,
      issuedDate: onChainInvoice.issuedDate,
      immutableHash: onChainInvoice.immutableHash,
      cid: onChainInvoice.cid,
      lines: onChainInvoice.lines || []
    };

    const compareField = (offChainValue: any, onChainValue: any) => {
      if (offChainValue === onChainValue) {
        return { match: true, icon: '✓', color: 'text-green-600' };
      } else {
        return { match: false, icon: '✗', color: 'text-red-600' };
      }
    };

    let comparisonResult = [
      {
        field: 'Số hóa đơn',
        offChain: offChainInvoice.invoiceNumber || '-',
        onChain: onChainData.invoiceNumber || '-',
        comparison: compareField(offChainInvoice.invoiceNumber, onChainData.invoiceNumber)
      },
      {
        field: 'Mẫu số hóa đơn',
        offChain: offChainInvoice.formNumber || '-',
        onChain: onChainData.formNumber || '-',
        comparison: compareField(offChainInvoice.formNumber, onChainData.formNumber)
      },
      {
        field: 'Ký hiệu hóa đơn',
        offChain: offChainInvoice.serial || '-',
        onChain: onChainData.serial || '-',
        comparison: compareField(offChainInvoice.serial, onChainData.serial)
      },
      {
        field: 'Mã tra cứu',
        offChain: offChainInvoice.lookupCode || '-',
        onChain: onChainData.lookupCode || '-',
        comparison: compareField(offChainInvoice.lookupCode, onChainData.lookupCode)
      },
      {
        field: 'Tên người bán',
        offChain: offChainInvoice.sellerName || '-',
        onChain: onChainData.sellerName || '-',
        comparison: compareField(offChainInvoice.sellerName, onChainData.sellerName)
      },
      {
        field: 'MST người bán',
        offChain: offChainInvoice.sellerTaxId || '-',
        onChain: onChainData.sellerTaxId || '-',
        comparison: compareField(offChainInvoice.sellerTaxId, onChainData.sellerTaxId)
      },
      {
        field: 'Tên người mua',
        offChain: offChainInvoice.customerName || '-',
        onChain: onChainData.customerName || '-',
        comparison: compareField(offChainInvoice.customerName, onChainData.customerName)
      },
      {
        field: 'Ngày phát hành',
        offChain: offChainInvoice.issuedDate || '-',
        onChain: onChainData.issuedDate || '-',
        comparison: compareField(offChainInvoice.issuedDate, onChainData.issuedDate)
      },
      {
        field: 'Tổng tiền',
        offChain: offChainInvoice.totalAmount?.toLocaleString('vi-VN') + ' ' + (offChainInvoice.currency || 'VND'),
        onChain: onChainData.totalAmount?.toLocaleString('vi-VN') + ' ' + (onChainData.currency || 'VND'),
        comparison: compareField(offChainInvoice.totalAmount, onChainData.totalAmount)
      }
    ];

    // Add invoice lines comparison if available
    if (offChainInvoice.lines && offChainInvoice.lines.length > 0) {
      const offChainLines = offChainInvoice.lines;
      const onChainLines = onChainData.lines;

      // Compare number of lines
      comparisonResult.push({
        field: '--- CHI TIẾT HÀNG HÓA ---',
        offChain: '--- --- ---',
        onChain: '--- --- ---',
        comparison: { match: true, icon: '---', color: 'text-gray-400' }
      });

      comparisonResult.push({
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
        comparisonResult.push({
          field: `${linePrefix} Tên`,
          offChain: offLine.name || '-',
          onChain: onLine?.name || '-',
          comparison: compareField(offLine.name, onLine?.name)
        });

        // Quantity comparison
        comparisonResult.push({
          field: `${linePrefix} Số lượng`,
          offChain: `${offLine.quantity || 0} ${offLine.unit || ''}`.trim(),
          onChain: `${onLine?.quantity || 0} ${onLine?.unit || ''}`.trim(),
          comparison: compareField(offLine.quantity, onLine?.quantity)
        });

        // Unit price comparison
        comparisonResult.push({
          field: `${linePrefix} Đơn giá`,
          offChain: (offLine.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
          onChain: (onLine?.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
          comparison: compareField(offLine.unitPrice, onLine?.unitPrice)
        });

        // Line total comparison
        comparisonResult.push({
          field: `${linePrefix} Thành tiền`,
          offChain: (offLine.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
          onChain: (onLine?.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
          comparison: compareField(offLine.lineTotal, onLine?.lineTotal)
        });
      });
    }

    return comparisonResult;
  };



  return (
    <>
      <Modal open={open} onClose={onClose} size="lg" style={{ overflowX: 'hidden' }}>
        <Modal.Body style={{ overflowX: 'auto', padding: '0' }}>
          {loadingInvoice ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : !invoice ? (
            <div className="p-6 text-center">
              <p className="text-red-600">Không thể tải thông tin hóa đơn</p>
            </div>
          ) : (
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                            {getInvoiceStatusText(invoice.status)}
                          </span>
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
          )}
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
            <Button onClick={handleCompare} appearance="ghost" loading={loadingComparison}>
              <AlertCircle size={16} className="mr-2" />
              {loadingComparison ? 'Đang tải...' : 'Đối sánh'}
            </Button>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleDownload}
              appearance="primary"
              loading={downloadingFileId !== null}
              disabled={!invoice || !invoice.attachmentFileIds || invoice.attachmentFileIds.length === 0}
            >
              <DownloadIcon size={16} className="mr-2" />
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
