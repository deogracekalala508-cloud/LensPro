'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { createEvent } from '@/lib/events'
import styles from './BrowseEvents.css'

export default function BrowseEvents({ events = [], userId, isPhotographer, t }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    pinCode: '',
    expiresAt: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createdCode, setCreatedCode] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!userId) return
    
    setIsCreating(true)
    try {
      const expiresAt = createData.expiresAt ? new Date(createData.expiresAt).toISOString() : null
      const event = await createEvent({
        title: createData.title,
        description: createData.description,
        pinCode: createData.pinCode || null,
        expiresAt,
        userId
      })
      setCreatedCode(event.share_code)
      setShowCreateForm(false)
      setCreateData({ title: '', description: '', pinCode: '', expiresAt: '' })
    } catch (err) {
      console.error('Create error:', err)
    } finally {
      setIsCreating(false)
    }
  }

  if (events.length === 0 && !showCreateForm) {
    return (
      <div className={styles.empty}>
        <p>No events</p>
        {isPhotographer && (
          <button onClick={() => setShowCreateForm(true)} className={styles.createBtn}>
            + Create event
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {isPhotographer && (
        <div className={styles.createSection}>
          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)} className={styles.createBtn}>
              + Create event
            </button>
          ) : (
            <form onSubmit={handleCreate} className={styles.createForm}>
              <h3>New event</h3>
              <input
                type="text"
                value={createData.title}
                onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                placeholder="Event name"
                className={styles.input}
                required
              />
              <textarea
                value={createData.description}
                onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                placeholder="Description (optional)"
                className={styles.textarea}
                rows={3}
              />
              <input
                type="text"
                value={createData.pinCode}
                onChange={(e) => setCreateData({ ...createData, pinCode: e.target.value })}
                placeholder="PIN code (optional)"
                className={styles.input}
              />
              <input
                type="datetime-local"
                value={createData.expiresAt}
                onChange={(e) => setCreateData({ ...createData, expiresAt: e.target.value })}
                className={styles.datetime}
              />
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowCreateForm(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className={styles.submitBtn}>
                  {isCreating ? '...' : 'Create'}
                </button>
              </div>
            </form>
          )}
          {createdCode && (
            <div className={styles.createdCode}>
              <p>Event created!</p>
              <div className={styles.codeDisplay}>
                <span className={styles.codeLabel}>Share code:</span>
                <span className={styles.codeValue}>{createdCode}</span>
              </div>
              <button onClick={() => setCreatedCode(null)} className={styles.dismissBtn}>
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className={styles.grid}>
          {events.map(event => (
            <div key={event.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{event.title}</h3>
                {event.expires_at && (
                  <span className={styles.expiry}>
                    Expires {new Date(event.expires_at).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              {event.description && <p className={styles.description}>{event.description}</p>}
              <div className={styles.meta}>
                <span>👥 {event.participant_count} participants</span>
                <span>•</span>
                <span>📸 {event.post_count} memories</span>
              </div>
              <div className={styles.actions}>
                <Link href={`/event/${event.share_code}`} className={styles.viewBtn}>
                  View
                </Link>
                <Link href={`/event/${event.share_code}/giant`} className={styles.giantBtn}>
                  Screen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
