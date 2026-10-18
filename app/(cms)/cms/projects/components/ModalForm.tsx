"use client";

import {
  PlusOutlined,
  UploadOutlined,
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
  Select,
  Space,
  Spin,
  Typography,
  Upload
} from "antd";
import { useEffect, useState } from "react";

import { useAppNotification } from "@/components/providers/NotificationProvider";
import { NamePath } from "antd/es/form/interface";
import { useCreateProjectMutation } from "../hooks/useCreateProjectMutation";
import useGetProjectDetail from "../hooks/useGetProjectDetailQuery";
import { useModal } from "../hooks/useModal";
import type {
  ProjectFormValues
} from "../schemas/project.schema";
import {
  projectFormSchema
} from "../schemas/project.schema";
import useGetListServicesQuery from "../hooks/useGetListServicesQuery";
import { useUpdateProjectMutation } from "../hooks/useUpdateProjectMutation";

const { TextArea } = Input;
const { Title } = Typography;

const MAX_IMAGES = 8;


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
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();

  const modal = useModal((state) => state.modal);
  const closeModal = useModal((state) => state.closeModal);

  const [form] = Form.useForm<ProjectFormValues>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const isModalOpen = modal !== null;
  const isEdit = modal?.formAction === "edit";

  const projectId: number | undefined = isEdit ? modal.id : undefined;

  const servicesListData = useGetListServicesQuery()

  const {
    data: project,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetProjectDetail(
    projectId,
    isModalOpen && isEdit,
  );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Reset form ketika modal dibuka atau ID edit berubah.
    form.resetFields();

    if (!isEdit || !project) {
      return;
    }

    form.setFieldsValue({
      name: project.name,
      serviceId: project.serviceId,
      desc: project.desc,
      caseStudy: project.caseStudy,
      why: project.why,
      logo_project: getExistingFile(project.logoProjectPath),
      banner_project: getExistingFile(project.bannerProjectPath),
      img_why: getExistingFile(project.imgWhyPath),
      images: (project.images || "")
        .split(",")
        .map((path) => path.trim())
        .filter(Boolean)
        .map((path, index) => ({
          uid: `existing-image-${index}-${path}`,
          name: path.split("/").pop() || `image-${index + 1}`,
          status: "done" as const,
          url: path,
        })),
    });
  }, [isModalOpen, isEdit, projectId, project, form]);

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

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

  const singleImageUploadProps: UploadProps = {
    name: "file",
    listType: "picture",
    accept: "image/*",
    maxCount: 1,
    beforeUpload: () => false
  };


  const buildProjectFormData = (
    values: ProjectFormValues,
  ): FormData => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("desc", values.desc);
    formData.append("caseStudy", values.caseStudy);
    formData.append("why", values.why);
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

    appendFile("logo_project", values.logo_project?.[0]);
    appendFile("banner_project", values.banner_project?.[0]);
    appendFile("img_why", values.img_why?.[0]);

    (values.images ?? []).forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    return formData;
  };

  const handleFinish = async (
    values: ProjectFormValues,
  ) => {
    // 1. Validasi input form menggunakan Zod.
    const formResult = projectFormSchema.safeParse(values);

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

    if (isEdit && projectId) {
      updateProjectMutation.mutate({ id: projectId, formData }, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
          notification.success({
            title: "Success",
            description: "Project updated successfully",
          });
        },

        onError: (error) => {
          console.error("Update project error:", error);
          notification.error({
            title: "Failed to update project",
            description: error.message,
          });
        }
      });
    } else {
      createProjectMutation.mutate(formData, {
        onSuccess: () => {
          closeModal();
          form.resetFields();
          notification.success({
            title: "Success",
            description: "Project created successfully",
          });
        },
        onError: (error) => {
          console.error("Create project error:", error);
          notification.error({
            title: "Failed to Create project",
            description: error.message,
          });
        }
      });
    }

  };


  return (
    <>
      <Modal
        title={isEdit ? "Edit Project" : "Create Project"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={765}
        destroyOnHidden
      >
        {
          isEdit && isDetailLoading && (
            <Flex justify="center" style={{ padding: 32 }}>
              <Spin description="Loading project detail" />
            </Flex>
          )
        }

        {
          isEdit && isDetailError && (
            <Alert
              type="error"
              showIcon
              title="Failed to load project detail"
              description={detailError.message}
            />
          )
        }
        <Form<ProjectFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            logo_project: [],
            banner_project: [],
            img_why: [],
            images: [],
          }}
        >
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>

            <Form.Item
              label="Project Name"
              name="name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your project name!",
                },
              ]}
            >
              <Input placeholder="Glums ID" />
            </Form.Item>

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

            <Card variant="borderless">
              <Title level={5} style={{ marginBottom: 20 }}>
                Project Detail
              </Title>

              <Form.Item
                label="Description"
                name="desc"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      "Please input your project description!",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Case Study"
                name="caseStudy"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input your case study!",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Card variant="borderless">
                <Form.Item
                  label="Reason"
                  name="why"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input the reason!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  name="img_why"
                  label="Reason Image"
                  valuePropName="fileList"
                  getValueFromEvent={normalizeFileList}
                >
                  <Upload {...singleImageUploadProps}>
                    <Button icon={<UploadOutlined />}>
                      Upload Reason Image
                    </Button>
                  </Upload>
                </Form.Item>
              </Card>
            </Card>

            <Form.Item
              name="logo_project"
              label="Logo Project"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
            >
              <Upload {...singleImageUploadProps}>
                <Button icon={<UploadOutlined />}>
                  Upload Logo
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="banner_project"
              label="Banner Project"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
            >
              <Upload {...singleImageUploadProps}>
                <Button icon={<UploadOutlined />}>
                  Upload Banner
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="images"
              label="Other Images"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
            >
              <Upload
                name="file"
                listType="picture-card"
                accept="image/*"
                multiple
                maxCount={MAX_IMAGES}
                onPreview={handlePreview}
                beforeUpload={() => false}
              >
                <button
                  type="button"
                  style={{
                    border: 0,
                    background: "none",
                  }}
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  loading={createProjectMutation.isPending}
                  disabled={
                    createProjectMutation.isPending || updateProjectMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !project))
                  }
                  type="primary"
                  htmlType="submit"
                >
                  {isEdit ? "Update Project" : "Create Project"}
                </Button>

                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  disabled={
                    createProjectMutation.isPending || updateProjectMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !project))
                  }
                >
                  Cancel
                </Button>

                <Button
                  htmlType="button"
                  onClick={() => form.resetFields()}
                  disabled={
                    createProjectMutation.isPending || updateProjectMutation.isPending ||
                    (isEdit && (isDetailLoading || isDetailError || !project))
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
