import { deleteService, getServiceDataById, updateService } from "@/features/services/services.controller";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getServiceDataById(id);
}

export async function PATCH(
    request: Request,
    { params }: Params
) {
    const { id } = await params;

    // VerifyToken

    return updateService(id, request);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    const { id } = await params;

    // VerifyToken

    return deleteService(id);
}