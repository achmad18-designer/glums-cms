'use client';
import TableSearch from '@/components/ui/TableSearch';
import { useTableSearch } from '@/hooks/useTableSearch';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex } from 'antd';
import { useCallback } from 'react';
import ModalForm from './components/ModalForm';
import Table from './components/Table';
import { useModal } from './hooks/useModal';
import { ServiceType } from './types/data.type';

const data = [
    {
        "id": 17,
        "serviceName": "Digital Marketing",
        "excerpt": "Grow your business. Elevate your brand",
        "subExcerpt": "Content Creation, Website Traffic Analysis, Social Media Management",
        "desc": "Grow your business. Elevate your brand",
        "serviceBannerPath": "http://localhost:3000/uploads/1724193813676-dummy-2.png",
        "serviceBannerName": "1724193813676-dummy-2.png",
        "createdAt": "2024-08-10T23:33:13.000Z",
        "updatedAt": "2024-11-04T00:18:04.000Z"
    },
    {
        "id": 15,
        "serviceName": "Graphic Designing",
        "excerpt": "Grow your business. Elevate your brand",
        "subExcerpt": "Content Creation, Website Traffic Analysis, Social Media Management",
        "desc": "Grow your business. Elevate your brand",
        "serviceBannerPath": "http://localhost:3000/uploads/1724193826227-dummy-3.png",
        "serviceBannerName": "1724193826227-dummy-3.png",
        "createdAt": "2024-08-03T10:47:05.000Z",
        "updatedAt": "2024-11-04T00:18:11.000Z"
    }
];

export default function ServicesPage() {
    const getSearchValue = useCallback(
        (services: ServiceType) =>
            [
                services.serviceName,
            ]
                .filter(Boolean)
                .join(" "),
        [],
    );
    const openCreate = useModal((state) => state.openCreate);
    const { search, setSearch, filteredData } = useTableSearch(data, getSearchValue);

    return (
        <Card>
            <ModalForm />

            <Flex vertical gap="medium">
                <Flex justify="space-between" align='center'>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        iconPlacement='end'
                        onClick={openCreate}
                    >
                        Create
                    </Button>
                    <TableSearch
                        value={search}
                        onChange={setSearch}
                        placeholder="Search projects..."
                    />
                </Flex>

                {/* table */}
                <Table data={filteredData} />
            </Flex>
        </Card>
    )
}
