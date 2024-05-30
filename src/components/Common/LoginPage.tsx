import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, theme } from 'antd';
import React from 'react';
  
  const LoginPage = () => {
    const { token } = theme.useToken();
  
    const handleLogin = async (values) => {
      // Xử lý logic đăng nhập tại đây (ví dụ: gọi API, kiểm tra thông tin, ...)
      console.log('Received values of form: ', values);
    };
  
    return (
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage
          backgroundImageUrl="https://cdn.tgdd.vn/2021/12/banner/bach-hoa-xanh-top-desk-1200-80-1200x80.png" 
          logo="https://cdn.tgdd.vn/mwgcart/mwg-site/ContentMwg/images/logo/Logo-BHX.svg" 
          title="Bách Hóa Sỉ"
          subTitle="Bách Hóa Sỉ - Giá Tốt Cho Đại Lý"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          activityConfig={{
            style: {
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
              color: token.colorTextHeading,
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(4px)',
            },
            title: 'Khuyến mãi đặc biệt',
            subTitle: 'Ưu đãi hấp dẫn dành cho khách hàng mới',
            action: (
              <Button
                size="large"
                style={{
                  borderRadius: 20,
                  background: token.colorBgElevated,
                  color: token.colorPrimary,
                  width: 120,
                }}
              >
                Tìm hiểu thêm
              </Button>
            ),
          }}
          onFinish={handleLogin}
          // Đã bỏ phần actions
        >
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'Tên đăng nhập'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên đăng nhập!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'Mật khẩu'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!',
                  },
                ]}
              />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Ghi nhớ đăng nhập
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              Quên mật khẩu?
            </a>
          </div>
        </LoginFormPage>
      </div>
    );
  };
  
  export default () => {
    return (
      <ProConfigProvider>
        <LoginPage />
      </ProConfigProvider>
    );
  };
  