import { Router } from "express";
import { findAll, save, remove, findById } from "../store.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  createNoteSchema,
  listQuerySchema,
  updateNoteSchema,
  type CreateNoteInput,
  type ListQuery,
  type UpdateNoteInput,
} from "../schemas/note.js";
import type { Note } from "../types.js";
import { NotFoundError } from "../errors.js";
export const notesRouter = Router();
// import crypto from "crypto";
// notesRouter.get("/test", (req, res) => res.send("Server is in good health"));

notesRouter.get("/", validateQuery(listQuerySchema), (req, res) => {
  const { search, page, limit, sort, order } = res.locals.query as ListQuery;
  const allNotes: Note[] = findAll();
  let filteredNotes = allNotes;
  if (search) {
    const searchTerm = String(search).toLowerCase();
    filteredNotes = filteredNotes.filter((note) => {
      const titleMatch = note.title?.toLowerCase().includes(searchTerm);
      const bodyMatch = note.body?.toLowerCase().includes(searchTerm);
      return titleMatch || bodyMatch;
    });
  }
  filteredNotes = filteredNotes.sort((a, b) => {
    const cmp = a[sort].localeCompare(b[sort]);
    return order === "asc" ? cmp : -cmp;
  });
  const total = allNotes.length;
  const offset = (page - 1) * limit;
  const paginatedNotes = filteredNotes.slice(offset, offset + limit);
  res.status(200).json({
    metadata: {
      page: page,
      limit: limit,
      // Use the length of the FILTERED array, not the total files array
      totalItems: filteredNotes.length,
      totalPages: Math.ceil(filteredNotes.length / limit),
      searchTerm: search || null,
    },
    data: paginatedNotes,
  });
});

// notesRouter.get("/boom", async (req, res) => {
//   throw new Error("Simulated database failure");
// });

notesRouter.get("/:id", (req, res) => {
  const note = findById(req.params.id);
  if (!note) {
    throw new NotFoundError("Note");
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
  const deleted = remove(req.params.id);
  if (!deleted) {
    throw new NotFoundError("Note");
  }
  res.status(204).end();
});
