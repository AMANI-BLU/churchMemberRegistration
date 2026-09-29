import React from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Church,
  Users,
  CreditCard,
  Award,
  Home,
  Layers,
  FileText,
  Settings as SettingsIcon,
  X
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { settings, members, families, ministries, pendingUsersCount } = useChurch();

  const baptizedCount = members.filter((m) => m.spiritualInfo?.baptismStatus === 'Baptized').length;

  const handleNavClick = (tab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && <div className="sidebar-overlay no-print" onClick={onCloseMobile} />}

      <aside className={`sidebar no-print ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-left" onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-brand-icon" style={{ background: '#ffffff', padding: '4px' }}>
              <img
                src="/church-logo.png"
                alt="EECMY Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="sidebar-brand-info">
              <div className="sidebar-brand-title" title={settings?.churchName || 'EECMY YABELLO'}>
                {settings?.churchName || 'EECMY YABELLO'}
              </div>
              <div className="sidebar-brand-sub">Management & Registry</div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            className="sidebar-close-mobile"
            onClick={onCloseMobile}
            title="Close menu"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Church Management</div>

          <button
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <Church size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => handleNavClick('members')}
          >
            <Users size={18} />
            <span>Members Directory</span>
            <span className="badge-counter">{members.length}</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'idcards' ? 'active' : ''}`}
            onClick={() => handleNavClick('idcards')}
          >
            <CreditCard size={18} />
            <span>ID Card Generator</span>
            <span className="badge-counter">ID</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'baptism' ? 'active' : ''}`}
            onClick={() => handleNavClick('baptism')}
          >
            <Award size={18} />
            <span>Baptism</span>
            <span className="badge-counter">
              {baptizedCount}
            </span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'families' ? 'active' : ''}`}
            onClick={() => handleNavClick('families')}
          >
            <Home size={18} />
            <span>Family Households</span>
            <span className="badge-counter">{families.length}</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'ministries' ? 'active' : ''}`}
            onClick={() => handleNavClick('ministries')}
          >
            <Layers size={18} />
            <span>Ministries & Teams</span>
            <span className="badge-counter">{ministries.length}</span>
          </button>

          <div className="sidebar-section-label" style={{ marginTop: '16px' }}>
            Reports & Analytics
          </div>

          <button
            className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavClick('reports')}
          >
            <FileText size={18} />
            <span>Monthly & Annual Reports</span>
          </button>

          <div className="sidebar-section-label" style={{ marginTop: '16px' }}>
            System
          </div>
          <button
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <SettingsIcon size={18} />
            <span>Church Settings</span>
            {pendingUsersCount > 0 && (
              <span className="badge-counter" style={{ background: '#ef4444', color: '#fff' }}>
                {pendingUsersCount}
              </span>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
};
