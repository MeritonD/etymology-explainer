'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import { etymologySchema } from '@/lib/etymology-schema';
import { Search, Sparkles, BookOpen, Clock, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { useRouter, useSearchParams } from 'next/navigation';

interface EtymologyInterfaceProps {
    initialWord?: string;
    initialEra?: string;
}

export function EtymologyInterface({ initialWord = '', initialEra = 'Victorian Era' }: EtymologyInterfaceProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [inputWord, setInputWord] = useState(initialWord || searchParams.get('word') || '');
    const [era, setEra] = useState(initialEra || searchParams.get('era') || 'Victorian Era');

    const { object, submit, isLoading, error } = useObject({
        api: '/api/etymology',
        schema: etymologySchema,
    });

    // Auto-search if props are provided (Deep Linking)
    useEffect(() => {
        if (initialWord && !object && !isLoading && !error) {
            submit({ word: initialWord, era: initialEra });
        }
    }, [initialWord, initialEra]); // Run once on mount if initials provided

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputWord.trim()) return;

        // Update URL without reload
        const params = new URLSearchParams();
        params.set('word', inputWord);
        params.set('era', era);
        router.replace(`/?${params.toString()}`);

        submit({ word: inputWord, era });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">

                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-full mb-4">
                        <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                        <span className="text-sm font-medium text-indigo-300">AI-Powered Word Histories</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
                        Etymology Explainer
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-lg mx-auto">
                        Discover the hidden stories behind everyday words.
                        Select a historical era to understand how it was used back then.
                    </p>
                </div>

                {/* Search & Configuration */}
                <div className="max-w-xl mx-auto mb-20">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-2 focus-within:border-indigo-500 transition-colors">
                                <Search className="w-6 h-6 text-neutral-500 ml-3" />
                                <input
                                    type="text"
                                    value={inputWord}
                                    onChange={(e) => setInputWord(e.target.value)}
                                    placeholder="Enter a word (e.g. 'serendipity')"
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-2 placeholder:text-neutral-600 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputWord}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-center flex-wrap">
                            {['Ancient Roots', 'Medieval', 'Victorian Era', '1920s Jazz Age', 'Modern Day'].map((e) => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setEra(e)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                        era === e
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"
                                    )}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>

                {/* Results Display */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                        {error.message || "Something went wrong. Please try again."}
                    </div>
                )}

                {object && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

                        {/* Primary Meaning Card */}
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
                                <h2 className="text-4xl font-bold text-white font-serif">{object.word}</h2>
                                {object.phonetic && (
                                    <span className="text-2xl text-neutral-500 font-mono">{object.phonetic}</span>
                                )}
                                <div className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm">
                                    <Globe className="w-4 h-4 mr-2" />
                                    {object.originLanguage}
                                </div>
                            </div>
                            <p className="text-xl text-neutral-300 leading-relaxed max-w-3xl">
                                {object.meaning}
                            </p>
                        </div>

                        {/* Time Capsule - Historical Usage */}
                        {object.timeCapsule && (
                            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Clock className="w-24 h-24 text-indigo-500" />
                                </div>
                                <h3 className="text-indigo-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Time Capsule: {object.timeCapsule.era}
                                </h3>
                                <div className="space-y-4">
                                    <blockquote className="text-2xl font-serif italic text-white border-l-4 border-indigo-500 pl-4">
                                        "{object.timeCapsule.usageExample}"
                                    </blockquote>
                                    <p className="text-neutral-400 leading-relaxed">
                                        {object.timeCapsule.contextExplanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-neutral-400 font-semibold uppercase tracking-wider text-sm flex items-center mb-6">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Evolution
                                </h3>
                                <div className="relative border-l border-neutral-800 ml-3 space-y-8 pb-4">
                                    {object.history?.map((event, i) => {
                                        if (!event) return null;
                                        return (
                                            <div key={i} className="ml-8 relative">
                                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-neutral-900 border-2 border-indigo-500/50"></span>
                                                <span className="text-indigo-400 font-bold block text-sm mb-1">{event.period}</span>
                                                <p className="text-neutral-400 text-sm">{event.description}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Fun Fact */}
                                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6">
                                    <h4 className="text-amber-500 font-semibold mb-2">Did you know?</h4>
                                    <p className="text-neutral-400 italic">"{object.funFact}"</p>
                                </div>

                                {/* Related Words */}
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                    <h4 className="text-neutral-400 font-semibold mb-4">Related / Cognates</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {object.relatedWords?.map((w, i) => (
                                            <span key={i} className="px-3 py-1 bg-neutral-800 rounded-md text-sm text-neutral-300">
                                                {w}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AdPlaceholder className="mt-8" />
                    </div>
                )}
            </div>
        </div>
    );
}
