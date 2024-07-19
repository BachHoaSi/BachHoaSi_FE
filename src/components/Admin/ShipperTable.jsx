import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
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
import api from "../../services/api";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
const ShipperTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [rowDataSelect, setRowDataSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const VehicleType = {
    MOTOR: "MOTOR",
    CAR: "CAR",
    TRUCK: "TRUCK",
    VAN: "VAN",
  };

  const ShippingStatus = {
    "WAITING FOR ORDER": "WAITING_FOR_ORDER",
    SHIPPING: "SHIPPING",
    OFFLINE: "OFFLINE",
  };

  const fetchData = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    try {
      const response = await api.get(`shippers`, {
        params: {
          page: current - 1,
          size: pageSize,
          q: "x",
        },
      });
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
      await api.delete(`shippers/${staffToDelete.staff.id}`);
      fetchData();
      message.success("Staff deleted successfully");
    } catch (error) {
      message.error("Failed to delete staff. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = () => {};

  const handleResetPassword = async (userId) => {
    if(userId !== undefined && userId !== null && userId > 0) {
      await api.patch(`shippers/reset-password?id=${userId}`,).then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
          toast.success('Reset Password Success');
        } else {
          toast.error(res.data.message);
        }
      }).catch(() => {
        toast.error('Something errors');
      });
    } else {
      toast.error('Input was not validate');
    }
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
      title: "Active",
      dataIndex: ["staff","is-active"],
      key: "staff.is-active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Locked",
      dataIndex: ["staff","is-locked"],
      key: "staff.is-locked",
      render: (isLocked) => (
        <Tag color={isLocked ? "red" : "green"}>
          {isLocked ? "Locked" : "Unlocked"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this shipper?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record.key);
            }}
            onCancel={(e) => {
              e.stopPropagation();
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
          <Button type="link" onClick={(e) => {
            e.stopPropagation();
            handleResetPassword(record.key);
          }}>
            <UserOutlined />
            Reset Password
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer/>
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
          Add New Shipper
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
            setRowDataSelect(record);
            console.log(record);
            form.setFieldsValue({
              name: record.staff.name,
              phone: record.staff.phone,
              status: record.staff.status,
              email: record.staff.email,
              shippingStatus: record.staff["shipping-status"],
              licenseNumber: record.staff["license-number"],
              licenseIssueDate: moment(
                record.staff["license-issue-date"],
                "YYYY-MM-DD"
              ),
              idCardNumber: record.staff["id-card-number"],
              idCardIssuePlace: record.staff["id-card-issue-place"],
              idCardIssueDate: record.staff["id-card-issue-date"],
              vehicleType: record.staff["vehicle-type"],
              isActive: record.staff['is-active'],
              isLocked: record.staff['is-locked']
            });
            setIsModalVisible(true);
          },
        })}
        pagination={pagination}
        locale={{
          emptyText: <Empty description="Not Found Any Data" />,
        }}
      />
      <Modal
        title={"Update Shipper"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Update
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
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Shipping Status"
            name="shippingStatus"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              defaultValue={ShippingStatus.SHIPPING}
              placeholder="Select Shipping Status"
            >
              {Object.keys(ShippingStatus).map((roleKey) => (
                <Option key={roleKey} value={ShippingStatus[roleKey]}>
                  {ShippingStatus[roleKey].toUpperCase()}
                </Option>
              ))}
            </Select>
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
            valuePropName={"date"}
            getValueFromEvent={(onChange) =>
              moment(onChange).format("YYYY-MM-DD")
            }
            getValueProps={(i) => ({ value: moment(i) })}
            defaultValue={moment.now()}
            rules={[
              { required: true, message: "Vui lòng nhập ngày cấp giấy phép!" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              allowClear={false}
            />
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
            valuePropName={"date"}
            getValueFromEvent={(onChange) =>
              moment(onChange).format("YYYY-MM-DD")
            }
            getValueProps={(i) => ({ value: moment(i) })}
            defaultValue={moment.now()}
            rules={[
              { required: true, message: "Vui lòng nhập ngày cấp CMND!" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              allowClear={false}
            />
          </Form.Item>
          <Form.Item
            label="Vehicle Type"
            name="vehicleType"
            rules={[{ required: true, message: "Please select a vehicle" }]}
          >
            <Select
              defaultValue={VehicleType.CAR}
              placeholder="Select Vehicle Type"
            >
              {Object.keys(VehicleType).map((roleKey) => (
                <Option key={roleKey} value={VehicleType[roleKey]}>
                  {VehicleType[roleKey].toUpperCase()}
                </Option>
              ))}
            </Select>
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
