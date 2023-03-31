import { model, Schema } from 'mongoose';
import { IMenu } from '../interfaces/menu.interface';

const MenuSchema = new Schema({
    title: {
        type: String,
        trim: true,
        index: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
});

export default model<IMenu>('Menu', MenuSchema);
