import prisma from "@/src/lib/prisma";

export function isValidServiceId(projectId: number): boolean {
    return Number.isInteger(projectId) && projectId > 0;
}

export async function getServiceById(id: string) {
    return await prisma.service.findUnique({
        where: {
            id: Number(id),
        },
    });
}