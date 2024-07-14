import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import api from '../../services/api';
import axios from "axios";
import { useEffect, useState } from "react";

const StaffTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    try {
      const response = await axios.get(
        `https://api.fams.college/api/v1/admins`,
        {
          params: {
            page: current - 1,
            size: pageSize,
            q: "x",
          },
          headers: {
            authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      const { content, totalElements } = response.data.data;
      console.info(response.data.data);
      setData(
        content.map((item, index) => ({
          key: (current - 1) * pageSize + index + 1,
          staff: item,
        }))
      );
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleCreateStaff = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields on cancel
  };

  const handleDelete = async (key, event) => {
    event.stopPropagation();
    try {
      const staffToDelete = data.find((item) => item.key === key);
      await axios.patch(
        `https://api.fams.college/api/v1/admins/disable/${staffToDelete.staff.id}`,
        {
          headers: {
            authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      fetchData();
      message.success("Staff deleted successfully");
    } catch (error) {
      message.error("Failed to delete staff. Please try again.");
    }
  };

  const roles = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF'
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: ['staff','id'],
      key: 'staff.id',
    },
    {
      title: 'Username',
      dataIndex: ['staff', 'username'],
      key: 'staff.username',
    },
    {
      title: 'Full Name',
      dataIndex: ['staff','full-name'],
      key: 'staff.full-name',
    },
    
    {
      title: 'Active',
      dataIndex: 'is-active',
      key: 'is-active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Locked',
      dataIndex: 'is-locked',
      key: 'is-locked',
      render: (isLocked) => (
        <Tag color={isLocked ? 'red' : 'green'}>
          {isLocked ? 'Locked' : 'Unlocked'}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: ['staff', 'role'],
      key: 'staff.role',
      render: (role) => {
        let color = 'purple'; // Default color
        let roleName = role;
    
        if (role === roles.ADMIN) {
          color = 'blue';
        } else if (role === roles.MANAGER) {
          color = 'green';
        } else if (role === roles.STAFF) {
          color = 'gray';
        } 
    
        roleName = roles[role] ? roles[role].toUpperCase() : roleName;
    
        return (
          <Tag color={color}>
            {roleName}
          </Tag>
        );
      },
    },
    
  ];

  const handleResetPasword = async () => {
    console.log('Reset Password');
  }

  const onFinish = async (values) => {
    try {
      console.log(values);
      await api.put(
        `admins/${selectedAccount.staff.id}`,
        values
      );
      fetchData(); // Fetch data again after updating
      message.success('Staff updated successfully');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update staff. Please try again.');
      console.error('Error updating staff:', error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateStaff}
        >
          Thêm nhân viên mới
        </Button>
      </Space>
      <Input.Search
        placeholder="Tìm kiếm"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(value) => setSearchParams({ q: value })}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => {
            setSelectedAccount(record);
            form.setFieldsValue({
              id: record.staff.id,
              fullName: record.staff['full-name'],
              username: record.staff.username,
              role: record.staff.role
            });
            setIsModalVisible(true);
          }
        })}
        pagination={pagination}
        locale={{
          emptyText: <Empty description="Không tìm thấy dữ liệu" />,
        }}
      />
      <Modal
        title={"Chỉnh sửa nhân viên"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Chỉnh sửa
          </Button>,
        ]}
      >
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <Form.Item
        label="ID"
        name="id"
        rules={[{ required: true, message: 'Please enter ID' }]}
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input/>
      </Form.Item>
      
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select defaultValue={roles.ADMIN} placeholder="Select a role">
          {Object.keys(roles).map(roleKey => (
            <Option key={roleKey} value={roles[roleKey]}>
              {roles[roleKey].toUpperCase()}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
      >
        <Input />
      </Form.Item>
    </Form>
      </Modal>
    </div>
  );
};

export default StaffTable;