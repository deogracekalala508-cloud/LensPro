// ModerationPanel component for admin moderation of event posts
// Uses React.createElement to avoid JSX compilation issues

import React, { useState } from 'react';

function ModerationPanel({ posts, onApprove, onReject, onReport, isLoading = false }) {
  const [selectedPost, setSelectedPost] = useState(null);
  
  const containerStyle = {
    background: 'white',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: 600
  };
  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1px solid #e0e0e0'
  };
  
  const titleStyle = {
    margin: 0,
    color: '#1a1a2e',
    fontSize: '1.3rem'
  };
  
  const countStyle = {
    background: '#1a1a2e',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: '0.85rem',
    fontWeight: 600
  };
  
  const listStyle = {
    maxHeight: 400,
    overflowY: 'auto'
  };
  
  const postItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
    border: '2px solid transparent'
  };
  
  const selectedPostItemStyle = {
    borderColor: '#1a1a2e'
  };
  
  const thumbStyle = {
    width: 50,
    height: 50,
    borderRadius: 4,
    objectFit: 'cover'
  };
  
  const infoStyle = {
    flex: 1,
    minWidth: 0
  };
  
  const authorStyle = {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: 2
  };
  
  const captionStyle = {
    fontSize: '0.9rem',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };
  
  const actionsStyle = {
    display: 'flex',
    gap: 8
  };
  
  const actionBtnStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600
  };
  
  const approveBtnStyle = {
    ...actionBtnStyle,
    background: '#16a34a',
    color: 'white'
  };
  
  const rejectBtnStyle = {
    ...actionBtnStyle,
    background: '#dc2626',
    color: 'white'
  };
  
  const reportBtnStyle = {
    ...actionBtnStyle,
    background: '#f59e0b',
    color: 'white'
  };
  
  const emptyStyle = {
    textAlign: 'center',
    padding: 30,
    color: '#999'
  };

  const handleSelect = (post) => {
    setSelectedPost(selectedPost?.id === post.id ? null : post);
  };

  const handleApprove = (post) => {
    onApprove(post);
    setSelectedPost(null);
  };

  const handleReject = (post) => {
    if (window.confirm('Rejeter ce post ?')) {
      onReject(post);
      setSelectedPost(null);
    }
  };

  const handleReport = (post) => {
    onReport(post);
    setSelectedPost(null);
  };

  if (posts.length === 0) {
    return React.createElement('div', { style: containerStyle },
      React.createElement('div', { style: headerStyle },
        React.createElement('h3', { style: titleStyle }, 'Modération'),
        React.createElement('span', { style: countStyle }, '0 posts')
      ),
      React.createElement('div', { style: emptyStyle }, 'Aucun post à modérer')
    );
  }

  return React.createElement('div', { style: containerStyle },
    React.createElement('div', { style: headerStyle },
      React.createElement('h3', { style: titleStyle }, 'Modération'),
      React.createElement('span', { style: countStyle }, `${posts.length} post(s) en attente`)
    ),
    React.createElement('div', { style: listStyle },
      posts.map(post => {
        const isSelected = selectedPost?.id === post.id;
        const itemStyle = isSelected ? { ...postItemStyle, ...selectedPostItemStyle } : postItemStyle;
        
        const actions = React.createElement('div', { style: actionsStyle },
          React.createElement('button', {
            style: approveBtnStyle,
            onClick: () => handleApprove(post)
          }, '✓ Approuver'),
          React.createElement('button', {
            style: rejectBtnStyle,
            onClick: () => handleReject(post)
          }, '✗ Rejeter'),
          React.createElement('button', {
            style: reportBtnStyle,
            onClick: () => handleReport(post)
          }, '🚩 Signaler')
        );
        
        return React.createElement('div', {
          key: post.id,
          style: itemStyle,
          onClick: () => handleSelect(post)
        },
          React.createElement('img', {
            src: post.content_url || '',
            alt: '',
            style: thumbStyle
          }),
          React.createElement('div', { style: infoStyle },
            React.createElement('div', { style: authorStyle }, post.user_name || 'Invité'),
            React.createElement('div', { style: captionStyle }, post.text_content || 'Sans légende')
          ),
          React.createElement('div', { style: actionsStyle },
            actions
          )
        );
      })
    )
  );
}

export default ModerationPanel;
