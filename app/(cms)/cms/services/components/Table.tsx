import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Table as AntTable, Button, Flex, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useModal } from '../hooks/useModal';
import { ColumnsType } from '../types/column.type';
import { ServiceType } from '../types/data.type';
import { useAppNotification } from '@/components/providers/NotificationProvider';
import useDeleteServiceMutation from '../hooks/useDeleteProjectMutation';

type columnAction = {
    handleDelete: (id: number) => void,
    handleEdit: (id: number) => void,
    deletingId?: number;
}

const columns = (columnAction: columnAction): TableColumnsType<ColumnsType> => [
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: 'Service Name',
        dataIndex: 'serviceName',
        sorter: (a, b) => a.serviceName.length - b.serviceName.length,
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
                        disabled={columnAction.deletingId === record.id}
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
                            loading={columnAction.deletingId === record.id}
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
    data: ServiceType[]
    loading?: boolean
}

const Table: React.FC<Props> = ({
    data,
    loading
}) => {
    const deleteMutation = useDeleteServiceMutation();
    const openEdit = useModal((state) => state.openEdit);
    const notification = useAppNotification();

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                notification.success({
                    description: "Service deleted successfully",
                });
            },
            onError: (error) => {
                console.error("Delete Service error:", error);
                notification.error({
                    title: "Failed to delete Service",
                    description: error.message,
                });
            },
        });
    };

    const handleEdit = (id: number) => {
        openEdit(id);
    }

    return (
        <AntTable<ColumnsType>
            rowKey="id"
            columns={columns({
                handleDelete,
                handleEdit,
                deletingId: deleteMutation.isPending
                    ? deleteMutation.variables
                    : undefined,
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