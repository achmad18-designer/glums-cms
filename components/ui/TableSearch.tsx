"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface TableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function TableSearch({
    value,
    onChange,
    placeholder = "Search...",
    className = "w-full sm:max-w-sm",
}: Readonly<TableSearchProps>) {
    return (
        <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={className}
        />
    );
}