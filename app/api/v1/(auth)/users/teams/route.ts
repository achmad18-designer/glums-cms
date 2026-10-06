import { getAllUsers, getDetailUserTeam } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
    return getDetailUserTeam(request);
}
export async function GET() {
    return getAllUsers();
}   