import { put } from '@vercel/blob';

export async function uploadFile(file: File) {
    const filename = `${crypto.randomUUID()}-${file.name}`;

    const blob = await put(filename, file, {
        access: 'public',
    });

    return {
        name: file.name,
        path: blob.url,
    };
}