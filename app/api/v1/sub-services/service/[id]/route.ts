import { getSubServicesDataByServiceId } from "@/features/sub-services/sub-services.controller";

type Params = {
    params: Promise<{
        id: string;
    }>;
};
export async function GET(request: Request, { params }: Params) {
    const id = (await params).id;
    return getSubServicesDataByServiceId(id);
}