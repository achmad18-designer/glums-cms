import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { uploadFile } from "@/utils/uploadFile";
import { buildProjectUpdateData, getProjectById, getUpdateProjectData, isValidProjectId, removeOldProjectFiles, updateProjectInDatabase, uploadProjectImages, uploadSingleProjectFile } from "./projects.helper";
import { createProjectSchema, serviceIdSchema } from "./projects.schema";
import { getServiceById } from "../services/services.helper";

export async function createProject(request: Request) {
    try {
        const formData = await request.formData();

        const logoProject = formData.get('logo_project');
        const bannerProject = formData.get('banner_project');
        const imgWhy = formData.get('img_why');
        const images = formData.getAll('images');

        const validation = createProjectSchema.safeParse({
            name: formData.get('name') || undefined,
            desc: formData.get('desc') || undefined,
            caseStudy: formData.get('caseStudy') || undefined,
            why: formData.get('why') || undefined,
            serviceId: formData.get('serviceId') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const service = await getServiceById(String(validation.data.serviceId));

        if (!service) {
            return errorResponse('Service not found', 404);
        }

        if (!(logoProject instanceof File)) {
            return errorResponse('Logo project is required', 400);
        }

        if (!(bannerProject instanceof File)) {
            return errorResponse('Banner project is required', 400);
        }

        if (!(imgWhy instanceof File)) {
            return errorResponse('Image why is required', 400);
        }

        const imageFiles = images.filter(
            (image): image is File => image instanceof File
        );

        if (imageFiles.length === 0) {
            return errorResponse('Project images are required', 400);
        }

        const logoUpload = await uploadFile(logoProject);
        const bannerUpload = await uploadFile(bannerProject);
        const imgWhyUpload = await uploadFile(imgWhy);

        const imageUploads = await Promise.all(
            imageFiles.map((image) => uploadFile(image))
        );

        const project = await prisma.project.create({
            data: {
                name: validation.data.name,
                desc: validation.data.desc,
                caseStudy: validation.data.caseStudy,
                why: validation.data.why,
                serviceId: service.id,

                logoProjectName: logoUpload.name,
                logoProjectPath: logoUpload.path,

                bannerProjectName: bannerUpload.name,
                bannerProjectPath: bannerUpload.path,

                imgWhyName: imgWhyUpload.name,
                imgWhyPath: imgWhyUpload.path,

                images: imageUploads
                    .map((image) => image.path)
                    .join(','),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return successResponse(
            project,
            'Project created successfully',
            201
        );
    } catch (error) {
        console.error('Create project error:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2003':
                    return errorResponse(
                        'Invalid service ID',
                        400
                    );

                case 'P2002':
                    return errorResponse(
                        'Project already exists',
                        409
                    );

                default:
                    break;
            }
        }

        return errorResponse('Failed to create project');
    }
}

export async function getAllProjects() {
    try {

        const projects = await prisma.project.findMany({
            orderBy: {
                id: 'desc',
            },
        });

        return successResponse(projects, 'Projects retrieved successfully');
    } catch (error) {
        console.error('Get all projects error:', error);

        return errorResponse('Failed to get projects');
    }
}
export async function getAllProjectsByServiceId(serviceId: string) {
    try {
        const validation = serviceIdSchema.safeParse(serviceId);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const projects = await prisma.project.findMany({
            where: {
                serviceId: validation.data
            },
            orderBy: {
                id: 'desc',
            },
        });

        return successResponse(projects, 'Projects retrieved successfully');
    } catch (error) {
        console.error('Get all projects error:', error);

        return errorResponse('Failed to get projects');
    }
}

export async function getDataProjectById(id: string) {
    try {
        if (!isValidProjectId(Number(id))) {
            return errorResponse('Invalid project ID', 400);
        }

        const project = await getProjectById(id);

        if (!project) {
            return errorResponse('Project not found', 404);
        }

        return successResponse(project, 'Project retrieved successfully');
    } catch (error) {
        console.error(error);
        return errorResponse('Failed to retrieve project');
    }
}

export async function updateProject(id: string, request: Request) {
    try {
        const projectId = id;

        if (!isValidProjectId(Number(projectId))) {
            return errorResponse('Invalid project ID', 400);
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return errorResponse('Project not found', 404);
        }

        const formData = await request.formData();
        const validation = getUpdateProjectData(formData);

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const projectData = buildProjectUpdateData(validation.data);

        const [
            logoProject,
            bannerProject,
            imgWhy,
            images,
        ] = await Promise.all([
            uploadSingleProjectFile(formData.get('logo_project')),
            uploadSingleProjectFile(formData.get('banner_project')),
            uploadSingleProjectFile(formData.get('img_why')),
            uploadProjectImages(formData),
        ]);


        const updatedProject = await updateProjectInDatabase(
            projectData,
            logoProject,
            bannerProject,
            imgWhy,
            images,
            Number(projectId)
        )

        await removeOldProjectFiles(project, {
            logoProjectPath: logoProject?.path || null,
            bannerProjectPath: bannerProject?.path || null,
            imgWhyPath: imgWhy?.path || null,
            images
        });

        return successResponse(
            updatedProject,
            'Project updated successfully'
        );

    } catch (error) {
        console.error('Update project error:', error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError
        ) {
            if (error.code === 'P2003') {
                return errorResponse(
                    'Invalid service ID',
                    400
                );
            }

            if (error.code === 'P2025') {
                return errorResponse(
                    'Project not found',
                    404
                );
            }
        }

        return errorResponse('Failed to update project');
    }
}

export async function deleteProject(id: string) {
    try {
        if (!isValidProjectId(Number(id))) {
            return errorResponse('Invalid project ID', 400);
        }

        const project = await getProjectById(id);

        if (!project) {
            return errorResponse('Project not found', 404);
        }

        await prisma.project.delete({
            where: {
                id: Number(id),
            },
        });

        await removeOldProjectFiles(project, {
            logoProjectPath: project.logoProjectPath,
            bannerProjectPath: project.bannerProjectPath,
            imgWhyPath: project.imgWhyPath,
            images: project.images
        })

        return successResponse(null, 'Project deleted successfully');
    } catch (error) {
        console.error('Delete project error:', error);

        return errorResponse('Failed to delete project');
    }
}