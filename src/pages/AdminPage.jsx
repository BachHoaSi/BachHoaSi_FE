import { Breadcrumb } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomLayout from '../components/common/Layout';

const AdminPage = () => {
    return (
        <CustomLayout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#fff',
                    borderRadius: '8px',
                }}
            >
                <Outlet /> {/* Outlet sẽ render component tương ứng với đường dẫn */}
            </div>
        </CustomLayout>
    );
};

export default AdminPage;
