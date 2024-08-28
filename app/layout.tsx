// next/font imports
import { Inter, JetBrains_Mono } from 'next/font/google';
// Import global styles
import './globals.css';
// Import required types from React
import { ReactNode } from 'react';
// Import Next.js Head component for setting meta tags
import Head from 'next/head';

import { Header } from '../components/header';

// Initialize fonts
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Define and export the RootLayout component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Next.js App</title>
        <meta name="description" content="Description of my Next.js app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
