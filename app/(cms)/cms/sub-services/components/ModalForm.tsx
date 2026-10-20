"use client";

import {
  UploadOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  Alert,
  Button,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Upload
} from "antd";
import { useEffect, useState } from "react";

import { useAppNotification } from "@/components/providers/NotificationProvider";
import { NamePath } from "antd/es/form/interface";
import useGetListServicesQuery from "../../services/hooks/useGetListServicesQuery";
import { useCreateSubServiceMutation } from "../hooks/useCreateSubServiceMutation";
import useGetDetailSubServiceQuery from "../hooks/useGetDetailSubServiceQuery";
import { useModal } from "../hooks/useModal";
import { useUpdateSubServiceMutation } from "../hooks/useUpdateSubServiceMutation";
import type {
  SubServiceFormValues
} from "../schemas/sub-service.schema";
import {
  subServiceFormSchema
} from "../schemas/sub-service.schema";

const { TextArea } = Input;

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
  const createSubServiceMutation = useCreateSubServiceMutation();
  const updateSubServiceMutation = useUpdateSubServiceMutation();
  const servicesListData = useGetListServicesQuery()

  const modal = useModal((state) => state.modal);
  const closeModal = useModal((state) => state.closeModal);

  const [form] = Form.useForm<SubServiceFormValues>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const isModalOpen = modal !== null;
  const isEdit = modal?.formAction === "edit";

  const serviceId = isEdit ? modal.id : undefined;

  const {
    data: subService,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetDetailSubServiceQuery(
    serviceId,
    isModalOpen && isEdit,
  );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Reset form ketika modal dibuka atau ID edit berubah.
    form.resetFields();

    if (!isEdit || !subService) {
      return;
    }

    form.setFieldsValue({
      subServiceName: subService.subServiceName,
      subServiceDesc: subService.subServiceDesc,
      serviceId: subService.serviceId,
      sub_service_banner: getExistingFile(subService.subServiceBannerPath),
    });
  }, [isModalOpen, isEdit, serviceId, subService, form]);

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
    values: SubServiceFormValues,
  ): FormData => {
    const formData = new FormData();

    formData.append("subServiceName", values.subServiceName);
    formData.append("subServiceDesc", values.subServiceDesc);
    formData.append("serviceId", String(values.serviceId));

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

    appendFile("sub_service_banner", values.sub_service_banner?.[0]);

    return formData;
  };

  const handleFinish = async (
    values: SubServiceFormValues,
  ) => {
    // 1. Validasi input form menggunakan Zod.
    const formResult = subServiceFormSchema.safeParse(values);

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
      updateSubServiceMutation.mutate({ id: serviceId, formData }, {
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
      createSubServiceMutation.mutate(formData, {
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
        <Form<SubServiceFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            sub_servcie_banner: [],
          }}
        >
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>

            <Form.Item
              name="serviceId"
              label="Service Type"
              rules={[
                {
                  required: true,
                  message: "Please select service type!",
                },
              ]}
            >
              <Select
                placeholder="Please select a service type"
                options={servicesListData?.data?.map((service) => ({
                  label: service.serviceName,
                  value: service.id,
                }))}
                loading={servicesListData.isLoading}
              />
            </Form.Item>

            <Form.Item
              label="Sub Service Name"
              name="subServiceName"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your sub service name!",
                },
              ]}
            >
              <Input placeholder="Digital Marketing" />
            </Form.Item>

            <Form.Item
              label="Sub Service Description"
              name="subServiceDesc"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message:
                    "Please input your sub service description!",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>


            <Form.Item
              name="sub_service_banner"
              label="Sub Service Banner"
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
                  loading={createSubServiceMutation.isPending}
                  disabled={
                    createSubServiceMutation.isPending || updateSubServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !subService))
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
                    createSubServiceMutation.isPending || updateSubServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !subService))
                  }
                >
                  Cancel
                </Button>

                <Button
                  htmlType="button"
                  onClick={() => form.resetFields()}
                  disabled={
                    createSubServiceMutation.isPending || updateSubServiceMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !subService))
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
