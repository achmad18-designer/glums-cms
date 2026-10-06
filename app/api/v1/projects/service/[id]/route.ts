import { getAllProjectsByServiceId } from "@/features/projects/projects.controller";
type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getAllProjectsByServiceId(id);
}