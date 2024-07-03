import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';


const { Header } = Layout;
const { Title } = Typography

const handleButtonClick = (e) => {
    message.info('Click on left button.');
    console.log('click left button', e);
};
const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
};


const items = [
    {
        label: 'Profile',
        key: '1',
        icon: <UserOutlined />,
    },
    {
        label: 'Sign out',
        key: '2',
        icon: <UserOutlined />,
        onClick: () => {
            sessionStorage.removeItem('token');
            window.location.reload(); // Reload the page after logout
        }
    },
    // {
    //     label: '3rd menu item',
    //     key: '3',
    //     icon: <UserOutlined />,
    //     danger: true,
    // },
    // {
    //     label: '4rd menu item',
    //     key: '4',
    //     icon: <UserOutlined />,
    //     danger: true,
    //     disabled: true,
    // },
];
const menuProps = {
    items,
    onClick: handleMenuClick,
};


const CustomAvatarDropdown = () => {
    const [userIcon, setUserIcon] = useState(null);

    useEffect(() => {
        const fetchUserIcon = async () => {
            try {
                const response = await fetch('/api/user/icon');
                const data = await response.json();
                setUserIcon(data.icon);
            } catch (error) {
                console.error('Error fetching user icon:', error);
            }
        };

        fetchUserIcon();
    }, []);

    const defaultAvatar = "https://images.unsplash.com/profile-fb-1687415375-5592bc38a9e7.jpg?auto=format&fit=crop&q=60&bg=fff&crop=faces&dpr=1&h=32&w=32";

    return (
        <Dropdown menu={menuProps} placement="bottomRight">
            <Avatar
                src={userIcon || defaultAvatar} // Sử dụng userIcon hoặc defaultAvatar
                size={40}
                style={{ cursor: 'pointer', right: 10 }}
            />
        </Dropdown>
    );
};

const CustomHeader = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await fetch('/api/user/role');
                const data = await response.json();
                setUserRole(data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const title = userRole === 'admin' ? 'Admin Dashboard' :
        userRole === 'staff' ? 'Staff Dashboard' :
            userRole === 'shipper' ? 'Shipper Dashboard' :
                'Admin Dashboard';


    return (
        <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                padding: 0,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Title level={5} style={{ marginLeft: 50 }}>{title}</Title>
            <div style={{ flexGrow: 1, }} />
            <CustomAvatarDropdown />
        </Header>
    );
};
export default CustomHeader;
