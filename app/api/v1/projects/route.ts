import { createProject, getAllProjects } from "@/features/projects/projects.controller";

export async function POST(request: Request) {
    // VerifyToken
    return createProject(request);
}

export async function GET() {
    return getAllProjects();
}