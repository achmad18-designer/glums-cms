import { login } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
    return await login(request);
}