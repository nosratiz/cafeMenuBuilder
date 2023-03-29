import { IUser } from '../interfaces/user.interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    family: {
        type: String,
        required: true,
        trim: true,
        
    },
    email: {
        type: String,
        trim: true,
        minlength: 3,
    },
    mobile: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
    ],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    birthday: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    confirmCode: {
        type: String,
        trim: true,
        default: randomInt(10000, 99999).toString(),
    },
    confirmCodeExpire: {
        type: Date,
        default: Date.now() + 1000 * 120  ,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    confirmMobile: {
        type: Boolean,
        default: false,
    },
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', UserSchema);



