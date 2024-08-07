import { Navigate, createBrowserRouter } from "react-router-dom";
import StaffDetailsPage from "../components/Admin/StaffDetail";
import ShipperTable from "../components/Admin/ShipperTable";
import NotFound from "../components/NotFound";
import CategoriesTable from "../components/Shared/CategoriesTable";
import AdminDashboard from "../components/Shared/ChartDashboard";
import OrderDetailsPage from "../components/Shared/OrderDetail";
import OrdersTable from "../components/Shared/OrdersTable";
import ProductDetailsPage from "../components/Shared/ProductDetail";
import ProductsTable from "../components/Shared/ProductsTable";
import StoreDetailsPage from "../components/Shared/StoreDetail";
import StoresTable from "../components/Shared/StoresTable";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import StaffTable from "../components/Admin/StaffTable";
import MenuTable from "../components/Admin/MenuTable";
import StoreLevelTable from "../components/Shared/StoreLevelTable";
import StoreTypeTable from "../components/Shared/StoreTypeTable";
import OrderAdd from "../components/Shared/OrderAdd";
import MenuDetail from "../components/Admin/MenuDetail";

export const router = createBrowserRouter([
    {
        path: "/admin",
        element: <PrivateRoute><AdminPage /></PrivateRoute>,
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
                path: "orders/:ordersId",
                element: <OrderDetailsPage />,
            },
            {
                path: "orders/add",
                element: <OrderAdd />,
            },
            {
                path: "stores",
                element: <StoresTable />,
            },
            {
                path: "stores/:storeId",
                element: <StoreDetailsPage />,
            },
            {
                path: "products",
                element: <ProductsTable />,
            },
            {
                path: "products/:productId",
                element: <ProductDetailsPage />,
            },
            {
                path: "shippers",
                element: <ShipperTable />,
            },
            {
                path: "staffs",
                element: <StaffTable/>
            },
            {
                path: "staffs/:staffId",
                element: <StaffDetailsPage />,
            },
            {
                path: "categories",
                element: <CategoriesTable />,
            },
            {
                path: "menus",
                element: <MenuTable/>
            },
            {
                path: "menus/:menuId",
                element: <MenuDetail/>
            },
            {
                path: "store-levels",
                element: <StoreLevelTable/>
            },
            {
                path: "store-types",
                element: <StoreTypeTable/>
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
    },
    {
        path: "/",
        element: <Navigate to={"/login"}></Navigate>    
    }
]);

