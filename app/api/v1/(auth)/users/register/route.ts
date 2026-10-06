import { registerMaster } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
    return registerMaster(request);
}