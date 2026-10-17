'use client';
import TableSearch from '@/components/ui/TableSearch';
import { useTableSearch } from '@/hooks/useTableSearch';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex } from 'antd';
import { useCallback } from 'react';
import ModalForm from './components/ModalForm';
import Table from './components/Table';
import { useModal } from './hooks/useModal';
import { ProjectType } from './types/data.type';
import useGetListProject from './hooks/useGetProjectsQuery';

export default function ProjectsPage() {
    const {
        data = [],
        isLoading
    } = useGetListProject();

    const getSearchValue = useCallback(
        (project: ProjectType) =>
            [
                project.name,
            ]
                .filter(Boolean)
                .join(" "),
        [],
    );
    const openCreate = useModal((state) => state.openCreate);
    const { search, setSearch, filteredData } = useTableSearch(data, getSearchValue);

    if (isLoading) {
        return <p>Loading projects...</p>;
    }

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
                    data={filteredData}
                    loading={isLoading}
                />
            </Flex>
        </Card>
    )
}
