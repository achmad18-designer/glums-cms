import { errorResponse, successResponse } from "@/utils/response";
import { CreateMessageSchema, CreateMessageType } from "./contact.schema";
import prisma from "@/src/lib/prisma";

export async function createMessage(data: CreateMessageType) {
    try {
        const result = CreateMessageSchema.safeParse(data);

        if (!result.success) {
            return errorResponse(result.error.message, 400);
        }

        await prisma.contact.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.message,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return successResponse(null, 'Message created successfully');
    } catch (error) {
        console.error(error);

        return errorResponse('Failed to create message');
    }
};

export async function getAllMessages() {
    try {
        const messages = await prisma.contact.findMany({
            select: {
                id: true,
                name: true,
                phone: false,
                email: true,
                message: false,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return successResponse(messages, 'Messages retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve messages');
    }
}

export async function getDetailMessage(id: string) {
    try {
        const message = await prisma.contact.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!message) {
            return errorResponse('Message not found', 404);
        }

        return successResponse(message, 'Message retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve message');
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.contact.delete({
            where: {
                id: Number(id),
            },
        });
        return successResponse(null, 'Message deleted successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to delete message');
    }
}