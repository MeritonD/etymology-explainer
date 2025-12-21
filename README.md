# Etymology Explainer 🕰️

Welcome to my **Etymology Explainer**! This is a project I built to explore the fascinating history of words, but with a twist. Instead of just a dry dictionary definition, I wanted to create a "Time Capsule" experience where you can see how a word was understood and used in different historical eras.

## What is this?

This is a web application that uses generative AI to take you on a journey through time.
- **Time Capsules**: Select a historical era (e.g., Ancient Rome, Victorian Era, The Roaring 20s) and see the etymology of a word from that specific cultural context.
- **Contextual Usage**: It doesn't just tell you the origin; it shows you how people *actually* used the word back then.

## How I Built It

I built this using a modern web stack, focusing on performance and AI integration.

### Tech Stack
- **[Next.js](https://nextjs.org/)**: The React framework for the web.
- **[Vercel AI SDK](https://sdk.vercel.ai/docs)**: To seamlessly stream AI responses to the frontend.
- **[Google Gemini](https://deepmind.google/technologies/gemini/)**: specifically `gemini-2.5-flash`, which powers the etymological insights.

## Getting Started

If you want to run this locally and play around with it:

1.  **Clone the repo**.

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn
    # or
    pnpm install
    ```

3.  **Set up your environment**:
    Make sure you have your Google Generative AI API key ready and set it in your `.env.local` file:
    ```bash
    GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to start exploring word histories!

## Future Ideas

I'm thinking about adding more eras, maybe even future sci-fi perspectives, or "famous person" capsules. Let me know if you have any cool ideas!
