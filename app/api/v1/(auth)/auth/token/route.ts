import { refreshToken } from "@/features/auth/auth.controller";

export async function GET() {
    return await refreshToken();
}