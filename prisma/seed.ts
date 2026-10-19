import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("🌱 Start seeding...");

    // ==========================================
    // CONTACT
    // ==========================================

    await prisma.contact.createMany({
        data: [
            {
                id: 1,
                name: "Fadil",
                phone: "0899987888",
                email: "fadil@email.com",
                message: "ini pesan dari fadil",
                createdAt: new Date("2024-07-14T12:51:04"),
                updatedAt: new Date("2024-07-14T12:51:04"),
            },
        ],
    });

    // ==========================================
    // CONTACT SETTINGS
    // ==========================================

    await prisma.contactSettings.createMany({
        data: [
            {
                id: 1,
                platform: "Instagram",
                link: "https://instagram.com/glums",
                createdAt: new Date("2024-07-14T13:02:00"),
                updatedAt: new Date("2024-07-14T13:02:00"),
            },
        ],
    });

    // ==========================================
    // GENERAL SETTINGS
    // ==========================================

    await prisma.generalSettings.createMany({
        data: [
            {
                id: 1,
                ptName: "PT. Greate Luminate Innovations",
                ptAddress:
                    "Jl. Prof. DR. Satrio, RT.14/RW.4, Kuningan, Karet Kuningan, Setia Budi, Kota Jakarta Selatan, Daerah Khusu Ibukota Jakarta 12940",
                marquee: "WE ARE PROFESIONAL",
                copyRight: "Glums Agency 2024 © All Rights Reserved",
                logoWebsiteName: "1724196086925-logo.png",
                logoWebsitePath:
                    "http://localhost:3000/uploads/1724196086925-logo.png",
                videoProfileName: "1724589447261-videoplayback.mp4",
                videoProfilePath:
                    "http://localhost:3000/uploads/1724589447261-videoplayback.mp4",
                aboutDesc:
                    "We're Glums, a powerhouse of creativity and innovation dedicated to elevating brands and driving impactful results. Our team of passionate professionals combines strategic thinking with cutting-edge solutions to bring your vision to life.\r\n\r\nReady to dominate? Contact us now for a free consultation! sama ini lah changged",
                teamMemberDesc:
                    "We believe every brand has a unique story to tell, and our mission is to amplify that story through innovative and effective digital strategies. edited",
                whatWeDoDesc:
                    "We believe every brand has a unique story to tell, and our mission is to amplify that story through innovative and effective digital strategies. ini juga edited",
                createdAt: new Date("2024-07-14T13:39:50"),
                updatedAt: new Date("2024-08-25T12:37:27"),
            },
        ],
    });

    // ==========================================
    // SERVICES
    // ==========================================

    await prisma.service.createMany({
        data: [
            {
                id: 14,
                serviceName: "Web & App Development",
                excerpt: "Grow your business. Elevate your brand",
                subExcerpt:
                    "Content Creation, Website Traffic Analysis, Social Media Management",
                desc: "Grow your business. Elevate your brand",
                serviceBannerPath:
                    "http://localhost:3000/uploads/1724193845846-dummy-4.png",
                serviceBannerName: "1724193845846-dummy-4.png",
                createdAt: new Date("2024-08-03T17:38:59"),
                updatedAt: new Date("2024-11-04T07:18:19"),
            },
            {
                id: 15,
                serviceName: "Graphic Designing",
                excerpt: "Grow your business. Elevate your brand",
                subExcerpt:
                    "Content Creation, Website Traffic Analysis, Social Media Management",
                desc: "Grow your business. Elevate your brand",
                serviceBannerPath:
                    "http://localhost:3000/uploads/1724193826227-dummy-3.png",
                serviceBannerName: "1724193826227-dummy-3.png",
                createdAt: new Date("2024-08-03T17:47:05"),
                updatedAt: new Date("2024-11-04T07:18:11"),
            },
            {
                id: 17,
                serviceName: "Digital Marketing",
                excerpt: "Grow your business. Elevate your brand",
                subExcerpt:
                    "Content Creation, Website Traffic Analysis, Social Media Management",
                desc: "Grow your business. Elevate your brand",
                serviceBannerPath:
                    "http://localhost:3000/uploads/1724193813676-dummy-2.png",
                serviceBannerName: "1724193813676-dummy-2.png",
                createdAt: new Date("2024-08-11T06:33:13"),
                updatedAt: new Date("2024-11-04T07:18:04"),
            },
            {
                id: 18,
                serviceName: "Video & Photo Branding",
                excerpt: "Grow your business. Elevate your brand",
                subExcerpt:
                    "Content Creation, Website Traffic Analysis, Social Media Management",
                desc: "Grow your business. Elevate your brand",
                serviceBannerPath:
                    "http://localhost:3000/uploads/1724193796529-dummy-1.png",
                serviceBannerName: "1724193796529-dummy-1.png",
                createdAt: new Date("2024-08-11T06:38:06"),
                updatedAt: new Date("2024-11-04T07:17:57"),
            },
        ],
    });

    // ==========================================
    // SUB SERVICES
    // ==========================================

    await prisma.subService.createMany({
        data: [
            {
                id: 1,
                serviceId: 18,
                subServiceName: "Digital Marketing",
                subServiceDesc: "deskripsi 1",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704785640-dummy-4.png",
                subServiceBannerName: "1730704785640-dummy-4.png",
                createdAt: new Date("2024-11-04T07:19:45"),
                updatedAt: new Date("2024-11-04T07:19:45"),
            },
            {
                id: 2,
                serviceId: 18,
                subServiceName: "Service 2",
                subServiceDesc: "service 2",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704825075-dummy-banner-progect.png",
                subServiceBannerName:
                    "1730704825075-dummy-banner-progect.png",
                createdAt: new Date("2024-11-04T07:20:25"),
                updatedAt: new Date("2024-11-04T07:20:25"),
            },
            {
                id: 3,
                serviceId: 17,
                subServiceName: "Service 1",
                subServiceDesc: "service 1",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704882793-img-one.png",
                subServiceBannerName: "1730704882793-img-one.png",
                createdAt: new Date("2024-11-04T07:21:22"),
                updatedAt: new Date("2024-11-04T07:21:22"),
            },
            {
                id: 4,
                serviceId: 17,
                subServiceName: "Service 2",
                subServiceDesc: "service 3",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704922028-contact.png",
                subServiceBannerName: "1730704922028-contact.png",
                createdAt: new Date("2024-11-04T07:22:15"),
                updatedAt: new Date("2024-11-04T07:22:15"),
            },
            {
                id: 5,
                serviceId: 17,
                subServiceName: "Service 3",
                subServiceDesc: "service 3",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704961095-about-profile3.png",
                subServiceBannerName: "1730704961095-about-profile3.png",
                createdAt: new Date("2024-11-04T07:22:41"),
                updatedAt: new Date("2024-11-04T07:22:41"),
            },
            {
                id: 6,
                serviceId: 15,
                subServiceName: "Service 1",
                subServiceDesc: "service 1",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730704982639-dummy-1.png",
                subServiceBannerName: "1730704982639-dummy-1.png",
                createdAt: new Date("2024-11-04T07:23:02"),
                updatedAt: new Date("2024-11-04T07:23:02"),
            },
            {
                id: 7,
                serviceId: 15,
                subServiceName: "Service 2",
                subServiceDesc: "service 2",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730705021684-dummy-4.png",
                subServiceBannerName: "1730705021684-dummy-4.png",
                createdAt: new Date("2024-11-04T07:23:41"),
                updatedAt: new Date("2024-11-04T07:23:41"),
            },
            {
                id: 8,
                serviceId: 14,
                subServiceName: "Service 1",
                subServiceDesc: "service 1",
                subServiceBannerPath:
                    "http://localhost:3000/uploads/1730705047934-img-three.png",
                subServiceBannerName: "1730705047934-img-three.png",
                createdAt: new Date("2024-11-04T07:24:07"),
                updatedAt: new Date("2024-11-04T07:24:07"),
            },
        ],
    });

    // ==========================================
    // PROJECTS
    // ==========================================

    await prisma.project.createMany({
        data: [
            {
                id: 16,
                name: "Ragam Space",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                caseStudy:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                why: "Why ragam space",
                logoProjectName: "1724193677370-BlackRock--Inc-.png",
                logoProjectPath:
                    "http://localhost:3000/uploads/1724193677370-BlackRock--Inc-.png",
                bannerProjectName: "1724193677371-dummy-4.png",
                bannerProjectPath:
                    "http://localhost:3000/uploads/1724193677371-dummy-4.png",
                imgWhyName: "1724193677373-img-two.png",
                imgWhyPath:
                    "http://localhost:3000/uploads/1724193677373-img-two.png",
                images:
                    "http://localhost:3000/uploads/1724175684737-dummy-1.png,http://localhost:3000/uploads/1724175684740-dummy-2.png,http://localhost:3000/uploads/1724175684745-dummy-3.png",
                serviceId: 14,
                createdAt: new Date("2024-08-20T17:30:02"),
                updatedAt: new Date("2024-08-20T22:42:04"),
            },
            {
                id: 17,
                name: "Marriott International",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                caseStudy:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                why: "Why Marriott International",
                logoProjectName: "1724193387182-Marriott-International.png",
                logoProjectPath:
                    "http://localhost:3000/uploads/1724193387182-Marriott-International.png",
                bannerProjectName: "1724193387182-dummy-4.png",
                bannerProjectPath:
                    "http://localhost:3000/uploads/1724193387182-dummy-4.png",
                imgWhyName: "1724193387186-dummy-2.png",
                imgWhyPath:
                    "http://localhost:3000/uploads/1724193387186-dummy-2.png",
                images:
                    "http://localhost:3000/uploads/1724193387190-dummy-1.png,http://localhost:3000/uploads/1724193387196-dummy-2.png,http://localhost:3000/uploads/1724193387200-dummy-3.png",
                serviceId: 15,
                createdAt: new Date("2024-08-20T22:36:27"),
                updatedAt: new Date("2024-08-20T22:36:27"),
            },
            {
                id: 18,
                name: "Moderna",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                caseStudy:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                why: "Why Moderna",
                logoProjectName: "1724193522756-Moderna--Inc-.png",
                logoProjectPath:
                    "http://localhost:3000/uploads/1724193522756-Moderna--Inc-.png",
                bannerProjectName: "1724193522757-img-one.png",
                bannerProjectPath:
                    "http://localhost:3000/uploads/1724193522757-img-one.png",
                imgWhyName: "1724193522799-img-two.png",
                imgWhyPath:
                    "http://localhost:3000/uploads/1724193522799-img-two.png",
                images:
                    "http://localhost:3000/uploads/1724193522823-about-profile.png,http://localhost:3000/uploads/1724193522831-about-profile2.png,http://localhost:3000/uploads/1724193522836-img-three.png",
                serviceId: 15,
                createdAt: new Date("2024-08-20T22:38:42"),
                updatedAt: new Date("2024-08-20T22:38:42"),
            },
        ],
    });

    // ==========================================
    // USERS
    // ==========================================

    await prisma.user.createMany({
        data: [
            {
                id: 8,
                name: "Achmad Ansori",
                username: "fadil@gmail.com",
                role: "UI / UX Designer",
                desc: "deskripsi",
                email: "achmadansori@gmail.com",
                password: "",
                img: "1730703888425-dummy3.png",
                imgPath:
                    "http://localhost:3000/uploads/1730703888425-dummy3.png",
                refreshToken: null,
                createdAt: new Date("2024-08-13T21:45:51"),
                updatedAt: new Date("2024-11-04T07:04:48"),
            },
            {
                id: 9,
                name: "Nova",
                username: "novan@email.com",
                role: "UI / UX Designer",
                desc: "Novan Deskripsi",
                email: "novan@email.com",
                password: "",
                img: "1730703877956-dummy2.png",
                imgPath:
                    "http://localhost:3000/uploads/1730703877956-dummy2.png",
                refreshToken: null,
                createdAt: new Date("2024-08-13T23:28:11"),
                updatedAt: new Date("2024-11-04T07:04:37"),
            },
            {
                id: 13,
                name: "Reihan",
                username: "reihan@email.com",
                role: "Web Developer",
                desc: "sasasasa",
                email: "reihan@email.com",
                password: "",
                img: "1730703863242-dummy1.png",
                imgPath:
                    "http://localhost:3000/uploads/1730703863242-dummy1.png",
                refreshToken: null,
                createdAt: new Date("2024-08-20T23:20:34"),
                updatedAt: new Date("2024-11-04T07:04:23"),
            },
            {
                id: 14,
                name: "Marco",
                username: "marco@email.com",
                role: "Product",
                desc: "Deskripsi",
                email: "marco@email.com",
                password: "",
                img: "1730703921323-dummy4.png",
                imgPath:
                    "http://localhost:3000/uploads/1730703921323-dummy4.png",
                refreshToken: null,
                createdAt: new Date("2024-11-04T07:05:21"),
                updatedAt: new Date("2024-11-04T07:05:21"),
            },
        ],
    });

    // ==========================================
    // FIX POSTGRES SEQUENCES
    // ==========================================

    const tables = [
        "tb_contact",
        "tb_contact_settings",
        "tb_general_settings",
        "tb_projects",
        "tb_services",
        "tb_sub_service",
        "tb_users",
    ];

    for (const table of tables) {
        await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('${table}', 'id'),
        COALESCE(MAX(id), 1),
        true
      )
      FROM "${table}";
    `);
    }

    console.log("✅ Seeding completed!");
}

main()
    .catch((error) => {
        console.error("❌ Seeding failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });