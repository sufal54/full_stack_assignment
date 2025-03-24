import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface NoteModelTypes extends Document {
    title: string;
    content: string;
    createdBy: Types.ObjectId;
}

const userSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
}, { timestamps: true });

const Note: Model<NoteModelTypes> = mongoose.model<NoteModelTypes>("Notes", userSchema);

export default Note;