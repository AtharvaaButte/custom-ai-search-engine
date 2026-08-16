import express from 'express';
import axios from 'axios';
import redisClient from '../config/redis.js';

const router = express.Router();
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

router.post('/', async (req, res) => {
    const { query, top_k = 5, enable_rag = false } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required.' });
    }

    // Construct a deterministic cache key
    const cacheKey = `search:${query.toLowerCase().trim()}:k${top_k}:rag${enable_rag}`;

    try {
        // CHECK REDIS CACHE FIRST
        const cachedData = redisClient.get(cacheKey);
        if (cachedData) {
            console.log(`CACHE HIT: Returning results for "${query}" from RAM`);
            return res.json({
                source: 'redis_cache',
                data: JSON.parse(cachedData)
            });
        }

        // CACHE MISS: Call Python FastAPI Engine
        console.log(`CACHE MISS: Forwarding query "${query}" to FastAPI Search Engine...`);

        const response = await axios.post(`${PYTHON_API_URL}/search`, {
            query,
            top_k,
            enable_rag
        });

        const searchResults = response.data;
        // STORE IN REDIS WITH 120-SECOND EXPIRATION 
        await redisClient.set(cacheKey, JSON.stringify(searchResults), {
            EX: 120
        });

        return res.json({
            source: 'python_engine',
            data: searchResults
        });
    } catch (error) {
        console.error('Search Route Error:', error.message);
        return res.status(500).json({ error: 'Failed to process search request' });
    }
});