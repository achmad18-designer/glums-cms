import { registerTeam } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
    // VerifyToken
    return registerTeam(request);
}