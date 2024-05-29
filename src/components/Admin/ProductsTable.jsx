import { DeleteOutlined, DownOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Empty, Input, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';

const data = [
    {
        key: '1',
        product: {
            name: 'Gấu Bông Capybara',
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898',
            quantity: 10,
            price: 29.99,
        }
    },
    {
        key: '2',
        product: {
            name: 'Product B',
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbmc-lp6cwov8rk0898',
            quantity: 2,
            price: 19.99,
        },
    },
];

const OrdersTable = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const searchInput = useRef(null);

    const handleSearch = (value) => {
        const searchQuery = value.toLowerCase();
        const filtered = data.filter((record) =>
            record.product.name.toLowerCase().includes(searchQuery)
        );
        setFilteredData(filtered);
    };

    const columns = [
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
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder="Search product name"
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={() => handleSearch(searchText)}
                    />
                    <Button
                        type="primary"
                        onClick={() => handleSearch(searchText)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginTop: 8 }}
                    >
                        Search
                    </Button>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        },
        {
            title: 'Quantity',
            dataIndex: ['product', 'quantity'],
            key: 'product.quantity', // Thêm key
        },
        {
            title: 'Price',
            dataIndex: ['product', 'price'],
            key: 'product.price', // Thêm key
            render: (price) => `$${parseFloat(price).toFixed(2) || '0.00'}`, // Ép kiểu về số trước khi format
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown menu={{
                        items: [
                            { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => console.log('Edit', record) },
                            { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => console.log('Delete', record) },
                        ]
                    }}>
                        <a onClick={(e) => e.preventDefault()}>More actions <DownOutlined /></a>
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredData}
                locale={{
                    emptyText: <Empty description="Không tìm thấy dữ liệu" />,
                }}
            />
        </>
    );
};

export default OrdersTable;