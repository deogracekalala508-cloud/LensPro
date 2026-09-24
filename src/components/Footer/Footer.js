import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <h3 className="footer-logo">Lens<span className="text-gradient">Pro</span></h3>
            <p className="footer-tagline">La plateforme premium où les photographes exposent leurs œuvres et livrent en qualité originale.</p>
          </div>
          
          <div className="footer-col">
            <h4>Liens utiles</h4>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/explore">Explorer</Link></li>
              <li><Link href="/auth/login">Connexion</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/terms">Conditions d'utilisation</Link></li>
              <li><Link href="/privacy">Confidentialité</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>Contact & Paiement</h4>
            <p className="contact-info">
              Pour activer votre abonnement ou poser une question,
              contactez-nous via WhatsApp.
            </p>
            <a
              href="https://wa.me/24399068332?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20LensPro"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn"
            >
              💬 Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LensPro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
