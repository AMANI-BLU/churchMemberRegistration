import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Shield,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export const Login = () => {
  const { login, settings, theme, toggleTheme } = useChurch();

  const [email, setEmail] = useState('admin@eecmy-yabello.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    login(selectedRole);
  };

  const handleQuickLogin = (role) => {
    login(role);
  };

  return (
    <div className="login-page-container">
      {/* Theme Toggle Top Right */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button
          type="button"
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="login-card-wrapper animate-scale-up">
        {/* Church Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-container">
            <img
              src="/church-logo.png"
              alt="EECMY Cross Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          </div>
          <h1 className="login-church-title">{settings.churchName}</h1>
          <p className="login-church-sub">
            Ethiopian Evangelical Church Mekane Yesus • Yabello Congregation
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="quick-access-box">
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick 1-Click Demo Access
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              className={`quick-login-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('admin');
                setEmail('admin@eecmy-yabello.org');
                setPassword('admin123');
              }}
            >
              <Shield size={14} />
              <span>Admin Portal</span>
            </button>
            <button
              type="button"
              className={`quick-login-btn ${selectedRole === 'staff' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('staff');
                setEmail('kes.desta@eecmy-yabello.org');
                setPassword('staff123');
              }}
            >
              <UserCheck size={14} />
              <span>Staff / Kes View</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div style={{ padding: '8px 12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Church Office Email</label>
            <div className="login-input-wrapper">
              <Mail size={16} className="login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@eecmy-yabello.org"
                className="form-input login-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="login-input-wrapper">
              <Lock size={16} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="form-input login-input"
                required
              />
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', justifyContent: 'center' }}>
            <span>Sign In to Congregation Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer-text">
          <span>Protected Congregation Records • {settings.statement || 'Proclaiming Christ in Faith and Love'}</span>
        </div>
      </div>
    </div>
  );
};
