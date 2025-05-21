import { z } from 'zod';
import {ai} from './genkit.config.js';
import { addPassion, addActivity, googleSearch } from './handler.js';

const addPassionTool = ai.defineTool(
    {
        name: 'addPassion',
        description: 'Adds a passion (hobby or ongoing interest) to the user profile.',
        inputSchema: z.object({
            name: z.string().describe('The passion to add (e.g., "karate", "photography")'),
            userId: z.string().optional(),
        }),
        outputSchema: z.object({
            success: z.boolean().describe('Whether the passion was added successfully'),
            message: z.string().describe('The message to the user'),
            result: z.any().describe('The result of the operation'),
        }),
    },
    async ({name, userId}) => {
        console.log("before addPassion", {name, userId})
        return addPassion({name, userId})
    },
);

const googleSearchTool = ai.defineTool(
    {
        name: 'googleSearch',
        description: '"Search the web for any information, including current date, time, weather, news, facts, or answers to user questions."',
        inputSchema: z.object({
            query: z.string().describe('The query to search for'),
        }),
        outputSchema: z.array(
            z.object({
                title:   z.string(),
                link:    z.string(),
                snippet: z.string()
            })
        ),
    },
    async ({query}) => {
        console.log("before googleSearch", {query})
        const result = await googleSearch({query})
        console.log("after googleSearch", {result})
        return result
    },
);

const addActivityTool = ai.defineTool(
    {
        name: 'addActivity',
        description: 'Adds an activity (event, achievement, or competition) to the user profile.',
        inputSchema: z.object({
            name: z.string().describe('The activity title (e.g., "national karate championship", "science fair")'),
            userId: z.string().optional()
        }),
        outputSchema: z.object({
            success: z.boolean().describe('Whether the activity was added successfully'),
            message: z.string().describe('The message to the user'),
            result: z.any().describe('The result of the operation'),
        }),
    },
    async ({name}) => {
        console.log("before addActivity", {name})
        return addActivity({name})
    },
);

export { addPassionTool, addActivityTool, googleSearchTool };