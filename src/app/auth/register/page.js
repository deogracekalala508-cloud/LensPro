'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import './register.css';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { signUp, hasSupabase } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    specialty: '',
    acceptedTerms: false
  });
  const [errors, setErrors] = useState({});

  const t = {
    fr: {
      title: 'Créer un compte',
      s1Title: 'Informations personnelles',
      s2Title: 'Détails du profil',
      s3Title: 'Confirmation',
      fullName: 'Nom complet',
      username: 'Nom d\'utilisateur',
      email: 'Email',
      password: 'Mot de passe',
      confirmPass: 'Confirmer le mot de passe',
      city: 'Ville',
      specialty: 'Spécialité',
      specOpts: ['Mariage', 'Portrait', 'Événement', 'Mode', 'Nature', 'Sport', 'Architecture', 'Gastronomie', 'Autre'],
      terms: 'J\'accepte les conditions d\'utilisation et la politique de confidentialité',
      next: 'Suivant',
      prev: 'Retour',
      submit: 'Créer mon compte',
      already: 'Déjà un compte ?',
      login: 'Connexion',
      summary: 'Résumé de vos informations'
    },
    en: {
      title: 'Create an account',
      s1Title: 'Personal Information',
      s2Title: 'Profile Details',
      s3Title: 'Confirmation',
      fullName: 'Full Name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPass: 'Confirm Password',
      city: 'City',
      specialty: 'Specialty',
      specOpts: ['Wedding', 'Portrait', 'Event', 'Fashion', 'Nature', 'Sports', 'Architecture', 'Food', 'Other'],
      terms: 'I accept the terms of service and privacy policy',
      next: 'Next',
      prev: 'Back',
      submit: 'Create Account',
      already: 'Already have an account?',
      login: 'Log in',
      summary: 'Information Summary'
    }
  };

  const curr = t[language] || t.fr;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    // Lire les valeurs directement depuis le formulaire DOM (mode uncontrolled)
    const form = e.target;
    const fd = new FormData(form);
    const formDataFromDom = {
      fullName: fd.get('fullName') || formData.fullName,
      username: fd.get('username') || formData.username,
      email: fd.get('email') || formData.email,
      password: fd.get('password') || formData.password,
      confirmPassword: fd.get('confirmPassword') || formData.confirmPassword,
      city: fd.get('city') || formData.city,
      specialty: fd.get('specialty') || formData.specialty,
      acceptedTerms: formData.acceptedTerms || formDataFromDom.acceptedTerms === 'on',
    };

    if (formDataFromDom.password !== formDataFromDom.confirmPassword) {
      alert(curr.confirmPass + ' ne correspond pas.');
      return;
    }

    setErrors({});
    const result = await signUp(formDataFromDom.email, formDataFromDom.password, {
      fullName: formDataFromDom.fullName,
      username: formDataFromDom.username,
      city: formDataFromDom.city,
      specialty: formDataFromDom.specialty,
    });
    if (!result.success) {
      setErrors({ form: result.error || (hasSupabase ? 'Erreur d\'inscription' : 'Erreur inscription') });
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="register-container">
      {/* Form Side */}
      <div className="register-form-side">
        <div className="register-glass-card">
          <div className="register-logo">LensPro</div>
          <h1 className="register-title">{curr.title}</h1>
          
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Les inputs sont toujours dans le DOM pour que FormData les capture */}

            {/* Champ step 1 : informations personnelles */}
            <div style={{ display: step <= 1 ? 'block' : 'none', position: step > 1 ? 'absolute' : 'static', visibility: step > 1 ? 'hidden' : 'visible', pointerEvents: step > 1 ? 'none' : 'auto', width: '100%', paddingBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#a1a1aa', fontWeight: 500 }}>{curr.s1Title}</h3>
              <div className="register-form-group">
                <label className="register-label">{curr.fullName}</label>
                <input type="text" name="fullName" defaultValue={formData.fullName} onChange={handleChange} className="register-input" required />
              </div>
              <div className="register-form-group">
                <label className="register-label">{curr.email}</label>
                <input type="email" name="email" defaultValue={formData.email} onChange={handleChange} className="register-input" required />
              </div>
              <div className="form-row">
                <div className="register-form-group">
                  <label className="register-label">{curr.password}</label>
                  <input type="password" name="password" defaultValue={formData.password} onChange={handleChange} className="register-input" required />
                </div>
                <div className="register-form-group">
                  <label className="register-label">{curr.confirmPass}</label>
                  <input type="password" name="confirmPassword" defaultValue={formData.confirmPassword} onChange={handleChange} className="register-input" required />
                </div>
              </div>
            </div>

            {/* Champ step 2 : détails du profil */}
            <div style={{ display: step <= 2 ? 'block' : 'none', position: step > 2 ? 'absolute' : 'static', visibility: step > 2 ? 'hidden' : 'visible', pointerEvents: step > 2 ? 'none' : 'auto', width: '100%', paddingBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#a1a1aa', fontWeight: 500 }}>{curr.s2Title}</h3>
              <div className="register-form-group">
                <label className="register-label">{curr.username}</label>
                <input type="text" name="username" defaultValue={formData.username} onChange={handleChange} className="register-input" required />
              </div>
              <div className="register-form-group">
                <label className="register-label">{curr.city}</label>
                <input type="text" name="city" defaultValue={formData.city} onChange={handleChange} className="register-input" required />
              </div>
              <div className="register-form-group">
                <label className="register-label">{curr.specialty}</label>
                <select name="specialty" defaultValue={formData.specialty} onChange={handleChange} className="register-select" required>
                  <option value="">Sélectionnez...</option>
                  {curr.specOpts.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Étape 3 : confirmation (inputs step 1 et 2 sont cachés mais présents dans le DOM) */}
            {step === 3 && (
              <div className="step-container">
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#a1a1aa', fontWeight: 500 }}>{curr.s3Title}</h3>
                <div className="summary-card">
                  <div className="summary-item">
                    <span className="summary-label">{curr.fullName}</span>
                    <span className="summary-value">{formData.fullName || '—'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{curr.email}</span>
                    <span className="summary-value">{formData.email || '—'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{curr.specialty}</span>
                    <span className="summary-value">{formData.specialty || '—'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{curr.city}</span>
                    <span className="summary-value">{formData.city || '—'}</span>
                  </div>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="acceptedTerms" defaultChecked={formData.acceptedTerms} onChange={handleChange} required />
                  <label className="checkbox-label">
                    {curr.terms}
                  </label>
                </div>
              </div>
            )}

            <div className="button-group">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="btn-prev">
                  {curr.prev}
                </button>
              )}
              <button type="submit" className={step === 3 ? "btn-submit" : "btn-next"}>
                {step === 3 ? curr.submit : curr.next}
              </button>
            </div>
          </form>

          <div className="register-footer">
            {curr.already} <Link href="/auth/login">{curr.login}</Link>
          </div>
        </div>
      </div>

      {/* Decorative Side */}
      <div className="register-decorative">
        <div className="lens-flare"></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Rejoignez LensPro</h2>
          <p style={{ fontSize: '1.1rem', color: '#e4e4e7', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
            La première plateforme pour les photographes professionnels en Afrique francophone.
          </p>
        </div>
      </div>
    </div>
  );
}
