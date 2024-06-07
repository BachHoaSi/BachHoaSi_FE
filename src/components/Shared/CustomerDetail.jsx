// src/pages/CustomerDetailsPage.jsx
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Avatar, Card, Descriptions, Divider, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerDetailsPage = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customerDetails, setCustomerDetails] = useState(null);

    useEffect(() => {
        const mockData = {
            id: customerId,
            name: faker.name.fullName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            address: faker.address.streetAddress(),
            rank: faker.helpers.arrayElement(['Member', 'Gold', 'Platinum']),
            totalOrders: faker.datatype.number({ min: 0, max: 100 }),
            totalSpending: faker.finance.amount(0, 5000, 2),
            avatar: faker.image.avatar(),
            rating: faker.datatype.number({ min: 1, max: 5 }),
        };
        setCustomerDetails(mockData);
    }, [customerId]);

    if (!customerDetails) {
        return <div>Loading...</div>;
    }

    const {
        id,
        name,
        email,
        phoneNumber,
        address,
        rank,
        totalOrders,
        totalSpending,
        avatar,
        rating,
    } = customerDetails;

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* ... (Back button is the same) */}
                <Card style={{ width: '100%' }} title="Thông tin khách hàng">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'center' }}> {/* Căn giữa bằng justify-content */}
                        <Avatar size={120} src={avatar} />
                        <div style={{ marginLeft: 24, textAlign: 'center' }}> {/* Căn giữa nội dung */}
                            <Typography.Title level={3}>{name}</Typography.Title>
                            <Tag color={rank === 'Member' ? 'default' : rank === 'Gold' ? 'gold' : 'cyan'}>
                                {rank}
                            </Tag>
                        </div>
                    </div>
                    <Divider style={{ margin: '16px 0', width: '100%' }} />
                    <Descriptions
                        column={1}
                        size="large"
                        labelStyle={{ fontWeight: 'bold' }}
                        contentStyle={{ textAlign: 'center' }} // Căn giữa nội dung Descriptions
                    >
                        <Descriptions.Item label={<MailOutlined style={{ fontSize: '1.2em' }} />} span={3}>
                            {email}
                        </Descriptions.Item>
                        <Descriptions.Item label={<PhoneOutlined style={{ fontSize: '1.2em' }} />} span={3}>
                            {phoneNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label={<EnvironmentOutlined style={{ fontSize: '1.2em' }} />} span={3}>
                            {address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số đơn hàng" style={{ fontSize: '1.1em' }}>{totalOrders}</Descriptions.Item>
                        <Descriptions.Item label="Tổng chi tiêu" style={{ fontSize: '1.1em' }}>${totalSpending}</Descriptions.Item>
                        {/* <Descriptions.Item label="Đánh giá">
                            <Rate disabled allowHalf defaultValue={rating} />
                        </Descriptions.Item> */}
                    </Descriptions>
                </Card>
            </Space>
        </div>
    );
};

export default CustomerDetailsPage;