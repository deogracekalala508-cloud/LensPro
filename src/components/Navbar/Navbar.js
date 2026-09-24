'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          Lens<span className="text-gradient">Pro</span>
        </Link>
        <nav className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>{t?.nav?.home || 'Accueil'}</Link>
          <Link href="/explore" className="nav-link" onClick={() => setIsOpen(false)}>{t?.nav?.explore || 'Explorer'}</Link>
          <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>{t?.nav?.dashboard || 'Dashboard'}</Link>
          <Link href="/events" className="nav-link" onClick={() => setIsOpen(false)}>{t?.nav?.events || 'Événements'}</Link>
          <Link href="/admin" className="nav-link admin-link" onClick={() => setIsOpen(false)}>⚡ Admin</Link>
          
          <div className="navbar-auth">
            <Link href="/auth/login" className="nav-link login" onClick={() => setIsOpen(false)}>{t?.nav?.login || 'Connexion'}</Link>
            <Link href="/auth/register" className="nav-btn register" onClick={() => setIsOpen(false)}>{t?.nav?.register || "S'inscrire"}</Link>
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} 
            className="lang-toggle"
            title="Changer de langue / Change language"
          >
            🌐 {language === 'fr' ? 'EN' : 'FR'}
          </button>
        </nav>
        <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
}
