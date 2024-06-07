import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchableTable from '../Functions/SearchableTable';

const data = [];

const statusOptions = ['Pending', 'Processing', 'Completed', 'Canceled'];
const customerNames = [
    'John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Donna', 'Evan', 'Grace', 'Hank', 'Ivy',
    'Jack', 'Laura', 'Mike', 'Nancy', 'Oscar', 'Peter', 'Quinn', 'Ryan', 'Sarah', 'Tom',
    'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zoe'
];
const customerSurnames = [
    'Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Edwards', 'Frank', 'Hall', 'Isaac', 'Jones',
    'King', 'Lewis', 'Miller', 'Nichols', 'Owens', 'Parker', 'Quinn', 'Roberts', 'Taylor', 'Upton',
    'Vaughn', 'Williams', 'Xavier', 'Young', 'Zimmerman', 'Anderson'
];

for (let i = 1; i <= 50; i++) {
    const orderId = `10${i.toString().padStart(2, '0')}`;
    const customer = `${customerNames[Math.floor(Math.random() * customerNames.length)]} ${customerSurnames[Math.floor(Math.random() * customerSurnames.length)]}`;
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
        customer,
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

    const handleCreateOrder = () => {
        console.log('Create Order clicked!');
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
        // navigate(`/admin/orders/${record.orderId}`);
        navigate(`/admin/order/123`);
    };

    const columns = [
        {
            title: 'OrderID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: '10%',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
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
                        style: { display: 'none' },
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
        </div>
    );
};

export default OrdersTable;
