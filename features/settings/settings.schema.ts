import { z } from 'zod';

export const createSettingsSchema = z.object({
    ptName: z.string().min(1, 'PT name is required'),
    ptAddress: z.string().min(1, 'PT address is required'),
    marquee: z.string().min(1, 'Marquee is required'),
    copyRight: z.string().min(1, 'Copyright is required'),
    aboutDesc: z.string().min(1, 'About description is required'),
    teamMemberDesc: z.string().min(1, 'Team member description is required'),
    whatWeDoDesc: z.string().min(1, 'What we do description is required'),
});
export const updateSettingsSchema = createSettingsSchema.partial();

export const settingsIdSchema = z.coerce
    .number()
    .int()
    .positive('Invalid settings ID');

export type CreateSettingsInput = z.infer<typeof createSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;