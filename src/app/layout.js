import { Inter } from 'next/font/google';
import { LanguageProvider } from '../context/LanguageContext';
import { DemoProvider } from '../context/DemoContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LensPro — Votre vitrine photo professionnelle',
  description: 'La plateforme premium où les photographes exposent leurs œuvres et livrent des photos de haute qualité à leurs clients.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageProvider>
          <DemoProvider>
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
