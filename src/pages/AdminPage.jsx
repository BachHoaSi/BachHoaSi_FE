import { Breadcrumb } from 'antd';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CustomLayout from '../components/common/Layout';

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
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                {breadcrumbNameMap[url]}
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">Admin</Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

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
