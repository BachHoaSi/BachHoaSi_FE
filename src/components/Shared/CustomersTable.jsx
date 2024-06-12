import { PlusOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;

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
            status: Math.random() > 0.5 ? 'Active' : 'Disabled',
        });
    }
    return data;
};

const CustomersTable = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [data, setData] = useState(generateData());
    const [filteredData, setFilteredData] = useState(data);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedRank, setSelectedRank] = useState('All');

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleCreateCustomer = () => {
        console.log('Create Customer clicked!');
    }

    const handleRankChange = (value) => {
        setSelectedRank(value);
        handleFilterData(value, searchText);
    };

    const handleFilterData = (rank, searchText) => {
        let filteredData = data;
        if (rank !== 'All') {
            filteredData = filteredData.filter(item => item.rank === rank);
        }
        if (searchText) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.address.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredData(filteredData);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        handleFilterData(selectedRank, value);
    };

    const handleEditCustomer = (record) => {
        setSelectedCustomer(record);
        form.setFieldsValue({
            name: record.name,
            age: record.age,
            address: record.address,
            rank: record.rank,
            status: record.status === 'Active',
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedCustomer(null);
    };

    const handleFormSubmit = (values) => {
        const updatedCustomer = {
            ...selectedCustomer,
            ...values,
            status: values.status ? 'Active' : 'Disabled',
        };
        const newData = data.map(item => item.key === updatedCustomer.key ? updatedCustomer : item);
        setData(newData);
        handleFilterData(selectedRank, searchText);
        setIsModalVisible(false);
        setSelectedCustomer(null);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Age', dataIndex: 'age', key: 'age', width: '10%' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: '10%',
            render: (rank) => (
                <Tag color={rank === 'Member' ? 'default' : rank === 'Gold' ? 'gold' : 'cyan'}>
                    {rank}
                </Tag>
            ),
            filters: rankOptions.map((rank) => ({ text: rank, value: rank })),
            filterMultiple: false,
            onFilter: (value, record) => record.rank === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'}>
                    {status}
                </Tag>
            ),
        },
    ];

    return (
        <div className="animate__animated animate__fadeIn">
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCustomer} >
                    Add New Customer
                </Button>
            </Space>
            <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Select defaultValue="All" style={{ width: 200 }} onChange={handleRankChange}>
                    <Option value="All">All</Option>
                    {rankOptions.map(rank => <Option key={rank} value={rank}>{rank}</Option>)}
                </Select>
                <Search
                    placeholder="Search customers"
                    onSearch={handleSearch}
                    onChange={e => handleSearch(e.target.value)}
                    style={{ width: 300, marginLeft: 'auto' }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={filteredData}
                onRow={(record) => ({
                    onClick: () => handleEditCustomer(record),
                })}
                pagination={{ pageSize: 7 }}
            />
            <Modal
                title="Edit Customer"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleModalOk}>
                        Save
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please enter the age' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter the address' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="rank" label="Rank" rules={[{ required: true, message: 'Please select a rank' }]}>
                        <Select>
                            {rankOptions.map(rank => <Option key={rank} value={rank}>{rank}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Status" valuePropName="checked">
                        <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomersTable;
