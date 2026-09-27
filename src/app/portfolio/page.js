'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './portfolio.module.css';

export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Portrait');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = ['Portrait', 'Mariage', 'Événement', 'Mode', 'Nature', 'Sport', 'Architecture', 'Gastronomie', 'Autre'];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/portfolio');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && supabase) {
      loadPhotos();
    }
  }, [user]);

  const loadPhotos = async () => {
    if (!supabase || !user) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      if (err) throw err;
      setPhotos(data || []);
    } catch (e) {
      console.error('Load photos error:', e);
      setError('Impossible de charger vos photos.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 20 MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `portfolio-photos/${user.id}/${Date.now()}.${ext}`;

      await supabase.storage
        .from('portfolio-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      const { data: urlData } = supabase.storage
        .from('portfolio-photos')
        .getPublicUrl(filePath);

      const thumbnailPath = `portfolio-photos/${user.id}/thumbs/${Date.now()}.${ext}`;
      await supabase.storage
        .from('portfolio-photos')
        .upload(thumbnailPath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      const { data: thumbUrlData } = supabase.storage
        .from('portfolio-photos')
        .getPublicUrl(thumbnailPath);

      const { data: photo, error: photoError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          title: newTitle || file.name.replace(/\.[^/.]+$/, ''),
          category: newCategory.toLowerCase(),
          storage_path: filePath,
          thumbnail_url: thumbUrlData.publicUrl,
          is_public: true,
        })
        .select()
        .single();

      if (photoError) throw photoError;

      setPhotos(prev => [photo, ...prev]);
      setSuccess('Photo publiée avec succès !');
      setNewTitle('');
      setNewCategory('Portrait');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error('Upload error:', e);
      setError('Erreur lors de l\'upload : ' + (e.message || 'Inconnu'));
    } finally {
      setUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async (photoId) => {
    if (!supabase || !user) return;
    try {
      const { error: err } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', user.id);
      if (err) throw err;
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setSuccess('Photo supprimée.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('Erreur lors de la suppression : ' + (e.message || 'Inconnu'));
    }
    setDeleteConfirm(null);
  };

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthorized}>
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour voir votre portfolio.</p>
          <Link href="/auth/login" className={styles.loginLink}>Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/dashboard" className={styles.backLink}>← Retour au dashboard</Link>
          <div>
            <h1 className={styles.title}>Votre Portfolio</h1>
            <p className={styles.subtitle}>Vos photos publiées ({photos.length})</p>
          </div>
        </div>
      </header>

      {error && <div className={styles.errorBar}>{error}</div>}
      {success && <div className={styles.successBar}>{success}</div>}

      <div className={styles.layout}>
        <div className={styles.photoGridSection}>
          <div className={styles.gridHeader}>
            <h2>Vos photos</h2>
            {photos.length === 0 && !loading && (
              <p className={styles.emptyText}>Vous n'avez pas encore publié de photos.</p>
            )}
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📷</div>
              <h3>Votre portfolio est vide</h3>
              <p>Uploadez vos premières photos pour les exposer à votre public.</p>
              <Link href="/dashboard/upload" className={styles.uploadLink}>Ajouter des photos</Link>
            </div>
          ) : (
            <div className={styles.photoGrid}>
              {photos.map(photo => (
                <div key={photo.id} className={styles.photoCard}>
                  <div className={styles.photoImage} style={{ backgroundImage: `url(${photo.thumbnail_url || photo.storage_path})` }}>
                    {deleteConfirm === photo.id && (
                      <div className={styles.deleteOverlay}>
                        <p>Supprimer cette photo ?</p>
                        <button onClick={() => handleDelete(photo.id)} className={styles.confirmBtn}>Oui</button>
                        <button onClick={() => setDeleteConfirm(null)} className={styles.cancelBtn}>Non</button>
                      </div>
                    )}
                  </div>
                  <div className={styles.photoInfo}>
                    <span className={styles.photoTitle}>{photo.title}</span>
                    <span className={styles.photoCategory}>{photo.category}</span>
                    <div className={styles.photoActions}>
                      <button
                        onClick={() => setDeleteConfirm(photo.id)}
                        className={styles.deletePhotoBtn}
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.uploadCard}>
            <h3>Ajouter une photo</h3>
            <form onSubmit={e => { e.preventDefault(); handleFileSelect(e); }}>
              <div className={styles.dropzone}>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  disabled={uploading}
                />
                <div className={styles.dropzoneContent}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p>Glissez ou cliquez pour uploader</p>
                  <span className={styles.formatHint}>JPG, PNG, WEBP • Max 20 MB</span>
                </div>
              </div>
              {uploading && (
                <div className={styles.progress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span>Upload en cours...</span>
                </div>
              )}
              <div className={styles.formRow}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Titre de la photo"
                  className={styles.titleInput}
                  disabled={uploading}
                />
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className={styles.categorySelect}
                  disabled={uploading}
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.uploadBtn} disabled={uploading}>
                {uploading ? 'Publication...' : 'Publier la photo'}
              </button>
            </form>
          </div>

          <div className={styles.statsCard}>
            <h3>Vos statistiques</h3>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Photos publiées</span>
              <span className={styles.statValue}>{photos.length}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Dernière publication</span>
              <span className={styles.statValue}>
                {photos.length > 0 ? new Date(photos[0].created_at).toLocaleDateString('fr-FR') : '—'}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Catégories</span>
              <span className={styles.statValue}>
                {categories.filter(c => photos.some(p => p.category === c.toLowerCase())).length}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
