import express from "express";
import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`Sever is listening at ${PORT}`);
});
