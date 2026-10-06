import { put } from "@vercel/blob";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {
            return Response.json(
                {
                    message: "File is required",
                },
                {
                    status: 400,
                },
            );
        }

        const blob = await put(
            `glums-test/${Date.now()}-${file.name}`,
            file,
            {
                access: "public",
            },
        );

        return Response.json(
            {
                message: "File uploaded successfully",
                file: blob,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Upload error:", error);

        return Response.json(
            {
                message: "Failed to upload file",
            },
            {
                status: 500,
            },
        );
    }
}