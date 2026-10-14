import type { MenuProps } from "antd";
import {
    DashboardOutlined,
    SettingOutlined,
    AppstoreOutlined,
    ToolOutlined,
    TeamOutlined,
} from "@ant-design/icons";

export const MENUS: MenuProps["items"] = [
    {
        key: "/cms/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
    },
    {
        key: "/cms/projects",
        icon: <AppstoreOutlined />,
        label: "Projects",
    },
    {
        key: "/cms/services",
        icon: <ToolOutlined />,
        label: "Services",
    },
    {
        key: "/cms/teams",
        icon: <TeamOutlined />,
        label: "Teams",
    },
    {
        key: "/cms/settings",
        icon: <SettingOutlined />,
        label: "Settings",
    },
];

export const ROUTE_LABELS: Record<string, string> = {
    cms: "Home",
    settings: "Settings",
    projects: "Projects",
    services: "Services",
    create: "Create",
    edit: "Edit",
};