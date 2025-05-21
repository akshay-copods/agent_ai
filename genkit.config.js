import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

export const ai = genkit({
    plugins: [
        googleAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: googleAI.model('gemini-2.0-flash'),
        })
    ],
});

export async function createAI({prompt,tools, history}) {

    const response = await ai.generate({
        // model: googleAI.model('gemini-2.0-flash'),
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        tools,
        config: {
            temperature: 0.5,
        },
        history,
        safetySettings: {
            harassment: 'BLOCK_ONLY_HIGH',
            danger: 'BLOCK_NONE',
        },
        toolConfig: {
            extensionParams: { userId: "test123455" },
            executionMode: 'automatic' // Force automatic execution
        }
    });

    // Extract text from message content
    // save for history
    // console.log({historyRes});
    const responseText = response.message.content[0].text;
    console.log({responseText, calls: response.custom.functionCalls()})

    // Handle tool execution results
    // const toolCalls = response.custom.functionCalls().map(call => ({
    //     tool: call.name,
    //     parameters: call.args,
    //     result: call.result
    // }));

    console.log({
        text: responseText,
        // toolCalls
    })

    return {
        text: responseText,
    }
}
