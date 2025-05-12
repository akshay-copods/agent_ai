// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
dotenv.config();
const serviceAccountKey = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH, 'utf8'));


const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
initializeApp({
    credential: cert(serviceAccountKey)
});

const db = getFirestore();

// Set up Genkit API
const ai = genkit({
    plugins: [googleAI({
        apiKey: process.env.GEMINI_API_KEY, // Use the API key from the .env file
    })],
    model: googleAI.model('gemini-2.0-flash'), // Set default model
    temperature: 0.5,
    maxTokens: 1000,
    topP: 1,
    topK: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    // tools: [addPassion, addActivity],
});

// Endpoint to interact with Genkit
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body; // Get prompt from the request body
        console.log({prompt, req: req.body})
        const { text } = await ai.generate(prompt); // Generate response using Genkit

        const messagesRef = db.collection('messages');
        const docRef = await messagesRef.add({
            text: text,
            timestamp: new Date(),
        });
        console.log('Added doc with ID:', docRef.id);

        res.json({ text });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
