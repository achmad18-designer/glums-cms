import { getDetailUserMaster } from "@/features/users/users.controller";

export async function POST(request: Request) {
    return getDetailUserMaster(request);
}
