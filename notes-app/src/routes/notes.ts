import { Router } from "express";
import { findAll, save, remove, findById } from "../store.js";
import { validateBody } from "../middleware/validate.js";
import {
  createNoteSchema,
  updateNoteSchema,
  type CreateNoteInput,
  type UpdateNoteInput,
} from "../schemas/note.js";
import type { Note } from "../types.js";
export const notesRouter = Router();
// import crypto from "crypto";
// notesRouter.get("/test", (req, res) => res.send("Server is in good health"));

notesRouter.get("/", (req, res) => {
  res.status(200).json(findAll());
});

notesRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  const note = findById(id);
  if (!note) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  res.json(note);
});

notesRouter.post("/", validateBody(createNoteSchema), (req, res) => {
  const { title, body } = req.body as CreateNoteInput;

  const now = new Date().toISOString();
  const note: Note = {
    id: crypto.randomUUID(),
    title: title,
    body: body,
    createdAt: now,
    updatedAt: now,
  };
  save(note);
  res.status(201).location(`/notes/${note.id}`).json(note);
});
notesRouter.patch("/:id", validateBody(updateNoteSchema), (req, res) => {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  const note = findById(id);
  if (!note) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  const updated: Note = {
    ...note,
    ...(req.body as UpdateNoteInput),
    updatedAt: new Date().toISOString(),
  };
  save(updated);
  res.send(updated);
});
notesRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  const deleted = remove(id);
  if (!deleted) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  res.status(204).end();
});
