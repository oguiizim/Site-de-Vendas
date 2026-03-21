import "dotenv/config";
import { Pool } from "pg";

const requiredEnvVars = [
  "POST_HOST",
  "POST_PORT",
  "POST_USER",
  "POST_PASSWORD",
  "POST_DATABASE",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`missing required environment variables: ${missingEnvVars}`);
  process.exit(1);
}

const pool = new Pool({
  host: process.env.POST_HOST,
  port: Number(process.env.POST_PORT) || 5432,
  user: process.env.POST_USER,
  password: process.env.POST_PASSWORD,
  database: process.env.POST_DATABASE,
});

export default pool;
