import { Router } from "express";
import { createNote, getAllNotes, getOneNote, updateOneNote, deleteOneNote } from "../controllers/note.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/notes", authMiddleware, createNote);
router.get("/notes", getAllNotes);
router.get("/notes/:id", getOneNote);
router.put("/notes/:id", authMiddleware, updateOneNote);
router.delete("/notes/:id", authMiddleware, deleteOneNote);

export default router;