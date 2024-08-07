import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Modal,
  Table,
  Row,
  Col,
  Spin,
  Typography,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../services/api";

const { Option } = Select;
const { Text } = Typography;

const OrderAdd = () => {
  const [storeId, setStoreId] = useState("");
  const [orderItems, setOrderItems] = useState([]); // Initialize as an empty array
  const [payingMethod, setPayingMethod] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [isStoreModalVisible, setIsStoreModalVisible] = useState(false);
  const [searchedStores, setSearchedStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]); // State to store available products
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store the currently selected product
  const [isProductModalVisible, setIsProductModalVisible] = useState(false); // State to control the product modal
  const [searchedProducts, setSearchedProducts] = useState([]); // State to store searched products

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("product-menus/available"); // Replace with your API endpoint

      if (response.status === 200 || response.data.isSuccess) {
        setProducts(response.data.data); // Assuming your API returns an array of products in 'content'
      } else {
        message.error("Error fetching products");
      }
    } catch (error) {
      message.error("Error fetching products");
    }
  };

  const handleStoreSearch = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`stores?q=name=${storeId}`);

      if (response.status === 200 || response.data.isSuccess) {
        const bodyData = response.data.data;
        const { content } = bodyData;
        setSearchedStores(content);
        setSearchQuery("");
        setIsStoreModalVisible(true);
      } else {
        message.error("No stores found");
      }
    } catch (error) {
      message.error("Error searching stores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreSelect = (storeIdLocal) => {
    setStoreId(storeIdLocal);
    setIsStoreModalVisible(false);
    setSearchQuery("");
  };

  const handleModalSearch = async () => {
    try {
      const response = await api.get(`stores?q=name=${searchQuery}`);

      if (response.status === 200 || response.data.isSuccess) {
        const bodyData = response.data.data;
        const { content } = bodyData;
        setSearchedStores(content);
      } else {
        message.error("No stores found");
      }
    } catch (error) {
      message.error("Error searching stores");
    }
  };

  const handleProductSearch = async () => {
    try {
      const response = await api.get(`product-menus/available?name=${searchQuery}`);

      if (response.status === 200 || response.data.isSuccess) {
        const bodyData = response.data;
        const { data } = bodyData;
        setSearchedProducts(data);
      } else {
        message.error("No products found");
      }
    } catch (error) {
      message.error("Error searching products");
    }
  };

  const handleProductSelect = (productId) => {
    // Add new product to orderItems array if it doesn't exist
    if (!orderItems.find((item) => item.productId === productId)) {
      setOrderItems(orderItems.concat({ productId, quantity: 0 }));
    }
    setSelectedProduct(productId);
    setIsProductModalVisible(false);
  };

  const handleQuantityChange = (quantity, productId) => {
    // Update quantity for existing product
    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleAddProduct = () => {
    // Open the product search modal
    setIsProductModalVisible(true);
  };

  const onFinish = async () => {
    const orderItemValidate =  orderItems.filter(
      (item) => item.productId !== null && item.quantity > 0
    ).reduce((acc, item) => {
      acc[item.productId] = item.quantity;
      return acc;
    }, {});
    const orderData = {
      storeId: parseFloat(storeId),
      orderItems: orderItemValidate,
      payingMethod,
      deliveryTime: deliveryTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    };

    if (orderData.orderItems.length === 0) {
      message.error("Please add at least one product to your order.");
      return;
    }

    try {
      // Replace this with your actual API call to add the order
      const response = await api.post("orders", orderData);

      if (response.status === 200 || response.data.isSuccess) {
        message.success("Order added successfully!");
        setStoreId("");
        setOrderItems([]); // Reset orderItems to an empty array
        setPayingMethod("");
        setDeliveryTime(null);
        setSelectedProduct(null);
      } else {
        message.error("Error adding order: " + response.data.message);
      }
    } catch (error) {
      message.error("Error adding order");
    }
  };

  const columns = [
    {
      title: "Store ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const productColumns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQuantity",
      key: "stockQuantity"
    }
  ];

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Store ID"
          name="storeId"
          rules={[{ required: !storeId, message: "Please enter Store ID" }]}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleStoreSearch}
          >
            <Text strong>{storeId || "Select Store"}</Text>{" "}
            {/* Display store ID or "Select Store" */}
            <SearchOutlined style={{ marginLeft: "8px" }} />
          </div>
        </Form.Item>

        <Form.Item
          label="Order Items"
          name="orderItems"
          rules={[{ required: !orderItems.length, message: "Please enter Order Items" }]}
        >
          {orderItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Text>
                {products.find((product) => product.id === item.productId)
                  ?.productName || "Product not found"}
              </Text>
              <InputNumber
                min={0}
                value={item.quantity}
                onChange={(value) =>
                  handleQuantityChange(value, item.productId)
                }
                style={{ width: "80px", marginRight: "8px" }}
              />
              <Text>Quantity</Text>
              {orderItems.length > 1 && (
                // Show a "Remove" button for each product item (except the first one)
                <Button
                  type="link"
                  onClick={() =>
                    setOrderItems(orderItems.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="dashed"
            block
            onClick={handleAddProduct}
            icon={<PlusOutlined />}
          >
            Add Product
          </Button>
        </Form.Item>

        <Form.Item
          label="Paying Method"
          name="payingMethod"
          rules={[{ required: true, message: "Please select Paying Method" }]}
        >
          <Select
            value={payingMethod}
            onChange={(value) => setPayingMethod(value)}
          >
            <Option value="COD">COD</Option>
            <Option value="BANKING">Banking</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Delivery Time"
          name="deliveryTime"
          rules={[{ required: true, message: "Please select Delivery Time" }]}
        >
          <DatePicker
            value={deliveryTime}
            onChange={(date) => setDeliveryTime(date)}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) => {
              const today = new Date();
              return current && current < today;
            }}
            disabledTime={(current) => {
              // Disable past times
              const now = new Date();
              return {
                disabledHours: () => {
                  // Disable hours before the current hour
                  const currentHour = now.getHours();
                  return Array.from({ length: currentHour }, (_, i) => i);
                },
                disabledMinutes: () => {
                  // Disable minutes before the current minute
                  const currentHour = now.getHours();
                  const currentMinute = now.getMinutes();
                  if (currentHour === now.getHours()) {
                    return Array.from({ length: currentMinute }, (_, i) => i);
                  }
                  return []; // All minutes are allowed if the hour is not the current hour
                },
                disabledSeconds: () => {
                  // Disable seconds before the current second (if needed)
                  const currentSecond = now.getSeconds();
                  return Array.from({ length: currentSecond }, (_, i) => i);
                },
              };
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Order
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Search Results"
        open={isStoreModalVisible}
        onCancel={() => setIsStoreModalVisible(false)}
        footer={null}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suffix={<SearchOutlined onClick={handleModalSearch} />}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={searchedStores}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleStoreSelect(record.id),
          })}
        />
        {isLoading && (
          <div style={{ textAlign: "center" }}>
            {" "}
            <Spin />{" "}
          </div>
        )}
      </Modal>

      {/* Product Modal */}
      <Modal
        title="Search Products"
        open={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={null}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suffix={<SearchOutlined onClick={handleProductSearch} />}
            />
          </Col>
        </Row>
        <Table
          columns={productColumns}
          dataSource={searchedProducts}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleProductSelect(record.id),
          })}
        />
      </Modal>
    </div>
  );
};

export default OrderAdd;