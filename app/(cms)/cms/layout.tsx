"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import ProfileMenu from "@/components/ui/ProfileMenu";
import { MENUS } from "@/config/menu";
import { useGetLabelPage } from "@/hooks/useGetLabelPage";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
    Button,
    Flex,
    Layout,
    Menu,
    type MenuProps,
    theme,
    Typography,
} from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

interface Props {
    readonly children: React.ReactNode;
}

type MenuItem = NonNullable<MenuProps["items"]>[number];

const getMenuItems = (
    items: typeof MENUS,
): Array<{ key: string; parentKey?: string }> => {
    return items.flatMap((item) => {
        if (!item || !("key" in item) || typeof item.key !== "string") {
            return [];
        }

        const current = {
            key: item.key,
        };

        const children =
            "children" in item && item.children
                ? getMenuItems(item.children as typeof MENUS).map(
                    (child) => ({
                        ...child,
                        parentKey: child.parentKey ?? item.key,
                    }),
                )
                : [];

        return [current, ...children];
    });
};

export default function LayoutCMS({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const { label } = useGetLabelPage();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = useMemo(
        () => getMenuItems(MENUS),
        [],
    );

    const selectedKey = useMemo(() => {
        return (
            menuItems
                .filter(
                    ({ key }) =>
                        pathname === key ||
                        (key !== "/cms" &&
                            pathname.startsWith(`${key}/`)),
                )
                .sort((a, b) => b.key.length - a.key.length)[0]?.key ??
            "/cms"
        );
    }, [menuItems, pathname]);

    const selectedParentKey = useMemo(() => {
        return menuItems.find(
            ({ key }) =>
                key === selectedKey &&
                menuItems.some(
                    (item) => item.parentKey === key,
                ),
        )?.key;
    }, [menuItems, selectedKey]);

    const [manualOpenKeys, setManualOpenKeys] = useState<string[]>([]);

    const openKeys = useMemo(() => {
        const selectedItem = menuItems.find(
            ({ key }) => key === selectedKey,
        );

        const parentKey = selectedItem?.parentKey;

        return Array.from(
            new Set([
                ...manualOpenKeys,
                ...(parentKey ? [parentKey] : []),
                ...(selectedParentKey ? [selectedParentKey] : []),
            ]),
        );
    }, [manualOpenKeys, menuItems, selectedKey, selectedParentKey]);

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        router.push(String(key));
    };

    const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
        setManualOpenKeys(keys as string[]);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="flex h-23 w-full items-center justify-center">
                    <Image
                        src="/img/logo.png"
                        alt="logo"
                        width={50}
                        height={50}
                    />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    items={MENUS as MenuItem[]}
                    selectedKeys={[selectedKey]}
                    openKeys={collapsed ? [] : openKeys}
                    onOpenChange={handleOpenChange}
                    onClick={handleMenuClick}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: 28,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="default"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 34,
                            height: 34,
                            padding: 0,
                            position: "absolute",
                            transform: "translateX(-46px)",
                        }}
                    />

                    <Flex justify="end">
                        <ProfileMenu />
                    </Flex>
                </Header>

                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Flex gap="middle" vertical>
                        <Title level={3}>{label}</Title>
                        <Breadcrumb />
                    </Flex>

                    <div className="mt-2">{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
}