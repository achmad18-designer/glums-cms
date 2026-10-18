
import type { UploadFile } from "antd";
import { z } from "zod";

const uploadFileSchema = z.custom<UploadFile>(
    (value): value is UploadFile => {
        if (!value || typeof value !== "object") {
            return false;
        }

        return (
            "uid" in value &&
            typeof value.uid === "string" &&
            "name" in value &&
            typeof value.name === "string"
        );
    },
    {
        message: "Invalid uploaded file",
    },
);

const singleImageSchema = z
    .array(uploadFileSchema)
    .max(1, "Only one image is allowed")
    .default([]);

const singleVideoSchema = uploadFileSchema
    .nullable()
    .optional();

export const settingsFormSchema = z.object({
    ptName: z.string().trim().min(1, "Please input your PT Name!"),
    ptAddress: z.string().trim().min(1, "Please input your PT Address!"),
    marquee: z.string().trim().min(1, "Please input your Marquee Running Text!"),
    copyRight: z.string().trim().min(1, "Please input your Copyright!"),
    aboutDesc: z.string().trim().min(1, "Please input the Description!"),
    teamMemberDesc: z.string().trim().min(1, "Please input the Team Member Description!"),
    whatWeDoDesc: z.string().trim().min(1, "Please input the reason!"),

    logo_website: singleImageSchema,
    video_profile: singleVideoSchema,
});

export type SettingsFormValues = z.infer<
    typeof settingsFormSchema
>;
