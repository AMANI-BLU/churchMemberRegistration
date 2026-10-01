import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  Download,
  Upload,
  RotateCcw,
  Check,
  Building,
  Database,
  RefreshCw,
  Copy,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  KeyRound,
  Mail,
  User,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Settings = ({ onPromptResetDemoData }) => {
  const {
    user,
    settings,
    updateSettings,
    exportDataJson,
    importDataJson,
    isSyncing,
    refreshData,
    showToast,
    userProfiles,
    pendingUsersCount,
    approveUser,
    rejectUser,
    changeUserRole,
    deleteUserAccount,
    updateAdminEmail,
    updateAdminPassword,
    updateAdminName
  } = useChurch();

  const [activeTab, setActiveTab] = useState(pendingUsersCount > 0 ? 'user_approvals' : 'church_profile');
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  // Confirm dialog state for user management
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => {}
  });

  const handlePromptRejectUser = (account) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject User Account',
      message: `Decline portal login access for "${account.full_name || account.email}"?`,
      confirmText: 'Reject Account',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: () => rejectUser(account.id)
    });
  };

  const handlePromptDeleteUser = (account) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User Account',
      message: `Permanently remove the account profile for "${account.full_name || account.email}"?`,
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: () => deleteUserAccount(account.id)
    });
  };

  // Church Profile Form
  const [profileForm, setProfileForm] = useState({ ...settings });

  // Account & Security Form
  const [adminName, setAdminName] = useState(user?.user_metadata?.full_name || '');
  const [adminEmail, setAdminEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings(profileForm);
  };

  const handleUpdateAccountInfo = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      if (adminName && adminName !== user?.user_metadata?.full_name) {
        await updateAdminName(adminName);
      }
      if (adminEmail && adminEmail !== user?.email) {
        await updateAdminEmail(adminEmail);
      }
      showToast('Account details updated successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to update account.', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await updateAdminPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password successfully updated!');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content) {
        importDataJson(content);
      }
    };
    reader.readAsText(file);
  };

  const filteredUsers = userProfiles.filter((u) => {
    if (userFilter === 'all') return true;
    return u.status === userFilter;
  });

  const copySqlToClipboard = () => {
    const sqlScript = `-- Run in Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT DEFAULT '',
    role TEXT DEFAULT 'staff',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    middle_name TEXT DEFAULT '',
    last_name TEXT NOT NULL,
    gender TEXT DEFAULT 'Male',
    dob TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    city TEXT DEFAULT 'Yabello',
    sub_city TEXT DEFAULT '',
    house_number TEXT DEFAULT '',
    marital_status TEXT DEFAULT 'Single',
    occupation TEXT DEFAULT '',
    emergency_contact_name TEXT DEFAULT '',
    emergency_contact_phone TEXT DEFAULT '',
    emergency_contact_relation TEXT DEFAULT '',
    registered_at TEXT DEFAULT CURRENT_DATE::text,
    registered_by TEXT DEFAULT 'Admin',
    status TEXT DEFAULT 'Active',
    photo TEXT DEFAULT '',
    family_id TEXT,
    family_role TEXT,
    ministry_ids JSONB DEFAULT '[]'::jsonb,
    spiritual_info JSONB DEFAULT '{"baptismStatus":"Unbaptized"}'::jsonb,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.families (
    id TEXT PRIMARY KEY,
    family_name TEXT NOT NULL,
    head_member_id TEXT DEFAULT '',
    member_ids JSONB DEFAULT '[]'::jsonb,
    address TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ministries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    leader_name TEXT DEFAULT '',
    leader_contact TEXT DEFAULT '',
    meeting_schedule TEXT DEFAULT '',
    description TEXT DEFAULT '',
    badge_color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.church_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    church_name TEXT DEFAULT 'EECMY YABELLO',
    tagline TEXT DEFAULT '',
    senior_pastor TEXT DEFAULT '',
    address TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    website TEXT DEFAULT '',
    founded_year NUMERIC DEFAULT 1978,
    statement TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access families" ON public.families FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access ministries" ON public.ministries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access church_settings" ON public.church_settings FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlScript);
    showToast('Supabase SQL copied to clipboard!');
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>Administration & Settings</h2>
          <p>
            Manage account approvals, staff security credentials, church profile, and cloud database.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'user_approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('user_approvals')}
        >
          <span>Account Approvals & Staff</span>
          {pendingUsersCount > 0 && (
            <span
              style={{
                marginLeft: '8px',
                background: '#ef4444',
                color: '#ffffff',
                padding: '2px 7px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              {pendingUsersCount}
            </span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'admin_security' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin_security')}
        >
          My Account & Security
        </button>
        <button
          className={`tab-btn ${activeTab === 'church_profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('church_profile')}
        >
          Church Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'supabase_db' ? 'active' : ''}`}
          onClick={() => setActiveTab('supabase_db')}
        >
          Supabase Cloud DB
        </button>
        <button
          className={`tab-btn ${activeTab === 'data_backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('data_backup')}
        >
          Data Backup & Clear
        </button>
      </div>

      {/* TAB 1: User Approvals & Staff Directory */}
      {activeTab === 'user_approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
              <h3 className="card-title">
                <Users size={18} color="var(--primary)" />
                <span>Portal User Accounts & Approvals</span>
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${userFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setUserFilter('all')}
                >
                  All ({userProfiles.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${userFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setUserFilter('pending')}
                  style={userFilter === 'pending' ? { background: '#f59e0b', borderColor: '#f59e0b' } : {}}
                >
                  Pending ({pendingUsersCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${userFilter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setUserFilter('approved')}
                >
                  Approved ({userProfiles.filter((u) => u.status === 'approved').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${userFilter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setUserFilter('rejected')}
                >
                  Rejected ({userProfiles.filter((u) => u.status === 'rejected').length})
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={refreshData}
                  title="Refresh user list"
                >
                  <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
            <div className="card-body">
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
                  <Users size={36} strokeWidth={1.5} style={{ marginBottom: '10px', opacity: 0.5 }} />
                  <p>No user accounts matching this filter.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredUsers.map((account) => {
                    const isPending = account.status === 'pending';
                    const isApproved = account.status === 'approved';
                    const isRejected = account.status === 'rejected';

                    return (
                      <div
                        key={account.id || account.email}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-app)',
                          border: isPending ? '1.5px solid #f59e0b' : '1px solid var(--border-color)',
                          gap: '16px',
                          flexWrap: 'wrap'
                        }}
                      >
                        {/* User info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}
                          >
                            {account.full_name ? account.full_name.charAt(0).toUpperCase() : account.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                                {account.full_name || 'Church Staff User'}
                              </span>
                              {account.email === 'admin@church.org' && (
                                <span style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'var(--primary)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>
                                  Default Admin
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {account.email} {account.created_at && `• Registered ${account.created_at.split('T')[0]}`}
                            </div>
                          </div>
                        </div>

                        {/* Status & Role Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          {/* Role Selector */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Role:</span>
                            <select
                              value={account.role || 'staff'}
                              onChange={(e) => changeUserRole(account.id, e.target.value)}
                              className="form-input"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: '32px' }}
                              disabled={account.email === 'admin@church.org'}
                            >
                              <option value="admin">Administrator</option>
                              <option value="pastor">Pastor / Minister</option>
                              <option value="staff">Church Staff</option>
                              <option value="deacon">Elder / Deacon</option>
                            </select>
                          </div>

                          {/* Status Badge */}
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              background: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                              color: isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#b45309',
                              border: `1px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#fcd34d'}`
                            }}
                          >
                            {account.status || 'pending'}
                          </span>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {!isApproved && (
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: '#10b981', color: '#ffffff', borderColor: '#10b981' }}
                                onClick={() => approveUser(account.id)}
                                title="Approve Account Login"
                              >
                                <Check size={14} />
                                <span>Approve</span>
                              </button>
                            )}
                            {!isRejected && account.email !== 'admin@church.org' && (
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: '#f59e0b', color: '#ffffff', borderColor: '#f59e0b' }}
                                onClick={() => handlePromptRejectUser(account)}
                                title="Decline Account Access"
                              >
                                <UserX size={14} />
                                <span>Reject</span>
                              </button>
                            )}
                            {account.email !== 'admin@church.org' && (
                              <button
                                type="button"
                                className="btn-icon sm"
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                                onClick={() => handlePromptDeleteUser(account)}
                                title="Delete user profile"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Admin Account & Security (Change Email & Password) */}
      {activeTab === 'admin_security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile & Email Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <User size={18} color="var(--primary)" />
                <span>Administrator Account Credentials</span>
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateAccountInfo}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name & Official Title</label>
                    <div className="login-input-wrapper">
                      <User size={16} className="login-input-icon" />
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Reverend / Lead Pastor"
                        className="form-input login-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Login Email Address</label>
                    <div className="login-input-wrapper">
                      <Mail size={16} className="login-input-icon" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@church.org"
                        className="form-input login-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={savingAccount}>
                    <Check size={16} />
                    <span>{savingAccount ? 'Saving...' : 'Update Account Email & Name'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Lock size={18} color="var(--primary)" />
                <span>Change Password</span>
              </h3>
            </div>
            <div className="card-body">
              {passwordError && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    marginBottom: '16px',
                    border: '1px solid var(--danger-border)'
                  }}
                >
                  <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'var(--success-light)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    marginBottom: '16px',
                    border: '1px solid var(--success-border)'
                  }}
                >
                  <CheckCircle2 size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="login-input-wrapper">
                      <Lock size={16} className="login-input-icon" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="form-input login-input"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="login-input-wrapper">
                      <KeyRound size={16} className="login-input-icon" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="form-input login-input"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                    <KeyRound size={16} />
                    <span>{savingPassword ? 'Updating Password...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Church Profile */}
      {activeTab === 'church_profile' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Building size={18} color="var(--primary)" />
              <span>Church Organization Profile</span>
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveProfile}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Church Name</label>
                  <input
                    type="text"
                    name="churchName"
                    value={profileForm.churchName}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Senior Reverend (Kes)</label>
                  <input
                    type="text"
                    name="seniorPastor"
                    value={profileForm.seniorPastor}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Church Motto / Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={profileForm.tagline}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Church Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Office Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Church Website</label>
                  <input
                    type="text"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={profileForm.foundedYear}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                <button type="submit" className="btn btn-primary settings-save-btn">
                  <Check size={16} />
                  <span>Save Church Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Supabase Database Info */}
      {activeTab === 'supabase_db' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
              <h3 className="card-title">
                <Database size={18} color="var(--primary)" />
                <span>Supabase Cloud Integration</span>
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={refreshData}
                disabled={isSyncing}
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync from Supabase'}</span>
              </button>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                <span>Connected: https://lpgutiximcoluzvvaqhe.supabase.co</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                All member registrations, households, holy baptism certificates, user accounts, and ministry rosters are automatically saved and synced with your Supabase database.
              </p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                  Database Tables Schema (SQL)
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Run this SQL in your Supabase SQL Editor to initialize all tables, triggers, and the pre-approved default admin account.
                </p>
                <button type="button" className="btn btn-secondary" onClick={copySqlToClipboard}>
                  <Copy size={16} />
                  <span>Copy SQL Table Schema</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Data Backup & Clear */}
      {activeTab === 'data_backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Download size={18} color="var(--primary)" />
                <span>Export & Import Church Data</span>
              </h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Download a complete, offline JSON backup of all members, families, ministries, and church settings.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={exportDataJson}>
                  <Download size={16} />
                  <span>Download Complete Backup (.json)</span>
                </button>

                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} />
                  <span>Restore from Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="card" style={{ borderColor: 'var(--danger-border)' }}>
            <div className="card-header" style={{ background: 'var(--danger-light)' }}>
              <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                <RotateCcw size={18} color="var(--danger)" />
                <span>Clear Local Data</span>
              </h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Clear local cached member data to start completely fresh.
              </p>
              <button className="btn btn-danger" onClick={onPromptResetDemoData}>
                <RotateCcw size={16} />
                <span>Clear All Local Cached Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog for User Profile Management */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
