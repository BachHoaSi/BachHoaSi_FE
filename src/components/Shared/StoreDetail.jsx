import { ArrowLeftOutlined, CloseOutlined, EditOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Avatar, Button, Card, Col, Form, Input, Row, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const GrayText = styled(Typography.Text)`
  background-color: #f0f0f0; /* Màu xám nhạt */
  padding: 4px 8px; /* Thêm padding cho đẹp hơn */
  border-radius: 4px; /* Bo góc nhẹ */
`;

const StoreDetailsPage = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [storeDetails, setstoreDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const mockData = {
            id: storeId,
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
        setstoreDetails(mockData);
        form.setFieldsValue(mockData);
    }, [storeId, form]);

    if (!storeDetails) {
        return <div>Loading...</div>;
    }

    const {
        name,
        email,
        phoneNumber,
        address,
        rank,
        totalOrders,
        totalSpending,
        avatar,
    } = storeDetails;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        form.resetFields();
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        setIsEditing(false);

        // Cập nhật state storeDetails, chỉ thay đổi các trường được chỉnh sửa
        setstoreDetails({
            ...storeDetails, // Giữ lại các thuộc tính khác của storeDetails
            ...values, // Cập nhật các giá trị mới từ form
        });
    };


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <Card style={{ width: '100%' }} title="User Profile" extra={
                    !isEditing && (
                        <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>
                            Edit
                        </Button>
                    )
                }>
                    <Row gutter={16}>
                        <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'center' }}>
                                <Avatar size={120} src={avatar} />
                                <div style={{ marginLeft: 24, textAlign: 'center' }}>
                                    <Form.Item name="name" style={{ marginBottom: 0 }}>
                                        {isEditing ? (
                                            <Input
                                                value={isEditing ? form.getFieldValue('name') : name}
                                                style={{ color: 'black' }}
                                            />
                                        ) : (
                                            <Typography.Title level={3}>{name}</Typography.Title>
                                        )}
                                    </Form.Item>
                                    <Tag color={rank === 'Member' ? 'default' : rank === 'Gold' ? 'gold' : 'cyan'}>
                                        {rank}
                                    </Tag>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Form
                                layout="vertical"
                                form={form}
                                onFinish={onFinish}
                                initialValues={storeDetails}
                            >
                                <Form.Item label="Email" name="email">
                                    <Input prefix={<MailOutlined />}
                                        disabled={!isEditing}
                                        value={isEditing ? form.getFieldValue('email') : email}
                                        style={{ color: 'black' }}
                                    />
                                </Form.Item>
                                <Form.Item label="Phone Number" name="phoneNumber">
                                    <Input prefix={<PhoneOutlined />}
                                        disabled={!isEditing}
                                        value={isEditing ? form.getFieldValue('phoneNumber') : phoneNumber}
                                        style={{ color: 'black' }}
                                    />
                                </Form.Item>
                                <Form.Item label="Address" name="address">
                                    <Input prefix={<EnvironmentOutlined />}
                                        disabled={!isEditing}
                                        value={isEditing ? form.getFieldValue('address') : address}
                                        style={{ color: 'black' }}
                                    />
                                </Form.Item>
                                <Form.Item label="Total Orders">
                                    <GrayText>{totalOrders}</GrayText>
                                </Form.Item>
                                <Form.Item label="Total Spending">
                                    <GrayText>${totalSpending}</GrayText>
                                </Form.Item>

                                {isEditing ? (
                                    <Form.Item>
                                        <Space>
                                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                                Save
                                            </Button>
                                            <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                                                Cancel
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </div>
    );
};

export default StoreDetailsPage;
