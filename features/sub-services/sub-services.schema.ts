import { z } from 'zod';
export const serviceIdSchema = z.coerce
    .number()
    .int()
    .positive('Invalid service ID');

export const createSubServiceSchema = z.object({
    serviceId: z.coerce.number({
        error: 'Service is required',
    }).int().positive('Service is required'),

    subServiceName: z.string({
        error: 'Name is required',
    }).min(1, 'Name is required'),

    subServiceDesc: z.string({
        error: 'Sub Service Description is required',
    }).min(1, 'Sub Service Description is required'),
});
export const updateSubServiceSchema = z.object({
    subServiceName: z.string().min(1, 'Name is required').optional(),
    subServiceDesc: z.string().min(1, 'Sub Service Description is required').optional(),
    serviceId: z.coerce.number({
        error: 'Service id is required',
    }).int().positive('Service id is required'),
});