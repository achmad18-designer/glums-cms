"use client";

import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { DropdownProps, MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

type MenuTypeAction = {
    actionSetting: () => void;
    actionLogout: () => void;
}

const items = ({
    actionLogout,
    actionSetting
}: MenuTypeAction): MenuProps['items'] => [
        {
            key: '1',
            label: 'Profile',
        },
        {
            key: '2',
            label: 'Settings',
            icon: <SettingOutlined />,
            onClick: () => actionSetting(),
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => actionLogout(),
        },
    ];

const ProfileMenu: React.FC = () => {
    const router = useRouter();
    const modalProfileSetting = () => {
        console.log('modalProfileSetting');
    };

    const sharedProps: DropdownProps = {
        menu: {
            items: items(
                {
                    actionLogout: () => router.push('/auth/login'),
                    actionSetting: modalProfileSetting
                }
            )
        },
        placement: 'bottomLeft'
    };

    return (
        <Dropdown {...sharedProps} trigger={['click']}>
            <Button type="primary" shape='circle'>
                FF
            </Button>
        </Dropdown>
    );
};

export default ProfileMenu;