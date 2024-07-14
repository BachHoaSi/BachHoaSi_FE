import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Modal, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';


const CategoriesTable = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
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
    
    const handleCreateCategory = async (values) => {
        const requestBody = {
            name: values.name,
            code: values.code,
            description: values.description
        }
        const responseReturn = api.post('/categories', requestBody)
        .then((response) => {
            if (response.status === 200) {
                const isSuccess = response.data.isSuccess;
                if (isSuccess) {
                    fetchData();
                    toast.success('Add Content Success');
                    createForm.resetFields();
                    setIsCreateModalVisible(false);
                }else {
                    toast.error('Add Content Failed');
                }
            }
        }).catch((err) => {
            console.error(err);
        });
        return responseReturn;
    }

    const handleDelete = async (key, event) => {
        event.stopPropagation();
        try {
            const categoryToDelete = data.find(item => item.key === key);
            const response = await api.delete(`/categories/${categoryToDelete.category.id}`);
            fetchData();
            if (response.data && response.data.isSuccess) {
                toast.success('Category deleted successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to delete category. Please try again.');
        }
    };

    const onUpdateFinish = async (values) => {
        try {
            const requestBody = {
                name: values.name,
                code: values.code,
                description: values.description,
            };

            const responseAxios = await api.put(`/categories/${selectedCategory.category.id}`, requestBody);
            if (responseAxios.status === 200 && responseAxios.data.isSuccess) {
                fetchData();
                setIsModalVisible(false);
                toast.success('Update Success');
                form.resetFields();
                setFileList([]);
            } else {
                toast.error(responseAxios.data.message);
            }        
        } catch (error) {
            console.error('Failed to create or update category:', error);
            toast.error("Error"); 
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
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setSelectedCategory(null);
                    setIsCreateModalVisible(true);
                }}>
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
                            id : record.category.id,
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
                title={'Edit Category'}
                open={isModalVisible}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {setIsModalVisible(false)}}
                footer={[
                    <Button key="back" onClick={() => {setIsModalVisible(false)}}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => {form.submit();}}>
                        {'Edit'}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={onUpdateFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name={"id"}
                        label={"ID"}
                    >
                        <Input disabled></Input>
                    </Form.Item>
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

            <Modal
            title={'Add New Category'}
            open={isCreateModalVisible}
            onCancel={() => {
                setIsCreateModalVisible(false);
            }}
            onOk={() => {createForm.submit()}}
            footer={[
                <Button key="back" onClick={() => {setIsCreateModalVisible(false)}}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => {createForm.submit();}}>
                    {'Create'}
                </Button>,
            ]}
            >
                <Form
                    form={createForm}
                    onFinish={handleCreateCategory}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Category Code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã danh mục!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
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
