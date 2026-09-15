import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATA_FILE: z.string().default("./data/notes.json"),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.log("Invalid environment configuration:");
  for (const issue of result.error.issues) {
    console.log(`${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = result.data;
