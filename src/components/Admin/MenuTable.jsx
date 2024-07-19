import React, { useState, useEffect } from 'react';
import { Table, Menu, Dropdown, Space, Button, Modal, message } from 'antd';
import api from '../../services/api'
import { useNavigate } from 'react-router-dom';

const MenuTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await api.get('menus');
      if (response.data.isSuccess) {
        setDataSource(response.data.data.content);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      message.error('Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record) => {
    navigate(`/admin/menus/${record.id}`); // Replace with your actual detail page route
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <div>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage + 1,
          pageSize: 10,
          total: 20, // Replace with actual total element count from response
          onChange: (page) => {
            setCurrentPage(page - 1);
            fetchMenuData();
          },
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </div>
  );
};

export default MenuTable;