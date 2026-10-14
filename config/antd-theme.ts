import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const antdTheme: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,

    token: {
        // Primary
        colorPrimary: '#212121',
        colorPrimaryHover: '#000000',
        colorPrimaryActive: '#000000',

        // Text
        colorTextBase: '#212121',
        colorText: '#212121',
        colorTextSecondary: '#757575',
        colorTextTertiary: '#757575',
        colorTextQuaternary: '#9E9E9E',

        // Background
        colorBgBase: '#FFFFFF',
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#FFFFFF',
        colorBgLayout: '#FFFFFF',
        colorBgSpotlight: '#212121',

        // Border
        colorBorder: '#E0E0E0',
        colorBorderSecondary: '#F5F5F5',

        // Fill
        colorFill: '#F5F5F5',
        colorFillSecondary: '#F5F5F5',
        colorFillTertiary: '#FAFAFA',
        colorFillQuaternary: '#FFFFFF',

        // Link
        colorLink: '#212121',
        colorLinkHover: '#000000',
        colorLinkActive: '#000000',

        borderRadius: 8,

        fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    components: {
        Layout: {
            headerBg: '#FFFFFF',
            siderBg: '#F5F5F5',
            bodyBg: '#FFFFFF',
            footerBg: '#FFFFFF',
        },

        Menu: {
            darkItemBg: '#F5F5F5',
            darkSubMenuItemBg: '#F5F5F5',

            darkItemColor: '#BDBDBD',
            darkItemHoverColor: '#FFFFFF',
            darkItemSelectedColor: '#FFFFFF',

            darkItemHoverBg: '#424242',
            darkItemSelectedBg: '#424242',

            darkDangerItemColor: '#BDBDBD',
            darkDangerItemHoverColor: '#FFFFFF',
        },

        Card: {
            colorBgContainer: '#FFFFFF',
        },

        Table: {
            colorBgContainer: '#FFFFFF',
            headerBg: '#F5F5F5',
            headerColor: '#212121',
            rowHoverBg: '#FAFAFA',
            borderColor: '#E0E0E0',
        },


        Input: {
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E0E0E0',

            activeBorderColor: '#212121',
            hoverBorderColor: '#757575',

            colorText: '#212121',
            colorTextPlaceholder: '#9E9E9E',
        },

        InputNumber: {
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E0E0E0',

            activeBorderColor: '#212121',
            hoverBorderColor: '#757575',
        },

        Select: {
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E0E0E0',

            optionSelectedBg: '#F5F5F5',
            optionActiveBg: '#FAFAFA',
        },

        DatePicker: {
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E0E0E0',

            activeBorderColor: '#212121',
            hoverBorderColor: '#757575',
        },

        Button: {
            primaryShadow: 'none',
        },

        Modal: {
            contentBg: '#FFFFFF',
            headerBg: '#FFFFFF',
            footerBg: '#FFFFFF',
        },

        Drawer: {
            colorBgElevated: '#FFFFFF',
        },

        Dropdown: {
            colorBgElevated: '#FFFFFF',
        },

        Popover: {
            colorBgElevated: '#FFFFFF',
        },

        Tooltip: {
            colorBgSpotlight: '#212121',
            colorTextLightSolid: '#FFFFFF',
        },

        Tag: {
            defaultBg: '#F5F5F5',
            defaultColor: '#212121',
        },

        Pagination: {
            itemBg: '#FFFFFF',
            itemActiveBg: '#212121',
            itemLinkBg: '#FFFFFF',
            itemActiveColor: '#FFFFFF',
            itemActiveColorDisabled: '#9E9E9E',
            itemActiveColorHover: '#757575',
        },

        Form: {
            labelColor: '#212121',
        },

        Breadcrumb: {
            itemColor: '#757575',
            lastItemColor: '#212121',
            linkColor: '#757575',
            linkHoverColor: '#212121',
        },

        Tabs: {
            itemColor: '#757575',
            itemHoverColor: '#212121',
            itemSelectedColor: '#212121',
            inkBarColor: '#212121',
            cardBg: '#FFFFFF',
        },

        Typography: {
            titleMarginBottom: 0
        }
    },
};
