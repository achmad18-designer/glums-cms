'use client';
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
    Space,
    Spin,
    Upload
} from "antd";
import { NamePath } from "antd/es/form/interface";
import { useEffect, useState } from "react";
import UploadVideoField from "./components/UploadVideoField";
import useGetSettingsQuery from "./hooks/useGetSettingsQuery";
import { useUpdateSettingsMutation } from "./hooks/useUpdateSettingsMutation";
import { settingsFormSchema, SettingsFormValues } from "./schemas/settings.schema";

const { TextArea } = Input;

const getFileSignature = (value: unknown): unknown => {
    if (!value) return null;

    if (Array.isArray(value)) {
        return value.map((file) => getFileSignature(file));
    }

    if (typeof value !== "object") {
        return value;
    }

    const file = value as UploadFile;
    const originFile = file.originFileObj;

    return {
        uid: file.uid,
        name: file.name,
        url: file.url,
        status: file.status,
        size: originFile?.size,
        lastModified: originFile?.lastModified,
        type: originFile?.type,
    };
};

const getFormSignature = (values: SettingsFormValues) =>
    JSON.stringify({
        ptName: values.ptName ?? "",
        ptAddress: values.ptAddress ?? "",
        marquee: values.marquee ?? "",
        aboutDesc: values.aboutDesc ?? "",
        copyRight: values.copyRight ?? "",
        teamMemberDesc: values.teamMemberDesc ?? "",
        whatWeDoDesc: values.whatWeDoDesc ?? "",
        logo_website: getFileSignature(values.logo_website),
        video_profile: getFileSignature(values.video_profile),
    });

const normalizeFileList = (
    event: { fileList?: UploadFile[] } | UploadFile[],
): UploadFile[] => {
    if (Array.isArray(event)) {
        return event;
    }

    return event?.fileList ?? [];
};
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

