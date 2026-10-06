import prisma from '@/src/lib/prisma';
import { uploadFile } from '@/utils/uploadFile';
import { successResponse, errorResponse } from '@/utils/response';
import { createSettingsSchema, settingsIdSchema, updateSettingsSchema } from './settings.schema';
import { getSettings, getSettingsById } from './settings.helper';
import { removeFile } from '@/utils/removeFile';

export async function getSettingsController() {
    try {
        const settings = await getSettings();

        if (!settings) {
            return errorResponse('Settings not found', 404);
        }

        return successResponse(
            settings,
            'Settings retrieved successfully'
        );
    } catch (error) {
        console.error('Get settings error:', error);

        return errorResponse('Failed to get settings');
    }
}

export async function createSettings(request: Request) {
    try {
        const existingSettings = await getSettings();

        if (existingSettings) {
            return errorResponse(
                'Settings already exists. Use update instead.',
                409
            );
        }
        const formData = await request.formData();

        const validation = createSettingsSchema.safeParse({
            ptName: formData.get('ptName') || undefined,
            ptAddress: formData.get('ptAddress') || undefined,
            marquee: formData.get('marquee') || undefined,
            copyRight: formData.get('copyRight') || undefined,
            aboutDesc: formData.get('aboutDesc') || undefined,
            teamMemberDesc: formData.get('teamMemberDesc') || undefined,
            whatWeDoDesc: formData.get('whatWeDoDesc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const logoWebsite = formData.get('logo_website');
        const videoProfile = formData.get('video_profile');

        if (!(logoWebsite instanceof File)) {
            return errorResponse('Logo website is required', 400);
        }

        if (!(videoProfile instanceof File)) {
            return errorResponse('Video profile is required', 400);
        }

        const [logo, video] = await Promise.all([
            uploadFile(logoWebsite),
            uploadFile(videoProfile),
        ]);

        const settings = await prisma.generalSettings.create({
            data: {
                ptName: validation.data.ptName,
                ptAddress: validation.data.ptAddress,
                marquee: validation.data.marquee,
                copyRight: validation.data.copyRight,

                logoWebsiteName: logo.name,
                logoWebsitePath: logo.path,

                videoProfileName: video.name,
                videoProfilePath: video.path,

                aboutDesc: validation.data.aboutDesc,
                teamMemberDesc: validation.data.teamMemberDesc,
                whatWeDoDesc: validation.data.whatWeDoDesc,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return successResponse(
            settings,
            'Settings created successfully',
            201
        );
    } catch (error) {
        console.error('Create settings error:', error);

        return errorResponse('Failed to create settings');
    }
}

export async function updateSettings(
    id: string,
    request: Request
) {
    try {
        const validationId = settingsIdSchema.safeParse(id);

        if (!validationId.success) {
            return errorResponse(
                validationId.error.issues[0].message,
                400
            );
        }

        const settings = await getSettingsById(validationId.data);

        if (!settings) {
            return errorResponse('Settings not found', 404);
        }

        const formData = await request.formData();

        const validation = updateSettingsSchema.safeParse({
            ptName: formData.get('ptName') || undefined,
            ptAddress: formData.get('ptAddress') || undefined,
            marquee: formData.get('marquee') || undefined,
            copyRight: formData.get('copyRight') || undefined,
            aboutDesc: formData.get('aboutDesc') || undefined,
            teamMemberDesc: formData.get('teamMemberDesc') || undefined,
            whatWeDoDesc: formData.get('whatWeDoDesc') || undefined,
        });

        if (!validation.success) {
            return errorResponse(
                validation.error.issues[0].message,
                400
            );
        }

        const logoWebsite = formData.get('logo_website');
        const videoProfile = formData.get('video_profile');

        const newLogo = logoWebsite instanceof File
            ? await uploadFile(logoWebsite)
            : null;

        const newVideo = videoProfile instanceof File
            ? await uploadFile(videoProfile)
            : null;

        const updatedSettings = await prisma.generalSettings.update({
            where: {
                id: validationId.data,
            },
            data: {
                ...validation.data,

                ...(newLogo && {
                    logoWebsiteName: newLogo.name,
                    logoWebsitePath: newLogo.path,
                }),

                ...(newVideo && {
                    videoProfileName: newVideo.name,
                    videoProfilePath: newVideo.path,
                }),
            },
        });

        await Promise.all([
            newLogo
                ? removeFile(settings.logoWebsitePath)
                : Promise.resolve(),

            newVideo
                ? removeFile(settings.videoProfilePath)
                : Promise.resolve(),
        ]);

        return successResponse(
            updatedSettings,
            'Settings updated successfully'
        );
    } catch (error) {
        console.error('Update settings error:', error);

        return errorResponse('Failed to update settings');
    }
}