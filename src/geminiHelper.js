// import the Genkit and Google AI plugin libraries
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.0-flash'), // set default model
});

export async function main() {
  // make a generation request
  const { text } = await ai.generate('Hello, Gemini!');
  console.log({ text });
  return text;
}
