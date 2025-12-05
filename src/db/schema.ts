import { pgTable, text, jsonb, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const cachedEtymologies = pgTable(
    'cached_etymologies',
    {
        word: text('word').notNull(),
        era: text('era').notNull(),
        content: jsonb('content').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.word, table.era] }),
        };
    }
);
