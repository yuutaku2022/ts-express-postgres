import fs from "fs";
import path from "path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: npm run make:migration -- migration_name");
  process.exit(1);
}

const safeName = name
  .trim()
  .replace(/\s+/g, "_")
  .replace(/[^a-zA-Z0-9_-]/g, "")
  .toLowerCase();

const migrationsDir = path.resolve(process.cwd(), "src/db/migrations");
fs.mkdirSync(migrationsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
const filename = `${timestamp}_${safeName}.sql`;
const filepath = path.join(migrationsDir, filename);

const template = `-- migration: ${name}\n\nCREATE TABLE IF NOT EXISTS your_table_name (\n  id SERIAL PRIMARY KEY,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n`;

fs.writeFileSync(filepath, template, "utf8");
console.log(`Created migration file: ${filepath}`);
