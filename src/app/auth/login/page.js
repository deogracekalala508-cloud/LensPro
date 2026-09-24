'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import './login.css';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { signIn, hasSupabase } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const t = {
    fr: {
      title: 'Bon retour',
      subtitle: 'Connectez-vous pour gérer vos photos',
      email: 'Email',
      password: 'Mot de passe',
      forgot: 'Mot de passe oublié ?',
      loginBtn: 'Se connecter',
      or: 'ou continuer avec',
      noAccount: 'Pas encore de compte ?',
      register: 'S\'inscrire',
      emailReq: 'L\'email est requis',
      passReq: 'Le mot de passe est requis'
    },
    en: {
      title: 'Welcome back',
      subtitle: 'Sign in to manage your photos',
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot password?',
      loginBtn: 'Sign In',
      or: 'or continue with',
      noAccount: 'Don\'t have an account?',
      register: 'Sign up',
      emailReq: 'Email is required',
      passReq: 'Password is required'
    }
  };

  const curr = t[language] || t.fr;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = curr.emailReq;
    if (!formData.password) newErrors.password = curr.passReq;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = await signIn(formData.email, formData.password);
    if (!result.success) {
      setErrors({ form: result.error || (hasSupabase ? 'Erreur de connexion' : 'Erreur connexion') });
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="auth-container">
      {/* Decorative Side */}
      <div className="auth-decorative">
        <div className="floating-photo p1"></div>
        <div className="floating-photo p2"></div>
        <div className="aperture-animation">
          <div className="aperture-blade"></div>
          <div className="aperture-blade"></div>
          <div className="aperture-blade"></div>
          <div className="aperture-blade"></div>
          <div className="aperture-blade"></div>
          <div className="aperture-blade"></div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-glass-card">
          <div className="auth-logo">LensPro</div>
          <h1 className="auth-title">{curr.title}</h1>
          <p className="auth-subtitle">{curr.subtitle}</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">{curr.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`auth-input ${errors.email ? 'error' : ''}`}
                placeholder="nom@exemple.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">{curr.password}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`auth-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="auth-forgot">
              <Link href="#">{curr.forgot}</Link>
            </div>

            <button type="submit" className="auth-submit">
              {curr.loginBtn}
            </button>
          </form>

          <div className="auth-divider">
            <span>{curr.or}</span>
          </div>

          <div className="auth-social">
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div className="auth-footer">
            {curr.noAccount} <Link href="/auth/register">{curr.register}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
