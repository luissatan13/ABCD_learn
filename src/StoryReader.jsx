import React, { useState } from 'react';
import { useApp } from './AppContext';

export function StoryReader({ story, onClose }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { speak } = useApp();

  const page = story.pages[currentPageIndex];
  const isLastPage = currentPageIndex === story.pages.length - 1;
  const isFirstPage = currentPageIndex === 0;

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      onClose(); // finish story
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const readPage = () => {
    speak(page.text, false); // normal speed reading for stories
  };

  return (
    <div className="screen" style={{ backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <button 
          onClick={onClose}
          style={{ background: 'var(--bg-glass-strong)', border: 'none', color: 'var(--text-bright)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ❌ Cerrar
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>
          {currentPageIndex + 1} / {story.pages.length}
        </span>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        
        {/* Emoji/Image Frame */}
        <div style={{ 
          background: 'var(--bg-glass)', 
          width: '240px', 
          height: '240px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          {page.image ? (
            <img src={page.image} alt="Ilustración del cuento" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '100px' }}>{page.emoji}</span>
          )}
        </div>

        {/* Text */}
        <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '22px', lineHeight: '1.5', color: 'var(--text-bright)', margin: 0, paddingRight: '40px' }}>
            {page.text}
          </p>
          
          {/* Read Button */}
          <button 
            onClick={readPage}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '16px', 
              transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, var(--primary), var(--purple))',
              border: 'none',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(236,72,153,0.4)'
            }}
            aria-label="Escuchar texto"
          >
            🔊
          </button>
        </div>

      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', padding: '24px', gap: '16px', justifyContent: 'center' }}>
        <button 
          className="btn-secondary"
          onClick={handlePrev}
          style={{ opacity: isFirstPage ? 0.5 : 1, pointerEvents: isFirstPage ? 'none' : 'auto', flex: 1, maxWidth: '160px' }}
        >
          ⬅️ Atrás
        </button>
        
        <button 
          className="btn-primary"
          onClick={handleNext}
          style={{ flex: 1, maxWidth: '160px' }}
        >
          {isLastPage ? 'Terminar 🎉' : 'Siguiente ➡️'}
        </button>
      </div>

    </div>
  );
}
