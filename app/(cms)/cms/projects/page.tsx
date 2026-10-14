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
        "id": 18,
        "name": "Moderna",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "caseStudy": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "why": "Why Moderna",
        "logoProjectName": "1724193522756-Moderna--Inc-.png",
        "logoProjectPath": "http://localhost:3000/uploads/1724193522756-Moderna--Inc-.png",
        "bannerProjectName": "1724193522757-img-one.png",
        "bannerProjectPath": "http://localhost:3000/uploads/1724193522757-img-one.png",
        "imgWhyName": "1724193522799-img-two.png",
        "imgWhyPath": "http://localhost:3000/uploads/1724193522799-img-two.png",
        "images": "http://localhost:3000/uploads/1724193522823-about-profile.png,http://localhost:3000/uploads/1724193522831-about-profile2.png,http://localhost:3000/uploads/1724193522836-img-three.png",
        "serviceId": 15,
        "createdAt": "2024-08-20T15:38:42.000Z",
        "updatedAt": "2024-08-20T15:38:42.000Z"
    },
    {
        "id": 17,
        "name": "Marriott International",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "caseStudy": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "why": "Why Marriott International",
        "logoProjectName": "1724193387182-Marriott-International.png",
        "logoProjectPath": "http://localhost:3000/uploads/1724193387182-Marriott-International.png",
        "bannerProjectName": "1724193387182-dummy-4.png",
        "bannerProjectPath": "http://localhost:3000/uploads/1724193387182-dummy-4.png",
        "imgWhyName": "1724193387186-dummy-2.png",
        "imgWhyPath": "http://localhost:3000/uploads/1724193387186-dummy-2.png",
        "images": "http://localhost:3000/uploads/1724193387190-dummy-1.png,http://localhost:3000/uploads/1724193387196-dummy-2.png,http://localhost:3000/uploads/1724193387200-dummy-3.png",
        "serviceId": 15,
        "createdAt": "2024-08-20T15:36:27.000Z",
        "updatedAt": "2024-08-20T15:36:27.000Z"
    },
];

export default function ProjectsPage() {
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
