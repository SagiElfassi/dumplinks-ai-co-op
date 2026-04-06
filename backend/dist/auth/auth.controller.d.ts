import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleLogin(credential: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            profilePictureUrl: string | undefined;
        };
    }>;
    getMe(req: {
        user: {
            _id: {
                toString(): string;
            };
        };
    }): Promise<{
        id: string;
        email: string;
        name: string | undefined;
        profilePictureUrl: string | undefined;
    }>;
    updateMe(req: {
        user: {
            _id: {
                toString(): string;
            };
        };
    }, body: {
        name?: string;
        profilePictureUrl?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string | undefined;
        profilePictureUrl: string | undefined;
    }>;
    deleteMe(req: {
        user: {
            _id: {
                toString(): string;
            };
        };
    }): Promise<void>;
}
