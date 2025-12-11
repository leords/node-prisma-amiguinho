import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

// Garante que o .env da raiz seja carregado corretamente
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
