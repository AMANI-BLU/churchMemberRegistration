import React from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  User,
  Edit2,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Home,
  Layers,
  Printer,
  CreditCard
} from 'lucide-react';

export const MemberProfileModal = ({
  isOpen,
  onClose,
  memberId,
  onEditMember
}) => {
  const {
    getMemberById,
    getFamilyById,
    getFamilyMembers,
    ministries,
    settings,
    toggleMemberStatus
  } = useChurch();

  if (!isOpen || !memberId) return null;

  const member = getMemberById(memberId);
  if (!member) return null;

  const family = member.familyId ? getFamilyById(member.familyId) : null;
  const familyMembers = family ? getFamilyMembers(family.id) : [];
  const memberMinistries = ministries.filter((m) => (member.ministryIds || []).includes(m.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog lg animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <User size={22} color="var(--primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {member.firstName} {member.lastName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button className="btn btn-secondary btn-sm no-print" onClick={handlePrint} title="Print Member Record">
              <Printer size={15} />
              <span>Print Profile</span>
            </button>
            <button
              className="btn btn-secondary btn-sm no-print"
              onClick={() => {
                onClose();
                onEditMember(member);
              }}
              title="Edit Member Information"
            >
              <Edit2 size={15} />
              <span>Edit</span>
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Print Header */}
          <div className="print-header print-only">
            <h1>{settings.churchName}</h1>
            <p>Official Church Member Record • Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Profile Hero Card */}
          <div className="profile-hero">
            <div className="avatar avatar-lg" style={{ flexShrink: 0, overflow: 'hidden' }}>
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={`${member.firstName} ${member.lastName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{member.firstName?.charAt(0)}{member.lastName?.charAt(0)}</span>
              )}
            </div>
            <div className="profile-hero-info" style={{ minWidth: 0, flex: '1 1 200px' }}>
              <h3 style={{ wordBreak: 'break-word' }}>
                {member.firstName} {member.lastName}
              </h3>
              <div className="profile-hero-meta">
                <span className="member-id-pill">{member.memberId}</span>
                <span className={`badge ${member.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                  {member.status}
                </span>
                <span className={`badge ${member.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`}>
                  <Award size={12} />
                  {member.spiritualInfo?.baptismStatus || 'Unbaptized'}
                </span>
                {member.familyRole && (
                  <span className="badge badge-role">
                    <Home size={12} />
                    {member.familyRole}
                  </span>
                )}
              </div>
            </div>
            <div className="no-print" style={{ marginLeft: 'auto' }}>
              <button
                className={`btn btn-sm ${member.status === 'Active' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleMemberStatus(member.id)}
              >
                Mark as {member.status === 'Active' ? 'Inactive' : 'Active'}
              </button>
            </div>
          </div>

          {/* 2-Column Info Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
            {/* Personal Details */}
            <div className="profile-section-card">
              <div className="form-section-title" style={{ marginTop: 0 }}>
                <User size={16} color="var(--primary)" />
                Personal Information
              </div>
              <div className="profile-details-list">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Gender</span>
                  <span className="profile-detail-value">{member.gender || 'Not specified'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Marital Status</span>
                  <span className="profile-detail-value">{member.maritalStatus || 'Not specified'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Date of Birth</span>
                  <span className="profile-detail-value">{member.dob || 'Not recorded'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Occupation</span>
                  <span className="profile-detail-value">{member.occupation || 'Not specified'}</span>
                </div>
                <div className="profile-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="profile-detail-label">Phone</span>
                  <span className="profile-detail-value">
                    {member.phone ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        {member.phone}
                      </span>
                    ) : (
                      'None'
                    )}
                  </span>
                </div>
                <div className="profile-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="profile-detail-label">Email</span>
                  <span className="profile-detail-value">
                    {member.email ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} color="var(--text-muted)" />
                        {member.email}
                      </span>
                    ) : (
                      'None'
                    )}
                  </span>
                </div>
                <div className="profile-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="profile-detail-label">Residential Address</span>
                  <span className="profile-detail-value">
                    {member.address ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        {member.address}
                      </span>
                    ) : (
                      'No address provided'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Spiritual Milestones */}
            <div className="profile-section-card">
              <div className="form-section-title" style={{ marginTop: 0 }}>
                <Award size={16} color="var(--primary)" />
                Spiritual Journey & Foundation
              </div>
              <div className="profile-details-list">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Baptism Status</span>
                  <span className="profile-detail-value">
                    <span className={`badge ${member.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`}>
                      {member.spiritualInfo?.baptismStatus || 'Unbaptized'}
                    </span>
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Baptism Date</span>
                  <span className="profile-detail-value">
                    {member.spiritualInfo?.baptismDate || 'Not recorded'}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Salvation Date</span>
                  <span className="profile-detail-value">
                    {member.spiritualInfo?.salvationDate || 'Not recorded'}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Member Since</span>
                  <span className="profile-detail-value">{member.registeredAt || 'Unknown'}</span>
                </div>
                <div className="profile-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="profile-detail-label">Registered By</span>
                  <span className="profile-detail-value">{member.registeredBy || 'Admin'}</span>
                </div>
              </div>

              {member.notes && (
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <span className="profile-detail-label">Kes & Pastoral Notes</span>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                    "{member.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Family & Households */}
          <div className="profile-section-card" style={{ marginTop: '16px' }}>
            <div className="form-section-title" style={{ marginTop: 0 }}>
              <Home size={16} color="var(--primary)" />
              Family Household Connection
            </div>
            {family ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{family.familyName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Address: {family.address} • Contact: {family.contactPhone}
                    </div>
                  </div>
                  <span className="badge badge-role">{member.familyRole}</span>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Family Members in this Household ({familyMembers.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {familyMembers.map((fm) => (
                    <div
                      key={fm.id}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>
                        {fm.firstName} {fm.lastName}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({fm.familyRole})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                No family unit linked. Registered as an independent member.
              </p>
            )}
          </div>

          {/* Active Ministries */}
          <div className="profile-section-card" style={{ marginTop: '16px' }}>
            <div className="form-section-title" style={{ marginTop: 0 }}>
              <Layers size={16} color="var(--primary)" />
              Active Ministry Enrollments ({memberMinistries.length})
            </div>
            {memberMinistries.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {memberMinistries.map((min) => (
                  <div
                    key={min.id}
                    style={{
                      padding: '8px 14px',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      borderLeft: '4px solid var(--primary)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{min.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Leader: {min.leaderName} • {min.meetingSchedule}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Not currently enrolled in any ministry groups.
              </p>
            )}
          </div>

          {/* Membership Badge & Verification */}
          <div className="profile-section-card" style={{ marginTop: '16px' }}>
            <div className="form-section-title" style={{ marginTop: 0 }}>
              <CreditCard size={16} color="var(--primary)" />
              Membership Verification & Identification
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Official Church Badge: {member.memberId}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Status: <strong>{member.status}</strong> • Registered: <strong>{member.registeredAt || 'Recorded'}</strong> by {member.registeredBy || 'Admin'}
                </div>
              </div>
              <div className="member-id-pill" style={{ fontSize: '0.86rem', padding: '4px 10px' }}>
                {settings.churchName}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEditMember(member);
            }}
          >
            <Edit2 size={16} />
            <span>Edit Member Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
