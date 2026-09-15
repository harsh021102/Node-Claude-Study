import express from "express";
import { notesRouter } from "./routes/notes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export const app = express();

app.use((req, res, next) => {
  console.log("1. entered", req.method, req.url);
  next();
});
app.use(express.json());
app.use("/notes", notesRouter);
// app.use((req, res, next) => {
//   console.log("2. reached notFound");
//   next();
// });
app.use(notFoundHandler);
app.use(errorHandler);
