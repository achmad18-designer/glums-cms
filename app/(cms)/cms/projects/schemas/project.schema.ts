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
export const projectFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Please input your project name!"),

    serviceId: z
        .number({
            error: "Please select service type!",
        })
        .int("Service ID must be an integer")
        .positive("Please select a valid service type"),

    desc: z
        .string()
        .trim()
        .min(1, "Please input your project description!"),

    caseStudy: z
        .string()
        .trim()
        .min(1, "Please input your case study!"),

    why: z
        .string()
        .trim()
        .min(1, "Please input the reason!"),

    logo_project: singleImageSchema,

    banner_project: singleImageSchema,

    img_why: singleImageSchema,

    images: z
        .array(uploadFileSchema)
        .max(8, "Maximum 8 images allowed")
        .default([]),
});

export type ProjectFormValues = z.infer<
    typeof projectFormSchema
>;

/**
 * Payload yang dikirim ke API.
 *
 * images disimpan sebagai comma-separated string,
 * sesuai struktur tabel saat ini.
 */
export const projectPayloadSchema = z.object({
    name: z.string().trim().min(1),
    serviceId: z.number().int().positive(),
    desc: z.string().trim().min(1),
    caseStudy: z.string().trim().min(1),
    why: z.string().trim().min(1),

    logoProjectPath: z.string(),
    bannerProjectPath: z.string(),
    imgWhyPath: z.string(),

    // Multiple image paths disimpan sebagai string
    // yang dipisahkan koma.
    images: z.string(),
});

export type ProjectPayload = z.infer<
    typeof projectPayloadSchema
>;