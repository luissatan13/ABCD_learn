import React, { useState } from 'react';
import { useApp } from './AppContext';
import { isVipEmail } from './vipEmails';
import { createMercadoPagoPreference } from './mercadopago';

export function PaywallModal({ onClose }) {
  const { user, activatePremium, isPremium } = useApp();
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'annual' | 'monthly' | 'lifetime'
  const [loading, setLoading] = useState(false);
  const isVip = isVipEmail(user?.email);

  const handleMercadoPagoCheckout = async () => {
    if (isPremium) {
      alert('🌟 ¡Tu cuenta ya cuenta con Acceso Premium ilimitado!');
      onClose();
      return;
    }

    try {
      setLoading(true);
      const checkoutUrl = await createMercadoPagoPreference(selectedPlan, user?.email);
      // Redirect user to Mercado Pago official checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Error al generar la preferencia de Mercado Pago:', err);
      alert('Ocurrió un error al conectar con Mercado Pago:\n' + (err.message || err));
      setLoading(false);
    }
  };

  const handleVipOrTestActivate = () => {
    activatePremium();
    alert('🎉 ¡Felicidades! Se ha activado el acceso Premium en tu cuenta.');
    onClose();
  };

  return (
    <div
      className="modal-overlay paywall-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Suscripción Premium"
    >
      <div className="paywall-card" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="paywall-close-btn" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        {/* Mascot & Header */}
        <div className="paywall-header">
          <div className="paywall-mascot-wrap">
            <span className="paywall-crown-badge">👑</span>
            <img src="/owl_mascot.png" alt="Mascota Búho Premium" />
          </div>
          <h2 className="paywall-title">Aventura de Leer <span className="gold-text">PREMIUM</span></h2>
          <p className="paywall-subtitle">¡Desbloquea todo el contenido educativo para aprender a leer sin límites!</p>
        </div>

        {/* VIP Email Banner */}
        {isVip && (
          <div className="paywall-vip-banner">
            <span className="vip-badge-icon">🌟</span>
            <div>
              <strong>¡Correo VIP Detectado! ({user?.email})</strong>
              <p>Tu cuenta cuenta con acceso Premium Gratuito e ilimitado.</p>
            </div>
            <button className="btn-primary btn-gold" onClick={handleVipOrTestActivate} style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>
              Desbloquear Gratis ⭐
            </button>
          </div>
        )}

        {/* Premium Features Checklist */}
        <div className="paywall-features-list">
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span><strong>Todas las Sílabas:</strong> Desbloquea de la M a la Z</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span><strong>100% Sin Anuncios:</strong> Experiencia segura para niños</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span><strong>Rompecabezas Completo:</strong> Modos de 16 y 25 piezas</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span><strong>Cuentos e Historias:</strong> Acceso a todos los libros de lectura</span>
          </div>
        </div>

        {/* Plan Selectors */}
        <div className="paywall-plans-grid">
          
          {/* Plan Anual */}
          <div
            className={`paywall-plan-card ${selectedPlan === 'annual' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="plan-popular-badge">👑 MÁS POPULAR - AHORRA 50%</div>
            <div className="plan-title">Plan Anual</div>
            <div className="plan-price">$499 MXN <span className="plan-period">/ año</span></div>
            <div className="plan-sub">Equivale a solo $41.50 MXN al mes</div>
          </div>

          {/* Plan Mensual */}
          <div
            className={`paywall-plan-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="plan-title">Plan Mensual</div>
            <div className="plan-price">$89 MXN <span className="plan-period">/ mes</span></div>
            <div className="plan-sub">Cancela en cualquier momento</div>
          </div>

          {/* Plan Vitalicio */}
          <div
            className={`paywall-plan-card ${selectedPlan === 'lifetime' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('lifetime')}
          >
            <div className="plan-title">Pase Vitalicio</div>
            <div className="plan-price">$899 MXN <span className="plan-period">/ pago único</span></div>
            <div className="plan-sub">Acceso para siempre sin mensualidades</div>
          </div>

        </div>

        {/* Mercado Pago Button */}
        <button
          className="btn-primary paywall-action-btn"
          onClick={handleMercadoPagoCheckout}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          {loading ? 'Generando Checkout...' : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#009EE3"/>
              </svg>
              <span>{isPremium ? '¡Ya eres Usuario Premium! ⭐' : '💳 Pagar con Mercado Pago'}</span>
            </>
          )}
        </button>

        {/* Test / Simulación Directa */}
        {!isPremium && (
          <button
            onClick={handleVipOrTestActivate}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer',
              marginTop: 10,
              width: '100%',
              textAlign: 'center',
            }}
          >
            🧪 Activar Modo Prueba (Simulación sin costo)
          </button>
        )}

        <p className="paywall-disclaimer">
          Pago 100% seguro procesado por Mercado Pago (Tarjetas, SPEI u OXXO).
        </p>

      </div>
    </div>
  );
}
