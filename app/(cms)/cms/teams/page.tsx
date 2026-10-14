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

const data = [
    {
        "id": 22,
        "name": "Fadil F",
        "username": "fadilf@email.com",
        "role": "developer",
        "desc": "ini adalah deskripsi",
        "email": "fadilf@email.com",
        "img": "test-img-transaction-3.jpeg",
        "imgPath": "https://0yokw9ghgueyl1md.public.blob.vercel-storage.com/b703c716-5f39-4a51-91b1-4b0607519cbf-test-img-transaction-3.jpeg",
        "createdAt": "2026-10-08T07:09:29.821Z",
        "updatedAt": "2026-10-08T07:09:29.821Z"
    },
    {
        "id": 18,
        "name": "Jhon Doe",
        "username": "johndoe@email.com",
        "role": "developer",
        "desc": "ini adalah deskripsi",
        "email": "johndoe@email.com",
        "img": "johan-1.png",
        "imgPath": "https://0yokw9ghgueyl1md.public.blob.vercel-storage.com/dd84a3e8-9fd2-4b37-b76b-605af69d80f7-johan-1.png",
        "createdAt": "2026-10-01T08:18:48.364Z",
        "updatedAt": "2026-10-01T08:18:48.364Z"
    },
];

export default function TeamsPage() {
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
