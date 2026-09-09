import { ValidationError, NotFoundError } from "./error.js";
import { loadTasks, saveTasks } from "./taskStore.js";

interface Task {
  id: string;
  task: string | undefined;
  completed: boolean;
}
const handleAdd = async (title: string | undefined) => {
  try {
    if (!title || title.trim() === "")
      throw new ValidationError("Invalid Input");
    const data = await loadTasks();
    4;
    const task = { id: Date.now().toString(), task: title, completed: false };
    data.push(task);
    await saveTasks(data);
    return task;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    } else throw err;
  }
};

async function handleList() {
  const data = await loadTasks();
  return data;
}
async function handleComplete(id: string | undefined) {
  const data = await loadTasks();
  let task = data.find((item: Task) => item.id === id);
  if (!task) throw new NotFoundError("Item not found");
  const newData = data.map((item: Task) =>
    item.id === id ? { ...task, completed: true } : item,
  );
  await saveTasks(newData);
}
async function handleRemove(id: string | undefined) {
  const data = await loadTasks();
  const newData = data.filter((item: Task) => item.id !== id);
  if (!newData.length) throw new NotFoundError("Item not found");
  await saveTasks(newData);
  return { id: id };
}

async function main() {
  const command = process.argv[2];
  try {
    let result;
    switch (command) {
      case "add":
        result = await handleAdd(process.argv[3]);
        break;
      case "list":
        result = await handleList();
        break;
      case "complete":
        result = await handleComplete(process.argv[3]);
        break;
      case "remove":
        result = await handleRemove(process.argv[3]);
        break;
      default:
        console.log(`Unknown command: ${command}`);
        return;
    }
    console.log(result);
  } catch (err: unknown) {
    // console.error(`${err.name}: ${err.message}`);
  }
}

main();
