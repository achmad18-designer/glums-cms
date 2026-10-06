import { del } from '@vercel/blob';

export async function removeFile(url?: string | null) {
    if (!url) {
        return;
    }

    await del(url);
}