
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { etymologySchema } from '@/lib/etymology-schema';

import { checkRateLimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';
import { cachedEtymologies } from '@/db/schema';
import { headers } from 'next/headers';

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
    const { word, era } = await req.json();

    // Rate Limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await checkRateLimit(ip);

    if (!success) {
        return new Response("Too Many Requests", { status: 429 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
    }

    console.log(`Processing etymology for: ${word} in era: ${era}`);

    // 1. Check Cache
    try {
        const cached = await db.query.cachedEtymologies.findFirst({
            where: (table, { and, eq }) => and(eq(table.word, word), eq(table.era, era)),
        });

        if (cached) {
            console.log('CACHE HIT');
            return Response.json(cached.content, {
                headers: { 'X-Cache': 'HIT' }
            });
        }
    } catch (e) {
        console.error('Cache Check Failed:', e);
        // Continue to generate on cache error
    }

    console.log('CACHE MISS - Generating');

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
            onFinish: async ({ object }) => {
                if (object) {
                    try {
                        await db.insert(cachedEtymologies).values({
                            word,
                            era,
                            content: object,
                        }).onConflictDoUpdate({
                            target: [cachedEtymologies.word, cachedEtymologies.era],
                            set: { content: object, createdAt: new Date() }
                        });
                        console.log('Saved to Cache');
                    } catch (err) {
                        console.error('Failed to save to cache:', err);
                    }
                }
            }
        });

        // Add Miss Header to the stream response
        const response = result.toTextStreamResponse();
        response.headers.set('X-Cache', 'MISS');
        return response;

    } catch (e) {
        console.error('Etymology API Error:', e);
        return new Response('Error generating etymology', { status: 500 });
    }
}
