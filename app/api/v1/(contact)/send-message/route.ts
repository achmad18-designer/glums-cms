import { createMessage } from "@/features/contacts/contacts.controller";

export async function POST(request: Request) {
    const body = await request.json();
    // VerifyToken
    // sendMessage(body)
    return createMessage(body);
}