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
  const [selectedProduct, setSelectedProduct] = useState('');
  const { menuId: currentMenuId } = useParams();
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [isUpdateProductModalVisible, setIsUpdateProductModalVisible] = useState(false); 
  useEffect(() => {
    fetchMenuData();
    fetchProducts(); // Fetch products when component mounts
    setMenuId(currentMenuId);
  }, []);

  const handleUpdateProduct = async (values) => {
    try {
      const response = await api.put(`product-menus?menuId=${selectedProduct.menuId}`, values);
      if (response.data.isSuccess) {
        message.success('Product updated successfully!');
        fetchMenuData(currentPage);
        setIsUpdateProductModalVisible(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product');
    }
  };

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`product-menus/${currentMenuId}`);
      if (response.data.isSuccess) {
        const {content} = response.data.data;
        const transformedData = content.map((item) => ({
          adminName: item.adminName,
          basePrice: item.basePrice,
          id: item.id,
          menuId: item.menuId,
          productId: item.productId,
          status: item.status,
          name: item.productDetails.name,
          description: item.productDetails.description,
          productCode: item.productDetails["product-code"], // Convert "product-code" to camelCase
          basePriceProduct: item.productDetails["base-price"], // Convert "base-price" to camelCase
          urlImage: item.productDetails["url-image"], // Convert "url-image" to camelCase
          stockQuantity: item.productDetails["stock-quantity"], // Convert "stock-quantity" to camelCase
          categoryName: item.productDetails["category-name"], // Convert "category-name" to camelCase
        }));
        setDataSource(transformedData);
        console.log(dataSource);
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

  const handleRowClick = async (record) => {
    setSelectedProduct(record);
    setIsUpdateProductModalVisible(true);
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
      title: 'Image',
      dataIndex: 'urlImage', // Correct way to access nested properties
      key: 'urlImage',
      render: (imageUrl) => (
        <img src={imageUrl} alt="Product" width={50} height={50} /> // Render image
      ),
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price) => `${price} VND`, 
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (quantity) => `${quantity}`, 
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

      <Modal
        title="Update Product in Menu"
        visible={isUpdateProductModalVisible}
        onCancel={() => setIsUpdateProductModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleUpdateProduct}>
            <Form.Item name="productId" label="Product ID" initialValue={selectedProduct.productId} disabled>
              <Input type="number" disabled/>
            </Form.Item>

            <Form.Item name="price" label="Price" initialValue={selectedProduct.basePrice} rules={[{ required: true, message: 'Please enter a price' }]}>
              <Input type="number" min={1}/>
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue={selectedProduct.status} rules={[{ required: true, message: 'Please select a status' }]}>
              <Select>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Product
              </Button>
              <Button onClick={() => setIsUpdateProductModalVisible(false)}>
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