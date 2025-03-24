import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    // if (!token) {
    //     res.status(401).json({ success: false, message: "Unauthorized token" });
    //     return;
    // }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decodedToken;
        next();
    } catch (e) {
        res.status(401).json({ success: false, message: "Invaild token" });
        return;

    }
}

export default authMiddleware;