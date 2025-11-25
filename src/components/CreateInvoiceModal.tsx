import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Button,
    Input,
    InputPicker,
    SelectPicker,
    DatePicker,
    InputNumber,
    Schema,
    Message,
    toaster,
    Table,
    IconButton,
    Loader,
    FlexboxGrid,
    Panel,
    Divider,
    ButtonToolbar,
    InputGroup,
    Uploader,
    Badge
} from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import type { CreateInvoiceRequest, CreateInvoiceLineRequest, Invoice } from '../types/invoice';
import { getOrganizationByMe } from '../api/services/organizationService';
import { createInvoice } from '../api/services/invoiceService';
import { uploadInvoiceFile } from '../api/services/fileUploadService';
import type { Organization } from '../types/organization';
import type { AttachmentFile } from '../types/fileUpload';
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Input>>(
    (props, ref) => <Input {...props} as="textarea" ref={ref} />
);

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (invoice: Invoice) => void;
}

interface FormErrors {
    [key: string]: string;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState<CreateInvoiceRequest>({
        invoiceNumber: '',
        formNumber: '',
        serial: '',
        organizationId: 0,
        sellerName: '',
        sellerTaxId: '',
        sellerAddress: '',
        sellerPhone: '',
        sellerEmail: '',
        customerName: '',
        customerTaxId: '',
        customerAddress: '',
        customerPhone: '',
        customerEmail: '',
        status: 1,
        issuedDate: new Date().toISOString().split('T')[0],
        subTotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        currency: 'VND',
        note: '',
        lines: [],
        attachmentFileIds: []
    });

    const [lines, setLines] = useState<CreateInvoiceLineRequest[]>([{
        lineNumber: 1,
        name: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 10,
        taxAmount: 0,
        lineTotal: 0
    }]);

    const [attachedFiles, setAttachedFiles] = useState<AttachmentFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const formRef = React.useRef<any>();
    const [formError, setFormError] = useState({});
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load organizations
            const loadOrganizations = async () => {
                try {
                    setLoadingOrganizations(true);
                    const response = await getOrganizationByMe();
                    if (response.succeeded && response.data) {
                        setOrganizations(response.data);
                    }
                } catch (error) {
                    console.error('Error loading organizations:', error);
                } finally {
                    setLoadingOrganizations(false);
                }
            };

            loadOrganizations();

