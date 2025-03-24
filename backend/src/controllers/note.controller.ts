import { Request, Response } from 'express';
import Note from '../models/note.model';
import User from '../models/user.model';

export interface AuthUserType extends Request {
    user?: {
        userId: string | undefined
    };
}

export const createNote = async (req: AuthUserType, res: Response): Promise<void> => {
    const { title, content } = req.body;
    if (!title || !content || !req.user) {
        res.status(404).json({ success: false, message: "Required title,content in Json-body and token", data: { title, content } });
        return;
    }

    try {
        const newNote = new Note({
            title,
            content,
            createdBy: req.user.userId
        });
        await newNote.save();
        res.status(200).json({ success: true, message: "Note created" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, user } = req.query;
        if (!page && !Number(page) || !user) {
            res.status(404).json({ success: false, message: "Pass page adn user(username) in parameter" });
            return;
        }

        const userData = await User.findOne({ username: user });
        if (!userData) {
            res.status(404).json({ success: false, message: "User not Found" });
            return;
        }
        const notes = await Note.find({ createdBy: userData._id }).skip((Number(page) - 1) * 20).limit(20).select("-__v -updatedAt").populate({
            path: "createdBy",
            select: "username email -_id"
        });

        res.status(200).json({ success: true, message: "Notes Founded", data: notes });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getOneNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ success: false, message: "Pass Note id as id in parameter" });
        return;
    }
    try {
        const note = await Note.findById(id).select("-__v -updatedAt").populate({
            path: "createdBy",
            select: "username email -_id"
        });
        if (!note) {
            res.status(404).json({ success: false, message: "Wrong Id" });
            return;
        }
        res.status(200).json({ success: true, message: "Note founded", data: note });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateOneNote = async (req: AuthUserType, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id || !req.user?.userId || !title || !content || !req.user.userId) {
        res.status(404).json({ success: false, message: "Pass Note id as id in parameter, auth token and title & content in json-body" });
        return;
    }
    try {
        const note = await Note.findById(id).populate("createdBy");
        if (!note) {
            res.status(404).json({ success: false, message: "Wrong Note Id" });
            return;
        }
        const user = note.createdBy._id as unknown as string;
        if (req.user.userId != user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        note.title = title;
        note.content = content;
        await note.save();
        res.status(200).json({ success: true, message: "Update successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteOneNote = async (req: AuthUserType, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || !req.user?.userId) {
        res.status(404).json({ success: false, message: "Pass Note id as id in parameter, auth token" });
        return;
    }
    try {
        const note = await Note.findById(id).populate("createdBy");
        if (!note) {
            res.status(404).json({ success: false, message: "Wrong Note Id" });
            return;
        }
        const user = note.createdBy._id as unknown as string;
        if (req.user.userId != user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        await note.deleteOne();
        res.status(200).json({ success: true, message: "Note deleted" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}