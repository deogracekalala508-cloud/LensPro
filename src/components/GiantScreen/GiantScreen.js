'use client'
import React, { useState, useEffect, useRef } from 'react'
import { getTranslations } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import { getEventPosts, getEventByShareCode, eventExists } from '@/lib/events'
import styles from './GiantScreen.module.css'

export default function GiantScreen({ shareCode }) {
  const t = getTranslations('fr')
  const [event, setEvent] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)
  const currentIndex = useRef(0)
  const autoPlayInterval = useRef(null)

  useEffect(() => {
    loadEvent()
    return () => clearInterval(autoPlayInterval.current)
  }, [shareCode])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const exists = await eventExists(shareCode)
      if (!exists) {
        setLoading(false)
        return
      }
      const eventData = await getEventByShareCode(shareCode)
      setEvent(eventData)
      const postsData = await getEventPosts({ eventId: eventData?.id, moderation_status: 'approved', limit: 50 })
      setPosts(postsData.filter(p => p.content_type === 'image' || p.content_type === 'video'))
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoPlay && posts.length > 1) {
      autoPlayInterval.current = setInterval(() => {
        currentIndex.current = (currentIndex.current + 1) % posts.length
      }, 5000)
    }
    return () => clearInterval(autoPlayInterval.current)
  }, [autoPlay, posts.length])

  const handleNext = () => {
    currentIndex.current = (currentIndex.current + 1) % posts.length
  }

  const handlePrev = () => {
    currentIndex.current = (currentIndex.current - 1 + posts.length) % posts.length
  }

  const currentPost = posts[currentIndex.current]

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  if (!event || posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No memories</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{event.title}</h1>
        {event.description && <p className={styles.description}>{event.description}</p>}
        <div className={styles.controls}>
          <button onClick={handlePrev} className={styles.navBtn}>Prev</button>
          <span className={styles.counter}>{currentIndex.current + 1} / {posts.length}</span>
          <button onClick={handleNext} className={styles.navBtn}>Next</button>
          <button 
            onClick={() => setAutoPlay(!autoPlay)} 
            className={`${styles.navBtn} ${!autoPlay ? styles.active : ''}`}
          >
            {autoPlay ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <div className={styles.display}>
        {currentPost?.content_type === 'image' && currentPost.content_url && (
          <img src={currentPost.content_url} alt="Memory" className={styles.image} />
        )}
        {currentPost?.content_type === 'video' && currentPost.content_url && (
          <video src={currentPost.content_url} autoPlay loop className={styles.video} />
        )}
      </div>

      {currentPost?.text_content && (
        <div className={styles.caption}>
          <p>{currentPost.text_content}</p>
          <span className={styles.author}>{currentPost.user_name || 'Guest'}</span>
        </div>
      )}
    </div>
  )
}
