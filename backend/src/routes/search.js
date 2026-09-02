import express from 'express';
import axios from 'axios';
import redisClient from '../config/redis.js';
import { env } from '../config/env.js';
import { log } from 'console';

const router = express.Router();

router.post('/', async (req, res) => {
    const { query, top_k = 5, enable_rag = false } = req.body;

   if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required and must be a string.' });
    }

    // Construct a deterministic cache key
    const cacheKey = `search:${query.toLowerCase().trim()}:k${top_k}:rag${enable_rag}`;

    try {
        // CHECK REDIS CACHE FIRST
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                console.log(`CACHE HIT: Returning results for "${query}" from RAM`);
                return res.json({
                    source: 'redis_cache',
                    data: parsedData
                });
            } catch (parseErr) {
                console.warn(`CORRUPTED CACHE DETECTED: Deleting key "${cacheKey}"`);
                await redisClient.del(cacheKey);
            }
        }

        // CACHE MISS: Call Python FastAPI Engine
        console.log(`CACHE MISS: Forwarding query "${query}" to FastAPI Search Engine...`);

        const response = await axios.post(`${env.pythonApiUrl}/search`, {
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

export default router;



