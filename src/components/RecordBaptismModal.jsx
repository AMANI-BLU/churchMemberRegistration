import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Award,
  X,
  Check,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

export const RecordBaptismModal = ({
  isOpen,
  onClose,
  preselectedMemberId = null
}) => {
  const { members, recordBaptism, settings } = useChurch();

  const [candidateId, setCandidateId] = useState(preselectedMemberId || '');
  const [formData, setFormData] = useState({
    baptismDate: new Date().toISOString().split('T')[0],
    officiatedBy: settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
    location: 'EECMY Sanctuary Baptistery',
    certificateNo: `BAP-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
    witness: 'Church Council Elder',
    salvationDate: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preselectedMemberId) {
        setCandidateId(preselectedMemberId);
      } else {
        const unbaptized = members.find((m) => m.spiritualInfo?.baptismStatus !== 'Baptized');
        setCandidateId(unbaptized ? unbaptized.id : (members[0]?.id || ''));
      }
      setFormData({
        baptismDate: new Date().toISOString().split('T')[0],
        officiatedBy: settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
        location: 'EECMY Sanctuary Baptistery',
        certificateNo: `BAP-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
        witness: 'Church Council Elder',
        salvationDate: '',
        notes: ''
      });
      setError('');
    }
  }, [isOpen, preselectedMemberId, members, settings]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateId) {
      setError('Please select a member candidate.');
      return;
    }
    recordBaptism(candidateId, formData);
    onClose();
  };

  const selectedMember = members.find((m) => m.id === candidateId || m.memberId === candidateId);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog md animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Award size={22} color="var(--primary)" />
            <span>Record Holy Baptism</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {/* Candidate Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                Select Candidate / Member <span className="required">*</span>
              </label>
              <select
                value={candidateId}
                onChange={(e) => {
                  setCandidateId(e.target.value);
                  setError('');
                }}
                className="form-select"
                disabled={!!preselectedMemberId}
              >
                <option value="">— Select Candidate —</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.memberId}) — {m.spiritualInfo?.baptismStatus || 'Unbaptized'}
                  </option>
                ))}
              </select>
              {error && <span style={{ color: 'var(--danger)', fontSize: '0.74rem' }}>{error}</span>}
            </div>

            {selectedMember && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}
              >
                <div className="avatar" style={{ overflow: 'hidden' }}>
                  {selectedMember.photo ? (
                    <img src={selectedMember.photo} alt={selectedMember.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {selectedMember.memberId} • {selectedMember.phone || 'No phone'} • {selectedMember.status}
                  </div>
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Baptism Date *</label>
                <input
                  type="date"
                  name="baptismDate"
                  value={formData.baptismDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Certificate Serial Number</label>
                <input
                  type="text"
                  name="certificateNo"
                  value={formData.certificateNo}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Officiating Reverend / Kes *</label>
                <input
                  type="text"
                  name="officiatedBy"
                  value={formData.officiatedBy}
                  onChange={handleChange}
                  placeholder="e.g. Reverend (Kes) Desta Guyo"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Baptism Location / Baptistery</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. EECMY Sanctuary Baptistery"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Church Witness / Elder</label>
                <input
                  type="text"
                  name="witness"
                  value={formData.witness}
                  onChange={handleChange}
                  placeholder="Elder Name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salvation Date (Optional)</label>
                <input
                  type="date"
                  name="salvationDate"
                  value={formData.salvationDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Notes & Spiritual Testimony</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Testimony summary, pastoral comments..."
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Record Baptism & Issue Certificate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
