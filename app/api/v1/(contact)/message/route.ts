import { getAllMessages } from "@/features/contacts/contacts.controller";

export function GET() {
    // VerifyToken
    return getAllMessages();
}