import { Document } from "mongoose";

export interface IRole extends Document {
    name: string;
}