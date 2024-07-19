import React, { useState, useEffect } from 'react';
import { Table, Menu, Dropdown, Space, Button, Modal, message, Input, Select, Form, Pagination } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Option } = Select;

const MenuDetail = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const { menuId: currentMenuId } = useParams();

  useEffect(() => {
    fetchMenuData(currentPage);
    fetchProducts(currentPage);
    setMenuId(currentMenuId);
  }, []);

  const fetchMenuData = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`menus/${currentMenuId}?page=${page - 1}`);
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

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/products?page=${page - 1}`);
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
      const response = await axios.post('/your-add-product-to-menu-api-endpoint', values);
      if (response.data.isSuccess) {
        message.success('Product added to menu successfully!');
        fetchMenuData(currentPage);
        setIsAddProductModalVisible(false); // Close modal after success
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding product to menu:', error);
      message.error('Failed to add product to menu');
    }
  };

  const handleRowClick = async (record) => {
    try {
      const response = await api.get(`products/${record.productId}`);
      if (response.data.isSuccess) {
        navigate(`/menu-detail/${currentMenuId}`, { state: { productDetails: response.data.data } });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      message.error('Failed to fetch product details');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMenuData(page);
    fetchProducts(page);
  };

  const columns = [
    // ... (columns remain the same)
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
            <Input type="number" />
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
            <Input type="number" />
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
        pagination={false}
      />
      <Pagination 
        current={currentPage} 
        onChange={handlePageChange} 
        total={10} 
      />

      <h2>Available Products</h2>
      <Table
        loading={loading}
        dataSource={products}
        columns={columns}
        pagination={false}
      />
      <Pagination 
        current={currentPage} 
        onChange={handlePageChange} 
        total={10} 
      />
    </div>
  );
};

export default MenuDetail;