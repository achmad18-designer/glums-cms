import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Table as AntTable, Button, Flex, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useModal } from '../hooks/useModal';
import { ColumnsType } from '../types/column.type';
import { ProjectType } from '../types/data.type';

type columnAction = {
    handleDelete: (id: number) => void,
    handleEdit: (id: number) => void
}

const columns = (columnAction: columnAction): TableColumnsType<ColumnsType> => [
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: 'Project Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        defaultSortOrder: "descend",
        sorter: (a, b) => {
            return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
        },
        render: (value: string) => dayjs(value).format("DD MMM YYYY HH:mm"),
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
        },
        render: (value: string) => dayjs(value).format("DD MMM YYYY HH:mm"),
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => {
            return (
                <Flex gap={8}>
                    <Button
                        onClick={() => columnAction.handleEdit(record.id)}
                        type="primary"
                        icon={<EditFilled />}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete the data?"
                        description="Are you sure to delete this data?"
                        onConfirm={() => columnAction.handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button
                            type="primary"
                            icon={<DeleteFilled />}
                            danger
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Flex>
            )
        },
    }
];

interface Props {
    data: ProjectType[]
    loading?: boolean
}

const Table: React.FC<Props> = ({
    data,
    loading
}) => {
    const openEdit = useModal((state) => state.openEdit);

    const handleDelete = (id: number) => {
        console.log('delete: ', id);
    }

    const handleEdit = (id: number) => {
        openEdit(id);
    }

    return (
        <AntTable<ColumnsType>
            rowKey="id"
            columns={columns({
                handleDelete,
                handleEdit
            })}
            dataSource={data}
            loading={loading}
            pagination={
                {
                    pageSize: 8,
                }
            }
        />
    )
}

export default Table;