import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    create(data: Partial<User>): Promise<UserDocument>;
    update(id: string, data: Partial<User>): Promise<UserDocument | null>;
    delete(id: string): Promise<void>;
}
