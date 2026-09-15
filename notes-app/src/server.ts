import express from "express";
import { app } from "./app.js";
import { config } from "./config.js";
import { load } from "./store.js";
import { error } from "console";

try {
  await load();
} catch (error) {
  console.error("Failed to start");
  console.error(error instanceof Error ? error.message : error);
  if (error instanceof Error && error.cause) {
    console.error("Caused by:", error.cause);
  }
  process.exit(1);
}
app.listen(config.PORT, () => {
  console.log(`Sever is listening at ${config.PORT}`);
});
