import { DeleteOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Upload, message } from 'antd';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from "../../config/firebase";

const productNames = [
    "Gấu Bông Capybara",
    "Gấu Bông Khủng Long",
    "Gấu Bông Kỳ Lân",
    "Gấu Bông Mèo Thần Tài",
    "Gấu Bông Stitch",
    "Gấu Bông Thỏ Cony",
    "Gấu Bông Totoro",
    "Gấu Bông We Bare Bears",
    "Gối Ôm Hình Trái Tim",
    "Gối Ôm Hình Chữ U",
];

const imageUrls = [
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898",
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898",
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898",
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898",
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898",
];

const initialData = [];
for (let i = 1; i <= 50; i++) {
    const product = {
        id: `P${i.toString().padStart(3, '0')}`,
        name: productNames[Math.floor(Math.random() * productNames.length)],
        image: imageUrls[Math.floor(Math.random() * imageUrls.length)],
        quantity: Math.floor(Math.random() * 50) + 1,
        price: (Math.random() * 100).toFixed(2),
    };
    initialData.push({
        key: i.toString(),
        product,
    });
}

const ProductsTable = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [data, setData] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const handleSearch = (value) => {
        const searchQuery = value.toLowerCase();
        const filtered = data.filter((record) => {
            return Object.values(record.product).some((field) =>
                field.toString().toLowerCase().includes(searchQuery)
            );
        });
        setFilteredData(filtered);
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

    const handleDelete = (key, event) => {
        event.stopPropagation();
        setData(data.filter((item) => item.key !== key));
        setFilteredData(filteredData.filter((item) => item.key !== key));
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
                const updatedProduct = {
                    ...selectedProduct,
                    product: {
                        ...selectedProduct.product,
                        name: values.name,
                        image: imageUrl,
                        quantity: values.stockQuantity,
                        price: values.basePrice.toFixed(2),
                    },
                };
                setData(data.map(item => (item.key === updatedProduct.key ? updatedProduct : item)));
                setFilteredData(filteredData.map(item => (item.key === updatedProduct.key ? updatedProduct : item)));
            } else {
                const response = await axios.post('https://api.fams.college/api/v1/products', requestBody, {
                    headers: { authorization: 'Bearer ' + sessionStorage.getItem('token') },
                });
                console.log('Product created:', response.data);
                const newProduct = {
                    key: (data.length + 1).toString(),
                    product: {
                        id: `P${(data.length + 1).toString().padStart(3, '0')}`,
                        name: values.name,
                        image: imageUrl,
                        quantity: values.stockQuantity,
                        price: values.basePrice.toFixed(2),
                    },
                };
                setData([...data, newProduct]);
                setFilteredData([...data, newProduct]);
            }
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

    const [animate, setAnimate] = useState('');

    useEffect(() => {
        const animationDirection = sessionStorage.getItem('animationDirection');
        console.log(animationDirection);
        if (animationDirection) {
            setAnimate(animationDirection);
            sessionStorage.removeItem('animationDirection');
        }
    }, []);

    return (
        <div className={`animate__animated ${animate}`}>
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
                dataSource={filteredData}
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
                pagination={{
                    pageSize: 7,
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
