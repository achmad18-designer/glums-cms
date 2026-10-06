import { createPlatform, getPlatforms } from "@/features/platforms/platforms.controller";

export async function GET() {
    return getPlatforms();
}

export async function POST(request: Request) {
    const body = await request.json();
    // VerifyToken
    // addNewPlatform(body)

    return createPlatform(body);
}