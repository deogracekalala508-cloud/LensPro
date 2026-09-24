import { React } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import { LanguageProvider } from '@/context/LanguageContext'

export default function EventsLayout({ children }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </main>
      <Footer />
    </LanguageProvider>
  )
}
