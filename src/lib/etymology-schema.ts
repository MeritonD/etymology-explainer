import { z } from 'zod';

export const etymologySchema = z.object({
    word: z.string(),
    phonetic: z.string().optional(),
    originLanguage: z.string().describe('The primary language of origin (e.g. Latin, Old English)'),
    meaning: z.string().describe('The current meaning of the word'),
    history: z.array(z.object({
        period: z.string().describe('e.g. "14th Century", "Old French"'),
        description: z.string().describe('What happened to the word in this period'),
    })).describe('Chronological evolution of the word'),
    funFact: z.string().describe('A surprising or amusing fact about the word'),
    relatedWords: z.array(z.string()).describe('Cognates or words with shared roots'),
    timeCapsule: z.object({
        era: z.string().describe('The historical era selected by the user (or best fit)'),
        usageExample: z.string().describe('A sentence demonstrating how the word was used in that era. STRICTLY use the historical meaning.'),
        contextExplanation: z.string().describe('Explanation of why the usage is different from today (e.g., "In the 1890s, gay meant carefree...")'),
    }).describe('A snapshot of the word in a specific time period'),
});

export type Etymology = z.infer<typeof etymologySchema>;