            // Reset form when modal opens
            setFormData({
                invoiceNumber: '',
                formNumber: '',
                serial: '',
                organizationId: 0,
                sellerName: '',
                sellerTaxId: '',
                sellerAddress: '',
                sellerPhone: '',
                sellerEmail: '',
                customerName: '',
                customerTaxId: '',
                customerAddress: '',
                customerPhone: '',
                customerEmail: '',
                status: 1,
                issuedDate: new Date().toISOString().split('T')[0],
                subTotal: 0,
                taxAmount: 0,
                discountAmount: 0,
                totalAmount: 0,
                currency: 'VND',
                note: '',
                lines: [],
                attachmentFileIds: []
            });
            setAttachedFiles([]);
            setLines([{
                lineNumber: 1,
                name: '',
                unit: '',
                quantity: 1,
                unitPrice: 0,
                discount: 0,
                taxRate: 10,
                taxAmount: 0,
                lineTotal: 0
            }]);
            setFormError({});
        }
    }, [isOpen]);
    const calculateLineTotal = (line: CreateInvoiceLineRequest): number => {
        const subtotal = line.quantity * line.unitPrice;
        const discountAmount = (subtotal * line.discount) / 100;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * line.taxRate) / 100;
        return afterDiscount + taxAmount;
    };

    const calculateTotals = (updatedLines: CreateInvoiceLineRequest[]) => {
        const subTotal = updatedLines.reduce((sum, line) => {
            return sum + (line.quantity * line.unitPrice);
        }, 0);

        const discountAmount = updatedLines.reduce((sum, line) => {
            return sum + ((line.quantity * line.unitPrice * line.discount) / 100);
        }, 0);

        const taxAmount = updatedLines.reduce((sum, line) => {
            const afterDiscount = (line.quantity * line.unitPrice) - ((line.quantity * line.unitPrice * line.discount) / 100);
            return sum + ((afterDiscount * line.taxRate) / 100);
        }, 0);

        const totalAmount = subTotal - discountAmount + taxAmount;

        setFormData(prev => ({
            ...prev,
            subTotal,
            discountAmount,
            taxAmount,
            totalAmount
        }));
    };

    const handleInputChange = (field: keyof CreateInvoiceRequest, value: any) => {
        setFormData((prev: CreateInvoiceRequest) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLineChange = (index: number, field: keyof CreateInvoiceLineRequest, value: any) => {
        const updatedLines = [...lines];
        updatedLines[index] = {
            ...updatedLines[index],
            [field]: value
        };

        // Recalculate line totals and tax amounts
        updatedLines[index].taxAmount = ((updatedLines[index].quantity * updatedLines[index].unitPrice -
            ((updatedLines[index].quantity * updatedLines[index].unitPrice * updatedLines[index].discount) / 100)) *
            updatedLines[index].taxRate) / 100;
        updatedLines[index].lineTotal = calculateLineTotal(updatedLines[index]);

        setLines(updatedLines);
        calculateTotals(updatedLines);
    };

    const addLine = () => {
        const newLine: CreateInvoiceLineRequest = {
            lineNumber: lines.length + 1,
            name: '',
            unit: '',
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            taxRate: 10,
            taxAmount: 0,
            lineTotal: 0
        };
        setLines(prev => [...prev, newLine]);
    };

    const removeLine = (index: number) => {
        if (lines.length > 1) {
            const updatedLines = lines.filter((_, i) => i !== index);
            // Update line numbers
            updatedLines.forEach((line, i) => {
                line.lineNumber = i + 1;
            });
            setLines(updatedLines);
            calculateTotals(updatedLines);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const response = await uploadInvoiceFile(file);

            if (response.succeeded && response.data) {
                setAttachedFiles(prev => [...prev, response.data]);
                setFormData(prev => ({
                    ...prev,
                    attachmentFileIds: [...(prev.attachmentFileIds || []), response.data.fileId]
                }));
                toaster.push(
                    <Message type="success" showIcon>
                        Upload file '{file.name}' thành công!
                    </Message>
                );
                return false; // Return false to prevent default behavior
            } else {
                toaster.push(
                    <Message type="error" showIcon>
                        Lỗi upload file: {response.message || 'Unknown error'}
                    </Message>
                );
                return false;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi upload file
                </Message>
            );
            return false;
        } finally {
            setUploading(false);
        }
    };

    const removeAttachedFile = (fileId: number) => {
        setAttachedFiles(prev => prev.filter(f => f.fileId !== fileId));
        setFormData(prev => ({
            ...prev,
            attachmentFileIds: (prev.attachmentFileIds || []).filter(id => id !== fileId)
        }));
    };

    // RSuite Form Schema
    const model = Schema.Model({
        invoiceNumber: Schema.Types.StringType().isRequired('Số hóa đơn là bắt buộc'),
        formNumber: Schema.Types.StringType().isRequired('Số mẫu là bắt buộc'),
        serial: Schema.Types.StringType().isRequired('Ký hiệu là bắt buộc'),
        sellerName: Schema.Types.StringType().isRequired('Tên người bán là bắt buộc'),
        sellerTaxId: Schema.Types.StringType().isRequired('Mã số thuế người bán là bắt buộc'),
        customerName: Schema.Types.StringType().isRequired('Tên khách hàng là bắt buộc'),
        customerTaxId: Schema.Types.StringType().isRequired('Mã số thuế khách hàng là bắt buộc'),
        organizationId: Schema.Types.NumberType().min(1, 'Vui lòng chọn tổ chức'),
        sellerEmail: Schema.Types.StringType().isEmail('Email người bán không hợp lệ'),
        customerEmail: Schema.Types.StringType().isEmail('Email khách hàng không hợp lệ')
    });

    const handleSubmit = async (status: number = 1) => {
        if (!formRef.current.check()) {
            toaster.push(
                <Message type="error" showIcon>
                    Vui lòng kiểm tra lại thông tin form
                </Message>
            );
            return;
        }

        // Validate lines
        if (lines.length === 0) {
            toaster.push(
                <Message type="error" showIcon>
                    Phải có ít nhất một dòng hàng hóa
                </Message>
            );
            return;
        }

        let hasLineError = false;
        lines.forEach((line, index) => {
            if (!line.name.trim()) {
                toaster.push(
                    <Message type="error" showIcon>
                        Tên hàng hóa dòng {index + 1} là bắt buộc
                    </Message>
                );
                hasLineError = true;
                return;
            }
            if (line.quantity <= 0) {
                toaster.push(
                    <Message type="error" showIcon>
                        Số lượng dòng {index + 1} phải lớn hơn 0
                    </Message>
                );
                hasLineError = true;
                return;
            }
            if (line.unitPrice < 0) {
                toaster.push(
                    <Message type="error" showIcon>
                        Đơn giá dòng {index + 1} không được âm
                    </Message>
                );
                hasLineError = true;
                return;
            }
        });

        if (hasLineError) return;

        const invoiceData: CreateInvoiceRequest = {
            ...formData,
            status: status,
            issuedDate: new Date(formData.issuedDate).toISOString(),
            lines: lines
        };

        setLoading(true);
        try {
            const response = await createInvoice(invoiceData);
            if (response.succeeded && response.data) {
                // Show success message
                toaster.push(
                    <Message type="success" showIcon>
                        {status === 0 ? 'Tạo bản nháp thành công!' : 'Tạo hóa đơn thành công!'}
                    </Message>
                );
                // Call success callback
                onSuccess(response.data);
                onClose();
            } else {
                // Show error message
                toaster.push(
                    <Message type="error" showIcon>
                        Có lỗi xảy ra khi tạo hóa đơn: {response.message || 'Unknown error'}
                    </Message>
                );
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi tạo hóa đơn
                </Message>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            size={1200}
        >
            <Modal.Header>
                <Modal.Title style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    📄 Tạo hóa đơn mới
                </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Form
                    ref={formRef}
                    model={model}
                    formValue={formData}
                    onChange={(formValue) => setFormData(formValue as CreateInvoiceRequest)}
                    formError={formError}
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                    {/* Invoice Basic Info */}
                    <Panel
                        header={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#1675e0',
                                fontWeight: '600'
                            }}>
                                📋 Thông tin cơ bản hóa đơn
                            </div>
                        }
                        bordered
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div style={{ padding: '16px' }}>
                            <FlexboxGrid justify="space-between" >
                                <FlexboxGrid.Item colspan={7}>
                                    <Form.Group controlId="invoiceNumber">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Số hóa đơn *
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="invoiceNumber"
                                            placeholder="Nhập số hóa đơn"
                                            accepter={Input}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={7}>
                                    <Form.Group controlId="formNumber">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Số mẫu *
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="formNumber"
                                            placeholder="Nhập số mẫu"
                                            accepter={Input}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={8}>
                                    <Form.Group controlId="serial">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Ký hiệu *
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="serial"
                                            placeholder="Nhập ký hiệu"
                                            accepter={Input}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>

                            <FlexboxGrid justify="start" style={{ marginTop: '16px' }}>
                                <FlexboxGrid.Item colspan={12}>
                                    <Form.Group controlId="organizationId">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Tổ chức *
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="organizationId"
                                            accepter={InputPicker}
                                            data={organizations.map((org) => ({
                                                label: org.organizationName,
                                                value: org.id,
                                            }))}
                                            placeholder="Chọn tổ chức"
                                            searchable
                                            cleanable
                                            loading={loadingOrganizations}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    </Panel>

                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item colspan={11}>
                            {/* Seller Information */}
                            <Panel
                                header={
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#28a745',
                                        fontWeight: '600'
                                    }}>
                                        🏢 Thông tin người bán
                                    </div>
                                }
                                bordered
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: 'white',
                                    height: 'fit-content'
                                }}
                            >
                                <div style={{ padding: '16px' }}>
                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={24}>
                                            <Form.Group controlId="sellerName">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Tên người bán *
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="sellerName"
                                                    placeholder="Nhập tên người bán"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>

                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={24}>
                                            <Form.Group controlId="sellerTaxId">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Mã số thuế *
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="sellerTaxId"
                                                    placeholder="Nhập mã số thuế"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>

                                    <Form.Group controlId="sellerAddress">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Địa chỉ
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="sellerAddress"
                                            placeholder="Nhập địa chỉ"
                                            accepter={Input}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>

                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={11}>
                                            <Form.Group controlId="sellerPhone">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Số điện thoại
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="sellerPhone"
                                                    placeholder="Nhập số điện thoại"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={11}>
                                            <Form.Group controlId="sellerEmail">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Email
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="sellerEmail"
                                                    placeholder="Nhập email"
                                                    accepter={Input}
                                                    type="email"
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </div>
                            </Panel>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={11}>
                            {/* Customer Information */}
                            <Panel
                                header={
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#17a2b8',
                                        fontWeight: '600'
                                    }}>
                                        👥 Thông tin khách hàng
                                    </div>
                                }
                                bordered
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: 'white',
                                    height: 'fit-content'
                                }}
                            >
                                <div style={{ padding: '16px' }}>
                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={24}>
                                            <Form.Group controlId="customerName">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Tên khách hàng *
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="customerName"
                                                    placeholder="Nhập tên khách hàng"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>

                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={24}>
                                            <Form.Group controlId="customerTaxId">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Mã số thuế *
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="customerTaxId"
                                                    placeholder="Nhập mã số thuế"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>

                                    <Form.Group controlId="customerAddress">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Địa chỉ
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="customerAddress"
                                            placeholder="Nhập địa chỉ"
                                            accepter={Input}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>

                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item colspan={11}>
                                            <Form.Group controlId="customerPhone">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Số điện thoại
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="customerPhone"
                                                    placeholder="Nhập số điện thoại"
                                                    accepter={Input}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={11}>
                                            <Form.Group controlId="customerEmail">
                                                <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                                    Email
                                                </Form.ControlLabel>
                                                <Form.Control
                                                    name="customerEmail"
                                                    placeholder="Nhập email"
                                                    accepter={Input}
                                                    type="email"
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </div>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                    {/* Invoice Details */}
                    <Panel
                        header={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#ffc107',
                                fontWeight: '600'
                            }}>
                                📅 Chi tiết hóa đơn
                            </div>
                        }
                        bordered
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div style={{ padding: '16px' }}>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={8}>
                                    <Form.Group controlId="issuedDate">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Ngày phát hành
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="issuedDate"
                                            accepter={DatePicker}
                                            format="yyyy-MM-dd"
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px'
                                            }}
                                            placeholder="Chọn ngày phát hành"
                                            value={formData.issuedDate ? new Date(formData.issuedDate) : null}
                                            onChange={(value) => {
                                                if (value) {
                                                    handleInputChange('issuedDate', value.toISOString().split('T')[0]);
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={8}>
                                    <Form.Group controlId="currency">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Tiền tệ
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="currency"
                                            accepter={SelectPicker}
                                            data={[
                                                { label: 'VND', value: 'VND' },
                                                { label: 'USD', value: 'USD' },
                                                { label: 'EUR', value: 'EUR' }
                                            ]}
                                            searchable={false}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px'
                                            }}
                                            placeholder="Chọn tiền tệ"
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={8}>
                                    <Form.Group controlId="note">
                                        <Form.ControlLabel style={{ fontWeight: '500', color: '#495057' }}>
                                            Ghi chú
                                        </Form.ControlLabel>
                                        <Form.Control
                                            name="note"
                                            placeholder="Nhập ghi chú"
                                            accepter={Textarea}
                                            rows={3}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    </Panel>

                    {/* File Upload */}
                    <Panel
                        header={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#6c5ce7',
                                fontWeight: '600'
                            }}>
                                📎 Tệp đính kèm
                            </div>
                        }
                        bordered
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div style={{ padding: '16px' }}>
                            <div style={{
                                marginBottom: '16px',
                                padding: '20px',
                                border: '2px dashed #6c5ce7',
                                borderRadius: '12px',
                                backgroundColor: '#f0e6ff',
                                textAlign: 'center'
                            }}>
                                <Uploader
                                    action=""
                                    autoUpload={false}
                                    multiple
                                    onChange={(fileList) => {
                                        fileList.forEach(file => {
                                            if (file.blobFile) {
                                                handleFileUpload(file.blobFile);
                                            }
                                        });
                                    }}
                                    disabled={uploading}
                                    style={{
                                        display: 'inline-block',
                                        width: 'auto'
                                    }}
                                >
                                    <Button
                                        appearance="primary"
                                        disabled={uploading}
                                        loading={uploading}
                                        style={{
                                            borderRadius: '8px',
                                            fontWeight: '500',
                                            backgroundColor: '#6c5ce7',
                                            borderColor: '#6c5ce7'
                                        }}
                                    >
                                        {uploading ? 'Đang upload...' : '📁 Chọn tệp để upload'}
                                    </Button>
                                </Uploader>
                                <p style={{
                                    marginTop: '12px',
                                    fontSize: '12px',
                                    color: '#6c757d'
                                }}>
                                    Kéo thả tệp hoặc nhấp để chọn tệp từ máy tính
                                </p>
                            </div>

                            {attachedFiles.length > 0 && (
                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <p style={{
                                        fontWeight: '600',
                                        marginBottom: '12px',
                                        color: '#495057'
                                    }}>
                                        Tệp đã upload ({attachedFiles.length}):
                                    </p>
                                    {attachedFiles.map((file, index) => (
                                        <div key={file.fileId} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            marginBottom: index < attachedFiles.length - 1 ? '8px' : '0',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                flex: 1
                                            }}>
                                                <Badge content={file.fileId} style={{
                                                    backgroundColor: '#6c5ce7',
                                                    color: 'white'
                                                }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{
                                                        margin: '0 0 4px 0',
                                                        fontWeight: '500',
                                                        color: '#495057'
                                                    }}>
                                                        {file.fileName}
                                                    </p>
                                                    <p style={{
                                                        margin: '0',
                                                        fontSize: '12px',
                                                        color: '#6c757d'
                                                    }}>
                                                        {(file.size / 1024).toFixed(2)} KB • {file.contentType}
                                                    </p>
                                                </div>
                                            </div>
                                            <IconButton
                                                icon={<CloseIcon />}
                                                color="red"
                                                appearance="subtle"
                                                size="sm"
                                                onClick={() => removeAttachedFile(file.fileId)}
                                                style={{
                                                    borderRadius: '6px',
                                                    backgroundColor: '#ffebee'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Panel>

                    {/* Invoice Lines */}
                    <Panel
                        header={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#dc3545',
                                fontWeight: '600'
                            }}>
                                🛒 Danh sách hàng hóa/dịch vụ
                            </div>
                        }
                        bordered
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div style={{ padding: '16px' }}>
                            <ButtonToolbar style={{ marginBottom: 16 }}>
                                <Button
                                    appearance="primary"
                                    startIcon={<PlusIcon />}
                                    onClick={addLine}
                                    style={{
                                        borderRadius: '8px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Thêm dòng
                                </Button>
                            </ButtonToolbar>

                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #e9ecef'
                            }}>
                                <Table
                                    data={lines}
                                    autoHeight
                                    bordered={false}
                                    cellBordered
                                    style={{ backgroundColor: 'white' }}
                                    headerHeight={50}
                                    rowHeight={60}
                                >
                                    <Table.Column width={70} align="center" fixed>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            STT
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                <div style={{
                                                    backgroundColor: '#e3f2fd',
                                                    borderRadius: '50%',
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    fontWeight: '600',
                                                    color: '#1976d2'
                                                }}>
                                                    {rowIndex !== undefined ? rowIndex + 1 : 0}
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={220} resizable flexGrow={1}>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Tên sản phẩm *
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <Input
                                                        value={rowData.name}
                                                        placeholder="Tên sản phẩm"
                                                        onChange={(value) => handleLineChange(rowIndex, 'name', value)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={100} resizable>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Đơn vị
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <Input
                                                        value={rowData.unit}
                                                        placeholder="Đơn vị"
                                                        onChange={(value) => handleLineChange(rowIndex, 'unit', value)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={110} resizable>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Số lượng *
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <InputNumber
                                                        value={rowData.quantity}
                                                        min={0}
                                                        step={0.01}
                                                        onChange={(value) => handleLineChange(rowIndex, 'quantity', value || 0)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={130} resizable>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Đơn giá
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <InputNumber
                                                        value={rowData.unitPrice}
                                                        min={0}
                                                        step={0.01}
                                                        onChange={(value) => handleLineChange(rowIndex, 'unitPrice', value || 0)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={110} resizable>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Giảm giá (%)
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <InputNumber
                                                        value={rowData.discount}
                                                        min={0}
                                                        max={100}
                                                        step={0.01}
                                                        onChange={(value) => handleLineChange(rowIndex, 'discount', value || 0)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={100} resizable>
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Thuế (%)
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                rowIndex !== undefined && (
                                                    <InputNumber
                                                        value={rowData.taxRate}
                                                        min={0}
                                                        max={100}
                                                        step={0.01}
                                                        onChange={(value) => handleLineChange(rowIndex, 'taxRate', value || 0)}
                                                        size="sm"
                                                        style={{ borderRadius: '6px' }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={140} align="right">
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Thành tiền
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {rowData => (
                                                <div style={{
                                                    backgroundColor: '#e8f5e8',
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    color: '#2e7d32',
                                                    textAlign: 'right'
                                                }}>
                                                    {rowData.lineTotal.toLocaleString('vi-VN')}
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={80} align="center" fixed="right">
                                        <Table.HeaderCell style={{
                                            backgroundColor: '#f8f9fa',
                                            fontWeight: '600',
                                            color: '#495057'
                                        }}>
                                            Hành động
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ padding: '8px' }}>
                                            {(rowData, rowIndex) => (
                                                lines.length > 1 && rowIndex !== undefined && (
                                                    <IconButton
                                                        icon={<TrashIcon />}
                                                        color="red"
                                                        appearance="subtle"
                                                        size="sm"
                                                        onClick={() => removeLine(rowIndex)}
                                                        style={{
                                                            borderRadius: '6px',
                                                            backgroundColor: '#ffebee'
                                                        }}
                                                    />
                                                )
                                            )}
                                        </Table.Cell>
                                    </Table.Column>
                                </Table>
                            </div>
                        </div>
                    </Panel>

                    {/* Totals */}
                    <Panel
                        header={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#6f42c1',
                                fontWeight: '600'
                            }}>
                                💰 Tổng kết
                            </div>
                        }
                        bordered
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div style={{ padding: '24px' }}>
                            <FlexboxGrid justify="end">
                                <FlexboxGrid.Item colspan={10}>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: '2px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            marginBottom: 12,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Tổng tiền hàng:</span>
                                            <span style={{ fontWeight: '600', color: '#495057' }}>
                                                {formData.subTotal.toLocaleString('vi-VN')} {formData.currency}
                                            </span>
                                        </div>
                                        <div style={{
                                            marginBottom: 12,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Giảm giá:</span>
                                            <span style={{ fontWeight: '600', color: '#dc3545' }}>
                                                -{formData.discountAmount.toLocaleString('vi-VN')} {formData.currency}
                                            </span>
                                        </div>
                                        <div style={{
                                            marginBottom: 16,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Tiền thuế:</span>
                                            <span style={{ fontWeight: '600', color: '#fd7e14' }}>
                                                +{formData.taxAmount.toLocaleString('vi-VN')} {formData.currency}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 0',
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                            border: '2px solid #1675e0'
                                        }}>
                                            <span style={{ color: '#495057' }}>Tổng thanh toán:</span>
                                            <span style={{
                                                color: '#1675e0',
                                                fontSize: '24px'
                                            }}>
                                                {formData.totalAmount.toLocaleString('vi-VN')} {formData.currency}
                                            </span>
                                        </div>
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    </Panel>
                </Form>
            </Modal.Body>

            <Modal.Footer >
                <ButtonToolbar style={{ gap: '12px' }}>
                    <Button
                        appearance="subtle"
                        onClick={onClose}
                        disabled={loading}
                        size="sm"
                        style={{
                            borderRadius: '8px',
                            fontWeight: '500',
                            padding: '10px 24px'
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        appearance="default"
                        onClick={() => handleSubmit(0)}
                        disabled={loading}
                        size="sm"
                        style={{
                            borderRadius: '8px',
                            fontWeight: '500',
                            padding: '10px 24px',
                            backgroundColor: '#6c757d',
                            borderColor: '#6c757d',
                            color: 'white'
                        }}
                    >
                        Tạo bản nháp
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={() => handleSubmit(1)}
                        disabled={loading}
                        loading={loading}
                        size="sm"
                        style={{
                            borderRadius: '8px',
                            fontWeight: '600',
                            padding: '10px 32px',
                            fontSize: '16px'
                        }}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                    </Button>
                </ButtonToolbar>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateInvoiceModal;