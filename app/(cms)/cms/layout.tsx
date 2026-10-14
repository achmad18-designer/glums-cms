"use client";
import Breadcrumb from '@/components/ui/Breadcrumb';
import { MENUS } from '@/config/menu';
import { useGetLabelPage } from '@/hooks/useGetLabelPage';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Flex, Layout, Menu, MenuProps, theme, Typography } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

interface Props {
    readonly children: React.ReactNode
}
export default function LayoutCMS({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { label } = useGetLabelPage()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const selectedKey = MENUS?.filter(
        (item) =>
            item &&
            "key" in item &&
            typeof item.key === "string" &&
            (
                pathname === item.key ||
                (item.key !== "/cms" &&
                    pathname.startsWith(`${item.key}/`)
                )
            ),
    ).sort((a, b) => String(b?.key).length - String(a?.key).length)[0]?.key?.toString() ?? "/cms";

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        router.push(key);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="w-full h-23 flex items-center justify-center " >
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
                    items={MENUS}
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 28, background: colorBgContainer }}>
                    {/* <Title level={1}></Title> */}
                    <Button
                        type="default"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 34,
                            height: 34,
                            padding: 0,
                            position: 'absolute',
                            transform: 'translateX(-46px)',
                        }}
                    />
                </Header>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Flex gap="middle" vertical >
                        <Title level={3}>{label}</Title>
                        <Breadcrumb />
                    </Flex>
                    <div className='mt-2'>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
