import express from "express";
import { notesRouter } from "./routes/notes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export const app = express();

app.use(express.json());
app.use("/notes", notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
