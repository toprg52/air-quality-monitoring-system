import React from 'react';

const NAV_ITEMS = [
  {
    id: 'overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    label: 'Overview',
  },
  {
    id: 'pollutants',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 1 10 10v.5a.5.5 0 0 1-.5.5H2.5a.5.5 0 0 1-.5-.5V12A10 10 0 0 1 12 2z"/>
        <line x1="12" y1="12" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/>
      </svg>
    ),
    label: 'Pollutants',
  },
];



export default function Sidebar({ activeView, onViewChange, sensors, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌬️</div>
          <div className="sidebar-logo-text">Air<span>Watch</span></div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Dashboard</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => { onViewChange(item.id); onClose(); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}


        </nav>

        {/* Bottom status */}
        <div className="sidebar-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="sidebar-status-dot" />
            <div className="sidebar-status-text">Node online</div>
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Data refreshes every 30s
          </div>
        </div>
      </aside>
    </>
  );
}
