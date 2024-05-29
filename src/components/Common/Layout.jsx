import { Layout } from 'antd';
import React from 'react';
import CustomFooter from './Footer';
import CustomHeader from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

const CustomLayout = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <CustomHeader />
                <Content style={{ margin: '0 16px' }}>
                    {children}
                </Content>
                <CustomFooter />
            </Layout>
        </Layout>
    );
};

export default CustomLayout;
