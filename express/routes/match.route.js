const OpenAI = require("openai");
const { Pinecone } = require('@pinecone-database/pinecone');

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const pc = new Pinecone({
  apiKey: 'pcsk_44Bcxs_F982ccogHqrd6zHcKQ8KerepiPqdXB4Cmycd6Tvy2BMZvvmD1BLkuyF84bWNRWM'
});
const index = pc.index('sume');

const openai = new OpenAI({
    apiKey: "sk-afbab412717241a19864f432b830930a", //  API key for OpenAI
    baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
});

async function getEmbeddingAndQuery(resumeText, state, specialization, jobType) {
    console.log(resumeText, state, specialization, jobType)
    try {
        // Get embedding
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-v3",
            input: resumeText,
            dimensions: 1024, 
            encoding_format: "float"
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Prepare filter
        let filter = {};
        if (state) {
            filter.state = { $eq: state };
        }
        if (specialization) {
            filter.specialization = { $eq: specialization };
        }
        if (jobType) {
            filter.jobType = { $eq: jobType };
        }

        // Query Pinecone
        const queryResponse = await index.query({
            topK: 10,
            vector: embedding,
            includeMetadata: true,
            ...(Object.keys(filter).length > 0 && { filter })
        });

        console.log("Embedding:", JSON.stringify(embeddingResponse, null, 2));
        console.log("Query Response:", JSON.stringify(queryResponse, null, 2));

        return queryResponse;
    } catch (error) {
        console.error('Error:', error);
    }
}


router.post('/test', async (req, res) => {
  try {
    
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
    const body = req.body
    try {
    
    res.json(
        await getEmbeddingAndQuery(
            body.resumeText, 
            body.state,
            body.specialization,
            body.jobType
        )
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;