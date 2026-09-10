import { Router } from "express";
import { findAll, save, remove, findById } from "../store.js";
import type { Note } from "../types.js";
export const notesRouter = Router();
// import crypto from "crypto";
// notesRouter.get("/test", (req, res) => res.send("Server is in good health"));

notesRouter.get("/", (req, res) => {
  res.status(200).json(findAll());
});

notesRouter.get("/:id", (req, res) => {
  const note = findById(req.params.id);
  if (!note) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  res.json(note);
});

notesRouter.post("/", (req, res) => {
  const { title, body } = req.body ?? {};
  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).send({
      error: "title is required and must be a non-empty string",
    });
    return;
  }
  if (body !== undefined && typeof body !== "string") {
    res.status(400).send({
      error: "body must be a string",
    });
    return;
  }
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
notesRouter.patch("/:id", (req, res) => {
  const note = findById(req.params.id);
  if (!note) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  const { title, body } = req.body ?? {};
  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).send({
      error: "title is required and must be a non-empty string",
    });
    return;
  }
  if (body !== undefined && typeof body !== "string") {
    res.status(400).send({
      error: "body must be a string",
    });
    return;
  }
  const updated: Note = {
    ...note,
    title: title,
    body: body,
    updatedAt: new Date().toISOString(),
  };
  save(note);
  res.send(updated);
});
notesRouter.delete("/:id", (req, res) => {
  const deleted = remove(req.params.id);
  if (!deleted) {
    res.status(404).send({ error: "Note not found" });
    return;
  }
  res.status(204).end();
});
