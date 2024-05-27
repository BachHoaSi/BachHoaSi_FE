import { Layout } from 'antd';
import React from 'react';

const { Footer } = Layout;

const CustomFooter = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Bach Hoa Si ©{new Date().getFullYear()} Created by Nhat Sang
        </Footer>
    );
};

export default CustomFooter;
