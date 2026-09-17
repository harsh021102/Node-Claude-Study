import { readFile, writeFile } from "fs/promises";
import type { Note } from "./types.js";
import { success, z } from "zod";
import { config } from "./config.js";

const noteSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  body: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
const notesFileSchema = z.array(noteSchema);
const notes = new Map<string, Note>();

function isNodeError(e: unknown): e is NodeJS.ErrnoException {
  return e instanceof Error && "code" in e;
}

export async function load(): Promise<void> {
  let raw: string;

  try {
    raw = await readFile(config.DATA_FILE, "utf-8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      await writeFile(config.DATA_FILE, "[]", "utf-8");
      return;
    }
    throw error;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `${config.DATA_FILE} is not valid JSON. Fix or remove it to start fresh.`,
      { cause: error },
    );
  }
  const result = notesFileSchema.safeParse(parsed);
  if (!result.success) {
    const detail = result.error.issues
      .slice(0, 5)
      .map((i) => `[${i.path.join(".")}] ${i.message}`)
      .join("\n");

    throw new Error(
      `${config.DATA_FILE} does not match the expected shape:\n${detail}`,
    );
  }
  for (const note of result.data) {
    notes.set(note.id, note);
  }
}

export function findAll() {
  return [...notes.values()];
}

export function findById(id: string) {
  return notes.get(id);
}

export async function save(note: Note): Promise<void> {
  notes.set(note.id, note);
  await persist();
}
export async function remove(id: string) {
  const exist = notes.delete(id);
  if (exist) await persist();
  return exist;
}

async function persist(): Promise<void> {
  const dataToSave = Array.from(notes.values());
  await writeFile(
    config.DATA_FILE,
    JSON.stringify(dataToSave, null, 2),
    "utf-8",
  );
}
