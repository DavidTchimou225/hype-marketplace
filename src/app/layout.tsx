import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import BottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/components/CartProvider';
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/StructuredData';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Hype Market - Marketplace Mode Africaine en Côte d\'Ivoire',
    template: '%s | Hype Market'
  },
  description: 'Découvrez la marketplace N°1 de mode africaine en Côte d\'Ivoire. Vêtements wax, bogolan, bijoux, cosmétiques naturels. Livraison rapide à Abidjan. Boutiques certifiées, paiement sécurisé.',
  keywords: ['hype', 'streetwear', 'hype marketplace', 'marketplace', 'mode ivoirienne', 'late', 'choco', 'mode africaine', 'wax', 'bogolan', 'kente', 'marketplace Côte d\'Ivoire', 'e-commerce Abidjan', 'vêtements africains', 'bijoux africains', 'cosmétiques naturels', 'boutique en ligne Abidjan', 'shopping Côte d\'Ivoire'],
  authors: [{ name: 'Hype Market' }],
  creator: 'Hype Market',
  publisher: 'Hype Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hypemarket.ci'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hype Market - Marketplace Mode Africaine N°1 en Côte d\'Ivoire',
    description: 'La plus grande sélection de mode africaine authentique : Wax, Bogolan, Kente, bijoux et cosmétiques. Livraison rapide à Abidjan et dans toute la Côte d\'Ivoire.',
    url: 'https://hypemarket.ci',
    siteName: 'Hype Market',
    locale: 'fr_CI',
    type: 'website',
    images: [
      {
        url: '/logo-og.png',
        width: 1200,
        height: 630,
        alt: 'Hype - Fashion Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hype Market - Mode Africaine en Côte d\'Ivoire',
    description: 'Marketplace N°1 de mode africaine. Wax, Bogolan, bijoux et cosmétiques naturels. Livraison rapide.',
    images: ['/logo-og.png'],
    creator: '@hypemarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hype Market',
  },
  verification: {
    google: 'votre-code-google-search-console',
  },
  category: 'shopping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://hypemarket.ci" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <AuthProvider>
          <CartProvider>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <BottomNavigation />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
