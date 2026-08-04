import React, { useState, useRef } from 'react';
import { useApp, AVATARS } from './AppContext';

export function ProfileScreen({ onDone }) {
  const { saveProfile, profile } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(
    profile?.avatar || AVATARS[0]
  );
  const [name, setName] = useState(profile?.name || 'Leo');
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    if (!name.trim()) return;
    saveProfile({ avatar: selectedAvatar, name: name.trim() });
    onDone();
  };

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="profile-screen-content">
          <div>
            <h1 className="profile-title">Mi Perfil</h1>
            <p className="profile-subtitle">¡Elige tu explorador y tu nombre!</p>
          </div>

          {/* Avatar selection */}
          <div className="card">
            <p className="avatar-card-title">Elige tu Avatar</p>
            <div className="avatar-grid">
              {AVATARS.map(av => (
                <button
                  key={av.id}
                  id={`avatar-${av.id}`}
                  className={`avatar-option ${selectedAvatar.id === av.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(av)}
                  aria-label={`Avatar: ${av.label}`}
                  aria-pressed={selectedAvatar.id === av.id}
                >
                  <img src={av.src} alt={av.label} />
                  {selectedAvatar.id === av.id && (
                    <div className="checkmark">✓</div>
                  )}
                </button>
              ))}
              {selectedAvatar.isCustom && (
                <button
                  key={selectedAvatar.id}
                  id={`avatar-${selectedAvatar.id}`}
                  className="avatar-option selected"
                  onClick={() => setSelectedAvatar(selectedAvatar)}
                  aria-label={`Avatar: ${selectedAvatar.label}`}
                  aria-pressed={true}
                >
                  <img src={selectedAvatar.src} alt={selectedAvatar.label} />
                  <div className="checkmark">✓</div>
                </button>
              )}
              <div 
                className="avatar-add" 
                aria-label="Añadir avatar personalizado"
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_SIZE = 150;
                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                          if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                          }
                        } else {
                          if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                          }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        
                        setSelectedAvatar({
                          id: 'custom-' + Date.now(),
                          src: dataUrl,
                          label: 'Personalizado',
                          isCustom: true
                        });
                      };
                      img.src = reader.result;
                    };
                    reader.readAsDataURL(file);
                  }
                  // Reset input value so the same file can be selected again
                  if (e.target) e.target.value = '';
                }} 
              />
            </div>
          </div>

          {/* Name input */}
          <div className="card">
            <p className="name-card-title">¿Cómo te llamas?</p>
            <div className="name-input-wrapper">
              <input
                id="child-name-input"
                className="name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
                placeholder="Tu nombre"
                aria-label="Nombre del niño"
                autoFocus={editing}
              />
              <span
                className="name-edit-icon"
                onClick={() => setEditing(true)}
                role="button"
                aria-label="Editar nombre"
              >
                ✏️
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="profile-btn-wrapper">
            <button
              id="profile-done-btn"
              className="btn-primary"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              ¡Listo!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
