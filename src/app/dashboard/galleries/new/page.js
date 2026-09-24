'use client';
import { useState } from 'react';
import styles from './new-gallery.module.css';
import Link from 'next/link';

export default function NewGallery() {
  const [files, setFiles] = useState([]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/dashboard/galleries" className={styles.backLink}>← Retour aux galeries</Link>
          <h1 className={styles.title}>Créer une nouvelle galerie</h1>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h3>Détails de la galerie</h3>
            <div className={styles.inputGroup}>
              <label>Titre de la galerie</label>
              <input type="text" placeholder="Ex: Mariage Sophie & Jean" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea placeholder="Un petit mot pour vos clients..." rows={3} className={styles.input}></textarea>
            </div>
            
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Code PIN (Optionnel)</label>
                <input type="text" placeholder="Ex: 1234" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>Date d'expiration</label>
                <input type="date" className={styles.input} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.dropzone}>
            <span className={styles.uploadIcon}>📸</span>
            <h3>Glissez-déposez vos photos ici</h3>
            <p>ou cliquez pour parcourir</p>
          </div>
          
          <button className={styles.createBtn}>Créer la galerie</button>
        </div>
      </div>
    </div>
  );
}
