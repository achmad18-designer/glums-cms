import { registerMaster } from "@/features/users/users.controller";

export async function POST(request: Request) {
    return registerMaster(request);
}