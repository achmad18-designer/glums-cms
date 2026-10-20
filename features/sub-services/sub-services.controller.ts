import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { uploadFile } from "@/utils/uploadFile";
import { getSubServiceById, isValidServiceId } from "./sub-services.helper";
import { createSubServiceSchema, serviceIdSchema, updateSubServiceSchema } from "./sub-services.schema";
import { removeFile } from "@/utils/removeFile";
import { getServiceById } from "../services/services.helper";

export async function getSubServicesData() {
    try {
        const services = await prisma.subService.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return successResponse(services, 'Sub Services retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve sub services');
    }
}

export async function getSubServicesDataByServiceId(serviceId: string) {
    try {
        const validation = serviceIdSchema.safeParse(serviceId);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const service = await getServiceById(String(validation.data));

        if (!service) {
            return errorResponse('Service id not found', 404);
        }

        const subServices = await prisma.subService.findMany({
            where: {
                serviceId: validation.data
            },
            orderBy: {
                id: 'desc',
            },
        });

        return successResponse(subServices, 'Sub Services retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve sub services');
    }
}

export async function getSubServiceDataById(id: string) {
    try {
        if (!isValidServiceId(Number(id))) {
            return errorResponse('Invalid service ID', 400)
        };

        const service = await getSubServiceById(id);

        if (!service) {
            return errorResponse('Service id not found', 404)
        };

        return successResponse(service, 'Sub Service retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve sub service');
    }
}

export async function createSubService(request: Request) {
    try {
        const formData = await request.formData();
        const subServiceBanner = formData.get('sub_service_banner');

        const validation = createSubServiceSchema.safeParse({
            serviceId: formData.get('serviceId') || undefined,
            subServiceName: formData.get('subServiceName') || undefined,
            subServiceDesc: formData.get('subServiceDesc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const service = await getServiceById(String(validation.data.serviceId));

        if (!service) {
            return errorResponse('Service id not found', 404);
        }

        if (!(subServiceBanner instanceof File)) {
            return errorResponse('Banner service is required', 400);
        }

        const banner = await uploadFile(subServiceBanner);

        const subService = await prisma.subService.create({
            data: {
                subServiceName: validation.data.subServiceName,
                subServiceDesc: validation.data.subServiceDesc,
                serviceId: service.id,
                subServiceBannerName: subServiceBanner.name,
                subServiceBannerPath: banner.path,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        return successResponse(subService, 'Sub Service created successfully', 201);

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to create sub service');
    }
}

export async function updateSubService(subServiceId: string, request: Request) {
    try {
        let updatedFile: Prisma.SubServiceUpdateInput | undefined;
        if (!isValidServiceId(Number(subServiceId))) {
            return errorResponse('Invalid service ID', 400)
        };

        const subService = await getSubServiceById(subServiceId);

        if (!subService) {
            return errorResponse('Sub Service not found', 404)
        };

        const formData = await request.formData();
        const subServiceBanner = formData.get('sub_service_banner');

        const validation = updateSubServiceSchema.safeParse({
            serviceId: formData.get('serviceId') || undefined,
            subServiceName: formData.get('subServiceName') || undefined,
            subServiceDesc: formData.get('subServiceDesc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const service = await getServiceById(String(validation.data.serviceId));

        if (!service) {
            return errorResponse('Service id not found', 404);
        }

        if (subServiceBanner instanceof File) {
            const img = await uploadFile(subServiceBanner);
            updatedFile = {
                subServiceBannerName: img.name,
                subServiceBannerPath: img.path,
            }
        }

        const updatedSubService = await prisma.subService.update({
            where: {
                id: Number(subServiceId),
            },
            data: {
                subServiceName: validation.data.subServiceName || subService.subServiceName,
                subServiceDesc: validation.data.subServiceDesc || subService.subServiceDesc,
                serviceId: service.id || subService.serviceId,
                subServiceBannerName: updatedFile?.subServiceBannerName,
                subServiceBannerPath: updatedFile?.subServiceBannerPath,
                updatedAt: new Date(),
            },
        });

        await removeFile(subService.subServiceBannerPath);

        return successResponse(updatedSubService, 'Sub Service updated successfully');

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to update sub service');
    }
}

export async function deleteSubService(id: string) {
    try {
        if (!isValidServiceId(Number(id))) {
            return errorResponse('Invalid service ID', 400)
        };

        const subService = await getSubServiceById(id);

        if (!subService) {
            return errorResponse('Sub Service not found', 404)
        };

        await prisma.subService.delete({
            where: {
                id: Number(id),
            },
        });

        await removeFile(subService.subServiceBannerPath);

        return successResponse(null, 'Sub Service deleted successfully');

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to delete sub service');
    }
}