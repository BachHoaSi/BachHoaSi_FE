import { DeleteOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Upload, message } from 'antd';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from "../../config/firebase";

const ProductsTable = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [searchParams, setSearchParams] = useState({
        name: '',
        description: '',
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, searchParams]);

    const fetchData = async () => {
        setLoading(true);
        const { current, pageSize } = pagination;
        const { name, description } = searchParams;
        try {
            const response = await axios.get(`https://api.fams.college/api/v1/products/search`, {
                params: {
                    page: current - 1,
                    size: pageSize,
                    sort: 'id',
                    name,
                    description,
                },
                headers: {
                    authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
            setData(response.data.content.map((item, index) => ({
                key: (current - 1) * pageSize + index + 1,
                product: item,
            })));
            setPagination((prev) => ({
                ...prev,
                total: response.data.totalElements,
            }));
        } catch (error) {
            message.error('Failed to fetch data. Please try again.');
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchParams({
            name: value,
            description: value,
        });
    };

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = async (key, event) => {
        event.stopPropagation();
        try {
            const productToDelete = data.find(item => item.key === key);
            await axios.delete(`https://api.fams.college/api/v1/products/${productToDelete.product.id}`, {
                headers: { authorization: 'Bearer ' + sessionStorage.getItem('token') },

            });
            fetchData();
            message.success('Product deleted successfully');
        } catch (error) {
            message.error('Failed to delete product. Please try again.');
        }
    };

    const uploadToFirebase = async (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('Firebase download URL:', downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: async (file) => {
            try {
                const downloadURL = await uploadToFirebase(file);
                setFileList([...fileList, { ...file, url: downloadURL }]);
                return false;
            } catch (error) {
                message.error(`${file.name} file upload failed.`);
                return Upload.LIST_IGNORE;
            }
        },
        onRemove: (file) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
        },
    };

    const onFinish = async (values) => {
        try {
            const imageUrl = fileList[0]?.url ?? 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898';
            const requestBody = {
                name: values.name,
                description: values.description,
                'base-price': values.basePrice,
                'stock-quantity': values.stockQuantity,
                'url-images': imageUrl,
                'category-id': values.categoryId,
            };

            if (selectedProduct) {
                await axios.put(`https://api.fams.college/api/v1/products/${selectedProduct.product.id}`, requestBody, {
                    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
                });
            } else {
                await axios.post('https://api.fams.college/api/v1/products', requestBody, {
                    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
                });
            }
            fetchData();
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Failed to create or update product:', error);
            message.error('Failed to create or update product. Please try again.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'ProductID',
            dataIndex: ['product', 'id'],
            key: 'product.id',
            width: '15%',
        },
        {
            title: 'Product Name',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <Space size="middle">
                    <img src={product.image} alt={product.name} width={40} />
                    <span>{product.name}</span>
                </Space>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: ['product', 'quantity'],
            key: 'product.quantity',
        },
        {
            title: 'Price',
            dataIndex: ['product', 'price'],
            key: 'product.price',
            render: (price) => `$${parseFloat(price).toFixed(2) || '0.00'}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={(e) => handleDelete(record.key, e)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProduct}>
                    Thêm sản phẩm mới
                </Button>
            </Space>
            <Input.Search
                placeholder="Tìm kiếm"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                onChange={handleTableChange}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedProduct(record);
                        form.setFieldsValue({
                            name: record.product.name,
                            basePrice: parseFloat(record.product.price),
                            stockQuantity: record.product.quantity,
                            categoryId: record.product.categoryId,
                            description: record.product.description,
                        });
                        setIsModalVisible(true);
                    },
                })}
                locale={{
                    emptyText: <Empty description="Không tìm thấy dữ liệu" />,
                }}
            />
            <Modal
                title={selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {selectedProduct ? 'Chỉnh sửa' : 'Thêm'}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="basePrice"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="stockQuantity"
                        label="Số lượng"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            <Select.Option value="1">Nội Thất</Select.Option>
                            <Select.Option value="2">Thực Phẩm</Select.Option>
                            <Select.Option value="3">Tiêu Dùng</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Hình ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
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
        </div>
    );
};

export default ProductsTable;
