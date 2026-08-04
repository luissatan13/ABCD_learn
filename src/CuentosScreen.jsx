import React, { useState } from 'react';
import { STORIES } from './storiesData';
import { StoryReader } from './StoryReader';

export function CuentosScreen() {
  const [activeStory, setActiveStory] = useState(null);

  if (activeStory) {
    return (
      <StoryReader 
        story={activeStory} 
        onClose={() => setActiveStory(null)} 
      />
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: '80px' }}>
      <div className="scroll-area">
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', color: 'white', textAlign: 'center', marginBottom: '8px' }}>
            📚 Cuentos
          </h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
            Lee y escucha estas divertidas historias.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STORIES.map(story => (
              <div 
                key={story.id}
                className="card"
                style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer', padding: '16px' }}
                onClick={() => setActiveStory(story)}
                role="button"
                tabIndex={0}
              >
                <div style={{ 
                  fontSize: '48px', 
                  background: 'var(--bg-glass-strong)', 
                  borderRadius: '16px', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {story.coverEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '18px' }}>{story.title}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.4' }}>
                    {story.description}
                  </p>
                  <span style={{ 
                    background: 'var(--purple-light)', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 'bold' 
                  }}>
                    {story.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
