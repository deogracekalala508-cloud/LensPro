'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './SocialWall.module.css'
import { getTranslations } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import { getEventPosts, getEventByShareCode, eventExists, createEventPost } from '@/lib/events'

export default function SocialWall({ shareCode, isAdmin = false }) {
  const t = getTranslations('fr')
  const [event, setEvent] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newPost, setNewPost] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [modalImage, setModalImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef(null)
  const audioUrl = useRef(null)

  useEffect(() => {
    if (!shareCode) return
    loadEvent()
  }, [shareCode])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const exists = await eventExists(shareCode)
      if (!exists) {
        setError(t.events.notFound || 'Event not found')
        setLoading(false)
        return
      }
      const eventData = await getEventByShareCode(shareCode)
      setEvent(eventData)
      loadPosts()
    } catch (err) {
      console.error('Error loading event:', err)
      setError(t.errors.loading || 'Loading error')
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    try {
      const postsData = await getEventPosts({ eventId: event?.id, moderation_status: 'approved', limit: 50 })
      setPosts(postsData)
    } catch (err) {
      console.error('Error loading posts:', err)
    }
  }

  useEffect(() => {
    if (event) loadPosts()
  }, [event])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setNewPost('')
    }
  }

  const handleAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'voice.webm')
        formData.append('eventId', event?.id)
        formData.append('contentType', 'audio')
        formData.append('userName', 'Guest')
        
        setIsUploading(true)
        try {
          const response = await fetch('/api/audio', {
            method: 'POST',
            body: formData
          })
          if (response.ok) {
            const data = await response.json()
            await createEventPost({
              eventId: event?.id,
              content_type: 'audio',
              content_url: data.url,
              audio_url: data.url,
              text_content: '',
              user_name: 'Guest',
              user_email: null,
              moderation_status: 'approved'
            })
            loadPosts()
            stream.getTracks().forEach(track => track.stop())
          }
        } catch (err) {
          console.error('Audio upload error:', err)
        } finally {
          setIsUploading(false)
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setTimeout(() => {
        mediaRecorder.stop()
      }, 30000)
    } catch (err) {
      console.error('Audio capture error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!event) return

    setIsUploading(true)
    try {
      let contentUrl = null
      let contentType = 'text'

      if (selectedFile) {
        const isImage = selectedFile.type.startsWith('image/')
        const isVideo = selectedFile.type.startsWith('video/')
        contentType = isImage ? 'image' : isVideo ? 'video' : 'file'

        const ext = selectedFile.name.split('.').pop()
        const filePath = `${event.share_code}/${Date.now()}.${ext}`
        
        const { data, error: uploadError } = await supabase.storage
          .from('event-uploads')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('event-uploads')
          .getPublicUrl(filePath)
        
        contentUrl = urlData.publicUrl
      }

      await createEventPost({
        eventId: event.id,
        content_type: contentType,
        content_url: contentUrl,
        text_content: newPost,
        audio_url: null,
        user_name: 'Guest',
        user_email: null,
        moderation_status: 'approved'
      })

      setNewPost('')
      setSelectedFile(null)
      fileInputRef.current.value = ''
      loadPosts()
    } catch (err) {
      console.error('Post error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this content?')) return
    try {
      await supabase.from('event_posts').delete().eq('id', postId)
      loadPosts()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t.events.loading || 'Loading...'}</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className={styles.error}>
        <h3>{t.events.notFound || 'Event not found'}</h3>
        <p>{error || t.events.expired || 'This event does not exist or has expired.'}</p>
      </div>
    )
  }

  const isExpired = event.expires_at && new Date(event.expires_at) < new Date()
  const isModerator = isAdmin

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{event.title}</h1>
          {event.description && <p className={styles.description}>{event.description}</p>}
          <div className={styles.meta}>
            <span>👥 {event.participant_count} participants</span>
            <span>•</span>
            <span>📸 {event.post_count} memories</span>
            {event.expires_at && (
              <>
                <span>•</span>
                <span className={isExpired ? styles.expired : ''}>
                  {isExpired ? '• Expired' : `Expires ${new Date(event.expires_at).toLocaleDateString('fr-FR')}`}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {isModerator && (
        <div className={styles.moderatorPanel}>
          <h3>Moderation</h3>
        </div>
      )}

      {!isExpired && (
        <div className={styles.uploadArea}>
          <form onSubmit={handleSubmit} className={styles.uploadForm}>
            <div className={styles.inputGroup}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t.events.placeholder || 'Share a memory...'}
                className={styles.textarea}
                rows={3}
                maxLength={500}
              />
              
              <div className={styles.fileInput}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className={styles.fileInputHidden}
                />
                <button type="button" className={styles.fileBtn}>
                  📷 Photo / Video
                </button>
                {selectedFile && (
                  <button 
                    type="button" 
                    className={styles.removeFileBtn}
                    onClick={() => {
                      setSelectedFile(null)
                      fileInputRef.current.value = ''
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className={styles.audioSection}>
                <button 
                  type="button" 
                  onClick={handleAudioCapture}
                  className={styles.audioBtn}
                  disabled={isUploading}
                >
                  🎤 Voice message
                </button>
              </div>

              <div className={styles.uploadButtons}>
                <button
                  type="submit"
                  disabled={isUploading || (!newPost && !selectedFile)}
                  className={styles.submitBtn}
                >
                  {isUploading ? (
                    <span className={styles.spinnerSmall}></span>
                  ) : null}
                  {t.events.share || 'Share'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className={styles.feed}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t.events.noPosts || 'No memories shared yet'}</p>
            <p className={styles.emptyHint}>{t.events.beFirst || 'Be the first to share!'}</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <div className={styles.avatar}>
                  {post.user_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className={styles.postMeta}>
                  <span className={styles.userName}>{post.user_name || 'Guest'}</span>
                  <span className={styles.postTime}>{formatTime(post.created_at)}</span>
                </div>
              </div>

              {post.text_content && (
                <p className={styles.postText}>{post.text_content}</p>
              )}

              {post.content_type === 'image' && post.content_url && (
                <div className={styles.postImage}>
                  <img src={post.content_url} alt="Post content" loading="lazy" />
                  <button 
                    className={styles.expandBtn}
                    onClick={() => setModalImage(post.content_url)}
                  >
                    👁 View
                  </button>
                </div>
              )}

              {post.content_type === 'video' && post.content_url && (
                <div className={styles.postVideo}>
                  <video src={post.content_url} controls className={styles.videoPlayer} />
                </div>
              )}

              {post.content_type === 'audio' && post.audio_url && (
                <div className={styles.postAudio}>
                  <audio src={post.audio_url} controls className={styles.audioPlayer} />
                  <span className={styles.audioLabel}>🎤 Voice message</span>
                </div>
              )}

              {isModerator && (
                <div className={styles.moderation}>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className={styles.deleteBtn}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {showModal && modalImage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <img src={modalImage} alt="Full screen" />
            <button 
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
