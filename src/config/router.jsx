import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "../components/Admin/ChartDashboard";
import CustomersTable from "../components/Admin/CustomersTable";
import OrdersTable from "../components/Admin/OrdersTable";
import AdminPage from "../pages/AdminPage";

export const router = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminPage />,
        children: [
            {
                path: "dashboard",
                element: <AdminDashboard />,
            },
            {
                path: "orders",
                element: <OrdersTable />,
            },
            {
                path: "customers",
                element: <CustomersTable />,
            },
            // {
            //     path: "products",
            //     element: <ProductsTable />, // Giả sử bạn có component ProductsTable
            // },
            // {
            //     path: "shipping",
            //     element: <Shipping />, // Giả sử bạn có component Shipping
            // },
            // {
            //     path: "staff",
            //     element: <StaffTable />, // Giả sử bạn có component StaffTable
            // },
        ]
    },
]);
