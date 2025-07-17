import { z } from 'zod';
import {ai} from './genkit.config.js';
// import { addPassion, addActivity, googleSearch } from './handler.js';
import { DynamicTool, tool , DynamicStructuredTool} from "@langchain/core/tools";

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


const firestoreToolSchema = z.object({
    collectionName: z.string().describe("The name of the Firestore collection where data should be stored (e.g., 'notes', 'userPreferences')."),
    documentId: z.string().optional().describe("The specific ID for the document. If not provided, Firestore will generate a unique ID."),
    dataToStore: z.any().describe("The JavaScript object (data) to store in the document. It should be a valid JSON-like object."),
});


const addNiche = tool(
    ({name}) => {
        console.log("before addNiche", {name})
        return "Niche added successfully" + name;
    },
    {
        name: "addNiche",
        description: "Adds a Niche (hobby or ongoing interest) to the user profile.",
        schema: z.object({
            name: z.string().describe("The Niche to add (e.g., 'karate', 'photography')"),
            userId: z.string().optional().describe("The user ID of the user to add the Niche to."),
        }),
    }
);


const addActivity = tool(
    ({name}) => {
        console.log("before addActivity", {name})
        return "Activity added successfully" + name;
    },
    {
        name: "addActivityHandler",
        description: "Adds an activity (event, achievement, or competition) to the user profile.",
        schema: z.object({
            name: z.string().describe("The activity title (e.g., 'national karate championship', 'science fair')"),
        }),
    }
);

const addCourse = tool(
    ({name}) => {
        console.log("before addCourse", {name})
        return "Course added successfully" + name;
    },
    {
        name: "addCourse",
        description: "Adds a course to the user profile.",
        schema: z.object({
            name: z.string().describe("The course title (e.g., 'karate', 'photography')"),
        }),
    }
);

const addHonor = tool(
    ({name}) => {
        console.log("before addHonor", {name})
        return "Honor added successfully" + name;
    },
    {
        name: "addHonor",
        description: "Adds an honor to the user profile.",
        schema: z.object({
            name: z.string().describe("The honor title (e.g., 'karate', 'photography')"),
        }),
    }
);


const addTool = tool(
    async ({ a, b }) => {
      return a + b;
    },
    {
      name: "add",
      schema: z.object({
        a: z.number(),
        b: z.number(),
      }),
      description: "Adds a and b.",
    }
  );
  
  const multiplyTool = tool(
    async ({ a, b }) => {
      return a * b;
    },
    {
      name: "multiply",
      schema: z.object({
        a: z.number(),
        b: z.number(),
      }),
      description: "Multiplies a and b.",
    }
  );

const tools = [addNiche, addActivity, addCourse, addHonor, addTool, multiplyTool, googleSearchTool];

export { addPassionTool, addActivityTool, googleSearchTool, addActivity, addCourse, addHonor, addNiche, tools};