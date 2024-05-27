// src/pages/CustomerPage.js
import React from 'react';
import { Layout } from 'antd';
import ProductList from '../components/Customer/ProductList';

const { Content } = Layout;

const CustomerPage = () => {
  return (
    <Layout>
      <Content>
        <h1>Customer Products</h1>
        <ProductList />
      </Content>
    </Layout>
  );
};

export default CustomerPage;
