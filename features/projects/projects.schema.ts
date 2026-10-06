import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string({
        error: 'Name is required',
    }).min(1, 'Name is required'),

    desc: z.string({
        error: 'Description is required',
    }).min(1, 'Description is required'),

    caseStudy: z.string({
        error: 'Case study is required',
    }).min(1, 'Case study is required'),

    why: z.string({
        error: 'Why is required',
    }).min(1, 'Why is required'),

    serviceId: z.coerce.number({
        error: 'Service is required',
    }).int().positive('Service is required'),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    desc: z.string().min(1, 'Description is required').optional(),
    caseStudy: z.string().min(1, 'Case study is required').optional(),
    why: z.string().min(1, 'Why is required').optional(),
    serviceId: z.coerce
        .number()
        .int()
        .positive('Invalid service ID')
        .optional(),
});

export const serviceIdSchema = z.coerce
    .number()
    .int()
    .positive('Invalid service ID');

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;