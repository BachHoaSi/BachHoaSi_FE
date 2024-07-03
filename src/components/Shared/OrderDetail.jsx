import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Avatar, Button, Card, Col, Descriptions, Popconfirm, Rate, Row, Space, Steps, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { Text } = Typography;
const { Step } = Steps;

const generateMockOrderDetails = (orderId) => {
    const numProducts = faker.datatype.number({ min: 1, max: 5 });

    return {
        orderId,
        store: faker.name.fullName(),
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

const StyledCard = styled(Card)`
    margin-bottom: 24px;
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

    const { store, price, status, createdAt, deliveryAt, products, feedback, rating } = orderDetails;

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
                    <Avatar src={record.image} size={50} shape="square" />
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
                <Row gutter={24}>
                    <Col span={17}>
                        <StyledCard>
                            <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                                <Descriptions.Item label="Cửa Hàng">{store}</Descriptions.Item>
                                <Descriptions.Item label="Tổng">{price} $</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    <Tag color={status === 'Pending' ? 'orange' : status === 'Processing' ? 'blue' : status === 'Completed' ? 'green' : 'red'}>
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
                        </StyledCard>
                        <StyledCard title="Danh sách sản phẩm">
                            <Table dataSource={products} columns={columns} pagination={false} />
                        </StyledCard>
                    </Col>
                    <Col span={7}>
                        <StyledCard>
                            <Steps direction="vertical" size="small" current={3}>
                                <Step title="Label Ready" description="Shipment Generated" />
                                <Step title="Pickup" description="Picked up by carrier" />
                                <Step title="In Transit" description="Arrived at Sort Facility" />
                                <Step title="Delivered" description="Arrived at Sort Facility" />
                            </Steps>
                        </StyledCard>
                        <StyledCard title="Thông tin thanh toán">
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Trạng thái thanh toán">
                                    <Tag color="green">Paid</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phương thức thanh toán">Visa - 9226</Descriptions.Item>
                                <Descriptions.Item label="Tổng cộng">
                                    <Text strong>$34.99</Text>
                                </Descriptions.Item>
                            </Descriptions>
                            {status !== 'Completed' && status !== 'Canceled' && (
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                                    onConfirm={handleCancelOrder}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button type="danger" icon={<DeleteOutlined />} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', width: '100%' }}>
                                        Hủy đơn hàng
                                    </Button>
                                </Popconfirm>
                            )}
                        </StyledCard>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default OrderDetailsPage;
