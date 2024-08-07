import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import { formatFormalDate } from "../../helper/tool";
import api from "../../services/api";

const { Text } = Typography;
const { Option } = Select;

const mapResponseToOrderDetailDto = (response) => {
  const product = response.orderProductMenu;
  if (product) {
    const list = product.map((item) => {
      return {
        name: item.productName,
        quantity: item.quantity,
        category: item.category,
        price: item.price,
        image: item.url,
      };
    });
    return {
      orderId: response.orderId,
      store: response.storeName,
      price: response.total,
      status: response.orderStatus,
      createdAt: response.createdAt,
      deliveryAt: response.deliveryTime,
      products: list,
      feedback: response.feedback,
      grandTotal: response.grandTotal,
      paymentMethod: response.paymentMethod,
    };
  }
  return {
    orderId: response.orderId,
    store: response.storeName,
    price: response.total,
    status: response.orderStatus,
    createdAt: response.createdAt,
    deliveryAt: response.deliveryTime,
    grandTotal: response.grandTotal,
    paymentMethod: response.paymentMethod,
    products: [],
    feedback: response.feedback,
  };
};

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const OrderDetailsPage = () => {
  const { ordersId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const fetchOrderDetailData = async (orderIdInput) => {
    await api.get(`orders/${orderIdInput}`).then((res) => {
      if (res.status === 200 && res.data.isSuccess) {
        const responseData = res.data.data;
        const result = mapResponseToOrderDetailDto(responseData);
        setOrderDetails(result);
      }
    });
  };

  const cancelOrder = async (orderIdInput) => {
    await api
      .patch(`orders/cancel/${orderIdInput}`)
      .then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
          toast.success("Cancel Order Success");
          window.location.reload();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something error");
      });
  };

  useEffect(() => {
    fetchOrderDetailData(ordersId);
  }, [ordersId]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const {
    store,
    price,
    status,
    createdAt,
    deliveryAt,
    products,
    feedback,
    paymentMethod,
    grandTotal,
  } = orderDetails;

  const handleOpenModalChangeStatus = () => {
    setSelectedStatus(status);
    setIsChangeStatusModalOpen(true);
  };

  const handleCloseModalChangeStatus = () => {
    setIsChangeStatusModalOpen(false);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleUpdateStatus = async () => {
    await api.patch(`orders/change-status/${ordersId}?status=${selectedStatus}`)
      .then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
          toast.success('Update Success');
          handleCloseModalChangeStatus();
          setSelectedStatus(null);
        } else {
          toast.error(`Failed to update status: ${res.data.message}`);
        }
      }).catch(() => {
        toast.error("Error");
      })
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "ACCEPTED":
        return "green";
      case "PICKED_UP":
        return "orange";
      case "IN_TRANSIT":
        return "blue";
      case "DELIVERED":
        return "purple";
      case "CANCELLED":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentTagColor = (status) => {
    switch (status) {
      case "COD":
        return "gray";
      case "BANKING":
        return "green";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.image} size={50} shape="square" />
          {text}
        </Space>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
  ];

  const handleGoBack = () => {
    navigate("/admin/orders");
  };

  return (
    <div style={{ padding: 24 }}>
      <ToastContainer></ToastContainer>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          Quay lại
        </Button>
        <Row gutter={24}>
          <Col span={17}>
            <StyledCard>
              <Descriptions title="Order Information" bordered column={2}>
                <Descriptions.Item label="Store">{store}</Descriptions.Item>
                <Descriptions.Item label="Total">{price} VND</Descriptions.Item>
                <Descriptions.Item
                  label="Status"
                  onClick={handleOpenModalChangeStatus}
                >
                  <span onClick={handleOpenModalChangeStatus}>
                    <Tag color={getStatusTagColor(status)}>{status}</Tag>
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Order Create">
                  {createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Day">
                  {formatFormalDate(deliveryAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Shipper">

                </Descriptions.Item>
                <Descriptions.Item label="Feedback">
                  {feedback ? feedback : "None"}
                </Descriptions.Item>
              </Descriptions>
            </StyledCard>
            <StyledCard title="Product List">
              <Table
                dataSource={products}
                columns={columns}
                pagination={false}
              />
            </StyledCard>
          </Col>
          <Col span={7}>
            <StyledCard title="Payment Info">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Payment Status">
                  <Tag color="green">Paid</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  <Tag color={getPaymentTagColor(paymentMethod)}>
                    {paymentMethod}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Summary">
                  <Text strong>{grandTotal} VND</Text>
                </Descriptions.Item>
              </Descriptions>
              {["ACCEPTED", "IN_TRANSIT", "PENDING", "PICKED_UP"].includes(
                status
              ) && (
                  <Popconfirm
                    title="Are you sure you want to cancel that order?"
                    onConfirm={() => {
                      cancelOrder(ordersId);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      style={{
                        marginTop: "20px",
                        backgroundColor: "red",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      Cancel Order
                    </Button>
                  </Popconfirm>
                )}
            </StyledCard>
          </Col>
        </Row>
      </Space>
      <Modal
        title="Update Status"
        open={isChangeStatusModalOpen}
        onCancel={handleCloseModalChangeStatus}
        footer={[
          <Button key="back" onClick={handleCloseModalChangeStatus}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateStatus}>
            Update
          </Button>,
        ]}
      >
        <Select value={selectedStatus} style={{ 'width': '9em' }} onChange={handleStatusChange}>
          <Option value="PENDING">Pending</Option>
          <Option value="ACCEPTED">Accepted</Option>
          <Option value="PICKED_UP">Picked Up</Option>
          <Option value="IN_TRANSIT">In Transit</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
