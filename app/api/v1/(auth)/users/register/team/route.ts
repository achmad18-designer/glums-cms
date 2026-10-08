import { registerTeam } from "@/features/users/users.controller";

export async function POST(request: Request) {
    // VerifyToken
    return registerTeam(request);
}