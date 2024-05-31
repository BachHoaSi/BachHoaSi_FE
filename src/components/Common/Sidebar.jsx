import {
    AuditOutlined,
    DeliveredProcedureOutlined,
    LineChartOutlined,
    ProductOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Style/sidebar.scss';
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
    getItem('Orders', '2', <AuditOutlined />, '/admin/orders'),
    getItem('Products', '3', <ProductOutlined />, '/admin/products'),
    getItem('Shipping', '4', <DeliveredProcedureOutlined />, '/admin/shipping'),
    getItem('Customers', '5', <UserOutlined />, '/admin/customers'),
    getItem('Staff', '6', <UserOutlined />, '/admin/staff'),
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentKey, setCurrentKey] = useState('1'); // Thêm trạng thái để theo dõi trang hiện tại
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (e) => {
        const item = items.find((item) => item.key === e.key);
        if (item) {
            setCurrentKey(e.key); // Cập nhật trang hiện tại khi click vào menu
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
