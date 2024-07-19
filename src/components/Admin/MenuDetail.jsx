import React, { useState, useEffect } from 'react';
import { Table, Menu, Dropdown, Space, Button, Modal, message, Input, Select, Form, InputNumber } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const { Option } = Select;

const MenuDetail = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const { menuId: currentMenuId } = useParams();
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false); 
  useEffect(() => {
    fetchMenuData();
    fetchProducts(); // Fetch products when component mounts
    setMenuId(currentMenuId);
  }, []);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`product-menus/${currentMenuId}`);
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('products'); // Replace with your actual product API endpoint
      if (response.data.isSuccess) {
        setProducts(response.data.data.content);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    try {
    const requestBody = {
        "price": values.price,
        "status": values.status,
        "product-id": values.productId
      }
      const response = await api.post(`menus/${values.menuId}`, requestBody);
      if (response.data.isSuccess) {
        message.success('Product added to menu successfully!');
        fetchMenuData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding product to menu:', error);
      message.error('Failed to add product to menu');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Menu ID',
      dataIndex: 'menuId',
      key: 'menuId',
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price) => `${price} VND`, // Format as VND currency
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Admin Name',
      dataIndex: 'adminName',
      key: 'adminName',
    },
  ];

  return (
    <div>
      <h1>Menu Detail</h1>
      <Button type="primary" onClick={() => setIsAddProductModalVisible(true)}>
        Add Product to Menu
      </Button>
      <Modal
        title="Add Product to Menu"
        visible={isAddProductModalVisible}
        onCancel={() => setIsAddProductModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddProduct}>
          <Form.Item name="menuId" label="Menu ID" initialValue={currentMenuId} disabled>
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Please select a product' }]}>
            <Select>
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
            <Button onClick={() => setIsAddProductModalVisible(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <h2>Product List in Menu</h2>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage + 1,
          pageSize: 10,
          total: 2, // Replace with actual total element count from response
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

export default MenuDetail;