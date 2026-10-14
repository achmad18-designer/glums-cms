
"use client";

import { ROUTE_LABELS } from "@/config/menu";
import { HomeOutlined } from "@ant-design/icons";
import type { BreadcrumbProps } from "antd";
import { Breadcrumb as AntBreadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    items?: BreadcrumbProps["items"];
    homeHref?: string;
}

export default function Breadcrumb({
    items,
    homeHref = "/cms",
}: Readonly<Props>) {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const generatedItems: BreadcrumbProps["items"] = [
        {
            title: (
                <Link href={homeHref}>
                    <HomeOutlined />
                    <span className="ml-2">Home</span>
                </Link>
            ),
        },
        ...segments
            .slice(1)
            .map((segment, index, array) => {
                const href =
                    "/" + segments.slice(0, index + 2).join("/");

                const label =
                    ROUTE_LABELS[segment] ??
                    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

                const isLast = index === array.length - 1;

                return {
                    title: isLast ? (
                        label
                    ) : (

                        <Link href={href}>
                            <span className="ml-2">{label}</span>
                        </Link>
                    ),
                };
            }),
    ];

    return (
        <AntBreadcrumb items={items ?? generatedItems} />
    );
}