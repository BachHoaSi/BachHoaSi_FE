import {
    AuditOutlined,
    DeliveredProcedureOutlined,
    LineChartOutlined,
    ProductOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '/src/assets/images/logo.svg'; // Import logo SVG

const { Sider } = Layout;

function getItem(label, key, icon, path) {
    return {
        key,
        icon,
        label,
        path,
    };
}

const items = [
    getItem('DashBoard', '1', <LineChartOutlined />, '/admin/dashboard'),
    getItem('Orders Table', '2', <AuditOutlined />, '/admin/orders'),
    getItem('Products Table', '3', <ProductOutlined />, '/admin/products'),
    getItem('Shipping', '4', <DeliveredProcedureOutlined />, '/admin/shipping'),
    getItem('Customers Table', '5', <UserOutlined />, '/admin/customers'),
    getItem('Staff Table', '6', <UserOutlined />, '/admin/staff'),
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        const item = items.find((item) => item.key === e.key);
        if (item) {
            navigate(item.path);
        }
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo" style={{ textAlign: 'center', padding: '16px' }}>
                <img src={Logo} alt="logo" style={{ width: '100%', maxHeight: '50px' }} />
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
        </Sider>
    );
};

export default Sidebar;
