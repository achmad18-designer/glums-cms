import { z } from 'zod';

export const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        username: z.string().min(1, 'Username is required'),
        email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1, 'Email is required'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Password does not match',
            path: ['confirmPassword'],
        }
    );
export const updateUserMasterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
    confirmPassword: z.string().optional(),
})
    .refine(
        (data) => {
            // Tidak mengganti password
            if (!data.newPassword && !data.confirmPassword) {
                return true;
            }

            return (
                !!data.newPassword &&
                data.newPassword === data.confirmPassword
            );
        },
        {
            message: 'Password confirmation does not match',
            path: ['confirmPassword'],
        }
    );

export const registerTeamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1, 'Email is required'),
    role: z.string().min(1, 'Role is required'),
    desc: z.string().min(1, 'Description is required'),
});
export const updateTeamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1, 'Email is required'),
    role: z.string().min(1, 'Role is required'),
    desc: z.string().min(1, 'Description is required'),
});