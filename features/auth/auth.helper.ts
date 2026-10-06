import { Prisma } from '@/src/generated/prisma/client';
import prisma from '@/src/lib/prisma';

export function isValidId(projectId: number): boolean {
    return Number.isInteger(projectId) && projectId > 0;
}


export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id: Number(id),
        },
    })
}
export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: {
            username,
        },
    });
}

export async function getMasterUser() {
    return prisma.user.findFirst({
        where: {
            role: 'master',
        },
    });
}

export async function createUser(
    data: Prisma.UserCreateInput
) {
    return prisma.user.create({
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
    return prisma.user.update({
        where: { id },
        omit: {
            password: true,
            refreshToken: true
        },
        data,
    });
}

export async function deleteUser(id: number) {
    return prisma.user.delete({
        where: { id },
    });
}