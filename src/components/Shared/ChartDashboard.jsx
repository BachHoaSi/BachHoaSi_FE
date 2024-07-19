
import {
    Avatar,
    Card,
    Col,
    DatePicker,
    List,
    Progress,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Typography,
} from 'antd';
import { React, useEffect, useState } from "react";
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styled from 'styled-components';
import api from '../../services/api';
import "../Style/sidebar.scss";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Sample Data
const salesData = [
    { date: '2024-05-01', sales: 2500 },
    { date: '2024-05-05', sales: 1800 },
    { date: '2024-05-10', sales: 3200 },
    { date: '2024-05-15', sales: 2850 },
    { date: '2024-05-20', sales: 4100 },
    { date: '2024-05-25', sales: 3500 },
];

const topProducts = [
    { id: 1, name: 'Product A', sales: 120 },
    { id: 2, name: 'Product B', sales: 95 },
    { id: 3, name: 'Product C', sales: 80 },
    { id: 4, name: 'Product D', sales: 65 },
    { id: 5, name: 'Product E', sales: 50 },
];

const recentOrders = [
    { id: 101, store: 'John Doe', date: '2024-05-27', amount: 54.99 },
    { id: 102, store: 'Jane Smith', date: '2024-05-26', amount: 89.50 },
    { id: 103, store: 'Mike Johnson', date: '2024-05-25', amount: 125.20 },
];

const transactionData = [
    { name: 'Completed', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Failed', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Dashboard = () => {
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalStores, setTotalStores] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalShippers, setTotalShippers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [recentOrdersData, setRecentOrdersData] = useState([]);

    const handleDateRangeChange = (dates) => {
        setSelectedRange(dates);
    };

    const [animate, setAnimate] = useState('');

    useEffect(() => {
        const animationDirection = sessionStorage.getItem('animationDirection');
        console.log(animationDirection); // Check the value of animationDirection
        if (animationDirection) {
            setAnimate(animationDirection);
            sessionStorage.removeItem('animationDirection');
        }
    }, []);

    useEffect(() => {
        fetchTotalOrders();
        fetchTotalStores();
        fetchTotalAdmins();
        fetchTotalShippers();
        fetchRevenue();
        fetchRecentOrders();
    }, []);

    const fetchTotalOrders = async () => {
        try {
            const response = await api.get('/orders', {
                params: {
                    page: 0,
                    size: 10000,
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                console.log("orders", response.data.data.content.length);
                setTotalOrders(response.data.data.content.length);
            } else {
                console.error('Error fetching total orders:', response);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };
    const fetchTotalStores = async () => {
        try {
            const response = await api.get('/stores', {
                params: {
                    page: 0,
                    size: 10000,
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                console.log("stores", response.data.data.content.length);
                setTotalStores(response.data.data.content.length);
            } else {
                console.error('Error fetching total orders:', response);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };
    const fetchTotalAdmins = async () => {
        try {
            const response = await api.get('/admins', {
                params: {
                    page: 0,
                    size: 10000,
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                console.log("admins", response.data.data.content.length);
                setTotalAdmins(response.data.data.content.length);
            } else {
                console.error('Error fetching total orders:', response);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };
    const fetchTotalShippers = async () => {
        try {
            const response = await api.get('/shippers', {
                params: {
                    page: 0,
                    size: 10000,
                    q: 'q',
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                console.log("shippers", response.data.data.content.length);
                setTotalShippers(response.data.data.content.length);
            } else {
                console.error('Error fetching total orders:', response);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };
    const fetchRevenue = async () => {
        try {
            const response = await api.get('/orders', {
                params: {
                    page: 0,
                    size: 10000,
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                const totalRevenue = response.data.data.content.reduce((total, order) => total + order.totalPrice, 0);
                console.log("revenue", totalRevenue);
                setTotalRevenue(totalRevenue);
            } else {
                console.error('Error fetching total orders:', response);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await api.get('/orders', {
                params: {
                    page: 0,
                    size: 5,
                },
            });
            if (response.status === 200 || response.data.isSuccess) {
                setRecentOrdersData(response.data.data.content);
            } else {
                console.error('Error fetching recent orders:', response);
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'orderId', key: 'orderId' },
        { title: 'Store', dataIndex: 'storeName', key: 'storeName' },
        { title: 'Date', dataIndex: 'createdDate', key: 'createdDate' },
        { title: 'Amount', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => `${(parseFloat(price) || 0).toFixed(2)} VND` },
    ];

    return (
        <div className={`animate__animated ${animate} `}>
            <StyledDashboard>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Header>
                            <Title level={2}>Dashboard</Title>
                            <Space>
                                <span>Welcome, Admin</span>
                                <RangePicker onChange={handleDateRangeChange} />
                                <Select defaultValue="week" style={{ width: 120 }}>
                                    <Option value="week">This Week</Option>
                                    <Option value="month">This Month</Option>
                                </Select>
                            </Space>
                        </Header>
                    </Col>

                    <Col span={6}>
                        <Card>
                            <Statistic title="Total Orders" value={totalOrders} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title="Revenue" value={totalRevenue + " VND"} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title="Staff" value={totalAdmins + totalShippers} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title="Total Stores" value={totalStores} />
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Reports">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Analytics">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <span>Transactions:</span>
                                <Progress percent={75} />
                            </div>
                            <ResponsiveContainer width="100%" height={262}>
                                <PieChart>
                                    <Pie
                                        data={transactionData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {transactionData.map((entry, index) => (
                                            <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Recent Orders">
                            <Table columns={columns} dataSource={recentOrdersData} pagination={false} />
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Top Selling Products">
                            <List
                                itemLayout="horizontal"
                                dataSource={topProducts}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${item.id}`} />}
                                            title={item.name}
                                            description={`Sales: ${item.sales}`}
                                        />
                                    </List.Item >
                                )}
                            />
                        </Card >
                    </Col >
                </Row >
            </StyledDashboard >
        </div >
    );
};

// Styled Components
const StyledDashboard = styled.div`
    padding: 24px;
  `;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  `;

export default Dashboard;

