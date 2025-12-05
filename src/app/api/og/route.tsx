import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
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
                        backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #171717)',
                        fontFamily: 'sans-serif',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #404040',
                            borderRadius: '20px',
                            padding: '40px 80px',
                            backgroundColor: 'rgba(23, 23, 23, 0.5)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#818cf8', fontSize: '24px', fontWeight: 600 }}>
                            Etymology Explainer
                        </div>

                        <div
                            style={{
                                fontSize: 80,
                                fontWeight: 900,
                                background: 'linear-gradient(to bottom right, #ffffff, #a3a3a3)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                marginBottom: '10px',
                                textTransform: 'capitalize',
                            }}
                        >
                            {word}
                        </div>

                        <div style={{ fontSize: 30, color: '#a3a3a3', marginTop: '10px' }}>
                            Time Capsule: <span style={{ color: '#818cf8', marginLeft: '8px' }}>{era}</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
