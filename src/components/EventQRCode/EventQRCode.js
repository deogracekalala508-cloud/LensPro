// EventQRCode component - displays QR code for event sharing
import React, { useState, useEffect } from 'react'
import { generateQRCodeDataURL, getEventShareUrl } from '../../lib/qrCode'

function EventQRCode({ shareCode, eventTitle, onClose, showDownload = true }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const qrUrl = typeof window !== 'undefined'
    ? getEventShareUrl(window.location.origin, shareCode)
    : ''

  useEffect(() => {
    generateQRCodeDataURL(qrUrl).then(setQrDataUrl)
  }, [qrUrl])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, onClick: onClose
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 30,
        maxWidth: 420, width: '100%', position: 'relative',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        onClick: e => e.stopPropagation()
      }}>
        <button style={{
          position: 'absolute', top: 15, right: 15, background: 'none',
          border: 'none', fontSize: 28, color: '#666', cursor: 'pointer', padding: 5
        }} onClick={onClose}>×</button>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: '1.5rem' }}>
          Code QR de l'événement
        </h2>
        <div style={{
          width: 256, height: 256, backgroundColor: '#fff',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#1a1a2e'
        }}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span>QR: {shareCode}</span>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
            <strong>Partagez ce code QR</strong>
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Les invités peuvent scanner ce code pour accéder au mur de souvenirs.
          </p>
          <p style={{
            fontFamily: 'monospace', background: '#f5f5f5',
            padding: '8px 12px', borderRadius: 4, wordBreak: 'break-all',
            marginTop: 10, color: '#1a1a2e', fontSize: '0.85rem'
          }}>
            {qrUrl}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 25 }}>
          <button style={{
            padding: '10px 20px', border: '2px solid #1a1a2e', borderRadius: 8,
            background: 'white', color: '#1a1a2e', fontSize: '0.95rem',
            fontWeight: 600, cursor: 'pointer'
          }} onClick={onClose}>Fermer</button>
          {showDownload && (
            <button style={{
              padding: '10px 20px', border: 'none', borderRadius: 8,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
            }} onClick={onClose}>Télécharger</button>
          )}
        </div>
        {eventTitle && (
          <p style={{ marginTop: 15, color: '#888', fontSize: '0.9rem' }}>{eventTitle}</p>
        )}
      </div>
    </div>
  )
}

export default EventQRCode;
