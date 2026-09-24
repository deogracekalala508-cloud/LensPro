export const mockPhotographers = [
  { id: 1, name: 'Jean-Pierre Lumba', username: 'jplumba', city: 'Kinshasa', specialty: 'Mariage', avatar: 'https://i.pravatar.cc/300?img=11', cover: 'https://picsum.photos/seed/cover1/1200/400', bio: 'Capturant vos plus beaux moments avec élégance.', isVerified: true, stats: { photos: 120, likes: 1450, views: 24500, followers: 340 } },
  { id: 2, name: 'Marie Mutombo', username: 'mariem', city: 'Lubumbashi', specialty: 'Portrait', avatar: 'https://i.pravatar.cc/300?img=5', cover: 'https://picsum.photos/seed/cover2/1200/400', bio: 'Portraits avec émotion et authenticité.', isVerified: true, stats: { photos: 85, likes: 980, views: 18200, followers: 210 } },
  { id: 3, name: 'Alain Nsengiyumva', username: 'alainn', city: 'Goma', specialty: 'Nature', avatar: 'https://i.pravatar.cc/300?img=33', cover: 'https://picsum.photos/seed/cover3/1200/400', bio: 'La beauté de la nature à travers mon objectif.', isVerified: false, stats: { photos: 320, likes: 4500, views: 56000, followers: 890 } },
  { id: 4, name: 'Sophie Kameni', username: 'sophiek', city: 'Douala', specialty: 'Mode', avatar: 'https://i.pravatar.cc/300?img=47', cover: 'https://picsum.photos/seed/cover4/1200/400', bio: 'Photographe de mode pour magazines locaux et internationaux.', isVerified: true, stats: { photos: 150, likes: 2100, views: 31000, followers: 450 } },
  { id: 5, name: 'Luc Kabasele', username: 'luck', city: 'Brazzaville', specialty: 'Événement', avatar: 'https://i.pravatar.cc/300?img=12', cover: 'https://picsum.photos/seed/cover5/1200/400', bio: 'Immortalisez vos soirées et événements corporatifs.', isVerified: false, stats: { photos: 200, likes: 1100, views: 19000, followers: 120 } },
  { id: 6, name: 'Grace Mboyo', username: 'gracem', city: 'Kinshasa', specialty: 'Gastronomie', avatar: 'https://i.pravatar.cc/300?img=9', cover: 'https://picsum.photos/seed/cover6/1200/400', bio: 'La nourriture est un art, je la rends appétissante.', isVerified: true, stats: { photos: 95, likes: 870, views: 14200, followers: 310 } },
  { id: 7, name: 'Paul Olinga', username: 'paulo', city: 'Yaoundé', specialty: 'Architecture', avatar: 'https://i.pravatar.cc/300?img=15', cover: 'https://picsum.photos/seed/cover7/1200/400', bio: 'Lignes et structures urbaines.', isVerified: false, stats: { photos: 110, likes: 920, views: 15000, followers: 180 } },
  { id: 8, name: 'Fatou Diop', username: 'fatoud', city: 'Dakar', specialty: 'Portrait', avatar: 'https://i.pravatar.cc/300?img=20', cover: 'https://picsum.photos/seed/cover8/1200/400', bio: 'Révéler la beauté de chaque personne.', isVerified: true, stats: { photos: 75, likes: 1600, views: 22000, followers: 520 } },
];

export const mockPhotos = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title: `Photo ${i + 1}`,
  category: i % 4 === 0 ? 'Mariage' : i % 4 === 1 ? 'Portrait' : i % 4 === 2 ? 'Événement' : 'Mode',
  url: `https://picsum.photos/seed/photo${i+1}/800/600`,
  likes: Math.floor(Math.random() * 200) + 15,
  views: Math.floor(Math.random() * 2000) + 120,
  photographerId: (i % 8) + 1,
  photographerName: mockPhotographers[i % 8].name,
  photographerAvatar: mockPhotographers[i % 8].avatar,
}));

export const explorePhotos = mockPhotos;

export const categories = [
  'Tous',
  'Mariage',
  'Portrait',
  'Événement',
  'Mode',
  'Nature',
  'Sport',
  'Architecture',
  'Gastronomie',
];