export default function SettingsPage() {
    const updateSettingsMutation = useUpdateSettingsMutation();
    const [form] = Form.useForm<SettingsFormValues>();

    const {
        data: settings,
        isLoading,
        isError,
        error,
    } = useGetSettingsQuery();
    // const [initialValues, setInitialValues] = useState<SettingsFormValues | null>(null);
    // const [isDirty, setIsDirty] = useState(false);

    const watchedValues = Form.useWatch([], form);

    const initialValues: SettingsFormValues | null = settings
        ? {
            ptName: settings.ptName,
            ptAddress: settings.ptAddress,
            marquee: settings.marquee,
            aboutDesc: settings.aboutDesc,
            copyRight: settings.copyRight,
            teamMemberDesc: settings.teamMemberDesc,
            whatWeDoDesc: settings.whatWeDoDesc,
            logo_website: getExistingFile(settings.logoWebsitePath),
            video_profile: null,
        }
        : null;

    const isDirty = Boolean(
        initialValues &&
        watchedValues &&
        getFormSignature(watchedValues as SettingsFormValues) !==
        getFormSignature(initialValues),
    );

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");


    useEffect(() => {
        if (!settings) return;

        form.setFieldsValue({
            ptName: settings.ptName,
            ptAddress: settings.ptAddress,
            marquee: settings.marquee,
            aboutDesc: settings.aboutDesc,
            copyRight: settings.copyRight,
            teamMemberDesc: settings.teamMemberDesc,
            whatWeDoDesc: settings.whatWeDoDesc,
            logo_website: getExistingFile(settings.logoWebsitePath),
            video_profile: null,
        });
    }, [settings, form]);

    const singleImageUploadProps: UploadProps = {
        name: "file",
        listType: "picture-card",
        accept: "image/*",
        maxCount: 1,
        beforeUpload: () => false
    };

    const buildProjectFormData = (
        values: SettingsFormValues,
    ): FormData => {
        const formData = new FormData();
        const video = values.video_profile;

        formData.append("ptName", values.ptName);
        formData.append("ptAddress", values.ptAddress);
        formData.append("aboutDesc", values.aboutDesc);
        formData.append("copyRight", values.copyRight);
        formData.append("marquee", values.marquee);
        formData.append("teamMemberDesc", values.teamMemberDesc);
        formData.append("whatWeDoDesc", values.whatWeDoDesc);

        if (video?.originFileObj) {
            formData.append(
                "video_profile",
                video.originFileObj as File,
            );
        }

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

        appendFile("logo_website", values.logo_website?.[0]);

        return formData;
    };

    const handleFinish = async (
        values: SettingsFormValues,
    ) => {
        // 1. Validasi input form menggunakan Zod.
        const formResult = settingsFormSchema.safeParse(values);

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

        console.log(formData, ": formData");

        // 3. Kirim FormData ke API.
        updateSettingsMutation.mutate(formData);
    };

    const handleCancel = () => {
        if (!initialValues) return;

        form.setFieldsValue(initialValues);
        form.setFields(
            Object.keys(initialValues).map((name) => ({
                name: name as NamePath,
                touched: false,
                errors: [],
            })),
        );
    };


    return (
        <Card>
            {
                isLoading && (
                    <Flex justify="center" style={{ padding: 32 }}>
                        <Spin description="Loading settings" />
                    </Flex>
                )
            }

            {
                isError && (
                    <Alert
                        type="error"
                        showIcon
                        title="Failed to load settings"
                        description={error.message}
                    />
                )
            }

            <Form<SettingsFormValues>
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>

                    <Form.Item
                        label="PT Name"
                        name="ptName"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your pt name!",
                            },
                        ]}
                    >
                        <Input placeholder="PT Name" />
                    </Form.Item>

                    <Form.Item
                        label="PT Address"
                        name="ptAddress"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your pt address!",
                            },
                        ]}
                    >
                        <Input placeholder="Jl. Raya No. 1..." />
                    </Form.Item>

                    <Form.Item
                        label="Marquee Running Text"
                        name="marquee"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your running text!",
                            }
                        ]}
                    >
                        <Input placeholder="Marquee Running Text" />
                    </Form.Item>

                    <Form.Item
                        label="Copy Right Text"
                        name="copyRight"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your copy right!",
                            }
                        ]}
                    >
                        <Input placeholder="Copy Right Text" />
                    </Form.Item>

                    <Form.Item
                        label="About Description"
                        name="aboutDesc"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your about description!",
                            }
                        ]}
                    >
                        <TextArea rows={4} placeholder="Lorem ipsum dolor sit amet" />
                    </Form.Item>

                    <Form.Item
                        label="Team Member Description"
                        name="teamMemberDesc"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your team member description!",
                            }
                        ]}
                    >
                        <TextArea rows={4} placeholder="Lorem ipsum dolor sit amet" />
                    </Form.Item>

                    <Form.Item
                        label="What We Do?"
                        name="whatWeDoDesc"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input your what we do!",
                            }
                        ]}
                    >
                        <TextArea rows={4} placeholder="Lorem ipsum dolor sit amet" />
                    </Form.Item>

                    <Form.Item
                        name="logo_website"
                        label="Logo Website"
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

                    <Form.Item
                        name="video_profile"
                        label="Video Profile"
                    >
                        <UploadVideoField
                            existingVideoUrl={settings?.videoProfilePath}
                            existingVideoName={settings?.videoProfileName}
                            maxSizeMB={100}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                loading={updateSettingsMutation.isPending}
                                disabled={
                                    !isDirty ||
                                    updateSettingsMutation.isPending ||
                                    isLoading ||
                                    isError
                                }
                                type="primary"
                                htmlType="submit"
                            >
                                Save
                            </Button>

                            <Button
                                htmlType="button"
                                onClick={handleCancel}
                                disabled={
                                    !isDirty ||
                                    updateSettingsMutation.isPending ||
                                    isLoading ||
                                    isError
                                }
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Space>
            </Form>

            <Image
                alt="Logo image preview"
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
        </Card>
    )
}
