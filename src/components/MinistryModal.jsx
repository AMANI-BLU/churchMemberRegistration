import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import { Layers, Edit2, X, Check, Users } from 'lucide-react';

export const MinistryModal = ({ isOpen, onClose, ministryToEdit = null }) => {
  const {
    addMinistry,
    updateMinistry,
    members,
    setMinistryMembers,
    getMinistryMembers
  } = useChurch();

  const isEditing = !!ministryToEdit;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Discipleship',
    leaderName: '',
    leaderContact: '',
    meetingSchedule: '',
    description: '',
    badgeColor: '#2563eb'
  });

  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'roster'
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (ministryToEdit) {
        setFormData({
          name: ministryToEdit.name || '',
          category: ministryToEdit.category || 'Discipleship',
          leaderName: ministryToEdit.leaderName || '',
          leaderContact: ministryToEdit.leaderContact || '',
          meetingSchedule: ministryToEdit.meetingSchedule || '',
          description: ministryToEdit.description || '',
          badgeColor: ministryToEdit.badgeColor || '#2563eb'
        });
        const enrolled = getMinistryMembers(ministryToEdit.id).map((m) => m.id);
        setSelectedMemberIds(enrolled);
      } else {
        setFormData({
          name: '',
          category: 'Discipleship',
          leaderName: '',
          leaderContact: '',
          meetingSchedule: '',
          description: '',
          badgeColor: '#2563eb'
        });
        setSelectedMemberIds([]);
      }
      setActiveTab('details');
      setErrors({});
    }
  }, [isOpen, ministryToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleMemberInRoster = (memberId) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ministry name is required';
    if (!formData.leaderName.trim()) newErrors.leaderName = 'Leader name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('details');
      return;
    }

    if (isEditing) {
      updateMinistry(ministryToEdit.id, formData);
      setMinistryMembers(ministryToEdit.id, selectedMemberIds);
    } else {
      const created = addMinistry(formData);
      if (selectedMemberIds.length > 0) {
        setMinistryMembers(created.id, selectedMemberIds);
      }
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog md animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={20} color="var(--primary)" />
            <span>{isEditing ? `Edit Ministry: ${formData.name}` : 'Create Ministry Group'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs-nav" style={{ padding: '0 24px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Ministry Info
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster')}
          >
            Member Roster ({selectedMemberIds.length})
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ maxHeight: 'calc(75vh - 120px)', overflowY: 'auto' }}>
            {activeTab === 'details' && (
              <div className="form-grid">
                <div className={`form-group full ${errors.name ? 'has-error' : ''}`}>
                  <label className="form-label">
                    Ministry / Team Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sanctuary Choir, Youth Fellowship"
                    className="form-input"
                    autoFocus
                  />
                  {errors.name && <span className="form-error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Ministry Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Worship & Arts">Worship & Arts</option>
                    <option value="Next Generation">Next Generation</option>
                    <option value="Discipleship">Discipleship</option>
                    <option value="Education">Education</option>
                    <option value="Intercession">Intercession</option>
                    <option value="Outreach & Care">Outreach & Care</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className={`form-group ${errors.leaderName ? 'has-error' : ''}`}>
                  <label className="form-label">
                    Servant Leader Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    placeholder="e.g. Sister Angela Hayes"
                    className="form-input"
                  />
                  {errors.leaderName && <span className="form-error-msg">{errors.leaderName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Leader Contact Phone</label>
                  <input
                    type="tel"
                    name="leaderContact"
                    value={formData.leaderContact}
                    onChange={handleChange}
                    placeholder="+251 900 000 000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meeting / Rehearsal Schedule</label>
                  <input
                    type="text"
                    name="meetingSchedule"
                    value={formData.meetingSchedule}
                    onChange={handleChange}
                    placeholder="e.g. Thursdays at 6:30 PM"
                    className="form-input"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Ministry Purpose & Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe mission, responsibilities and meeting purpose..."
                    className="form-textarea"
                  />
                </div>
              </div>
            )}

            {activeTab === 'roster' && (
              <div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Select congregation members enrolled in this ministry group:
                </p>

                <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '6px' }}>
                  {members.map((m) => {
                    const isEnrolled = selectedMemberIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`checkbox-item ${isEnrolled ? 'checked' : ''}`}
                        onClick={() => toggleMemberInRoster(m.id)}
                        style={{ padding: '8px 12px', marginBottom: '4px' }}
                      >
                        <input type="checkbox" checked={isEnrolled} onChange={() => {}} style={{ cursor: 'pointer' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar avatar-sm" style={{ overflow: 'hidden' }}>
                            {m.photo ? (
                              <img src={m.photo} alt={m.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.86rem', fontWeight: '600' }}>{m.firstName} {m.lastName}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({m.memberId})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{isEditing ? 'Save Ministry' : 'Create Ministry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
