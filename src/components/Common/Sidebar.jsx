import {
    AuditOutlined,
    LineChartOutlined,
    MenuOutlined,
    ProductOutlined,
    TagsOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { React, useEffect, useState } from 'react';
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
    getItem('Stores', '4', <UserOutlined />, '/admin/stores'),
    getItem('Staff', '5', <UserOutlined />, '/admin/staffs'),
    getItem('Shipper', '6', <UserOutlined />, '/admin/shippers'),
    getItem('Categories', '7', <TagsOutlined />, '/admin/categories'),
    getItem('Setting', '8', <MenuOutlined />, '/admin/settings'),
];
sessionStorage.setItem('sidebarItems', JSON.stringify(items));

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentKey, setCurrentKey] = useState(() => {
        const storedKey = sessionStorage.getItem('currentKey');
        return storedKey || '1';
    });
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;
    const activeKey = items.find(item => item.path === currentPath)?.key || '1';

    useEffect(() => {
        sessionStorage.setItem('currentKey', activeKey);
    }, [activeKey]);

    const handleMenuClick = async (e) => {
        const item = items.find((item) => item.key === e.key);
        if (item) {
            const storedCurrentKey = parseInt(sessionStorage.getItem('currentKey'), 10) || 1;
            const newKey = parseInt(item.key, 10);

            // Compare keys before updating
            if (newKey > storedCurrentKey) {
                sessionStorage.setItem('animationDirection', 'animate__backInUp');
            } else if (newKey < storedCurrentKey) {
                sessionStorage.setItem('animationDirection', 'animate__backInDown');
            } else {
                // No animation if keys are the same
                sessionStorage.setItem('animationDirection', 'animate__zoomIn');
            }

            sessionStorage.setItem('currentKey', newKey); // Update currentKey in sessionStorage
            setCurrentKey(newKey);
            navigate(item.path);
        }
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo" style={{ textAlign: 'center', padding: '16px' }}>
                <img src={Logo} alt="logo" style={{ width: '100%', maxHeight: '50px' }} />
            </div>
            <Menu theme="dark" selectedKeys={[activeKey]} mode="inline" items={items} onClick={handleMenuClick} />
        </Sider>
    );
};

export default Sidebar;
