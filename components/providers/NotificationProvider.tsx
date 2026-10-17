"use client";

import { notification } from "antd";
import { createContext, useContext } from "react";

type NotificationApi = ReturnType<
    typeof notification.useNotification
>[0];

const NotificationContext =
    createContext<NotificationApi | null>(null);

export function NotificationProvider({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    const [api, contextHolder] = notification.useNotification({
        duration: 3,
        showProgress: true
    });

    return (
        <NotificationContext.Provider value={api}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

export function useAppNotification() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useAppNotification must be used within NotificationProvider",
        );
    }

    return context;
}