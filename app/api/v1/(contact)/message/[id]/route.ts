import { deleteMessage, getDetailMessage } from "@/features/contacts/contacts.controller";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(
    request: Request,
    { params }: Params
) {
    const { id } = await params;
    // VerifyToken
    return getDetailMessage(id);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    const { id } = await params;
    // VerifyToken
    return deleteMessage(id);
}