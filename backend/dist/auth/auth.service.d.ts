import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private issueToken;
    private toProfile;
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            profilePictureUrl: string | undefined;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            profilePictureUrl: string | undefined;
        };
    }>;
    googleLogin(accessToken: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            profilePictureUrl: string | undefined;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string | undefined;
        profilePictureUrl: string | undefined;
    }>;
    updateMe(userId: string, data: {
        name?: string;
        profilePictureUrl?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string | undefined;
        profilePictureUrl: string | undefined;
    }>;
    deleteMe(userId: string): Promise<void>;
}
