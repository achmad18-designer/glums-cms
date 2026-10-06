
import { NextResponse } from 'next/server';

type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type ErrorResponse = {
    success: false;
    message: string;
    data: null;
};

export const successResponse = <T>(
    data: T,
    message = 'Success',
    status = 200
) => {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        data,
    };

    return NextResponse.json(response, { status });
};

export const errorResponse = (
    message = 'Internal server error',
    status = 500
) => {
    const response: ErrorResponse = {
        success: false,
        message,
        data: null,
    };

    return NextResponse.json(response, { status });
};
