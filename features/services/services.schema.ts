import { z } from 'zod';

export const createServiceSchema = z.object({
    serviceName: z.string({
        error: 'Name is required',
    }).min(1, 'Name is required'),

    excerpt: z.string({
        error: 'Excerpt is required',
    }).min(1, 'Excerpt is required'),

    subExcerpt: z.string({
        error: 'Sub Excerpt is required',
    }).min(1, 'Sub Excerpt is required'),

    desc: z.string({
        error: 'Description Excerpt is required',
    }).min(1, 'Description Excerpt is required'),
});
export const updateServiceSchema = z.object({
    serviceName: z.string({
        error: 'Name is required',
    }).min(1, 'Name is required').optional(),

    excerpt: z.string({
        error: 'Excerpt is required',
    }).min(1, 'Excerpt is required').optional(),

    subExcerpt: z.string({
        error: 'Sub Excerpt is required',
    }).min(1, 'Sub Excerpt is required').optional(),

    desc: z.string({
        error: 'Description Excerpt is required',
    }).min(1, 'Description Excerpt is required').optional(),
});