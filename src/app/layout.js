import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// AuthProviderClient est un Client Component avec état - on le charge côté client
const AuthProviderClientDynamic = dynamic(() => import('../context/AuthProviderClient').then(mod => ({ default: mod.AuthProviderClient })), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Chargement...</div>
});

// LanguageProvider et DemoProvider évitent le bailout CSR grâce à dynamic import avec ssr: false
const LanguageProviderDynamic = dynamic(() => import('../context/LanguageContext').then(mod => ({ default: mod.LanguageProvider })), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Chargement...</div>
});

const DemoProviderDynamic = dynamic(() => import('../context/DemoContext').then(mod => ({ default: mod.DemoProvider })), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Chargement...</div>
});

export const metadata = {
  title: 'LensPro — Votre vitrine photo professionnelle',
  description: 'La plateforme premium où les photographes exposent leurs œuvres et livrent des photos de haute qualité à leurs clients.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageProviderDynamic>
          <DemoProviderDynamic>
            <AuthProviderClientDynamic>
              <Navbar />
              <main className="main-content">
                {children}
              </main>
              <Footer />
            </AuthProviderClientDynamic>
          </DemoProviderDynamic>
        </LanguageProviderDynamic>
      </body>
    </html>
  );
}
