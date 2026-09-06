import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Geist, IBM_Plex_Mono } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${ibmMono.variable} min-h-dvh flex flex-col`}>
        <AuthProvider>
          <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3">
            <Navbar />
          </header>
          <main className="grow px-6 pt-18">{children}</main>
          <footer className="border-t border-line mt-auto">
            <Footer />
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
