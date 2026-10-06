import { createService, getServicesData } from "@/features/services/services.controller";


export async function POST(request: Request) {
    // VerifyToken
    return createService(request);
}

export async function GET() {
    return getServicesData();
}