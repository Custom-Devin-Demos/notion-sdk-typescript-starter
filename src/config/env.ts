import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NOTION_TOKEN: string;
  PORT: number;
  CLIENT_ORIGIN: string;
}

function loadEnv(): EnvConfig {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      "NOTION_TOKEN is not set. Please create a .env file with NOTION_TOKEN=secret_..."
    );
  }

  return {
    NOTION_TOKEN: token,
    PORT: parseInt(process.env.PORT || "3000", 10),
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  };
}

export const env = loadEnv();
