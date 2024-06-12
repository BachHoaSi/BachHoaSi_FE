import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
    Button,
    Card, Descriptions,
    Divider,
    Form,
    Image,
    Input, InputNumber,
    Modal,
    Popconfirm,
    Rate,
    Select,
    Space,
    Tag,
    Typography,
    Upload, message,
} from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const generateMockProductDetails = (productId) => {
    return {
        id: productId,
        name: faker.commerce.productName(),
        image: faker.image.image(),
        description: faker.lorem.paragraph(),
        price: parseFloat(faker.commerce.price()),
        quantity: faker.datatype.number({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        rating: faker.datatype.number({ min: 1, max: 5 }),
    };
};

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const mockData = generateMockProductDetails(productId);
        setProductDetails(mockData);
    }, [productId]);

    useEffect(() => {
        console.log("File list updated: ", fileList);
    }, [fileList]);

    if (!productDetails) {
        return <div>Loading...</div>;
    }

    const { name, image, description, price, quantity, category, rating } = productDetails;

    const handleEditProduct = () => {
        setIsEditing(true);
        form.setFieldsValue({
            ...productDetails,
            image: fileList
        });
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`https://api.fams.college/api/v1/products/${productId}`,
                { headers: { authorization: 'Bearer ' + sessionStorage.getItem('token'), }, });
            message.success('Sản phẩm đã được xóa thành công.');
            navigate('/admin/products');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            message.error('Xóa sản phẩm thất bại. Vui lòng thử lại.');
        }
    };

    const onFinish = async (values) => {
        try {
            // Gọi API để cập nhật sản phẩm
            await axios.put(`https://api.fams.college/api/v1/products/${productId}`, values,
                { headers: { authorization: 'Bearer ' + sessionStorage.getItem('token'), }, });
            message.success('Sản phẩm đã được cập nhật thành công.');
            setIsEditing(false);
            setProductDetails(values);
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            message.error('Cập nhật sản phẩm thất bại. Vui lòng thử lại.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://api.fams.college/api/v1/products/upload-image',
        headers: {
            authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                setFileList([...info.fileList]);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        fileList,
    };

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>

                <Card title={`Sản phẩm #${productId}`} style={{ width: '100%' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Image width={200} src={image} />
                        <div>
                            <Title level={3}>{name}</Title>
                            <Tag color="blue">{category}</Tag>
                            <Rate disabled defaultValue={rating} />
                        </div>
                        <Paragraph>{description}</Paragraph>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Giá">${price}</Descriptions.Item>
                            <Descriptions.Item label="Số lượng">{quantity}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Space>
                            <Button type="primary" icon={<EditOutlined />} onClick={handleEditProduct}>
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                onConfirm={handleDeleteProduct}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="danger" icon={<DeleteOutlined />}>
                                    Xóa
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Space>
                </Card>

                {/* Modal chỉnh sửa sản phẩm */}
                <Modal
                    title="Chỉnh sửa sản phẩm"
                    open={isEditing}
                    onOk={form.submit}
                    onCancel={() => setIsEditing(false)}
                >
                    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}>
                            <InputNumber min={0} />
                        </Form.Item>

                        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                            <Input.TextArea />
                        </Form.Item>

                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}>
                            <InputNumber min={0} />
                        </Form.Item>

                        <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                            <Select placeholder="Chọn danh mục">
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                console.log('Event: ', e);
                                return Array.isArray(e) ? e : e?.fileList;
                            }}
                            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
                        >
                            <Upload.Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Kéo và thả hoặc chọn hình ảnh</p>
                                <p className="ant-upload-hint">
                                    Chỉ được tải lên một tệp
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </div>
    );
};

export default ProductDetailsPage;
