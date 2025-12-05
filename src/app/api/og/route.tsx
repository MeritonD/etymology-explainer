import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// export const runtime = 'edge'; // Edge runtime can be unstable locally
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hasWord = searchParams.has('word');
        const word = hasWord
            ? searchParams.get('word')?.slice(0, 100)
            : 'Etymology Explainer';

        const era = searchParams.get('era') || 'History';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#171717',
                        color: 'white',
                        fontSize: 32,
                        fontWeight: 600,
                    }}
                >
                    <div style={{ marginBottom: 20 }}>Etymology Explainer</div>
                    <div style={{ fontSize: 80, fontWeight: 900, marginBottom: 20 }}>{word}</div>
                    <div style={{ fontSize: 40, opacity: 0.8 }}>{era}</div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );

    } catch (e: any) {
        console.log(e.message);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
