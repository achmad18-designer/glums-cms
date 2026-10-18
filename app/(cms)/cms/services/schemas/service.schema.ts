import { UploadFile } from "antd";
import { z } from "zod";
/**
 * Validasi satu item upload.
 *
 * File baru dapat memiliki status uploading/done,
 * sedangkan file existing dari server memiliki status done.
 */
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

/**
 * Validasi upload untuk field gambar tunggal.
 * Kosong diperbolehkan karena gambar bisa opsional.
 */
const singleImageSchema = z
    .array(uploadFileSchema)
    .max(1, "Only one image is allowed")
    .default([]);

/**
 * Validasi form sebelum transformasi menjadi payload API.
 */
export const serviceFormSchema = z.object({
    serviceName: z
        .string()
        .trim()
        .min(1, "Please input your service name!"),

    excerpt: z
        .string()
        .trim()
        .min(1, "Please input your service excerpt!"),

    subExcerpt: z
        .string()
        .trim()
        .min(1, "Please input your service sub excerpt!"),

    desc: z
        .string()
        .trim()
        .min(1, "Please input your description service!"),
    service_banner: singleImageSchema,
});

export type ServiceFormValues = z.infer<
    typeof serviceFormSchema
>;