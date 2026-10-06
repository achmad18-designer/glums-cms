import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { uploadFile } from "@/utils/uploadFile";
import { getServiceById, isValidServiceId } from "./services.helper";
import { createServiceSchema, updateServiceSchema } from "./services.schema";
import { removeFile } from "@/utils/removeFile";

export async function getServicesData() {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return successResponse(services, 'Services retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve services');
    }
}

export async function getServiceDataById(id: string) {
    try {
        if (!isValidServiceId(Number(id))) {
            return errorResponse('Invalid service ID', 400)
        };

        const service = await getServiceById(id);

        if (!service) {
            return errorResponse('Service not found', 404)
        };

        return successResponse(service, 'Service retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve service');
    }
}

export async function createService(request: Request) {
    try {
        const formData = await request.formData();
        const serviceBanner = formData.get('service_banner');

        const validation = createServiceSchema.safeParse({
            serviceName: formData.get('serviceName') || undefined,
            excerpt: formData.get('excerpt') || undefined,
            subExcerpt: formData.get('subExcerpt') || undefined,
            desc: formData.get('desc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        if (!(serviceBanner instanceof File)) {
            return errorResponse('Banner service is required', 400);
        }

        const banner = await uploadFile(serviceBanner);

        const service = await prisma.service.create({
            data: {
                serviceName: validation.data.serviceName,
                excerpt: validation.data.excerpt,
                subExcerpt: validation.data.subExcerpt,
                desc: validation.data.desc,
                serviceBannerName: banner.name,
                serviceBannerPath: banner.path,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        return successResponse(service, 'Service created successfully', 201);

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to create service');
    }
}

export async function updateService(serviceId: string, request: Request) {
    try {
        let updatedFile: Prisma.ServiceUpdateInput | undefined;
        if (!isValidServiceId(Number(serviceId))) {
            return errorResponse('Invalid service ID', 400)
        };

        const service = await getServiceById(serviceId);

        if (!service) {
            return errorResponse('Service not found', 404)
        };

        const formData = await request.formData();
        const serviceBanner = formData.get('service_banner');

        const validation = updateServiceSchema.safeParse({
            serviceName: formData.get('serviceName') || undefined,
            excerpt: formData.get('excerpt') || undefined,
            subExcerpt: formData.get('subExcerpt') || undefined,
            desc: formData.get('desc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        if (serviceBanner instanceof File) {
            const banner = await uploadFile(serviceBanner);
            updatedFile = {
                serviceBannerName: banner.name,
                serviceBannerPath: banner.path,
            }
        }

        const updatedService = await prisma.service.update({
            where: {
                id: Number(serviceId),
            },
            data: {
                serviceName: validation.data.serviceName || service.serviceName,
                excerpt: validation.data.excerpt || service.excerpt,
                subExcerpt: validation.data.subExcerpt || service.subExcerpt,
                desc: validation.data.desc || service.desc,
                ...updatedFile,
                updatedAt: new Date(),
            },
        });

        await removeFile(service.serviceBannerPath);

        return successResponse(updatedService, 'Service updated successfully');

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to update service');
    }
}

export async function deleteService(id: string) {
    try {
        if (!isValidServiceId(Number(id))) {
            return errorResponse('Invalid service ID', 400)
        };

        const service = await getServiceById(id);

        if (!service) {
            return errorResponse('Service not found', 404)
        };

        await prisma.service.delete({
            where: {
                id: Number(id),
            },
        });

        await removeFile(service.serviceBannerPath);

        return successResponse(null, 'Service deleted successfully');

    } catch (error) {
        console.error(error);
        return errorResponse('Failed to delete service');
    }
}