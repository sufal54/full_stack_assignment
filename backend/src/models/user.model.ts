import mongoose, { Schema, Document, Model } from "mongoose";

interface UserModelTypes extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User: Model<UserModelTypes> = mongoose.model<UserModelTypes>("Users", userSchema);

export default User;