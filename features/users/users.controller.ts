import { Prisma } from '@/src/generated/prisma/client';
import prisma from '@/src/lib/prisma';
import { removeFile } from '@/utils/removeFile';
import {
    errorResponse,
    successResponse,
} from '@/utils/response';
import { uploadFile } from '@/utils/uploadFile';
import bcrypt from 'bcryptjs';
import {
    createUser,
    deleteUser,
    getMasterUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    isValidId,
    updateUser
} from './users.helper';
import { registerSchema, registerTeamSchema, updateTeamSchema, updateUserMasterSchema } from './users.schema';

export async function registerMaster(request: Request) {
    try {
        const body = await request.json();

        const master = await getMasterUser();

        if (master) {
            return errorResponse('User register has closed', 400);
        }

        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const {
            name,
            username,
            email,
            password,
        } = validation.data;

        const [existingEmail, existingUsername] =
            await Promise.all([
                getUserByEmail(email),
                getUserByUsername(username),
            ]);

        if (existingEmail) {
            return errorResponse(
                'Email already used',
                409
            );
        }


        if (existingUsername) {
            return errorResponse(
                'Username already used',
                409
            );
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await createUser({
            name,
            username,
            email,
            password: hashedPassword,
            role: 'master',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return successResponse(
            {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            'User registered successfully',
            201
        );
    } catch (error) {
        console.error('Register error:', error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === 'P2002') {
                return errorResponse(
                    'Username or email already used',
                    409
                );
            }
        }

        return errorResponse(
            'Failed to register user'
        );
    }
}

export async function registerTeam(
    request: Request
) {
    try {
        const formData = await request.formData();

        const validation = registerTeamSchema.safeParse({
            name: formData.get('name') || undefined,
            email: formData.get('email') || undefined,
            role: formData.get('role') || undefined,
            desc: formData.get('desc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        if (validation.data.role.toLowerCase() === 'master') {
            return errorResponse(
                'Master role already exists. Please use another role.',
                400
            );
        }

        const img = formData.get('img');

        if (!(img instanceof File)) {
            return errorResponse(
                'Image is required',
                400
            );
        }

        const existingEmail = await getUserByEmail(
            validation.data.email
        );

        if (existingEmail) {
            return errorResponse(
                'Email already used',
                409
            );
        }

        if (validation.data.role === 'master') {
            const master = await getMasterUser();

            if (master) {
                return errorResponse(
                    'Master role already exists. Please use another role.',
                    409
                );
            }
        }

        const uploadedImage = await uploadFile(img);

        const user = await createUser({
            name: validation.data.name,
            email: validation.data.email,
            username: validation.data.email,
            role: validation.data.role,
            desc: validation.data.desc,
            password: '',
            img: uploadedImage.name,
            imgPath: uploadedImage.path,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return successResponse(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                desc: user.desc,
                img: user.img,
                imgPath: user.imgPath,
            },
            'Team registered successfully',
            201
        );
    } catch (error) {
        console.error(
            'Register team error:',
            error
        );

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === 'P2002') {
                return errorResponse(
                    'Email already used',
                    409
                );
            }
        }

        return errorResponse(
            'Failed to register team'
        );
    }
}

export async function getDetailUserMaster(request: Request) {
    try {
        const body = await request.json();

        if (!isValidId(body.id)) {
            return errorResponse(
                'Invalid user id',
                400
            );
        }

        const user = await prisma.user.findUnique({
            omit: {
                password: true,
                refreshToken: true,
            },
            where: {
                id: Number(body.id),
            },
        })

        if (!user) {
            return errorResponse(
                'User not found',
                404
            );
        }

        if (user.role !== 'master') {
            return errorResponse(
                'Unauthorized',
                403
            );
        }

        return successResponse(
            user,
            'User retrieved successfully'
        );
    } catch (error) {
        console.error(
            'Get user by id error:',
            error
        );

        return errorResponse(
            'Failed to get user'
        );
    }
}

export async function getDetailUserTeam(request: Request) {
    try {
        const body = await request.json();

        if (!isValidId(body.id)) {
            return errorResponse(
                'Invalid user id',
                400
            );
        }

        const user = await prisma.user.findUnique({
            omit: {
                password: true,
                refreshToken: true,
            },
            where: {
                id: Number(body.id),
            },
        })

        if (!user) {
            return errorResponse(
                'User not found',
                404
            );
        }

        if (user.role === 'master') {
            return errorResponse(
                'Unauthorized',
                403
            );
        }

        return successResponse(
            user,
            'User retrieved successfully'
        );
    } catch (error) {
        console.error(
            'Get user by id error:',
            error
        );

        return errorResponse(
            'Failed to get user'
        );
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            omit: {
                password: true,
                refreshToken: true,
            },
            where: {
                role: {
                    not: 'master',
                },
            },
            orderBy: {
                id: 'desc',
            },
        })

        return successResponse(
            users,
            'Users retrieved successfully'
        );
    } catch (error) {
        console.error(
            'Get all users error:',
            error
        );

        return errorResponse(
            'Failed to get users'
        );
    }
}

export async function updateMasterUser(
    id: string,
    request: Request
) {
    try {
        const userId = id;

        if (!isValidId(Number(userId))) {
            return errorResponse(
                'Invalid user id',
                400
            );
        }

        const user = await getUserById(userId);

        if (!user) {
            return errorResponse('User not found', 404);
        }

        if (user.role !== 'master') {
            return errorResponse('Unauthorized', 403);
        }

        const body = await request.json();

        const validation = updateUserMasterSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const {
            name,
            currentPassword,
            newPassword,
        } = validation.data;

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return errorResponse('Invalid password', 401);
        }

        const updateData: {
            name: string;
            password?: string;
        } = {
            name,
        };

        if (newPassword) {
            updateData.password = await bcrypt.hash(
                newPassword,
                10
            );
        }

        await updateUser(Number(userId), updateData);

        return successResponse(
            null,
            'User updated successfully'
        );
    } catch (error) {
        console.error(error)

        return errorResponse('Failed to update user');
    }

}

export async function updateTeamUser(
    id: string,
    request: Request
) {
    const userId = id;

    if (!isValidId(Number(userId))) {
        return errorResponse(
            'Invalid user id',
            400
        );
    }

    const user = await getUserById(userId);

    if (!user) {
        return errorResponse('User not found', 404);
    }

    if (user.role === 'master') {
        return errorResponse('Unauthorized', 403);
    }

    const formData = await request.formData();

    const body = {
        name: formData.get('name'),
        desc: formData.get('desc'),
        email: formData.get('email'),
        role: formData.get('role')
    };

    const validation = updateTeamSchema.safeParse(body);

    if (!validation.success) {
        return errorResponse(
            validation.error.issues[0].message,
            400
        );
    }

    const img = formData.get('img');

    if (img !== null && !(img instanceof File)) {
        return errorResponse('Invalid image file', 400);
    }

    let newImage = null;

    try {
        /**
         * Upload image baru jika ada
         */
        if (img instanceof File && img.size > 0) {
            newImage = await uploadFile(img);
        }

        /**
         * Prepare update data
         */
        const updateData: {
            name: string;
            desc: string;
            role: string;
            email: string;
            img?: string;
            imgPath?: string;
        } = {
            name: validation.data.name,
            desc: validation.data.desc,
            email: validation.data.email,
            role: validation.data.role
        };

        if (newImage) {
            updateData.img = newImage.name;
            updateData.imgPath = newImage.path;
        }

        /**
         * Update database
         */
        const updatedUser = await updateUser(
            Number(userId),
            updateData
        );

        /**
         * Hapus image lama setelah DB berhasil
         */
        if (newImage && user.imgPath) {
            await removeFile(user.imgPath);
        }

        return successResponse(
            updatedUser,
            'Team user updated successfully'
        );
    } catch (error) {
        /**
         * Jika upload berhasil tetapi DB gagal,
         * hapus image baru agar tidak menjadi orphan Blob.
         */
        if (newImage) {
            await removeFile(newImage.path);
        }

        console.error(error);

        return errorResponse(
            'Failed to update team user',
            500
        );
    }
}

export async function deleteTeamUser(id: string) {
    const userId = id;

    if (!isValidId(Number(userId))) {
        return errorResponse(
            'Invalid user id',
            400
        );
    }

    const team = await getUserById(userId);

    if (!team) {
        return errorResponse('User not found', 404);
    }

    if (team.role === 'master') {
        return errorResponse('Unauthorized', 403);
    }

    const oldImagePath = team.imgPath;

    try {
        await deleteUser(Number(userId));

        /**
         * Hapus image setelah DB berhasil
         */
        if (oldImagePath) {
            await removeFile(oldImagePath);
        }

        return successResponse(
            null,
            'Team deleted successfully'
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Failed to delete team',
            500
        );
    }
}