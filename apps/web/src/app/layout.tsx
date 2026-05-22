import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/layout/Providers';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ChatVibe - Random Video Chat',
  description: 'Connect with people worldwide through random video chat, text chat, and livestreams.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'ChatVibe - Random Video Chat',
    description: 'Connect with people worldwide through random video chat.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-bg-primary text-text-primary`}>
        <ThemeProvider>
          <Providers>
            <Navbar />
            <main className="pt-16 pb-20 md:pb-0">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
