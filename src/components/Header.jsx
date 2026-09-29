import React from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Menu,
  Plus,
  Shield,
  Calendar,
  UserCheck,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

export const Header = ({
  onToggleMobileSidebar,
  onOpenRegisterMember,
  onNavigate
}) => {
  const {
    currentRole,
    setCurrentRole,
    settings,
    theme,
    toggleTheme,
    logout
  } = useChurch();

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="top-header no-print">
      <div className="header-left">
        {/* Mobile Hamburger to trigger Sidebar */}
        <button
          className="header-menu-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          type="button"
        >
          <Menu size={20} />
        </button>

        {/* Church Logo & Branding on Header */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => onNavigate && onNavigate('dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onNavigate && onNavigate('dashboard');
            }
          }}
          title="Return to Dashboard"
        >
          <img
            src="/church-logo.png"
            alt="EECMY Cross"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
          <div className="header-church-info">
            <span className="header-church-name">{settings.churchName}</span>
            <span className="header-church-sub">{settings.address || 'Yabello, Ethiopia'}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Date Display */}
        <div className="header-date-pill">
          <Calendar size={13} color="var(--primary)" />
          <span>{todayStr}</span>
        </div>

        {/* Theme Chooser Switcher */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Admin Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: '700'
          }}
          title="Logged in as Administrator"
        >
          <Shield size={13} />
          <span>Admin</span>
        </div>

        {/* Primary Action */}
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenRegisterMember}
          type="button"
        >
          <Plus size={15} />
          <span>Register Member</span>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          className="btn-icon sm"
          onClick={logout}
          title="Sign out of congregation portal"
          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

