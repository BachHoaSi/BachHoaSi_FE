import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Empty, Form, Input, Modal, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchableTable from '../Functions/SearchableTable';

const data = [];

const statusOptions = ['Pending', 'Processing', 'Completed', 'Canceled'];
const storeNames = [
    'John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Donna', 'Evan', 'Grace', 'Hank', 'Ivy',
    'Jack', 'Laura', 'Mike', 'Nancy', 'Oscar', 'Peter', 'Quinn', 'Ryan', 'Sarah', 'Tom',
    'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zoe'
];
const storeSurnames = [
    'Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Edwards', 'Frank', 'Hall', 'Isaac', 'Jones',
    'King', 'Lewis', 'Miller', 'Nichols', 'Owens', 'Parker', 'Quinn', 'Roberts', 'Taylor', 'Upton',
    'Vaughn', 'Williams', 'Xavier', 'Young', 'Zimmerman', 'Anderson'
];

for (let i = 1; i <= 50; i++) {
    const orderId = `10${i.toString().padStart(2, '0')}`;
    const store = `${storeNames[Math.floor(Math.random() * storeNames.length)]} ${storeSurnames[Math.floor(Math.random() * storeSurnames.length)]}`;
    const price = Math.floor(Math.random() * 300) + 50 + (Math.random() * 100).toFixed(2);
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const createdAt = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    let deliveryAt = new Date(createdAt);
    deliveryAt.setDate(deliveryAt.getDate() + Math.floor(Math.random() * 30));
    deliveryAt = deliveryAt.toISOString().slice(0, 10);

    data.push({
        key: i.toString(),
        orderId,
        store,
        price,
        status,
        createdAt,
        deliveryAt,
    });
}

const OrdersTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const searchInput = useRef(null);
    const [filteredData, setFilteredData] = useState(data);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleCreateOrder = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setIsModalVisible(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        const filteredStatus = filters.status || null;

        let filteredData = data;
        if (filteredStatus) {
            filteredData = filteredData.filter((item) =>
                filteredStatus.includes(item.status)
            );
        }

        setFilteredData(filteredData);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/orders/123`);
    };

    const columns = [
        {
            title: 'OrderID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: '10%',
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
            width: '20%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            render: (price) => `$${(parseFloat(price) || 0).toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Processing', value: 'Processing' },
                { text: 'Completed', value: 'Completed' },
                { text: 'Canceled', value: 'Canceled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Delivery At',
            dataIndex: 'deliveryAt',
            key: 'deliveryAt',
            width: '20%',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
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
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder} >
                    Tạo đơn hàng
                </Button>
            </Space>
            <div>
                <SearchableTable
                    data={filteredData.length > 0 ? filteredData : data}
                    columns={columns}
                    searchInputProps={{
                        placeholder: 'Search Orders',
                        style: { marginBottom: 8, display: 'block' },
                        onChange: (e) => setSearchText(e.target.value),
                        ref: searchInput,
                    }}
                    tableProps={{
                        onChange: handleChange,
                        onRow: (record) => ({
                            onClick: () => handleRowClick(record),
                        }),
                        locale: { emptyText: <Empty description="Không tìm thấy dữ liệu" /> },
                    }}
                />
            </div>
            <Modal
                title="Tạo đơn hàng mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Tạo
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item name="storeName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="products" label="Sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}>
                        <Select mode="multiple" placeholder="Chọn sản phẩm">
                            {/* Render các option sản phẩm ở đây */}
                        </Select>
                    </Form.Item>

                    <Form.Item name="deliveryDate" label="Ngày giao hàng" rules={[{ required: true, message: 'Vui lòng chọn ngày giao hàng!' }]}>
                        <DatePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrdersTable;
