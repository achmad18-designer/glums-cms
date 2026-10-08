'use client';

import { ConfigProvider } from 'antd';
import { antdTheme } from '@/config/antd-theme';

type AntdProviderProps = {
    readonly children: React.ReactNode;
};

export default function AntdProvider({
    children,
}: AntdProviderProps) {
    return (
        <ConfigProvider theme={antdTheme}>
            {children}
        </ConfigProvider>
    );
}