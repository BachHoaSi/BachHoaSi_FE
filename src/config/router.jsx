import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "../components/Admin/ChartDashboard";
import CustomersTable from "../components/Admin/CustomersTable";
import OrdersTable from "../components/Admin/OrdersTable";
import ProductsTable from "../components/Admin/ProductsTable";
import StaffsTable from "../components/Admin/StaffsTable";
import NotFound from "../components/NotFound";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
// import SignupPage from "../pages/SignupPage";

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
    // {
    //     path: "/signup",
    //     element: <SignupPage />,
    // }
]);
