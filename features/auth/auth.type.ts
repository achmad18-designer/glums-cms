export interface UserType {
    id: string;
    name: string;
    username: string;
    role: string;
    desc: string;
    email: string;
    password: string;
    img: string;
    imgPath: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserPreview = Omit<UserType, 'password' | 'refreshToken' | 'img'>