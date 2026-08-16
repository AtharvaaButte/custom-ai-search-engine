import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  pythonApiUrl : process.env.PYTHON_API_URL || 'http://127.0.0.1:8000',
  port: process.env.PORT || 5000,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  groqApiKey: process.env.GROQ_API_KEY,
};

