import prisma from "@/src/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { CreatePlatformInput, createPlatformSchema, UpdatePlatformInput, updatePlatformSchema } from "./platforms.schema";

export async function getPlatforms() {
    try {
        const platforms = await prisma.contactSettings.findMany();

        return successResponse(
            platforms,
            'Platform retrieved successfully'
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Failed to retrieve platform'
        );
    }
}

export async function createPlatform(data: CreatePlatformInput) {
    try {
        const result = createPlatformSchema.safeParse(data);

        if (!result.success) {
            return errorResponse(result.error.message, 400);
        }

        const platform = await prisma.contactSettings.create({
            data: {
                platform: data.platform,
                link: data.link,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return successResponse(
            platform,
            'Platform created successfully'
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Failed to create platform'
        );
    }
}

export async function updatePlatform(id: string, data: UpdatePlatformInput) {
    try {
        const result = updatePlatformSchema.safeParse(data);

        if (!result.success) {
            return errorResponse(result.error.message, 400);
        }

        const platform = await prisma.contactSettings.update({
            where: {
                id: Number(id)
            },
            data: {
                platform: data.platform,
                link: data.link,
                updatedAt: new Date()
            }
        });

        return successResponse(
            platform,
            'Platform updated successfully'
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Failed to update platform'
        );
    }
}

export async function deletePlatform(id: string) {
    try {
        await prisma.contactSettings.delete({
            where: {
                id: Number(id)
            }
        });

        return successResponse(
            null,
            'Platform deleted successfully'
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            'Failed to delete platform'
        );
    }
}