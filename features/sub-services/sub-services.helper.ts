import prisma from "@/src/lib/prisma";

export function isValidServiceId(projectId: number): boolean {
    return Number.isInteger(projectId) && projectId > 0;
}

export async function getSubServiceById(id: string) {
    return await prisma.subService.findUnique({
        where: {
            id: Number(id),
        },
    });
}