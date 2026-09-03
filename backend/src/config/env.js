import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const rawPythonUrl = process.env.PYTHON_API_URL || process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';
const formattedPythonUrl = rawPythonUrl.startsWith('http://') || rawPythonUrl.startsWith('https://')
  ? rawPythonUrl
  : `http://${rawPythonUrl}`;

export const env = {
  pythonApiUrl: formattedPythonUrl,
  port: process.env.PORT || 5000,
  redisUrl: process.env.REDIS_URL || (process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : "redis://localhost:6379"),
  groqApiKey: process.env.GROQ_API_KEY,
};
