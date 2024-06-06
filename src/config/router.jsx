import { createBrowserRouter } from "react-router-dom";
import StaffsTable from "../components/Admin/StaffsTable";
import NotFound from "../components/NotFound";
import AdminDashboard from "../components/Shared/ChartDashboard";
import CustomersTable from "../components/Shared/CustomersTable";
import OrdersTable from "../components/Shared/OrdersTable";
import ProductsTable from "../components/Shared/ProductsTable";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";



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
            {
                path: "products",
                element: <ProductsTable />,
            },
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
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    }
]);
