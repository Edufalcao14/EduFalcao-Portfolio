import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { BackToTop } from '@/components/back-to-top/backToTop';
import { GlobalMatrixBackground } from '@/components/GlobalMatrixBackground';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getSettings } from '@/lib/content';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/**
 * Title and description come from the CMS instead of being hardcoded as
 * "Portfolio".
 *
 * The fallback is not decoration. This runs for every statically rendered page,
 * including the 404, and those are rendered inside a build container that has no
 * database. Without it the whole image fails to build.
 */
const METADATA_FALLBACK = {
  name: 'Eduardo Sampaio Falcão',
  title: 'Eduardo Falcão, Mobile Engineer · React Native & Expo',
  description:
    'Mobile engineer, React Native and Expo. 3 years of apps in production in fintech: payments, KYC, biometrics, 30k active users.',
};

export async function generateMetadata(): Promise<Metadata> {
  let name = METADATA_FALLBACK.name;
  let title = METADATA_FALLBACK.title;
  let description = METADATA_FALLBACK.description;

  try {
    const settings = await getSettings();
    name = settings.name;
    title = settings.defaultTitle;
    description = settings.defaultDescription;
  } catch {
    // No database reachable, which at build time is expected.
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edufalcao.site'),
    title: { default: title, template: `%s | ${name}` },
    description,
    icons: { icon: '/images/logo.svg' },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The site is written in English; it used to declare pt-BR.
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        <GlobalMatrixBackground />
        <Header />
        {children}
        <Footer />
        {/* Was rendered outside <body>, which is invalid markup. */}
        <BackToTop />
      </body>
    </html>
  );
}
