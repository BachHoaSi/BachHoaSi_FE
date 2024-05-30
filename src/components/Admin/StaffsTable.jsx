import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import React from 'react';
import SearchableTable from '../Functions/SearchableTable';

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Jim Green',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
    {
        key: '5',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '6',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '7',
        name: 'Jim Green',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '8',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

const StaffsTable = () => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'edit',
                                    label: 'Edit',
                                    icon: <EditOutlined />,
                                    onClick: () => console.log('Edit', record),
                                },
                                {
                                    key: 'delete',
                                    label: 'Delete',
                                    icon: <DeleteOutlined />,
                                    danger: true,
                                    onClick: () => console.log('Delete', record),
                                },
                            ],
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            More actions <DownOutlined />
                        </a>
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <div class="animate__animated animate__backInUp">
            <SearchableTable
                data={data}
                columns={columns}
            />
        </div>
    );

};

export default StaffsTable;