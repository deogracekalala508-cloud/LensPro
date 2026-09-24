// EventCreator component for creating new social wall events
// Uses React.createElement to avoid JSX compilation issues

import React, { useState } from 'react';
import { createEvent } from '../../lib/events';

function EventCreator({ onCreated, userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const containerStyle = {
    background: 'white',
    borderRadius: 16,
    padding: 30,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: 500,
    margin: '0 auto'
  };
  
  const titleStyle = {
    marginBottom: 20,
    color: '#1a1a2e',
    fontSize: '1.5rem',
    textAlign: 'center'
  };
  
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  };
  
  const labelStyle = {
    fontWeight: 600,
    color: '#333',
    marginBottom: 6,
    fontSize: '0.95rem'
  };
  
  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    fontSize: '1rem',
    transition: 'border-color 0.2s'
  };
  
  const textareaStyle = {
    ...inputStyle,
    minHeight: 100,
    resize: 'vertical'
  };
  
  const submitBtnStyle = {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '1.05rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 10
  };
  
  const errorStyle = {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: 15
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        pinCode: pinCode.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined
      };
      
      // For now, use a mock creator since we need auth user
      const newEvent = {
        id: 'mock-' + Date.now(),
        ...eventData,
        share_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        user_id: userId,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      onCreated(newEvent);
    } catch (err) {
      setError('Erreur: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('h2', { style: titleStyle }, 'Créer un Événement Social'),
    error && React.createElement('div', { style: errorStyle }, error),
    React.createElement('form', { style: formStyle, onSubmit: handleSubmit },
      React.createElement('label', { style: labelStyle }, 'Titre de l\'événement'),
      React.createElement('input', {
        type: 'text',
        value: title,
        onChange: e => setTitle(e.target.value),
        placeholder: 'Ex: Mariage de Sarah & Marc',
        style: inputStyle,
        required: true
      }),
      
      React.createElement('label', { style: labelStyle }, 'Description (optionnel)'),
      React.createElement('textarea', {
        value: description,
        onChange: e => setDescription(e.target.value),
        placeholder: 'Décrivez votre événement...',
        style: textareaStyle,
        maxLength: 500
      }),
      
      React.createElement('label', { style: labelStyle }, 'Code PIN (optionnel)'),
      React.createElement('input', {
        type: 'password',
        value: pinCode,
        onChange: e => setPinCode(e.target.value),
        placeholder: 'Pour protéger l\'accès',
        style: inputStyle,
        maxLength: 6
      }),
      
      React.createElement('label', { style: labelStyle }, 'Date d\'expiration (optionnel)'),
      React.createElement('input', {
        type: 'datetime-local',
        value: expiresAt,
        onChange: e => setExpiresAt(e.target.value),
        style: inputStyle
      }),
      
      React.createElement('button', {
        type: 'submit',
        style: submitBtnStyle,
        disabled: isSubmitting
      }, isSubmitting ? 'Création...' : 'Créer l\'événement')
    )
  );
}

export default EventCreator;
