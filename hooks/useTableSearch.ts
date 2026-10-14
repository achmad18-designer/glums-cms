"use client";

import { useMemo, useState } from "react";

export function useTableSearch<T>(
    data: T[],
    getSearchValue: (item: T) => string,
) {
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return data;

        return data.filter((item) =>
            getSearchValue(item).toLowerCase().includes(keyword),
        );
    }, [data, search, getSearchValue]);

    return {
        search,
        setSearch,
        filteredData,
    };
}