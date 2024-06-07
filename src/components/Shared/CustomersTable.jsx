import { PlusOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Button, Select, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchableTable from '../Functions/SearchableTable';

const { Option } = Select;

const rankOptions = ['Member', 'Gold', 'Platinum'];
const numberOfCustomers = 50;

const generateData = () => {
    const data = [];
    for (let i = 1; i <= numberOfCustomers; i++) {
        data.push({
            key: i.toString(),
            name: faker.name.fullName(),
            age: faker.datatype.number({ min: 18, max: 65 }),
            address: faker.address.streetAddress(),
            rank: rankOptions[Math.floor(Math.random() * rankOptions.length)],
        });
    }
    return data;
};

const CustomersTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const searchInput = useRef(null);
    const [filteredData, setFilteredData] = useState(generateData());

    const navigate = useNavigate();

    const [selectedRank, setSelectedRank] = useState('All'); // State để lưu rank được chọn

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);

        // Lọc dữ liệu theo rank đã chọn
        let newData = generateData();
        if (selectedRank !== 'All') {
            newData = newData.filter(item => item.rank === selectedRank);
        }

        setFilteredData(newData);
    };

    const handleCreateOrder = () => {
        console.log('Create Customer clicked!');
    }
    const handleRankChange = (value) => {
        setSelectedRank(value); // Cập nhật rank được chọn
        handleChange(null, null, null); // Gọi lại handleChange để lọc dữ liệu
    };

    useEffect(() => {
        const animationDirection = sessionStorage.getItem('animationDirection');
        console.log(animationDirection);
        if (animationDirection) {
            setAnimate(animationDirection);
            sessionStorage.removeItem('animationDirection');
        }
    }, []);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Age', dataIndex: 'age', key: 'age', width: '20%' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: '20%',
            render: (rank) => (
                <Tag color={rank === 'Member' ? 'default' : rank === 'Gold' ? 'gold' : 'cyan'}>
                    {rank}
                </Tag>
            ),
            filters: rankOptions.map((rank) => ({ text: rank, value: rank })),
            filterMultiple: false,
            onFilter: (value, record) => record.rank === value,
        },
    ];

    const [animate, setAnimate] = useState('');

    return (
        <div className={`animate__animated ${animate}`}>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder} >
                    Add New Customer
                </Button>
            </Space>
            <SearchableTable
                data={filteredData}
                columns={columns}
                tableProps={{
                    onRow: (record) => ({
                        // onClick: () => navigate(`/admin/customers/${record.key}`),
                        onClick: () => navigate(`/admin/customer/123`),
                    }),
                }}
            />
        </div>
    );
};

export default CustomersTable;
