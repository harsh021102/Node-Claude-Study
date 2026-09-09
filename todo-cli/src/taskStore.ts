import fs from "fs/promises";
const FILE = "task.json";
export async function loadTasks() {
  try {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
      throw err;
      //   console.log("Invalid task");
    }
  }
}

export async function saveTasks(tasks: any) {
  await fs.writeFile(FILE, JSON.stringify(tasks, null, 2));
}
