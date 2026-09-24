'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockPhotographers, mockPhotos, mockGalleries } from '../lib/mockData';

const DemoContext = createContext();

const initialTestimonials = [
  {
    id: 1,
    name: 'Marc K.',
    role: 'Photographe de Mariage • Kinshasa',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    text: "LensPro a complètement transformé ma façon de livrer des photos à mes clients. L'interface est fluide et très professionnelle.",
    status: 'approved',
    date: '2026-09-15'
  },
  {
    id: 2,
    name: 'Sophie L.',
    role: 'Photographe Portrait • Douala',
    avatar: 'https://i.pravatar.cc/150?img=44',
    rating: 5,
    text: "La fonctionnalité avant/après est géniale pour montrer mes compétences en retouche. Mes clients adorent !",
    status: 'approved',
    date: '2026-09-12'
  },
  {
    id: 3,
    name: 'Jean-Paul D.',
    role: 'Photographe Événementiel • Lubumbashi',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: "Le support via WhatsApp pour l'abonnement par mobile money est très pratique pour nous en Afrique. Je recommande vivement.",
    status: 'approved',
    date: '2026-09-10'
  }
];

export const DemoProvider = ({ children }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [photographers, setPhotographers] = useState([]);

  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedDemoMode = localStorage.getItem('lenspro_demo_mode');
    if (savedDemoMode !== null) {
      setDemoMode(savedDemoMode === 'true');
    }

    const savedTestimonials = localStorage.getItem('lenspro_testimonials');
    if (savedTestimonials) {
      try {
        setTestimonials(JSON.parse(savedTestimonials));
      } catch (e) {}
    }

    const savedPhotographers = localStorage.getItem('lenspro_photographers');
    if (savedPhotographers) {
      try {
        setPhotographers(JSON.parse(savedPhotographers));
      } catch (e) {
        setPhotographers(mockPhotographers);
      }
    } else {
      setPhotographers(mockPhotographers);
    }
  }, []);

  const toggleDemoMode = (val) => {
    const nextVal = typeof val === 'boolean' ? val : !demoMode;
    setDemoMode(nextVal);
    localStorage.setItem('lenspro_demo_mode', String(nextVal));
  };

  const addTestimonial = (testimonial) => {
    const newTesti = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Pending admin approval by default
      rating: 5,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
      ...testimonial
    };
    const updated = [newTesti, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('lenspro_testimonials', JSON.stringify(updated));
    return newTesti;
  };

  const updateTestimonialStatus = (id, status) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, status } : t);
    setTestimonials(updated);
    localStorage.setItem('lenspro_testimonials', JSON.stringify(updated));
  };

  const deleteTestimonial = (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    localStorage.setItem('lenspro_testimonials', JSON.stringify(updated));
  };

  const togglePhotographerStatus = (id) => {
    const updated = photographers.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Actif' ? 'Désactivé' : 'Actif';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setPhotographers(updated);
    localStorage.setItem('lenspro_photographers', JSON.stringify(updated));
  };

  const deletePhotographer = (id) => {
    const updated = photographers.filter(p => p.id !== id);
    setPhotographers(updated);
    localStorage.setItem('lenspro_photographers', JSON.stringify(updated));
  };

  const addPhotographer = (pData) => {
    const newP = {
      id: Date.now(),
      status: 'Actif',
      joinDate: new Date().toISOString().split('T')[0],
      storage: '0 MB',
      ...pData
    };
    const updated = [newP, ...photographers];
    setPhotographers(updated);
    localStorage.setItem('lenspro_photographers', JSON.stringify(updated));
    return newP;
  };

  return (
    <DemoContext.Provider
      value={{
        demoMode,
        toggleDemoMode,
        testimonials,
        approvedTestimonials: testimonials.filter(t => t.status === 'approved'),
        addTestimonial,
        updateTestimonialStatus,
        deleteTestimonial,
        photographers,
        togglePhotographerStatus,
        deletePhotographer,
        addPhotographer,
        activePhotos: demoMode ? mockPhotos : mockPhotos.filter(p => !p.isDemo)
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    return {
      demoMode: true,
      toggleDemoMode: () => {},
      testimonials: initialTestimonials,
      approvedTestimonials: initialTestimonials,
      addTestimonial: () => {},
      updateTestimonialStatus: () => {},
      deleteTestimonial: () => {},
      photographers: mockPhotographers,
      togglePhotographerStatus: () => {},
      deletePhotographer: () => {},
      addPhotographer: () => {},
      activePhotos: mockPhotos
    };
  }
  return context;
};
