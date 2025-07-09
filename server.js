// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import { createAI } from './genkit.config.js';
import { addPassionTool, addActivityTool, googleSearchTool } from './tools.js';
import { addPassion, addActivity } from './handler.js';

dotenv.config();
// const serviceAccountKey = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH, 'utf8'));

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// // Initialize Firebase Admin SDK
// initializeApp({
//     credential: cert(serviceAccountKey)
// });
// const db = getFirestore();

// Endpoint to interact with Genkit
app.post('/generate', async (req, res) => {
    try {
        const { prompt, chatHistory } = req.body;

        const tools = [addPassionTool, addActivityTool, googleSearchTool]

        // trim chat history excluding fist message since it is actual prompt we need to send
        const trimChatHistory = chatHistory.slice(1);
        
        const chatHistoryPrompt = trimChatHistory.map(message => `${message.role}: ${message.content}\n`);

        console.log({prompt, req: req.body});
        console.log("123",chatHistoryPrompt[0]);

        const inputPrompt = {
            text: `[RAW USER INPUT TO PROCESS]
        ${prompt}
        
        [SYSTEM RULES]
        1. Extract activity/passion names DIRECTLY from text
        2. NEVER ask follow-up questions
        3. Format names EXACTLY as mentioned
        4. Auto-fill parameters using pattern: 
            - Activity: "[verb] [event]" (e.g., "won karate competition")
            - Passion: "[base noun]" (e.g., "karate")`
        }

        const userMessage = typeof prompt === 'string' 
        ? prompt 
        : JSON.stringify(prompt).replace(/"/g, '');

        const response = await createAI({
            prompt: {
                text: `
                    Answer the following question: ${userMessage}

                    Please use these following chat history as context: ${chatHistoryPrompt}

                    Please follow the following tools and rules you need to follow: 

                    You are a friendly assistant named Chotu. You have two backend tools you can call:
                    1. addPassion(name) – adds a hobby/interest to the user’s profile  
                    2. addActivity(title, date?) – adds an event/achievement/competition  
                    
                    **Mode switching**  
                    - If the user is just making small talk, asking how you are, or requesting general info, **do not** call any tools—just reply naturally.
                    - Before calling tools, show user the tool call and ask for confirmation.
                    - If the user mentions a hobby or ongoing interest (e.g. “I love painting,” “I’ve been learning guitar”), call **addPassion** with the passion name, then confirm with a friendly sentence.  
                    - If the user mentions a specific event, achievement, or competition (e.g. “I ran the city marathon on March 3rd,” “I won the debate contest”), call **addActivity** with title and date, then confirm.  
                    - If the user message contains both, call both tools in the appropriate order, then confirm both additions in a single reply.
                    
                    **Reply style**  
                    - Always respond in plain, warm English.  
                    - After calling tools, summarize what you added:  
                    “[✅] Added passion: painting.  
                    [✅] Added activity: city marathon on 2025‑03‑03.”  
                    
                    **Examples**  
                    User: “Hi there!”  
                    Assistant: “Hey! I’m doing great—how can I help you today?”  
                    
                    User: “I’ve been practicing yoga every morning.”  
                    Assistant (internally): addPassion(“yoga”)  
                    Assistant → “Awesome! [✅] I’ve added your passion: yoga. Anything else you’d like to add?”  
                    
                    User: “How’s the weather?”  
                    Assistant: “It’s sunny where I am—what’s up?”  
                    
                    Now here’s the user’s latest message:  
                    “${prompt}”
                        `.trim()
            },
            tools,
            history: chatHistoryPrompt
        });

        console.log({response});
        res.json(response);
    } catch (error) {
        console.error('Error generating text:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