export const mockGalleries = [
  { id: 1, title: 'Mariage de Sarah & Marc', photosCount: 145, shareCode: 'SM2026', views: 320, date: '2026-08-15', pin: '1234', cover: 'https://picsum.photos/seed/gal1/600/400' },
  { id: 2, title: 'Gala de Charité', photosCount: 89, shareCode: 'GALA26', views: 150, date: '2026-09-02', pin: '', cover: 'https://picsum.photos/seed/gal2/600/400' },
  { id: 3, title: 'Shooting Mode Été', photosCount: 34, shareCode: 'MODE26', views: 890, date: '2026-07-20', pin: '', cover: 'https://picsum.photos/seed/gal3/600/400' },
  { id: 4, title: 'Anniversaire 30 ans Julien', photosCount: 56, shareCode: 'JUJU30', views: 45, date: '2026-09-10', pin: '5678', cover: 'https://picsum.photos/seed/gal4/600/400' },
  { id: 5, title: 'Conférence Tech Africa', photosCount: 210, shareCode: 'TECHAF26', views: 540, date: '2026-06-05', pin: '', cover: 'https://picsum.photos/seed/gal5/600/400' }
];

export const clientGallery = {
  id: 1,
  title: 'Mariage de Sarah & Marc',
  photographerName: 'Jean-Pierre Lumba',
  photographerAvatar: 'https://i.pravatar.cc/300?img=11',
  date: '15 Août 2026',
  photosCount: 12,
  pin: '1234',
  photos: Array.from({ length: 12 }).map((_, i) => ({
    id: i + 101,
    title: `Moment Mariage ${i + 1}`,
    url: `https://picsum.photos/seed/wedding${i + 1}/1200/800`,
    thumbnailUrl: `https://picsum.photos/seed/wedding${i + 1}/400/300`,
    image: `https://picsum.photos/seed/wedding${i + 1}/1200/800`,
  }))
};

export const photographerProfile = {
  ...mockPhotographers[0],
  photos: mockPhotos.slice(0, 12),
  beforeAfterPairs: [
    {
      id: 1,
      title: 'Retouche Portrait Studio',
      before: 'https://picsum.photos/seed/raw1/800/600',
      after: 'https://picsum.photos/seed/retouched1/800/600',
    },
    {
      id: 2,
      title: 'Colorimétrie Mariage',
      before: 'https://picsum.photos/seed/raw2/800/600',
      after: 'https://picsum.photos/seed/retouched2/800/600',
    }
  ]
};

export const mockStats = {
  totalPhotos: 534,
  totalViews: 32450,
  totalLikes: 1420,
  totalDownloads: 890
};

export const mockActivity = [
  { id: 1, icon: '❤️', user: 'Marie M.', action: 'a aimé', target: 'votre photo "Coucher de soleil Goma"', time: 'Il y a 5 min' },
  { id: 2, icon: '⬇️', user: 'Client Galerie "Mariage Sarah"', action: 'a téléchargé', target: '12 photos', time: 'Il y a 2 heures' },
  { id: 3, icon: '👁️', user: 'Votre portfolio', action: 'a dépassé', target: 'les 1 000 vues cette semaine', time: 'Hier' }
];

export const mockAdminStats = {
  totalPhotographers: 148,
  activeSubscriptions: 112,
  trialUsers: 28,
  expiredUsers: 8,
  monthlyRevenue: 5600, // 112 * $50
};

// Données mock pour les événements (social wall)
export const mockEvents = [
  {
    id: 1,
    title: 'Gala de Fin d\'Année 2026',
    description: 'Un Gala exceptionnel pour célébrer les réalisations de la communauté photographique.',
    shareCode: 'GALA2026',
    eventType: 'gala',
    date: '2026-12-31',
    startTime: '19:00',
    endTime: '23:00',
    location: 'Hôtel des Arts, Kinshasa',
    coverImage: 'https://picsum.photos/seed/gala2026/1200/600',
    status: 'active',
    posts: [
      { id: 1, userId: 1, username: 'jplumba', avatar: 'https://i.pravatar.cc/300?img=11', text: 'Prêt pour le Gala de ce soir ! 🎉', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, userId: 2, username: 'mariem', avatar: 'https://i.pravatar.cc/300?img=5', text: 'J\'arrive bientôt !', createdAt: new Date(Date.now() - 1800000).toISOString() },
    ]
  },
  {
    id: 2,
    title: 'Atelier Photo Urbaine',
    description: 'Atelier pratique pour améliorer vos compétences en photographie urbaine à Kinshasa.',
    shareCode: 'URBAN26',
    eventType: 'workshop',
    date: '2026-11-15',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Marché Central, Kinshasa',
    coverImage: 'https://picsum.photos/seed/urban26/1200/600',
    status: 'active',
    posts: [
      { id: 1, userId: 3, username: 'alainn', avatar: 'https://i.pravatar.cc/300?img=33', text: 'Super initiative ! Je suis motivé.', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ]
  }
];

export const mockEventByShareCode = mockEvents.find(e => e.shareCode === 'TEST123') || null;
