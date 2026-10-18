
"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Upload, Typography, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import {
    DeleteOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface UploadVideoFieldProps {
    value?: UploadFile | null;
    onChange?: (file: UploadFile | null) => void;
    existingVideoUrl?: string | null;
    existingVideoName?: string;
    maxSizeMB?: number;
    disabled?: boolean;
}

const ACCEPTED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

export default function UploadVideoField({
    value = null,
    onChange,
    existingVideoUrl,
    existingVideoName = "Video saat ini",
    maxSizeMB = 100,
    disabled = false
}: Readonly<UploadVideoFieldProps>) {
    const [messageApi, contextHolder] = message.useMessage();
    const [localPreviewUrl, setLocalPreviewUrl] =
        useState<string | null>(null);
    const [existingVideoRemoved, setExistingVideoRemoved] =
        useState(false);

    const objectUrlRef = useRef<string | null>(null);

    const clearObjectUrl = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    const handleBeforeUpload: UploadProps["beforeUpload"] = (
        file,
    ) => {
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            messageApi.error(
                "Format video harus MP4, WebM, atau MOV.",
            );
            return Upload.LIST_IGNORE;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            messageApi.error(
                `Ukuran video maksimal ${maxSizeMB} MB.`,
            );
            return Upload.LIST_IGNORE;
        }

        clearObjectUrl();

        const objectUrl = URL.createObjectURL(file);
        objectUrlRef.current = objectUrl;

        setLocalPreviewUrl(objectUrl);
        setExistingVideoRemoved(false);

        const uploadFile: UploadFile = {
            uid: file.uid,
            name: file.name,
            status: "done",
            size: file.size,
            type: file.type,
            originFileObj: file,
        };

        onChange?.(uploadFile);

        // Upload dilakukan saat form disubmit.
        return false;
    };

    const handleRemove = () => {
        clearObjectUrl();
        setLocalPreviewUrl(null);
        setExistingVideoRemoved(true);

        onChange?.(null);
    };

    const previewUrl = value
        ? localPreviewUrl
        : existingVideoRemoved
            ? null
            : existingVideoUrl || null;

    const fileList = value
        ? [
            {
                uid: "video-upload",
                name: value.name,
                status: "done" as const,
                size: value.size,
                type: value.type,
            },
        ]
        : [];

    return (
        <div className="space-y-3">
            {contextHolder}

            <Upload
                accept="video/mp4,video/webm,video/quicktime"
                maxCount={1}
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                disabled={disabled}
                showUploadList={false}
            >
                <Button
                    icon={<VideoCameraOutlined />}
                    disabled={disabled || Boolean(value)}
                >
                    {previewUrl ? "Ganti Video" : "Pilih Video"}
                </Button>
            </Upload>

            <Text type="secondary" className="block">
                Format MP4, WebM, atau MOV. Maksimal {maxSizeMB} MB.
            </Text>

            {previewUrl && (
                <div className="max-w-xl space-y-2">
                    <Text strong>Preview Video</Text>

                    <video
                        key={previewUrl}
                        src={previewUrl}
                        controls
                        preload="metadata"
                        className="w-full rounded-lg border"
                    >
                        Browser tidak mendukung pemutaran video.
                    </video>

                    <div className="flex items-center justify-between gap-3">
                        <Text type="secondary" ellipsis>
                            {value?.name ?? existingVideoName}
                        </Text>

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={disabled}
                            onClick={handleRemove}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
