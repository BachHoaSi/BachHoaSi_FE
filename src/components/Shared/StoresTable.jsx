import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

const { Option } = Select;
const { Search } = Input;

const StoresTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRank, setSelectedRank] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchStoreTypes();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const queryParam = `name=${searchParams.name}&store-level=${selectedRank}`;
    try {
      const response = await api.get(`/stores`, {
        params: {
          page: current - 1,
          size: pageSize,
          q: queryParam,
        },
      });
      const { content, totalElements } = response.data.data;
      setData(
        content.map((item, index) => ({
          key: (current - 1) * pageSize + index + 1,
          store: item,
        }))
      );
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
      }));
      // toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/store-levels");
      setCategories(response.data.data.content);
    } catch (error) {
      message.error("Failed to fetch categories. Please try again.");
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchParams({
      name: value,
    });
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    setIsModalVisible(true);
  };

  const handleRankChange = (value) => {
    setSelectedRank(value);
    handleFilterData(value, searchText);
  };

  const handleFilterData = (rank, searchText) => {
    let filteredData = data;
    if (rank !== "All") {
      filteredData = filteredData.filter(
        (item) => item["store-level"] === rank
      );
    }
    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredData(filteredData);
  };

  const handleDeleteStore = async (key, event) => {
    event.stopPropagation();
    try {
      const storeToDelete = data.find((item) => item.key === key);
      const response = await api.delete(`/stores/${storeToDelete.store["id"]}`);
      fetchData();
      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Store deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete store. Please try again.");
    }
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedStore(null);
  };

  const handleFormSubmit = async (values) => {
    try {
      const requestBody = {
        name: values.name,
        type: values.type,
        point: values.point,
        storeStatus: values.storeStatus,
        location: values.location,
        "store-level": values.storeLevel,
      };
      console.log(requestBody);

      if (selectedStore) {
        await api.put(
          `/stores?code=${selectedStore.store["store-code"]}`,
          requestBody
        );
      } else {
        await api.post("/stores", requestBody);
      }
      fetchData();
      setIsModalVisible(false);
      setSelectedStore(null);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Failed to create or update store:", error);
      message.error("Failed to create or update store. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [storeTypes, setStoreTypes] = useState([]);
  const fetchStoreTypes = async () => {
    try {
      const response = await api.get('store-types/all');
      const storeTypeData = response.data.data.content;
      console.log(storeTypeData);
      setStoreTypes(storeTypeData);
    } catch (error) {
      message.error("Failed to fetch store types. Please try again.");
      console.error("Failed to fetch store types:", error);
    }
  };


  const columns = [
    {
      title: "Store Id",
      dataIndex: ["store", "id"],
      key: "store.id",
    },
    {
      title: "Store Name",
      dataIndex: ["store", "name"],
      key: "store.name",
    },
    {
      title: "Type",
      dataIndex: ["store", "type"],
      key: "store.type",
    },
    {
      title: "Point",
      dataIndex: ["store", "point"],
      key: "store.point",
    },
    {
      title: "Location",
      dataIndex: ["store", "location"],
      key: "store.location",
    },
    {
      title: "Status",
      dataIndex: ["store", "storeStatus"],
      key: "store.storeStatus",
      render: (storeStatus) => {
        let color;
        switch (storeStatus) {
          case "REJECTED":
            color = "volcano";
            break;
          case "ACCEPTED":
            color = "green";
            break;
          case "PENDING":
            color = "gold";
            break;
          case "CREATED":
            color = "blue";
            break;
          default:
            color = "default";
            break;
        }
        return (
          <Tag color={color}>
            {storeStatus ? storeStatus : "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Store Level",
      dataIndex: ["store", "store-level"],
      key: "store.store-level",
    },
    {
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this store?"
          onConfirm={(e) => handleDeleteStore(record.key, e)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Select
          defaultValue={selectedRank}
          style={{ width: 200 }}
          onChange={(value) => setSelectedRank(value)}
        >
          <Select.Option value="">All</Select.Option>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.level}
            </Select.Option>
          ))}
        </Select>
      </Space>
      <Input.Search
        placeholder="Tìm kiếm"
        allowClear
        enterButton="Search"
        size="medium"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => {
            setSelectedStore(record);
            form.setFieldsValue({
              name: record.store.name,
              type: record.store.type,
              point: record.store.point,
              storeStatus: record.store.storeStatus,
              location: record.store.location,
              storeLevel: record.store["store-level"],
            });
            setIsModalVisible(true);
          },
        })}
        locale={{
          emptyText: <Empty description="Không tìm thấy dữ liệu" />,
        }}
      />
      <Modal
        title={"Chỉnh sửa Store"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {"Chỉnh sửa"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="name"
            label="Store Name"
            rules={[{ required: true, message: "Vui lòng nhập tên Store!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Store Type"
            rules={[{ required: true, message: "Vui lòng nhập loại Store!" }]}
          >
            <Select placeholder="Select Store Type">
              {storeTypes.map((type) => (
                <Option key={type.id} value={type.name}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="point"
            label="Point"
            rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="storeLevel"
            label="Level"
            rules={[{ required: true, message: "Vui lòng chọn cấp độ Store!" }]}
          >
            <Select placeholder="Chọn cấp độ Store">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoresTable;
