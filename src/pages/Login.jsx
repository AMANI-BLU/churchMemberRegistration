import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Shield,
  UserCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Loader2,
  CheckCircle2,
  KeyRound,
  Sparkles
} from 'lucide-react';

export const Login = () => {
  const { signIn, signUp, resetPassword, settings, theme, toggleTheme } = useChurch();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('admin@church.org');
  const [password, setPassword] = useState('Admin@Church2026!');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fillAdminCredentials = () => {
    setEmail('admin@church.org');
    setPassword('Admin@Church2026!');
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email || !password) {
          setError('Please provide both email and password.');
          setLoading(false);
          return;
        }
        await signIn(email.trim(), password);
      } else if (mode === 'signup') {
        if (!email || !password || !fullName) {
          setError('Please fill in all required registration fields.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signUp(email.trim(), password, { fullName: fullName.trim(), role });
        setSuccessMessage('Account created! You are now logged in or check your email for confirmation.');
      } else if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your registered church email address.');
          setLoading(false);
          return;
        }
        await resetPassword(email.trim());
        setSuccessMessage('Password reset link sent to your email.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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

      <div className="login-card-wrapper animate-scale-up" style={{ maxWidth: '440px', width: '100%' }}>
        {/* Church Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-container">
            <img
              src="/church-logo.png"
              alt="EECMY Cross Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          </div>
          <h1 className="login-church-title">{settings?.churchName || 'EECMY YABELLO'}</h1>
          <p className="login-church-sub">
            Ethiopian Evangelical Church Mekane Yesus • Yabello Congregation
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '20px',
            gap: '4px'
          }}
        >
          <button
            type="button"
            className="tab-btn"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'signin' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: mode === 'signin' ? '700' : '500',
              boxShadow: mode === 'signin' ? 'var(--shadow-xs)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccessMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="tab-btn"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'signup' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: mode === 'signup' ? '700' : '500',
              boxShadow: mode === 'signup' ? 'var(--shadow-xs)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMessage('');
            }}
          >
            Register Account
          </button>
        </div>

        {mode === 'signin' && (
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={fillAdminCredentials}
              style={{
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-border, #bfdbfe)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={12} />
              <span>Use Default Admin Credentials</span>
            </button>
          </div>
        )}

        {/* Login / Signup / Reset Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                border: '1px solid var(--danger-border)',
                lineHeight: 1.4
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: '10px 14px',
                background: '#ecfdf5',
                color: '#065f46',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Full Name for Sign Up */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name & Title</label>
              <div className="login-input-wrapper">
                <User size={16} className="login-input-icon" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Pastor Desta Guyo"
                  className="form-input login-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Role selection for Sign Up */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Portal Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
                style={{ height: '42px' }}
              >
                <option value="admin">Administrator / Lead Pastor</option>
                <option value="staff">Church Staff / Secretary</option>
                <option value="deacon">Elder / Deacon</option>
              </select>
            </div>
          )}

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="login-input-wrapper">
              <Mail size={16} className="login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="pastor@church.org"
                className="form-input login-input"
                required
              />
            </div>
          </div>

          {/* Password (for Sign In & Sign Up) */}
          {mode !== 'forgot' && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="login-input-wrapper" style={{ marginTop: '6px' }}>
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', justifyContent: 'center', marginTop: '4px' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In with Supabase</span>
                <ArrowRight size={16} />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Church Account</span>
                <Sparkles size={16} />
              </>
            ) : (
              <>
                <span>Send Password Reset Email</span>
                <KeyRound size={16} />
              </>
            )}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMode('signin');
                setError('');
                setSuccessMessage('');
              }}
            >
              Back to Sign In
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="login-footer-text">
          <span>Protected Supabase Auth • {settings?.statement || 'Proclaiming Christ in Faith and Love'}</span>
        </div>
      </div>
    </div>
  );
};
