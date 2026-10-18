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
import useGetListServicesQuery from './hooks/useGetListServicesQuery';

export default function ServicesPage() {
    const {
        data = [],
        isLoading
    } = useGetListServicesQuery();
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
                <Table
                    loading={isLoading}
                    data={filteredData}
                />
            </Flex>
        </Card>
    )
}
