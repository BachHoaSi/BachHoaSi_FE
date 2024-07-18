import {
  Input,
  Empty,
  Space,
  Tag,
  Table,
  Button,
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsonToQueryParams } from "../../helper/tool";
import SearchBar from "../Functions/SearchBar";

const OrdersTable = () => {
  const [animate, setAnimate] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const queryJson = {
        id: searchParams.name
    }
    const queryEncode = jsonToQueryParams(queryJson);
    try {
      const response = await api.get(`orders`, {
        params: {
          page: current - 1,
          size: pageSize,
        },
      });
      const { content, totalElements } = response.data.data;
      setData(
        content.map((item, index) => ({
          key: (current - 1) * pageSize + index + 1,
          order: item,
        }))
      );
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleSearch = (search) => {
    setSearchParams(search);
  }

  const handleRowClick = (record) => {
    navigate(`/admin/orders/${record.order.orderId}`);
  };

  const columns = [
    {
      title: "OrderID",
      dataIndex: ["order", "orderId"],
      key: "order.orderId",
      width: "10%",
    },
    {
      title: "Store Name",
      dataIndex: ["order", "storeName"],
      key: "order.storeName",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: ["order", "totalPrice"],
      key: "order.totalPrice",
      width: "15%",
      render: (price) => `${(parseFloat(price) || 0).toFixed(2)} VND`,
    },
    {
      title: "Status",
      dataIndex: ["order", "orderStatus"],
      key: "order.orderStatus",
      width: "15%",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "ACCEPTED", value: "ACCEPTED" },
        { text: "PICKED_UP", value: "PICKED_UP" },
        { text: "IN_TRANSIT", value: "IN_TRANSIT" },
        { text: "DELIVERED", value: "DELIVERED" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record.order.orderStatus === value,
      render: (status) => {
        let color = "blue";
        let text = status;

        switch (status) {
          case "PENDING":
            color = "orange";
            text = "Pending";
            break;
          case "ACCEPTED":
            color = "green";
            text = "Accepted";
            break;
          case "PICKED_UP":
            color = "green";
            text = "Picked Up";
            break;
          case "IN_TRANSIT":
            color = "green";
            text = "In Transit";
            break;
          case "DELIVERED":
            color = "green";
            text = "Delivered";
            break;
          case "CANCELLED":
            color = "red";
            text = "Cancelled";
            break;
        }

        return (
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Delivery At",
      dataIndex: ["order", "storeAddress"],
      key: "deliveryAt",
      width: "20%",
    },
    {
      title: "Created At",
      dataIndex: ["order", "createdDate"],
      key: "createdDate",
      width: "20%",
    },
  ];

  return (
    <div className={`animate__animated ${animate}`}>
      <ToastContainer></ToastContainer>
      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Input.Search
              placeholder={'Search'}
              onSearch={handleSearch}
              enterButton
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              navigate("add");
                }}>
                    Add New Order
                </Button>
      </Space>
      <div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          onChange={handleChange}
          pagination={pagination}
          onRow={(record) => ({
            onClick: () => {
              handleRowClick(record);
            },
          })}
          locale={{
            emptyText: <Empty description="Not found Data" />,
          }}
        />
      </div>
    </div>
  );
};

export default OrdersTable;
