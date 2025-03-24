import express, { Express } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import connectDB from './config/db.config';

import userRouters from "./routers/user.router";
import noteRouters from './routers/note.router';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());

app.use("/api/auth", userRouters);
app.use("/api", noteRouters);

const port = process.env.PORT || 8080;

app.listen(port, async (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Server started");
    await connectDB();
})