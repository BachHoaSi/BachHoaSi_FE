import 'animate.css';
import { Breadcrumb } from 'antd';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CustomLayout from '../components/Common/Layout';

const breadcrumbNameMap = {
    '/admin/dashboard': 'Dashboard',
    '/admin/orders': 'Orders Table',
    '/admin/products': 'Products Table',
    '/admin/shipping': 'Shipping',
    '/admin/customers': 'Customers Table',
    '/admin/staff': 'Staff Table',
};

const AdminPage = () => {
    const location = useLocation();

    const pathSnippets = location.pathname.split('/').filter(i => i !== '');
    const extraBreadcrumbItems = pathSnippets
        .map((snippet, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    {breadcrumbNameMap[url] || snippet.charAt(0).toUpperCase() + snippet.slice(1)}
                </Breadcrumb.Item>
            );
        });

    const breadcrumbItems = extraBreadcrumbItems;

    return (
        <CustomLayout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                {breadcrumbItems}
            </Breadcrumb>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#fff',
                    borderRadius: '8px',
                }}
            >
                <Outlet />
            </div>
        </CustomLayout>
    );
};

export default AdminPage;
