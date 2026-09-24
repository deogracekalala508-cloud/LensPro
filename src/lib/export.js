// Export utilities for social wall events

export function exportPostsToCSV(posts) {
  const headers = ['ID', 'Caption', 'Author', 'Author Username', 'Photo URL', 'Likes', 'Created At', 'Featured']
  
  const rows = posts.map(post => [
    post.id,
    `"${(post.caption || '').replace(/"/g, '""')}"`,
    post.user?.full_name || 'Anonymous',
    post.user?.username || '',
    post.photo_url,
    post.likes?.length || 0,
    post.created_at,
    post.is_featured ? 'Yes' : 'No'
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  return csv
}

export function exportPostsToJSON(posts) {
  return JSON.stringify(posts, null, 2)
}

export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function exportEventData(event, posts, format = 'json') {
  const data = {
    event: {
      id: event.id,
      title: event.title,
      description: event.description,
      share_code: event.share_code,
      cover_image_url: event.cover_image_url,
      participant_count: event.participant_count,
      post_count: event.post_count,
      created_at: event.created_at,
      expires_at: event.expires_at
    },
    posts: posts.map(post => ({
      id: post.id,
      caption: post.caption,
      photo_url: post.photo_url,
      thumbnail_url: post.thumbnail_url,
      author: post.user,
      likes: post.likes?.length || 0,
      is_featured: post.is_featured,
      created_at: post.created_at
    })),
    exported_at: new Date().toISOString()
  }
  
  if (format === 'json') {
    return {
      content: JSON.stringify(data, null, 2),
      filename: `event-${event.share_code}-export.json`,
      mimeType: 'application/json'
    }
  }
  
  const csv = exportPostsToCSV(posts)
  return {
    content: csv,
    filename: `event-${event.share_code}-posts.csv`,
    mimeType: 'text/csv'
  }
}

// Generate a printable gallery layout HTML
export function generatePrintableGallery(posts, eventTitle, eventDate) {
  const photosHtml = posts
    .filter(p => p.photo_url)
    .map(p => `
      <div class="gallery-photo">
        <img src="${p.photo_url}" alt="${p.caption || 'Photo'}" />
        <div class="photo-caption">${p.caption || ''}</div>
        <div class="photo-author">${p.user?.full_name || 'Invité'}</div>
      </div>
    `)
    .join('\n')
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${eventTitle} - Galerie de souvenirs</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1a1a2e;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }
    .gallery-photo {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .gallery-photo img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .photo-caption {
      padding: 10px;
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .photo-author {
      padding: 0 10px 10px;
      font-size: 12px;
      color: #888;
    }
    @media print {
      body { background: white; }
      .gallery-grid { gap: 5px; }
      .gallery-photo { break-inside: avoid; box-shadow: none; }
      .gallery-photo img { height: 150px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${eventTitle}</h1>
    <p>${eventDate} • ${posts.length} photos</p>
  </div>
  <div class="gallery-grid">
    ${photosHtml}
  </div>
</body>
</html>
  `
}
