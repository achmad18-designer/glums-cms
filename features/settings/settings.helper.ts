import prisma from '@/src/lib/prisma';

export async function getSettingsById(id: number) {
    return prisma.generalSettings.findUnique({
        where: {
            id,
        },
    });
}

export async function getSettings() {
    return prisma.generalSettings.findFirst({
        orderBy: {
            id: 'asc',
        },
    });
}