import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Avatar, Button, Descriptions, Divider, Popconfirm, Rate, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { Title } = Typography;

const generateMockOrderDetails = (orderId) => {
    const numProducts = faker.datatype.number({ min: 1, max: 5 });

    return {
        orderId,
        customer: faker.name.fullName(),
        price: faker.finance.amount(50, 350, 2),
        status: faker.helpers.arrayElement(['Pending', 'Processing', 'Completed', 'Canceled']),
        createdAt: faker.date.past().toISOString().slice(0, 10),
        deliveryAt: faker.date.future().toISOString().slice(0, 10),
        products: Array.from({ length: numProducts }, () => ({
            name: faker.commerce.productName(),
            quantity: faker.datatype.number({ min: 1, max: 5 }),
            category: faker.commerce.department(),
            price: faker.finance.amount(10, 100, 2),
            image: faker.image.image(),
        })),
        feedback: faker.lorem.sentence(),
        rating: faker.datatype.number({ min: 1, max: 5 })
    };
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CancelButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const mockData = generateMockOrderDetails(orderId);
        setOrderDetails(mockData);
    }, [orderId]);

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    const { customer, price, status, createdAt, deliveryAt, products, feedback, rating } = orderDetails;

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.image} size={50} shape='square' />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
    ];

    const handleCancelOrder = () => {
        console.log('Hủy đơn hàng', orderId);
    };

    const handleGoBack = () => {
        navigate('/admin/orders');
    };

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
                    Quay lại
                </Button>
                <Title level={2}>Đơn hàng #{orderId || 123}</Title>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Khách hàng">{customer}</Descriptions.Item>
                    <Descriptions.Item label="Tổng giá">{price}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={status === 'Pending' ? 'warning' : status === 'Processing' ? 'processing' : status === 'Completed' ? 'success' : 'error'}>
                            {status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{createdAt}</Descriptions.Item>
                    <Descriptions.Item label="Ngày giao hàng">{deliveryAt}</Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">
                        <Rate disabled defaultValue={rating} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Phản hồi">{feedback}</Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Danh sách sản phẩm</Divider>
                <TableContainer>
                    <Table dataSource={products} columns={columns} pagination={false} />
                    <CancelButtonContainer>
                        {status !== 'Completed' && status !== 'Canceled' && (
                            <Popconfirm
                                title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                                onConfirm={handleCancelOrder}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="danger" icon={<DeleteOutlined />} style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}>
                                    Hủy đơn hàng
                                </Button>
                            </Popconfirm>
                        )}
                    </CancelButtonContainer>
                </TableContainer>
            </Space>
        </div>
    );
};

export default OrderDetailsPage;
