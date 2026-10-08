import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const antdTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,

    token: {
        colorPrimary: '#6366f1',

        colorBgBase: '#0f172a',
        colorBgContainer: '#111827',
        colorBgElevated: '#1f2937',

        colorTextBase: '#f8fafc',
        colorText: '#e5e7eb',
        colorTextSecondary: '#9ca3af',

        colorBorder: '#374151',
        colorBorderSecondary: '#1f2937',

        borderRadius: 8,

        fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    components: {
        Layout: {
            headerBg: '#111827',
            siderBg: '#0f172a',
            bodyBg: '#0f172a',
            footerBg: '#0f172a',
        },

        Menu: {
            darkItemBg: '#0f172a',
            darkSubMenuItemBg: '#111827',
            darkItemSelectedBg: '#312e81',
            darkItemHoverBg: '#1e293b',
            darkItemColor: '#cbd5e1',
            darkItemSelectedColor: '#ffffff',
        },

        Card: {
            colorBgContainer: '#111827',
        },

        Table: {
            colorBgContainer: '#111827',
            headerBg: '#1f2937',
            rowHoverBg: '#1e293b',
            borderColor: '#374151',
        },

        Input: {
            colorBgContainer: '#111827',
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#818cf8',
        },

        Select: {
            colorBgContainer: '#111827',
        },

        Modal: {
            contentBg: '#111827',
            headerBg: '#111827',
        },

        Drawer: {
            colorBgElevated: '#111827',
        },

        Button: {
            primaryShadow: 'none',
        },
    },
};