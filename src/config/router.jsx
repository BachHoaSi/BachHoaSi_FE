import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "../components/Admin/ChartDashboard";
import CustomersTable from "../components/Admin/CustomersTable";
import OrdersTable from "../components/Admin/OrdersTable";
import StaffsTable from "../components/Admin/StaffsTable";
import NotFound from "../components/NotFound";
import AdminPage from "../pages/AdminPage";

export const router = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminPage />,
        children: [
            {
                path: "",
                element: <AdminDashboard />,
            },
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
            //     element: <ProductsTable />,
            // },
            // {
            //     path: "shipping",
            //     element: <Shipping />,
            // },
            {
                path: "staff",
                element: <StaffsTable />,
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);