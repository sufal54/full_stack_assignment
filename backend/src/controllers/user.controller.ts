import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";
import { AuthUserType } from "./note.controller";
dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(404).json({ success: false, message: "Required username,email,password in Json-body" });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPassword
        });
        await newUser.save();
        res.status(200).json({ success: true, message: "User Created" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404).json({ success: false, message: "Required email,password in Json-body" });
        return;
    }

    try {
        const userData = await User.findOne({ email });
        if (!userData || !(await bcrypt.compare(password, userData.password))) {
            res.status(400).json({ success: false, message: "Invaild credentials" });
            return;
        }
        const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET!);
        res.status(200).cookie("token", token, { httpOnly: true }).json({ success: true, message: "Login successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getUserData = async (req: AuthUserType, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(404).json({ success: false, message: "Token not found" });
        return;
    }
    try {
        const user = await User.findById(req.user.userId).select("_id username email");
        if (!user) {
            res.status(404).json({ success: false, message: "Wrong token" });
            return;
        }
        res.status(200).json({ success: true, message: "User founded", data: user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}