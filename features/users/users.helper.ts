import { Prisma } from '@/src/generated/prisma/client';
import prisma from '@/src/lib/prisma';

export function isValidId(projectId: number): boolean {
    return Number.isInteger(projectId) && projectId > 0;
}


export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id: Number(id),
        },
    })
}
export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function getUserByUsername(username: string) {
    return await prisma.user.findUnique({
        where: {
            username,
        },
    });
}

export async function getMasterUser() {
    return await prisma.user.findFirst({
        where: {
            role: 'master',
        },
    });
}

export async function createUser(
    data: Prisma.UserCreateInput
) {
    return await prisma.user.create({
        data,
    });
}

export async function updateUser(
    id: number,
    data: {
        name?: string;
        email?: string;
        role?: string;
        desc?: string;
        img?: string;
        imgPath?: string;
    }
) {
    return await prisma.user.update({
        where: { id },
        omit: {
            password: true,
            refreshToken: true
        },
        data,
    });
}

export async function deleteUser(id: number) {
    return await prisma.user.delete({
        where: { id },
    });
}
