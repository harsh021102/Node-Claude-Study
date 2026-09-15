import express from "express";
import { app } from "./app.js";
import { config } from "./config.js";

const PORT = Number(config.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`Sever is listening at ${PORT}`);
});
