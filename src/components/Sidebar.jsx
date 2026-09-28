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
  Shield,
  RotateCcw,
  X,
  Plus
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  onOpenRegisterMember,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentRole, setCurrentRole, settings, members, families, ministries, resetToDemoData } = useChurch();

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
              <div className="sidebar-brand-title" title={settings.churchName}>
                {settings.churchName}
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

        {/* Quick Action Button */}
        <div style={{ padding: '0 16px 14px' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              onOpenRegisterMember();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <Plus size={16} />
            <span>Register Member</span>
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
            <span>Baptism Hub</span>
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

          {/* Administration - Admin Only */}
          {currentRole === 'admin' && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: '16px' }}>
                System
              </div>
              <button
                className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <SettingsIcon size={18} />
                <span>Church Settings</span>
              </button>
            </>
          )}
        </nav>

        {/* Role Card & Reset at Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-role-card">
            <div className="role-card-header">
              <span className={`role-tag ${currentRole}`}>
                <Shield size={12} />
                {currentRole === 'admin' ? 'Administrator' : 'Staff'}
              </span>
              <button
                className="btn-icon sm"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}
                onClick={resetToDemoData}
                title="Reset to initial church demo data"
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <div className="role-card-name">
              {currentRole === 'admin' ? 'Admin Portal' : 'Staff Access'}
            </div>
            <div className="role-card-desc">
              {currentRole === 'admin'
                ? 'Congregation registration, ID cards, baptism hub, reports & system settings.'
                : 'Registration, family households & ordinance certificates.'}
            </div>
            <button
              className="role-switcher-btn"
              onClick={() => setCurrentRole(currentRole === 'admin' ? 'staff' : 'admin')}
            >
              Switch to {currentRole === 'admin' ? 'Staff' : 'Admin'} Mode
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
