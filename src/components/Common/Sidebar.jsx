import {
  AuditOutlined,
  LineChartOutlined,
  MenuOutlined,
  ProductOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/sidebar.scss";
import Logo from "/src/assets/images/logo.svg"; // Import logo SVG
import { CategoryOutlined, LeaderboardOutlined } from "@mui/icons-material";

const { Sider } = Layout;

// Define a function to create menu items
const createMenuItem = (label, key, icon, path) => ({
  key,
  icon,
  label,
  path,
});

// Define the menu items
const menuItems = [
  createMenuItem("DashBoard", "1", <LineChartOutlined />, "/admin/dashboard"),
  createMenuItem("Menu", "9", <MenuOutlined />, "/admin/menus"),
  createMenuItem("Orders", "2", <AuditOutlined />, "/admin/orders"),
  createMenuItem("Products", "3", <ProductOutlined />, "/admin/products"),
  {
    key: "type",
    icon: <TagsOutlined />,
    label: "Types",
    children: [
      createMenuItem("Store Levels", "5", <LeaderboardOutlined />, "/admin/store-levels"),
      createMenuItem("Store Types", "6", <ProductOutlined />, "/admin/shippers"),
      createMenuItem("Categories", "7", <CategoryOutlined/>, "/admin/categories")
    ],
  },
  
  // User Menu - This is the parent item
  {
    key: "user",
    icon: <UserOutlined />,
    label: "Users",
    children: [
      createMenuItem("Staff", "5", <UserOutlined />, "/admin/staffs"),
      createMenuItem("Shipper", "6", <UserOutlined />, "/admin/shippers"),
      createMenuItem("Stores", "4", <UserOutlined />, "/admin/stores"),
    ],
  },
  createMenuItem("Setting", "8", <SettingOutlined />, "/admin/settings"),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentKey, setCurrentKey] = useState("1");
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey =
    menuItems.find((item) => {
      if (item.children) {
        return item.children.some((child) => child.path === location.pathname);
      } else {
        return item.path === location.pathname;
      }
    })?.key || "1";

  useEffect(() => {
    sessionStorage.setItem("currentKey", activeKey);
  }, [activeKey]);

  // Handle menu click
  const handleMenuClick = (e) => {
    // Find the selected item
    const selectedItem = menuItems.find(
      (item) =>
        item.key === e.key ||
        (item.children && item.children.some((child) => child.key === e.key))
    );

    // Navigate based on the selected item
    if (selectedItem) {
      sessionStorage.setItem("currentKey", e.key);
      setCurrentKey(e.key);

      if (selectedItem.children) {
        // Handle nested menu item clicks
        const childItem = selectedItem.children.find(
          (child) => child.key === e.key
        );
        if (childItem) {
          navigate(childItem.path);
        }
      } else {
        // Handle regular menu item clicks
        navigate(selectedItem.path);
      }
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="logo" style={{ textAlign: "center", padding: "16px" }}>
        <img
          src={Logo}
          alt="logo"
          style={{ width: "100%", maxHeight: "50px" }}
        />
      </div>
      <Menu
        theme="dark"
        selectedKeys={[activeKey]}
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
