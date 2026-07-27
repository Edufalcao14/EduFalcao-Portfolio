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

/** Title and description come from the CMS instead of being hardcoded as "Portfolio". */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eduardofalcao.dev'),
    title: {
      default: settings.defaultTitle,
      template: `%s | ${settings.name}`,
    },
    description: settings.defaultDescription,
    icons: {
      icon: '/images/logo.svg',
    },
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
