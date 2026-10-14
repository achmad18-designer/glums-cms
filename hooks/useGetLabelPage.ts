import { ROUTE_LABELS } from "@/config/menu";
import { usePathname } from "next/navigation";

export const useGetLabelPage = () => {
    const pathname = usePathname();
    let label: string = "";

    const segments = pathname.split("/").filter(Boolean);

    segments.slice(1).forEach((segment, index, array) => {
        const labelFromSegments =
            ROUTE_LABELS[segment] ??
            segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        label = labelFromSegments;
    });

    return { label };
};