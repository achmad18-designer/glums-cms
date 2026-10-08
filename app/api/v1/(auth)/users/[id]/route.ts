import { updateMasterUser } from "@/features/users/users.controller";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: Params) {
    // VerifyToken
    const { id } = await params;
    return updateMasterUser(id, request);
}