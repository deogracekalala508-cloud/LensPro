// EventQRCode component - displays QR code for event sharing
// This is a pure function component that renders QR codes

function EventQRCode({ shareCode, eventTitle, onClose, showDownload = true }) {
  // QR code generation would use a library like qrcode.react
  // For now, we use a placeholder approach
  const qrUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${shareCode}`;
  
  const containerStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20
  };
  
  const modalStyle = {
    background: 'white',
    borderRadius: 16,
    padding: 30,
    maxWidth: 420,
    width: '100%',
    position: 'relative',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  };
  
  const closeBtnStyle = {
    position: 'absolute',
    top: 15,
    right: 15,
    background: 'none',
    border: 'none',
    fontSize: 28,
    color: '#666',
    cursor: 'pointer',
    padding: 5
  };
  
  const titleStyle = {
    marginBottom: 20,
    color: '#1a1a2e',
    fontSize: '1.5rem'
  };
  
  const qrPlaceholderStyle = {
    width: 256,
    height: 256,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#1a1a2e'
  };
  
  const infoStyle = {
    textAlign: 'center'
  };
  
  const urlStyle = {
    fontFamily: 'monospace',
    background: '#f5f5f5',
    padding: '8px 12px',
    borderRadius: 4,
    wordBreak: 'break-all',
    marginTop: 10,
    color: '#1a1a2e',
    fontSize: '0.85rem'
  };
  
  const actionsStyle = {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 25
  };
  
  const btnPrimaryStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer'
  };
  
  const btnOutlineStyle = {
    padding: '10px 20px',
    border: '2px solid #1a1a2e',
    borderRadius: 8,
    background: 'white',
    color: '#1a1a2e',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer'
  };
  
  const eventTitleStyle = {
    marginTop: 15,
    color: '#888',
    fontSize: '0.9rem'
  };

  return React.createElement('div', { style: containerStyle, onClick: onClose },
    React.createElement('div', { style: modalStyle, onClick: e => e.stopPropagation() },
      React.createElement('button', { style: closeBtnStyle, onClick: onClose }, '×'),
      React.createElement('h2', { style: titleStyle }, 'Code QR de l\'événement'),
      React.createElement('div', { style: qrPlaceholderStyle }, '[QR: ' + shareCode + ']'),
      React.createElement('div', { style: infoStyle },
        React.createElement('p', { style: { color: '#666', margin: '5px 0', fontSize: '0.9rem' } },
          React.createElement('strong', null, 'Partagez ce code QR')
        ),
        React.createElement('p', { style: { color: '#666', fontSize: '0.9rem' } },
          'Les invités peuvent scanner ce code pour accéder au mur de souvenirs.'
        ),
        React.createElement('p', { style: urlStyle }, qrUrl)
      ),
      React.createElement('div', { style: actionsStyle },
        React.createElement('button', { style: btnOutlineStyle, onClick: onClose }, 'Fermer'),
        showDownload && React.createElement('button', { style: btnPrimaryStyle, onClick: onClose }, 'Télécharger')
      ),
      eventTitle && React.createElement('p', { style: eventTitleStyle }, eventTitle)
    )
  );
}

export default EventQRCode;
