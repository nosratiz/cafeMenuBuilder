import { model, Schema } from 'mongoose';
import { IRole } from '../interfaces/role.interface';

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});

export default model<IRole>('Role', RoleSchema);