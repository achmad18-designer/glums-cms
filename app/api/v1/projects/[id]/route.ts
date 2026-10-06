import { deleteProject, getDataProjectById, updateProject } from "@/features/projects/projects.controller";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getDataProjectById(id);
}

export async function PATCH(
    request: Request,
    { params }: Params
) {
    const { id } = await params;

    // VerifyToken

    return updateProject(id, request);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    const { id } = await params;

    // VerifyToken

    return deleteProject(id);
}