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
  Space,
  Spin,
  Upload
} from "antd";
import { useEffect, useState } from "react";

import { useAppNotification } from "@/components/providers/NotificationProvider";
import { NamePath } from "antd/es/form/interface";
import { useCreateTeamMutation } from "../hooks/useCreateTeamMutation";
import useGetDetailTeamQuery from "../hooks/useGetDetailTeamQuery";
import { useModal } from "../hooks/useModal";
import type {
  TeamFormValues
} from "../schemas/team.schema";
import {
  teamFormSchema
} from "../schemas/team.schema";
import { useUpdateTeamMutation } from "../hooks/useUpdateTeamMutation";

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
  const createTeamMutation = useCreateTeamMutation();
  const updateTeameMutation = useUpdateTeamMutation();
  const modal = useModal((state) => state.modal);
  const closeModal = useModal((state) => state.closeModal);

  const [form] = Form.useForm<TeamFormValues>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview: UploadProps["onPreview"] = async (
    file,
  ) => {
    let src = file.url || file.thumbUrl;

    if (!src && file.originFileObj) {
      src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to preview image"));
          }
        };

        reader.onerror = () => {
          reject(reader.error);
        };

        reader.readAsDataURL(file.originFileObj as File);
      });
    }

    if (src) {
      setPreviewImage(src);
      setPreviewOpen(true);
    }
  };

  const isModalOpen = modal !== null;
  const isEdit = modal?.formAction === "edit";

  const userId = isEdit ? modal.id : undefined;

  const {
    data: user,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetDetailTeamQuery(
    userId,
    isModalOpen && isEdit,
  );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Reset form ketika modal dibuka atau ID edit berubah.
    form.resetFields();

    if (!isEdit || !user) {
      return;
    }

    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      desc: user.desc,
      img: getExistingFile(user.imgPath),
    });
  }, [isModalOpen, isEdit, userId, user, form]);

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  const singleImageUploadProps: UploadProps = {
    name: "file",
    listType: "picture-card",
    accept: "image/*",
    maxCount: 1,
    onPreview: handlePreview,
    beforeUpload: () => false,
  };

  const buildProjectFormData = (
    values: TeamFormValues,
  ): FormData => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("desc", values.desc);
    formData.append("email", values.email);
    formData.append("role", values.role);

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

    appendFile("img", values.img?.[0]);

    return formData;
  };

  const handleFinish = async (
    values: TeamFormValues,
  ) => {
    // 1. Validasi input form menggunakan Zod.
    const formResult = teamFormSchema.safeParse(values);

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

    if (isEdit && userId) {
      updateTeameMutation.mutate({ id: userId, formData }, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
        },
      });
    } else {
      createTeamMutation.mutate(formData, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
        },
      });
    }

  };


  return (
    <>
      <Modal
        title={isEdit ? "Edit Team" : "Create Team"}
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
        <Form<TeamFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>

            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input placeholder="Jhon Doe" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please input valid email!",
                },
              ]}
            >
              <Input placeholder="jL4kS@example.com" />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your role!",
                }
              ]}
            >
              <Input placeholder="Software Engineer" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="desc"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input description!",
                }
              ]}
            >
              <TextArea rows={2} placeholder="Lorem ipsum dolor sit amet" />
            </Form.Item>

            <Form.Item
              name="img"
              label="Profile Picture"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
            >
              <Upload
                {...singleImageUploadProps}>
                <Space>
                  <UploadOutlined />
                  Upload
                </Space>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  loading={createTeamMutation.isPending}
                  disabled={
                    createTeamMutation.isPending || updateTeameMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !user))
                  }
                  type="primary"
                  htmlType="submit"
                >
                  {isEdit ? "Update Team" : "Create Team"}
                </Button>

                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  disabled={
                    createTeamMutation.isPending || updateTeameMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !user))
                  }
                >
                  Cancel
                </Button>

                <Button
                  htmlType="button"
                  onClick={() => form.resetFields()}
                  disabled={
                    createTeamMutation.isPending || updateTeameMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !user))
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
