import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import searchRouter from './routes/search.js';

// Importing redis.js triggers the Redis connection on server startup
import './config/redis.js';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

app.use('/api/search', searchRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'express-backend' });
});

// Global 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(env.port, () => {
    console.log(`Express Backend running at http://localhost:${env.port}`);
});