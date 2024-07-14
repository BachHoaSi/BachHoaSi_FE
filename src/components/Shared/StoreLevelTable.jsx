import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import api from '../../services/api';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StoreLevelTable = () => {
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
      const response = await api.get(
        `store-levels`,
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
          level: item,
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
      title: 'ID',
      dataIndex: ['level','id'],
      key: 'level.id',
    },
    {
      title: 'Level',
      dataIndex: ['level', 'level'],
      key: 'level.level',
    },
    {
        title: 'From Point',
        dataIndex: ['level', 'fromPoint'],
        key: 'level.from-point',
    },
    {
        title: 'To Point',
        dataIndex: ['level', 'toPoint'],
        key: 'level.toPoint',
    },
    
  ];

  const onFinish = async (values) => {
    try {
      await api.put(
        `store-levels/${selectStoreLevel.level.id}`,
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

  const onCreateFinish = async (values) => {
    await api.post(
        `store-levels`,
        values
    ).then((result) => {
        if (result.status === 200 && result.data.isSuccess) {
            fetchData();
            message.success('Add Store Level Successfully');
            setCreateIsModalVisible(false);
            toast.success('Create Store Level Success');
        } else {
            toast.error(result.data.message);
        }
    }).catch(() => {
        toast.error('Something error');
    });
      
  }
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
          onClick={() => {
            form.resetFields();
            setCreateIsModalVisible(true);
          }}
        >
          Add Store Level
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
              id: record.level.id,
              level: record.level.level,
              fromPoint: record.level.fromPoint,
              toPoint: record.level.toPoint,
              description: record.level.description
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
        title={"Edit Store Level"}
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
        label="Level"
        name="level"
        rules={[{ required: true, message: 'Please enter level' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        label="From Point"
        name="fromPoint"
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="To Point"
        name="toPoint"
      >
        <InputNumber />
      </Form.Item>
    </Form>
      </Modal>
      <Modal
        title={"Add Store Level"}
        open={isCreateModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => {
            setCreateIsModalVisible(false);
            form.resetFields();
          }}>
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
        label="Level"
        name="level"
        rules={[{ required: true, message: 'Please enter level' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        label="From Point"
        name="fromPoint"
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="To Point"
        name="toPoint"
      >
        <InputNumber />
      </Form.Item>
    </Form>
      </Modal>
    </div>
  );
};

export default StoreLevelTable;