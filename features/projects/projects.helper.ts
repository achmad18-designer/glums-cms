import { Prisma } from "@/src/generated/prisma/client";
import { UpdateProjectInput, updateProjectSchema } from "./projects.schema";
import { uploadFile } from "@/utils/uploadFile";
import prisma from "@/src/lib/prisma";
import { removeFile } from "@/utils/removeFile";
import { ProjectType } from "./projects.type";

type singleImageType = {
    name: string;
    path: string;
} | null

export async function getProjectById(id: string) {
    return await prisma.project.findUnique({
        where: {
            id: Number(id),
        },
    });
}

export function getUpdateProjectData(formData: FormData) {
    return updateProjectSchema.safeParse({
        name: formData.get('name') || undefined,
        desc: formData.get('desc') || undefined,
        caseStudy: formData.get('caseStudy') || undefined,
        why: formData.get('why') || undefined,
        serviceId: formData.get('serviceId') || undefined,
    });
}

export function buildProjectUpdateData(
    input: UpdateProjectInput
): Prisma.ProjectUpdateInput {
    const data: Prisma.ProjectUpdateInput = {
        ...(input.name !== undefined && {
            name: input.name,
        }),
        ...(input.desc !== undefined && {
            desc: input.desc,
        }),
        ...(input.caseStudy !== undefined && {
            caseStudy: input.caseStudy,
        }),
        ...(input.why !== undefined && {
            why: input.why,
        }),
        ...(input.serviceId !== undefined && {
            service: {
                connect: {
                    id: input.serviceId,
                },
            },
        }),
    };

    return data;
}

export async function uploadSingleProjectFile(
    file: FormDataEntryValue | null
) {
    if (!(file instanceof File)) {
        return null;
    }

    return uploadFile(file);
}

export async function uploadProjectImages(formData: FormData) {
    const files = formData
        .getAll('images')
        .filter(
            (file): file is File => file instanceof File
        );

    if (files.length === 0) {
        return null;
    }

    const uploads = await Promise.all(
        files.map((file) => uploadFile(file))
    );

    return uploads.map((file) => file.path).join(',');
}

export async function removeOldProjectFiles(
    project: ProjectType,
    files: {
        logoProjectPath: string | null;
        bannerProjectPath: string | null;
        imgWhyPath: string | null;
        images: string | null;
    }
) {
    const removeMultipleImages = async (images: string | null) => {
        if (!images) {
            return;
        }

        const imagePaths = images.split(',');

        await Promise.all(
            imagePaths.map((path) => removeFile(path))
        );
    }

    await Promise.all([
        files.logoProjectPath ? removeFile(project.logoProjectPath) : Promise.resolve(),
        files.bannerProjectPath ? removeFile(project.bannerProjectPath) : Promise.resolve(),
        files.imgWhyPath ? removeFile(project.imgWhyPath) : Promise.resolve(),
        files.images ? removeMultipleImages(project.images) : Promise.resolve(),
    ]);
}

export function isValidProjectId(projectId: number): boolean {
    return Number.isInteger(projectId) && projectId > 0;
}
export async function updateProjectInDatabase(
    projectData: Prisma.ProjectUpdateInput,
    logoProject: singleImageType,
    bannerProject: singleImageType,
    imgWhy: singleImageType,
    images: string | null,
    projectId: number
) {
    // implementation to update project in the database
    const fileData: Prisma.ProjectUpdateInput = {
        ...(logoProject && {
            logoProjectName: logoProject.name,
            logoProjectPath: logoProject.path,
        }),
        ...(bannerProject && {
            bannerProjectName: bannerProject.name,
            bannerProjectPath: bannerProject.path,
        }),
        ...(imgWhy && {
            imgWhyName: imgWhy.name,
            imgWhyPath: imgWhy.path,
        }),
        ...(images && {
            images,
        }),
    };

    const updatedProject = await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            ...projectData,
            ...fileData,
        },
    });

    return updatedProject;
}