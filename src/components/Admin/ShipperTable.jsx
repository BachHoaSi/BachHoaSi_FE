import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import api from '../../services/api';
import { UserOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState } from "react";

const ShipperTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
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
      const response = await api.get(
        `shippers`,
        {
          params: {
            page: current - 1,
            size: pageSize,
            q: "x",
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
  };

  const handleDelete = async (key, event) => {
    event.stopPropagation();
    try {
      const staffToDelete = data.find((item) => item.key === key);
      await axios.delete(
        `https://api.fams.college/api/v1/shippers/${staffToDelete.staff.id}`,
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


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = () => {
    
  }
  const handleResetPassword = (userId) => {
    // Implement reset password logic here, e.g., using API call
    console.log(`Reset password for user ID: ${userId}`);
    // You might want to show a confirmation message, update the UI, etc.
  };


  const columns = [
    {
      title: "Shipper Id",
      dataIndex: ["staff", "id"],
      key: "staff.id",
      width: "15%",
    },
    {
      title: "Shipper Name",
      dataIndex: ["staff", "name"],
      key: "staff.name",
      render: (name) => (
        <Space size="middle">
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: ["staff", "phone"],
      key: "staff.phone",
    },
    {
      title: "Email",
      dataIndex: ["staff", "email"],
      key: "staff.email",
    },
    {
      title: "Status",
      dataIndex: ["staff", "status"],
      key: "staff.status",
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
        <Popconfirm
          title="Are you sure to delete this record?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
        </Popconfirm>
        <Button type="link" onClick={() => handleResetPassword(record.id)}>
          <UserOutlined />
          Reset Password
        </Button>
      </Space>
      ),
    },
  ];

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
        pagination={pagination}
        locale={{
          emptyText: <Empty description="Không tìm thấy dữ liệu" />,
        }}
      />
      <Modal
        title={"Thêm nhân viên mới"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="name"
            label="Tên nhân viên"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhân viên!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng nhập trạng thái!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shippingStatus"
            label="Trạng thái giao hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trạng thái giao hàng!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="licenseNumber"
            label="Số giấy phép"
            rules={[{ required: true, message: "Vui lòng nhập số giấy phép!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="licenseIssueDate"
            label="Ngày cấp giấy phép"
            rules={[
              { required: true, message: "Vui lòng nhập ngày cấp giấy phép!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idCardNumber"
            label="Số CMND"
            rules={[{ required: true, message: "Vui lòng nhập số CMND!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idCardIssuePlace"
            label="Nơi cấp CMND"
            rules={[{ required: true, message: "Vui lòng nhập nơi cấp CMND!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idCardIssueDate"
            label="Ngày cấp CMND"
            rules={[
              { required: true, message: "Vui lòng nhập ngày cấp CMND!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleType"
            label="Loại phương tiện"
            rules={[
              { required: true, message: "Vui lòng nhập loại phương tiện!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Hoạt động"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái hoạt động!",
              },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Có</Select.Option>
              <Select.Option value={false}>Không</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isLocked"
            label="Khóa"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái khóa!" },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Có</Select.Option>
              <Select.Option value={false}>Không</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShipperTable;
