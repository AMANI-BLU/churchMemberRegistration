import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import { Home, Edit2, X, Check, Plus, Trash2 } from 'lucide-react';

export const FamilyModal = ({ isOpen, onClose, familyToEdit = null }) => {
  const {
    addFamily,
    updateFamily,
    members,
    updateMember,
    getFamilyMembers
  } = useChurch();

  const isEditing = !!familyToEdit;

  const [formData, setFormData] = useState({
    familyName: '',
    address: '',
    contactPhone: '',
    headMemberId: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (familyToEdit) {
        setFormData({
          familyName: familyToEdit.familyName || '',
          address: familyToEdit.address || '',
          contactPhone: familyToEdit.contactPhone || '',
          headMemberId: familyToEdit.headMemberId || '',
          notes: familyToEdit.notes || ''
        });
      } else {
        setFormData({
          familyName: '',
          address: '',
          contactPhone: '',
          headMemberId: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, familyToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.familyName.trim()) {
      newErrors.familyName = 'Family name is required (e.g. Guyo Family)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateFamily(familyToEdit.id, formData);
      if (formData.headMemberId) {
        const head = members.find((m) => m.memberId === formData.headMemberId);
        if (head && head.familyId === familyToEdit.id) {
          updateMember(head.id, { familyRole: 'Head of Family' });
        }
      }
    } else {
      const createdFamily = addFamily(formData);
      if (formData.headMemberId) {
        const head = members.find((m) => m.memberId === formData.headMemberId);
        if (head) {
          updateMember(head.id, {
            familyId: createdFamily.id,
            familyRole: 'Head of Family'
          });
        }
      }
    }
    onClose();
  };

  const currentFamilyMembers = isEditing ? getFamilyMembers(familyToEdit.id) : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog md animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Home size={20} color="var(--primary)" />
            <span>{isEditing ? `Edit Family: ${familyToEdit.familyName}` : 'Create Family Household'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            <div className="form-grid">
              <div className={`form-group full ${errors.familyName ? 'has-error' : ''}`}>
                <label className="form-label">
                  Family Household Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  placeholder="e.g. Guyo Family"
                  className="form-input"
                  autoFocus
                />
                {errors.familyName && <span className="form-error-msg">{errors.familyName}</span>}
              </div>

              <div className="form-group full">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Kebele 01, Yabello"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Household Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+251 900 000 000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Head of Family</label>
                <select
                  name="headMemberId"
                  value={formData.headMemberId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">— Select Head of Household —</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.memberId}>
                      {m.firstName} {m.lastName} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full">
                <label className="form-label">Household Notes & Kes Details</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special prayer requests, family notes..."
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Current members if editing */}
            {isEditing && currentFamilyMembers.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Enrolled Family Members ({currentFamilyMembers.length}):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {currentFamilyMembers.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        padding: '4px 10px',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <strong>{m.firstName} {m.lastName}</strong> ({m.familyRole || 'Member'})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{isEditing ? 'Save Family Household' : 'Create Household'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
