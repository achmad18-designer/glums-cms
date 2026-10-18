"use client";

import {
  UploadOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Spin,
  Typography,
  Upload
} from "antd";
import { useEffect, useState } from "react";

import { useAppNotification } from "@/components/providers/NotificationProvider";
import { NamePath } from "antd/es/form/interface";
import { useCreateServiceMutation } from "../hooks/useCreateServiceMutation";
import useGetDetailServiceQuery from "../hooks/useGetDetailServiceQuery";
import { useModal } from "../hooks/useModal";
import type {
  ServiceFormValues
} from "../schemas/service.schema";
import {
  serviceFormSchema
} from "../schemas/service.schema";
import { useUpdateServiceMutation } from "../hooks/useUpdateServiceMutation";

const { TextArea } = Input;
const { Title } = Typography;

const normalizeFileList = (
  event: { fileList?: UploadFile[] } | UploadFile[],
): UploadFile[] => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList ?? [];
};

/**
 * Membuat UploadFile dari path gambar yang sudah tersimpan.
 * File existing tidak perlu di-upload ulang.
 */
const getExistingFile = (
  path: string | null | undefined,
  index = 0,
): UploadFile[] => {
  if (!path) {
    return [];
  }

  return [
    {
      uid: `existing-${index}-${path}`,
      name: path.split("/").pop() || `image-${index + 1}`,
      status: "done",
      url: path,
    },
  ];
};


const ModalForm = () => {
  const notification = useAppNotification();
  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const modal = useModal((state) => state.modal);
  const closeModal = useModal((state) => state.closeModal);

  const [form] = Form.useForm<ServiceFormValues>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const isModalOpen = modal !== null;
  const isEdit = modal?.formAction === "edit";

  const serviceId = isEdit ? modal.id : undefined;

  const {
    data: service,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetDetailServiceQuery(
    serviceId,
    isModalOpen && isEdit,
  );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Reset form ketika modal dibuka atau ID edit berubah.
    form.resetFields();

    if (!isEdit || !service) {
      return;
    }

    form.setFieldsValue({
      serviceName: service.serviceName,
      excerpt: service.excerpt,
      subExcerpt: service.subExcerpt,
      desc: service.desc,
      service_banner: getExistingFile(service.serviceBannerPath),
    });
  }, [isModalOpen, isEdit, serviceId, service, form]);

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  const singleImageUploadProps: UploadProps = {
    name: "file",
    listType: "picture",
    accept: "image/*",
    maxCount: 1,
    beforeUpload: () => false
  };

  const buildProjectFormData = (
    values: ServiceFormValues,
  ): FormData => {
    const formData = new FormData();

    formData.append("serviceName", values.serviceName);
    formData.append("desc", values.desc);
    formData.append("excerpt", values.excerpt);
    formData.append("subExcerpt", values.subExcerpt);

    const appendFile = (
      fieldName: string,
      file?: UploadFile,
    ) => {
      if (file?.originFileObj) {
        formData.append(
          fieldName,
          file.originFileObj,
        );
      }
    };

    appendFile("service_banner", values.service_banner?.[0]);

    return formData;
  };

  const handleFinish = async (
    values: ServiceFormValues,
  ) => {
    // 1. Validasi input form menggunakan Zod.
    const formResult = serviceFormSchema.safeParse(values);

    if (!formResult.success) {
      form.setFields(
        formResult.error.issues.map((issue) => ({
          name: issue.path as NamePath,
          errors: [issue.message],
        })),
      );

      return;
    }

    // 2. Buat FormData.
    const formData = buildProjectFormData(formResult.data);

    if (isEdit && serviceId) {
      updateServiceMutation.mutate({ id: serviceId, formData }, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
          notification.success({
            title: "Success",
            description: "Service updated successfully",
          });
        },
      });
    } else {
      createServiceMutation.mutate(formData, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
          notification.success({
            title: "Success",
            description: "Service created successfully",
          });
        },
      });
    }

  };


  return (
    <>
      <Modal
        title={isEdit ? "Edit Service" : "Create Service"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={765}
        destroyOnHidden
      >
        {
          isEdit && isDetailLoading && (
            <Flex justify="center" style={{ padding: 32 }}>
              <Spin description="Loading service detail" />
            </Flex>
          )
        }

        {
          isEdit && isDetailError && (
            <Alert
              type="error"
              showIcon
              title="Failed to load service detail"
              description={detailError.message}
            />
          )
        }
        <Form<ServiceFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            servcie_banner: [],
          }}
        >
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>

            <Form.Item
              label="Service Name"
              name="serviceName"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your service name!",
                },
              ]}
            >
              <Input placeholder="Digital Marketing" />
            </Form.Item>

            <Card variant="borderless">
              <Title level={5} style={{ marginBottom: 20 }}>
                Service Detail
              </Title>

              <Form.Item
                label="Excerpt"
                name="excerpt"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      "Please input your service excerpt!",
                  },
                ]}
              >
                <TextArea rows={1} />
              </Form.Item>

              <Form.Item
                label="Sub Excerpt"
                name="subExcerpt"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input your sub excerpt!",
                  },
                ]}
              >
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item
                label="Description"
                name="desc"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

            </Card>

            <Form.Item
              name="service_banner"
              label="Service Banner"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
            >
              <Upload {...singleImageUploadProps}>
                <Button icon={<UploadOutlined />}>
                  Upload Banner
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  loading={createServiceMutation.isPending}
                  disabled={
                    createServiceMutation.isPending || updateServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !service))
                  }
                  type="primary"
                  htmlType="submit"
                >
                  {isEdit ? "Update Service" : "Create Service"}
                </Button>

                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  disabled={
                    createServiceMutation.isPending || updateServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !service))
                  }
                >
                  Cancel
                </Button>

                <Button
                  htmlType="button"
                  onClick={() => form.resetFields()}
                  disabled={
                    createServiceMutation.isPending || updateServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !service))
                  }
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      <Image
        alt="Project image preview"
        src={previewImage}
        styles={{
          root: {
            display: "none",
          },
        }}
        preview={{
          open: previewOpen,
          onOpenChange: setPreviewOpen,
          afterOpenChange: (open) => {
            if (!open) {
              setPreviewImage("");
            }
          },
        }}
      />
    </>
  );
};

export default ModalForm;
