'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/events';
import styles from './create-event.module.css';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function CreateEventPage() {
  const router = useRouter();
  const t = typeof window !== 'undefined' ? getTranslations('fr') : { events: { createEvent: 'Create event', createSubtitle: 'Create a temporary social space', eventTitle: 'Event title', eventDescription: 'Description', pinCode: 'PIN code (optional)', expiryDate: 'Expiry date (optional)', coverImage: 'Cover image URL (optional)', create: 'Create', cancel: 'Cancel', error: 'Error' } };
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pinCode: '',
    expiryDate: '',
    coverImageUrl: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const event = await createEvent({
        title: formData.title,
        description: formData.description,
        pinCode: formData.pinCode || null,
        expiresAt: formData.expiryDate ? new Date(formData.expiryDate) : null,
        coverImageUrl: formData.coverImageUrl || null
      });

      setSuccess(`Event "${event.title}" created successfully!`);
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.events.createEvent || 'Créer un événement'}</h1>
        <p className={styles.subtitle}>{t.events.createSubtitle || 'Créez un espace social temporaire pour vos invités'}</p>
      </header>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label}>
              {t.events.eventTitle || 'Titre de l\'événement'} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: Mariage de Sarah & Marc"
              required
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              {t.events.eventDescription || 'Description'} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Décrivez votre événement pour les invités..."
              rows={4}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.section}>
              <label className={styles.label}>
                {t.events.pinCode || 'Code PIN (optionnel)'}
              </label>
              <input
                type="password"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ex: 1234"
              />
              <span className={styles.hint}>
                Les invités devront entrer ce code pour rejoindre l'événement
              </span>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>
                {t.events.expiryDate || 'Date d\'expiration (optionnel)'}
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              {t.events.coverImage || 'URL de l\'image de couverture (optionnel)'}
            </label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.btnSecondary}
              disabled={isCreating}
            >
              {t.common && t.common.cancel ? t.common.cancel : 'Annuler'}
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isCreating}
            >
              {isCreating ? 'Création...' : t.events.create || 'Créer l\'événement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
