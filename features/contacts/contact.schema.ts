import { z } from 'zod';

export const CreateMessageSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1, 'Email is required'),
    message: z.string().min(1, 'Message is required'),
});

export type CreateMessageType = z.infer<
    typeof CreateMessageSchema
>;
