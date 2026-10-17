export interface ProjectType {
    id: number;
    name: string;
    desc: string;
    caseStudy: string;
    why: string;
    logoProjectName: string;
    logoProjectPath: string;
    bannerProjectName: string;
    bannerProjectPath: string;
    imgWhyName: string;
    imgWhyPath: string;
    images: string;
    serviceId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectPayloadType {
    name: string;
    serviceId: number;
    desc: string;
    caseStudy: string;
    why: string;
    logoProjectPath: string;
    bannerProjectPath: string;
    imgWhyPath: string;
    images: string;
}