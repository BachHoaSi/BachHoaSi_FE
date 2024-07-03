import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const { Option } = Select;
const { Search } = Input;

const CategoriesTable = () => {
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
        name: ''
    });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, searchParams]);

    const fetchData = async () => {
        setLoading(true);
        const { current, pageSize } = pagination;
        const queryParam = `name=${searchParams.name}`;
        try {
            const response = await api.get(`/categories`, {
                params: {
                    page: current - 1,
                    size: pageSize,
                    q: queryParam,
                },
            });
            const { content, totalElements } = response.data.data;
            setData(content.map((item, index) => ({
                key: (current - 1) * pageSize + index + 1,
                category: item,
            })));
            setPagination((prev) => ({
                ...prev,
                total: totalElements,
            }));
            // toast.success(response.data.message);
        } catch (error) {
            toast.error('Failed to fetch data. Please try again.');
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchParams({
            name: value
        });
    };



    const handleCreateCategory = () => {
        setSelectedCategory(null);
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
            const categoryToDelete = data.find(item => item.key === key);
            const response = await api.delete(`/categories/${categoryToDelete.category.id}`);
            fetchData();
            if (response.data && response.data.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Category deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete category. Please try again.');
        }
    };

    const onFinish = async (values) => {
        try {
            const requestBody = {
                name: values.name,
                code: values.code,
                description: values.description,
            };

            if (selectedCategory) {
                await api.put(`/categories/${selectedCategory.category.id}`, requestBody);
            } else {
                await api.post('/categories', requestBody);
            }
            fetchData();
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Failed to create or update category:', error);
            message.error('Failed to create or update category. Please try again.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'Category ID',
            dataIndex: ['category', 'id'],
            key: 'category.id',
        },
        {
            title: 'Category Name',
            dataIndex: ['category', 'name'],
            key: 'category.name',
        },
        {
            title: 'Category Code',
            dataIndex: ['category', 'code'],
            key: 'category.code',
        },
        {
            title: 'Description',
            dataIndex: ['category', 'description'],
            key: 'category.description',
        },
        {

            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={(e) => handleDelete(record.key, e)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <ToastContainer />
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCategory}>
                    Thêm danh mục mới
                </Button>
            </Space>
            <Input.Search
                placeholder="Tìm kiếm"
                allowClear
                enterButton="Search"
                size="medium"
                onSearch={handleSearch}
                onChange={e => handleSearch(e.target.value)}
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
                        setSelectedCategory(record);
                        form.setFieldsValue({
                            name: record.category.name,
                            code: record.category.code,
                            description: record.category.description,
                        });
                        setIsModalVisible(true);
                    },
                })}
                locale={{
                    emptyText: <Empty description="Không tìm thấy dữ liệu" />,
                }}
            />
            <Modal
                title={selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {selectedCategory ? 'Chỉnh sửa' : 'Thêm'}
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
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Mã danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập mã danh mục!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả danh mục!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesTable;
