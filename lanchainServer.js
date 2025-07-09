// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
// import { createAI } from './genkit.config.js';
import { tools } from './tools.js';
// import { addPassion, addActivity } from './handler.js';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";

import {
    DynamicRetrievalMode
} from "@google/generative-ai";

dotenv.config();
// const serviceAccountKey = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH, 'utf8'));

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// // Initialize Firebase Admin SDK
// initializeApp({
//     credential: cert(serviceAccountKey)
// });
// const db = getFirestore();

// Endpoint to interact with Genkit

app.post('/generateLangChain', async (req, res) => {
    try {
        const { prompt, chatHistory } = req.body;

        // const tools = [addPassionTool, addActivityTool, googleSearchTool]

        // trim chat history excluding fist message since it is actual prompt we need to send
        const trimChatHistory = chatHistory.slice(1);
        
        const chatHistoryPrompt = trimChatHistory.map(message => `${message.role}: ${message.content}\n`);

        console.log({prompt, req: req.body});

        const inputPrompt =  `
        👉 You are a structured data assistant called Uni. Your job is to extract and save user information into one or more of the following categories:

            - Passion & Niche (hobbies, interests, skills, niches) → CALL_TOOL: add_passion
            - Activity (actions, projects, practice, tasks) → CALL_TOOL: add_activity
            - Honor (awards, recognitions) → CALL_TOOL: add_honor
            - Course (academic subjects, topics) → CALL_TOOL: add_course
            - College (universities, institutions) → CALL_TOOL: add_college

            -----

            User Context:
            - You may be talking to either a student or a parent.
            - You are always provided a user context object:
            - 'user_email': current user's email
            - 'isParent': true if the user is a parent
            - 'student_email': student email if the user is a parent

            Always refer to the right person:
            - If the user is a student: refer to "your profile"
            - If the user is a parent: refer to "your student" (or the student name if given)

            -----
            
            💬 APPRECIATION + ACTION FLOW

            - You may briefly appreciate or acknowledge user inputs (e.g., "Trekking sounds like a great experience!").
            - BUT you **must immediately follow this** with either:
                - a tool call (if explicit)
                - a confirmation prompt (if implied/descriptive)

            ✔️ Appreciation is OPTIONAL — but follow-up with tool logic is MANDATORY.

            ❌ Never stop at appreciation.

            🚦 INTENT TYPES & TOOL-CALL LOGIC

            1. **EXPLICIT INSTRUCTIONS (HIGHEST PRIORITY)**  
            - If the user message includes any clear directive words like "add", "save", "include", "insert", or similar,  
            and clearly specifies what to save and in which category, you must IMMEDIATELY call the correct tool.  
            DO NOT ask for confirmation.

            Examples:  
            - Add 2hr Trekking to activity  
            - Save chess as a passion  
            - Include robotics camp in activities

            Call the tool like this:  
            CALL_TOOL: add_activity { "activity_name": "2hr Trekking" }




            2. **Implied Category (Interest or Action)**
            - If the user expresses a clear interest (e.g., "I love chess") or describes doing something (e.g., "I built a website"), but doesn't explicitly say to add/save it:
            1. Identify the most appropriate category: Passion, Activity, Honor, etc.
            2. Ask the user for confirmation using the correct label with appreciation:
                - Passion → "Would you like me to save this as a passion in your profile?"
                - Activity → "Would you like me to save this as an activity in your profile?"
                - Honor → "Would you like me to save this as an honor in your profile?"
                - Course → "Would you like me to save this as a course in your profile?"
            3. If the user says yes, immediately call the appropriate tool using function call JSON.


            3. **Descriptive Action**
            - Triggered by actions like: "I participated in a robotics camp" or "I built a website."
            - Treat this as an activity.
            - Ask the user with appreciation: start with appreciating the user's action and then ask "Would you like me to save this as an activity in your profile?"
            - If the user agrees, call the tool using 'CALL_TOOL'.
            
            🚦 RESPONSE HANDLING AFTER CONFIRMATION

            - If the user confirms (e.g., says "Yes") after you asked for confirmation:
                → IMMEDIATELY CALL the appropriate tool.
                → DO NOT re-confirm or ask again like "Shall I go ahead?" — it wastes time and frustrates users.


            -----

            📎 MULTI-CATEGORY LOGIC

            If a user input implies **more than one category** (e.g., "I enjoy painting and recently held an art exhibition"):
            1. Identify each category (Passion + Activity).
            2. Preview what will be saved:  
            "I'm about to save *painting* as a passion and *art exhibition* as an activity in your profile. Shall I go ahead?"
            3. Only if user confirms, call each tool one by one:
            CALL_TOOL: add_passion { "passion": "Painting" }  
            CALL_TOOL: add_activity { "activity": "Art exhibition", "linked_to": "Painting" }

            4. Only after success of the tool call, confirm to user:  
            "Painting has been saved as a passion, and your art exhibition has been recorded as an activity."

            ---

            If the user input includes **multiple items in the same category** (e.g., "Add Soccer camp and Scuba Diving as activities"):
            1. Recognize both items as separate entries under the same category.
            2. Do NOT summarize the action unless you're emitting tool calls.
            3. You MUST emit a separate 'CALL_TOOL' for each item:
            CALL_TOOL: add_activity { "activity_name": "Soccer camp" }  
            CALL_TOOL: add_activity { "activity_name": "Scuba Diving" }

            4. After successful tool calls, confirm:
            "Soccer camp and Scuba Diving have been saved as activities in your profile. Would you like to add anything else?"


            -----


            🛑 CRITICAL RULES

            - DO NOT say something has been saved unless the tool call succeeds.
            - The tool call MUST be made explicitly using CALL_TOOL before confirming success to the user.
            - If the user agrees (e.g., says "yes") after you ask for confirmation to save something:
                → You MUST immediately emit the correct CALL_TOOL with appropriate JSON.
                → Do NOT respond with phrases like "okay, I'll save it" or "it has been saved" unless the tool call is part of your output.
            - If a tool returns an error (e.g., duplicate, user not found, etc), report it to the user clearly and do not claim success.
            - Never fake saving or pretend a tool was called if it wasn't.



            -----

            ✅ After any tool call(s) succeed:
            - If you saved **one** item, confirm by mentioning the <value> and its <category>, then invite more.
            - If you saved **multiple** items at once, list each <value> with its <category>, then invite more.
            - Always vary your phrasing so it sounds natural.

            Examples:

            Single-item save:
                "Great—<value> is now in your <category>. Anything else you'd like to add?"
                "All set! I've recorded <value> under <category>. Would you like to add more?"

            Multi-item save:
                "Done! I added <value1> as a <category1> and <value2> as a <category2>. Want to add anything else?"
                "Perfect—<value1> has been saved to <category1>, and <value2> to <category2>. Anything else on your mind?"
                "Your updates are in: <value1>/<category1>, <value2>/<category2>. Need to add more?"

            End of instruction. 👈
        `

        const userMessage = typeof prompt === 'string' 
        ? prompt
        : JSON.stringify(prompt).replace(/"/g, '');


        // langChain starts here
        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: "gemini-2.5-flash-preview-05-20",
        }).bindTools(tools);

        console.log({chatHistory})

        // Convert chat history to LangChain message format
        const messages = chatHistory?.map(msg => {
            if (msg.role === 'user') {
                return new HumanMessage(msg.content);
            } else {
                return new AIMessage(msg.content);
            }
        });

        messages.push(new HumanMessage(userMessage));   
        
        

        // messages.unshift(new SystemMessage(inputPrompt));

        console.log({messages, tools});

        const response = await model.invoke([
            new SystemMessage("Please use the google search tool if user asks about it."),
            ...messages,
        ]);

        let responseText = "";
        let toolCalls = [];

        if(typeof response.content === 'object') {
            toolCalls = response["tool_calls"];
        } else {
            responseText = response.content;
        }

        console.log({toolCalls});

        if(toolCalls.length > 0) {
            const toolsByName = tools.reduce((acc, tool) => {
                acc[tool.name] = tool;
                return acc;
            }, {});

            // Run tool calls (simulated here, replace with your real handlers)
            for (const call of toolCalls) {
                const selectedTool = toolsByName[call.name];
                const toolMessage = await selectedTool.invoke(call);
                console.log({toolMessage});

                messages.push(toolMessage);
            }



            const aiResponse = await model.invoke(messages);

            console.log({aiResponse});

            responseText = aiResponse.content;
        }
        console.log({messages});

        res.json({text: responseText, response});
    } catch (error) {
        console.error('Error generating text:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// Replace this with actual tool logic
async function handleToolCall(name, args) {
    switch (name) {
      case "addPassion":
      case "addActivity":
      case "addHonor":
      case "addCourse":
        console.log(`✅ ${name} executed with`, args);
        break;
      default:
        console.warn(`⚠️ Unknown tool: ${name}`);
    }
  }