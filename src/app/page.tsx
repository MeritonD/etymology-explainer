
import { EtymologyInterface } from '@/components/etymology-interface';
import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import { getBaseUrl } from '@/lib/url-utils';

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const word = params.word as string;
  const era = params.era as string || 'Victorian Era';

  if (!word) {
    return {
      title: 'Etymology Explainer',
      description: 'Discover the hidden stories behind everyday words with AI.',
    }
  }

  // Use the OG Image Route
  const ogUrl = new URL(`${getBaseUrl()}/api/og`);
  ogUrl.searchParams.set('word', word);
  ogUrl.searchParams.set('era', era);

  return {
    title: `${word} - Etymology Explainer`,
    description: `Discover the history of the word "${word}" in the ${era}.`,
    openGraph: {
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const word = typeof params.word === 'string' ? params.word : undefined;
  const era = typeof params.era === 'string' ? params.era : undefined;

  return (
    <EtymologyInterface initialWord={word} initialEra={era} />
  );
}
