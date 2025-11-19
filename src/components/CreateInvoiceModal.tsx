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
    InputGroup
} from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import PlusIcon from '@rsuite/icons/Plus';
import type { CreateInvoiceRequest, CreateInvoiceLineRequest } from '../types/invoice';
import { getAllOrganizations } from '../api/services/organizationService';
import type { Organization } from '../types/organization';
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Input>>(
    (props, ref) => <Input {...props} as="textarea" ref={ref} />
);

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (invoice: CreateInvoiceRequest) => void;
    loading?: boolean;
}

interface FormErrors {
    [key: string]: string;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false
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
        lines: []
    });

    const [lines, setLines] = useState<CreateInvoiceLineRequest[]>([{
        lineNumber: 1,
        description: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 10,
        taxAmount: 0,
        lineTotal: 0
    }]);

    const formRef = React.useRef<any>();
    const [formError, setFormError] = useState({});
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load organizations
            const loadOrganizations = async () => {
                try {
                    setLoadingOrganizations(true);
                    const response = await getAllOrganizations();
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
                lines: []
            });
            setLines([{
                lineNumber: 1,
                description: '',
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
            description: '',
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

    const handleSubmit = () => {
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
            if (!line.description.trim()) {
                toaster.push(
                    <Message type="error" showIcon>
                        Mô tả hàng hóa dòng {index + 1} là bắt buộc
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
            issuedDate: new Date(formData.issuedDate).toISOString(),
            lines: lines
        };
        onSubmit(invoiceData);
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            size="lg"
        >
            <Modal.Header>
                <Modal.Title>Tạo hóa đơn mới</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: '70vh', overflow: 'auto' }}>
                <Form
                    ref={formRef}
                    model={model}
                    formValue={formData}
                    onChange={(formValue) => setFormData(formValue as CreateInvoiceRequest)}
                    formError={formError}
                >
                    {/* Invoice Basic Info */}
                    <Panel header="Thông tin cơ bản hóa đơn" bordered>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="invoiceNumber">
                                    <Form.ControlLabel>Số hóa đơn *</Form.ControlLabel>
                                    <Form.Control
                                        name="invoiceNumber"
                                        placeholder="Nhập số hóa đơn"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="formNumber">
                                    <Form.ControlLabel>Số mẫu *</Form.ControlLabel>
                                    <Form.Control
                                        name="formNumber"
                                        placeholder="Nhập số mẫu"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="serial">
                                    <Form.ControlLabel>Ký hiệu *</Form.ControlLabel>
                                    <Form.Control
                                        name="serial"
                                        placeholder="Nhập ký hiệu"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>

                    <FlexboxGrid justify="start">
                        <FlexboxGrid.Item colspan={12}>
                            <Form.Group controlId="organizationId">
                                <Form.ControlLabel>Tổ chức *</Form.ControlLabel>
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
                                    style={{ width: '100%' }}
                                />
                            </Form.Group>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                    <Divider />

                    {/* Seller Information */}
                    <Panel header="Thông tin người bán" bordered>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="sellerName">
                                    <Form.ControlLabel>Tên người bán *</Form.ControlLabel>
                                    <Form.Control
                                        name="sellerName"
                                        placeholder="Nhập tên người bán"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="sellerTaxId">
                                    <Form.ControlLabel>Mã số thuế *</Form.ControlLabel>
                                    <Form.Control
                                        name="sellerTaxId"
                                        placeholder="Nhập mã số thuế"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="sellerAddress">
                                    <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                                    <Form.Control
                                        name="sellerAddress"
                                        placeholder="Nhập địa chỉ"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="sellerPhone">
                                    <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                                    <Form.Control
                                        name="sellerPhone"
                                        placeholder="Nhập số điện thoại"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <Form.Group controlId="sellerEmail">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control
                                name="sellerEmail"
                                placeholder="Nhập email"
                                accepter={Input}
                                type="email"
                            />
                        </Form.Group>
                    </Panel>

                    <Divider />

                    {/* Customer Information */}
                    <Panel header="Thông tin khách hàng" bordered>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="customerName">
                                    <Form.ControlLabel>Tên khách hàng *</Form.ControlLabel>
                                    <Form.Control
                                        name="customerName"
                                        placeholder="Nhập tên khách hàng"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="customerTaxId">
                                    <Form.ControlLabel>Mã số thuế *</Form.ControlLabel>
                                    <Form.Control
                                        name="customerTaxId"
                                        placeholder="Nhập mã số thuế"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="customerAddress">
                                    <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                                    <Form.Control
                                        name="customerAddress"
                                        placeholder="Nhập địa chỉ"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={11}>
                                <Form.Group controlId="customerPhone">
                                    <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                                    <Form.Control
                                        name="customerPhone"
                                        placeholder="Nhập số điện thoại"
                                        accepter={Input}
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <Form.Group controlId="customerEmail">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control
                                name="customerEmail"
                                placeholder="Nhập email"
                                accepter={Input}
                                type="email"
                            />
                        </Form.Group>
                    </Panel>

                    <Divider />

                    {/* Invoice Details */}
                    <Panel header="Chi tiết hóa đơn" bordered>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="issuedDate">
                                    <Form.ControlLabel>Ngày phát hành</Form.ControlLabel>
                                    <Form.Control
                                        name="issuedDate"
                                        accepter={DatePicker}
                                        format="yyyy-MM-dd"
                                        style={{ width: '100%' }}
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
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="status">
                                    <Form.ControlLabel>Trạng thái</Form.ControlLabel>
                                    <Form.Control
                                        name="status"
                                        accepter={SelectPicker}
                                        data={[
                                            { label: 'Nháp', value: 1 },
                                            { label: 'Đã phát hành', value: 2 },
                                            { label: 'Đã hủy', value: 3 }
                                        ]}
                                        searchable={false}
                                        style={{ width: '100%' }}
                                        placeholder="Chọn trạng thái"
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={7}>
                                <Form.Group controlId="currency">
                                    <Form.ControlLabel>Tiền tệ</Form.ControlLabel>
                                    <Form.Control
                                        name="currency"
                                        accepter={SelectPicker}
                                        data={[
                                            { label: 'VND', value: 'VND' },
                                            { label: 'USD', value: 'USD' },
                                            { label: 'EUR', value: 'EUR' }
                                        ]}
                                        searchable={false}
                                        style={{ width: '100%' }}
                                        placeholder="Chọn tiền tệ"
                                    />
                                </Form.Group>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <Form.Group controlId="note">
                            <Form.ControlLabel>Ghi chú</Form.ControlLabel>
                            <Form.Control
                                name="note"
                                placeholder="Nhập ghi chú"
                                accepter={Textarea}
                                rows={3}
                            />
                        </Form.Group>
                    </Panel>

                    <Divider />

                    {/* Invoice Lines */}
                    <Panel header="Danh sách hàng hóa/dịch vụ" bordered>
                        <ButtonToolbar style={{ marginBottom: 16 }}>
                            <Button
                                appearance="primary"
                                startIcon={<PlusIcon />}
                                onClick={addLine}
                            >
                                Thêm dòng
                            </Button>
                        </ButtonToolbar>

                        <Table
                            data={lines}
                            autoHeight
                            bordered
                            cellBordered
                        >
                            <Table.Column width={60} align="center" fixed>
                                <Table.HeaderCell>STT</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (rowIndex !== undefined ? rowIndex + 1 : 0)}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={200} resizable>
                                <Table.HeaderCell>Mô tả *</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <Input
                                                value={rowData.description}
                                                placeholder="Mô tả sản phẩm"
                                                onChange={(value) => handleLineChange(rowIndex, 'description', value)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={100} resizable>
                                <Table.HeaderCell>Đơn vị</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <Input
                                                value={rowData.unit}
                                                placeholder="Đơn vị"
                                                onChange={(value) => handleLineChange(rowIndex, 'unit', value)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={100} resizable>
                                <Table.HeaderCell>Số lượng *</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <InputNumber
                                                value={rowData.quantity}
                                                min={0}
                                                step={0.01}
                                                onChange={(value) => handleLineChange(rowIndex, 'quantity', value || 0)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={120} resizable>
                                <Table.HeaderCell>Đơn giá</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <InputNumber
                                                value={rowData.unitPrice}
                                                min={0}
                                                step={0.01}
                                                onChange={(value) => handleLineChange(rowIndex, 'unitPrice', value || 0)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={100} resizable>
                                <Table.HeaderCell>Giảm giá (%)</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <InputNumber
                                                value={rowData.discount}
                                                min={0}
                                                max={100}
                                                step={0.01}
                                                onChange={(value) => handleLineChange(rowIndex, 'discount', value || 0)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={100} resizable>
                                <Table.HeaderCell>Thuế (%)</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        rowIndex !== undefined && (
                                            <InputNumber
                                                value={rowData.taxRate}
                                                min={0}
                                                max={100}
                                                step={0.01}
                                                onChange={(value) => handleLineChange(rowIndex, 'taxRate', value || 0)}
                                                size="sm"
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={120} align="right">
                                <Table.HeaderCell>Thành tiền</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => (
                                        <strong>{rowData.lineTotal.toLocaleString('vi-VN')}</strong>
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column width={80} align="center" fixed="right">
                                <Table.HeaderCell>Hành động</Table.HeaderCell>
                                <Table.Cell>
                                    {(rowData, rowIndex) => (
                                        lines.length > 1 && rowIndex !== undefined && (
                                            <IconButton
                                                icon={<TrashIcon />}
                                                color="red"
                                                appearance="subtle"
                                                size="sm"
                                                onClick={() => removeLine(rowIndex)}
                                            />
                                        )
                                    )}
                                </Table.Cell>
                            </Table.Column>
                        </Table>
                    </Panel>

                    <Divider />

                    {/* Totals */}
                    <Panel header="Tổng kết" bordered>
                        <FlexboxGrid justify="end">
                            <FlexboxGrid.Item colspan={12}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <span>Tổng tiền hàng: </span>
                                        <strong>{formData.subTotal.toLocaleString('vi-VN')} {formData.currency}</strong>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <span>Giảm giá: </span>
                                        <strong>{formData.discountAmount.toLocaleString('vi-VN')} {formData.currency}</strong>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <span>Tiền thuế: </span>
                                        <strong>{formData.taxAmount.toLocaleString('vi-VN')} {formData.currency}</strong>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        <span>Tổng thanh toán: </span>
                                        <span style={{ color: '#1675e0' }}>
                                            {formData.totalAmount.toLocaleString('vi-VN')} {formData.currency}
                                        </span>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <ButtonToolbar>
                    <Button
                        appearance="subtle"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        loading={loading}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                    </Button>
                </ButtonToolbar>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateInvoiceModal;