import { React } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import { LanguageProvider } from '@/context/LanguageContext'

export default function EventShareLayout({ children, params }) {
  return (
    <LanguageProvider>
      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
        {children}
      </main>
    </LanguageProvider>
  )
}
