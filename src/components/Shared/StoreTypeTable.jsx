import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Tag,
  Select,
  Table,
  message,
} from "antd";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StoreTypeTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectStoreLevel, setSelectedStoreLevel] = useState(null);
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
      const response = await api.get(`store-types`, {
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
          type: item,
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

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields on cancel
  };

  const columns = [
    {
      title: "ID",
      dataIndex: ["type", "id"],
      key: "type.id",
    },
    {
      title: "Type Name",
      dataIndex: ["type", "name"],
      key: "type.name",
    },

    {
      title: "Status",
      dataIndex: ["type", "status"],
      key: "type.status",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  const onFinish = async (values) => {
    try {
      await api.put(`store-types/${selectStoreLevel.level.id}`, values);
      fetchData(); // Fetch data again after updating
      message.success("Staff updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update staff. Please try again.");
      console.error("Error updating staff:", error);
    }
  };

  const onCreateFinish = async (values) => {
    await api
      .post(`store-levels`, values)
      .then((result) => {
        if (result.status === 200 && result.data.isSuccess) {
          fetchData();
          message.success("Add Store Level Successfully");
          setCreateIsModalVisible(false);
          toast.success("Create Store Level Success");
        } else {
          toast.error(result.data.message);
        }
      })
      .catch(() => {
        toast.error("Something error");
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          onClick={() => {
            form.resetFields();
            setCreateIsModalVisible(true);
          }}
        >
          Add Store Type
        </Button>
      </Space>
      <Input.Search
        placeholder="Search"
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
            setSelectedStoreLevel(record);
            form.setFieldsValue({
              id: record.type.id,
              name: record.type.name,
              description: record.type.description,
              status: record.type.status,
            });
            setIsModalVisible(true);
          },
        })}
        pagination={pagination}
        locale={{
          emptyText: <Empty description="Không tìm thấy dữ liệu" />,
        }}
      />
      <Modal
        title={"Edit Store Type"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Edit
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
            rules={[{ required: true, message: "Please enter ID" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái hoạt động!",
              },
            ]}
          >
            <Select placeholder="Select Status" defaultValue={true}>
              <Select.Option value={true}>Có</Select.Option>
              <Select.Option value={false}>Không</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={"Add Store Level"}
        open={isCreateModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setCreateIsModalVisible(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onCreateFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter level" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái hoạt động!",
              },
            ]}
          >
            <Select placeholder="Select Status" defaultValue={true}>
              <Select.Option value={true}>Có</Select.Option>
              <Select.Option value={false}>Không</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreTypeTable;
