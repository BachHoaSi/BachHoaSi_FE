import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Tag, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;

const rankOptions = ['Member', 'Gold', 'Platinum'];

const CustomersTable = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRank, setSelectedRank] = useState('All');

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://api.fams.college/api/v1/stores', {
                params: {
                    page: 0,
                    size: 10,
                },
                headers: {
                    authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
            const { content } = response.data.data;
            setData(content);
            setFilteredData(content);
        } catch (error) {
            message.error('Failed to fetch data. Please try again.');
            console.error('Failed to fetch data:', error);
        }
    };

    const handleCreateStore = () => {
        setIsModalVisible(true);
    };

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
                item.location.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredData(filteredData);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        handleFilterData(selectedRank, value);
    };

    const handleEditStore = (record) => {
        setSelectedStore(record);
        form.setFieldsValue({
            name: record.name,
            type: record.type,
            point: record.point,
            status: record.status,
            location: record.location,
            storeLevel: record['store-level'],
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedStore(null);
    };

    const handleFormSubmit = (values) => {
        const updatedStore = {
            ...selectedStore,
            ...values,
        };
        const newData = data.map(item => item.id === updatedStore.id ? updatedStore : item);
        setData(newData);
        handleFilterData(selectedRank, searchText);
        setIsModalVisible(false);
        setSelectedStore(null);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Type', dataIndex: 'type', key: 'type', width: '15%' },
        { title: 'Point', dataIndex: 'point', key: 'point', width: '10%' },
        { title: 'Location', dataIndex: 'location', key: 'location', width: '20%' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => (
                <Tag color={status ? 'green' : 'volcano'}>
                    {status ? 'Active' : 'Disabled'}
                </Tag>
            ),
        },
        { title: 'Store Level', dataIndex: 'store-level', key: 'store-level', width: '10%' },
    ];

    return (
        <div className="animate__animated animate__fadeIn">
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateStore} >
                    Add New Store
                </Button>
            </Space>
            <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Select defaultValue="All" style={{ width: 200 }} onChange={handleRankChange}>
                    <Option value="All">All</Option>
                    {rankOptions.map(rank => <Option key={rank} value={rank}>{rank}</Option>)}
                </Select>
                <Search
                    placeholder="Search stores"
                    onSearch={handleSearch}
                    onChange={e => handleSearch(e.target.value)}
                    style={{ width: 300, marginLeft: 'auto' }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={filteredData}
                onRow={(record) => ({
                    onClick: () => handleEditStore(record),
                })}
                pagination={{ pageSize: 7 }}
            />
            <Modal
                title="Edit Store"
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
                    <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter the type' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="point" label="Point" rules={[{ required: true, message: 'Please enter the point' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter the location' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="storeLevel" label="Store Level" rules={[{ required: true, message: 'Please enter the store level' }]}>
                        <Input />
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