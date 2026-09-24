'use client';
import { useState } from 'react';
import styles from './upload.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function UploadPage() {
  const { t } = useLanguage();
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    // mock add files
    setFiles([...files, { id: Date.now(), name: 'photo.jpg', progress: 100 }]);
  };

  return (
    <div className={styles.uploadContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload Photos</h1>
        <p className={styles.subtitle}>Ajoutez des photos à votre portfolio public</p>
      </header>

      <div 
        className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.uploadIcon}>⬆️</span>
          <h3>Glissez-déposez vos photos ici</h3>
          <p>ou</p>
          <button className={styles.browseBtn}>Parcourir les fichiers</button>
          <span className={styles.formats}>JPG, PNG, WEBP (Max 20MB)</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.filesList}>
          <div className={styles.listHeader}>
            <h3>Fichiers ({files.length})</h3>
            <button className={styles.publishBtn}>Publier tout</button>
          </div>
          
          <div className={styles.grid}>
            {files.map(file => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.preview}>
                  <div className={styles.mockImg}>Preview</div>
                </div>
                <div className={styles.fileInfo}>
                  <input type="text" placeholder="Titre de la photo" className={styles.input} />
                  <select className={styles.select}>
                    <option>Mariage</option>
                    <option>Portrait</option>
                    <option>Nature</option>
                  </select>
                  <div className={styles.toggles}>
                    <label className={styles.toggle}>
                      <input type="checkbox" defaultChecked /> Public
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
