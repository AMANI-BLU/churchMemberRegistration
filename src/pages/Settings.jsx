import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Settings as SettingsIcon,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Check,
  Building,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

export const Settings = ({ onPromptResetDemoData }) => {
  const {
    settings,
    updateSettings,
    exportDataJson,
    importDataJson
  } = useChurch();

  const [activeTab, setActiveTab] = useState('church_profile'); // 'church_profile' | 'data_backup'

  // Church Profile Form
  const [profileForm, setProfileForm] = useState({ ...settings });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings(profileForm);
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

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>Administration & Settings</h2>
          <p>
            Manage church settings, congregational branding, and system data backups.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'church_profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('church_profile')}
        >
          Church Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'data_backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('data_backup')}
        >
          Data Backup & Reset
        </button>
      </div>

      {/* TAB 1: Church Profile */}
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

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '200px' }}>
                  <Check size={16} />
                  <span>Save Church Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Data Backup & Reset */}
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
                Download a complete, offline JSON backup of all members, families, ministries, and church settings. You can restore it at any time.
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
                <span>Reset to Demonstration Church Data</span>
              </h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Restore all members, families, and ministries back to the initial sample church demonstration dataset for EECMY YABELLO.
              </p>
              <button className="btn btn-danger" onClick={onPromptResetDemoData}>
                <RotateCcw size={16} />
                <span>Reset to Initial Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
