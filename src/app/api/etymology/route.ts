
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { etymologySchema } from '@/lib/etymology-schema';

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
    const { word, era } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
    }

    console.log(`Processing etymology for: ${word} in era: ${era}`);

    try {
        const result = await streamObject({
            model: google('gemini-2.5-flash'),
            schema: etymologySchema,
            prompt: `Explain the etymology of the word "${word}".
        targetEra: ${era || 'Modern Day'}
        
        Strictly follow the schema.
        CRITICAL: For the 'timeCapsule', you must provide a sentence that uses the word "${word}" AS IT WAS UNDERSTOOD in the '${era}'.
        If the word did not exist, explain the closest equivalent or its root.
        Contrast the meaning if it has changed significantly (e.g. gay: happy vs homosexual).`,
        });

        return result.toTextStreamResponse();
    } catch (e) {
        console.error('Etymology API Error:', e);
        return new Response('Error generating etymology', { status: 500 });
    }
}
