'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './upload.module.css';

export const dynamic = 'force-dynamic';

const CATEGORIES = ['Portrait', 'Mariage', 'Événement', 'Mode', 'Nature', 'Sport', 'Architecture', 'Gastronomie', 'Autre'];

export default function UploadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploadingIds, setUploadingIds] = useState(new Set());
  const [progress, setProgress] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState({});
  const [titles, setTitles] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/dashboard/upload');
    }
  }, [user, authLoading, router]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    let validCount = 0;
    const newFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" n'est pas une image valide.`);
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError(`"${file.name}" dépasse 20 MB.`);
        return false;
      }
      validCount++;
      return true;
    });

    if (validCount === 0) return;

    const fileEntries = newFiles.map(file => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      progress: 0,
      category: categories[file.name] || 'Portrait',
      title: titles[file.name] || file.name.replace(/\.[^/.]+$/, ''),
    }));

    setFiles(prev => [...prev, ...fileEntries]);
    setError('');
    setSuccess('');
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length === 0) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/png,image/webp';
    input.files = droppedFiles;
    handleFileSelect({ target: input });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateCategory = (id, category) => {
    setCategories(prev => ({ ...prev, [id]: category }));
    setFiles(prev => prev.map(f => f.id === id ? { ...f, category } : f));
  };

  const updateTitle = (id, title) => {
    setTitles(prev => ({ ...prev, [id]: title }));
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title } : f));
  };

  const uploadFile = async (fileEntry) => {
    if (!supabase || !user) return;

    setUploadingIds(prev => new Set(prev).add(fileEntry.id));
    setProgress(prev => ({ ...prev, [fileEntry.id]: 0 }));

    try {
      const ext = fileEntry.file.name.split('.').pop() || 'jpg';
      const fileName = fileEntry.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'photo';
      const filePath = `portfolio-photos/${user.id}/${fileName}.${ext}`;

      await supabase.storage
        .from('portfolio-photos')
        .upload(filePath, fileEntry.file, {
          cacheControl: '3600',
          upsert: false,
          onProgress: (prog) => {
            setProgress(prev => ({ ...prev, [fileEntry.id]: Math.round(prog * 100) }));
          },
        });

      const { data: urlData } = supabase.storage
        .from('portfolio-photos')
        .getPublicUrl(filePath);

      const thumbnailPath = `portfolio-photos/${user.id}/thumbs/${fileName}.${ext}`;
      await supabase.storage
        .from('portfolio-photos')
        .upload(thumbnailPath, fileEntry.file, {
          cacheControl: '3600',
          upsert: false,
        });
      const { data: thumbUrlData } = supabase.storage
        .from('portfolio-photos')
        .getPublicUrl(thumbnailPath);

      const { error: photoError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          title: fileEntry.title || fileEntry.name.replace(/\.[^/.]+$/, ''),
          category: fileEntry.category.toLowerCase(),
          storage_path: filePath,
          thumbnail_url: thumbUrlData.publicUrl,
          is_public: true,
        });

      if (photoError) throw photoError;

      setSuccess(`"${fileEntry.title || fileEntry.name}" publiée !`);
      setFiles(prev => prev.filter(f => f.id !== fileEntry.id));
    } catch (e) {
      console.error('Upload error:', e);
      setError('Erreur upload : ' + (e.message || 'Inconnu'));
    } finally {
      setUploadingIds(prev => {
        const next = new Set(prev);
        next.delete(fileEntry.id);
        return next;
      });
      setProgress(prev => {
        const next = { ...prev };
        delete next[fileEntry.id];
        return next;
      });
    }
  };

  const handlePublishAll = async () => {
    if (files.length === 0) return;
    setError('');
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const handlePublishOne = (fileEntry) => {
    uploadFile(fileEntry);
  };

  if (authLoading) {
    return <div className={styles.uploadContainer}><div className={styles.uploadIcon}>Chargement...</div></div>;
  }

  if (!user) {
    return (
      <div className={styles.uploadContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Connexion requise</h1>
          <p className={styles.subtitle}><a href="/auth/login" style={{color:'#6B21A8'}}>Se connecter</a> pour uploader des photos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.uploadContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload Photos</h1>
        <p className={styles.subtitle}>Ajoutez des photos à votre portfolio public</p>
      </header>

      {error && <div className={styles.errorBar}>{error}</div>}
      {success && <div className={styles.successBar}>{success}</div>}

      <div
        className={styles.dropzone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.dropzoneContent}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.uploadIcon}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <h3>Glissez-déposez vos photos ici</h3>
          <p>ou</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button type="button" className={styles.browseBtn} onClick={() => fileInputRef.current?.click()}>
            Parcourir les fichiers
          </button>
          <span className={styles.formats}>JPG, PNG, WEBP (Max 20MB)</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.filesList}>
          <div className={styles.listHeader}>
            <h3>
              Fichiers ({files.length})
              {uploadingIds.size > 0 && (
                <span style={{fontSize:'0.85rem', color:'#9ca3af', marginLeft:'0.5rem'}}>
                  • {uploadingIds.size} en cours
                </span>
              )}
            </h3>
            <button
              className={styles.publishBtn}
              onClick={handlePublishAll}
              disabled={uploadingIds.size > 0}
            >
              Publier tout
            </button>
          </div>

          <div className={styles.grid}>
            {files.map(file => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.preview}>
                  <img src={file.preview} alt={file.name} className={styles.previewImg} />
                </div>
                <div className={styles.fileInfo}>
                  <input
                    type="text"
                    value={file.title}
                    onChange={e => updateTitle(file.id, e.target.value)}
                    placeholder="Titre de la photo"
                    className={styles.input}
                  />
                  <select
                    value={file.category}
                    onChange={e => updateCategory(file.id, e.target.value)}
                    className={styles.select}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div className={styles.fileActions}>
                    {uploadingIds.has(file.id) ? (
                      <div className={styles.progress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${progress[file.id] || 0}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{progress[file.id] || 0}%</span>
                      </div>
                    ) : (
                      <>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFile(file.id)}
                        >
                          ✕
                        </button>
                        <button
                          className={styles.publishOneBtn}
                          onClick={() => handlePublishOne(file)}
                        >
                          Publier
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>Aucune photo sélectionnée.</p>
        </div>
      )}
    </div>
  );
}
