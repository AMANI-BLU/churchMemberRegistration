import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Layers,
  X,
  Check,
  Search,
  Users,
  UserCheck
} from 'lucide-react';

export const AssignMinistryModal = ({
  isOpen,
  onClose,
  ministry
}) => {
  const { members, setMinistryMembers } = useChurch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  useEffect(() => {
    if (isOpen && ministry) {
      const currentEnrolled = members
        .filter((m) => (m.ministryIds || []).includes(ministry.id))
        .map((m) => m.id);
      setSelectedMemberIds(currentEnrolled);
      setSearchQuery('');
    }
  }, [isOpen, ministry, members]);

  if (!isOpen || !ministry) return null;

  const handleToggle = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredMembers.map((m) => m.id);
    const allSelected = filteredIds.every((id) => selectedMemberIds.includes(id));
    if (allSelected) {
      setSelectedMemberIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedMemberIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleSave = () => {
    setMinistryMembers(ministry.id, selectedMemberIds);
    onClose();
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (m.memberId && m.memberId.toLowerCase().includes(q)) ||
      (m.occupation && m.occupation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog md animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={20} color="var(--primary)" />
            <span>Manage Ministry Roster: {ministry.name}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Leader: <strong>{ministry.leaderName}</strong> • Schedule: <strong>{ministry.meetingSchedule}</strong>
            </span>
            <span className="badge badge-active">
              {selectedMemberIds.length} members enrolled
            </span>
          </div>

          {/* Search bar */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search members to enroll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSelectAllFiltered}
              style={{ fontSize: '0.76rem' }}
            >
              Toggle All Filtered ({filteredMembers.length})
            </button>
          </div>

          {/* Members Checkbox List */}
          <div
            style={{
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px'
            }}
          >
            {filteredMembers.map((m) => {
              const isChecked = selectedMemberIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`checkbox-item ${isChecked ? 'checked' : ''}`}
                  onClick={() => handleToggle(m.id)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '4px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <div className="avatar avatar-sm" style={{ overflow: 'hidden' }}>
                      {m.photo ? (
                        <img src={m.photo} alt={m.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '600' }}>
                        {m.firstName} {m.lastName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {m.memberId} • {m.occupation || 'Member'} • {m.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>Save Roster ({selectedMemberIds.length} Enrolled)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
