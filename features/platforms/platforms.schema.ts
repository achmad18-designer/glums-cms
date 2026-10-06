import { z } from 'zod';

export const createPlatformSchema = z.object({
    platform: z.string().min(1, 'Platform is required'),
    link: z.string().url().refine((value) => {
        try {
            new URL(value);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }, 'Invalid URL'),
});

export const updatePlatformSchema = z.object({
    platform: z.string().min(1).optional(),
    link: z.string().url().refine((value) => {
        try {
            new URL(value);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }, 'Invalid URL').optional(),
});

export type CreatePlatformInput = z.infer<
    typeof createPlatformSchema
>;

export type UpdatePlatformInput = z.infer<
    typeof updatePlatformSchema
>;