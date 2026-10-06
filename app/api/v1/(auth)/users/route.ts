import { getDetailUserMaster } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
    return getDetailUserMaster(request);
}
