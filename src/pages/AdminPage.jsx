import 'animate.css';
import { Breadcrumb } from 'antd';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import CustomLayout from '../components/Common/Layout';

const breadcrumbNameMap = {
    '/admin/dashboard': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/products': 'Products',
    '/admin/shipping': 'Shipping',
    '/admin/stores': 'Stores',
    '/admin/staff': 'Staffs',
};

const AdminPage = () => {
    const location = useLocation();

    const pathSnippets = location.pathname.split('/').filter((i) => i !== '');

    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
            key: url,
            title: <Link to={url}>{breadcrumbNameMap[url] || snippet.charAt(0).toUpperCase() + snippet.slice(1)}</Link>,
        };
    });

    return (
        <CustomLayout>
            <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
            <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                <Outlet />
            </div>
        </CustomLayout>
    );
};

export default AdminPage;
