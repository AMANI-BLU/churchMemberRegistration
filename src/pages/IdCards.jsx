import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  CreditCard,
  Printer,
  Search,
  Check,
  QrCode,
  Church,
  Phone,
  MapPin,
  Sparkles,
  Users,
  User,
  ChevronDown
} from 'lucide-react';

export const IdCards = () => {
  const { settings, members, ministries } = useChurch();

  // UX: Starts focused on 1 member
  const [selectedIds, setSelectedIds] = useState(() => {
    return members.length > 0 ? [members[0].id] : [];
  });

  const [activeSide, setActiveSide] = useState('both'); // 'front', 'back', 'both'
  const [cardTheme, setCardTheme] = useState('sapphire'); // 'sapphire', 'slate'
  const [searchQuery, setSearchQuery] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('ALL');

  // Filtered members matching current search/filters
  const filteredMemberList = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        (m.memberId && m.memberId.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q));

      const matchesMinistry =
        ministryFilter === 'ALL' || (m.ministryIds || []).includes(ministryFilter);

      return matchesSearch && matchesMinistry;
    });
  }, [members, searchQuery, ministryFilter]);

  // Selected members for card rendering
  const displayMembers = useMemo(() => {
    return members.filter((m) => selectedIds.includes(m.id) || selectedIds.includes(m.memberId));
  }, [members, selectedIds]);

  // Handle single member selection from dropdown
  const handleSelectSingleMember = (memberId) => {
    if (!memberId) return;
    setSelectedIds([memberId]);
  };

  // Toggle selection for a member
  const handleToggleMember = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(members.map((m) => m.id));
  };

  const handleResetToSingle = () => {
    if (members.length > 0) {
      setSelectedIds([members[0].id]);
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  const isSingle = displayMembers.length === 1;
  const isAllSelected = selectedIds.length === members.length;

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <h2>Member ID Card Generator</h2>
          <p>
            Generate and print official CR80 church membership ID cards with barcodes, QR data, and pastoral signatures.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={handlePrintAll}
            disabled={displayMembers.length === 0}
          >
            <Printer size={16} />
            <span>Print {displayMembers.length} {displayMembers.length === 1 ? 'Card' : 'Cards'}</span>
          </button>
        </div>
      </div>

      {/* UX Controls & Selection Card */}
      <div className="card no-print" style={{ marginBottom: '18px', background: '#ffffff' }}>
        <div className="card-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Top Row: Primary Member Selector + Search + Batch Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {/* Quick Member Dropdown Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px', minWidth: '260px' }}>
              <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap', fontWeight: '700' }}>
                Select Member:
              </label>
              <select
                value={isSingle ? displayMembers[0]?.id : ''}
                onChange={(e) => handleSelectSingleMember(e.target.value)}
                className="form-select"
                style={{ fontWeight: '600', padding: '7px 12px', fontSize: '0.84rem', flex: 1 }}
              >
                <option value="" disabled={isSingle}>
                  {isAllSelected ? `— All Members Selected (${members.length}) —` : `— ${selectedIds.length} Members Selected —`}
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.memberId}) — {m.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action Toggle Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${isAllSelected ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleSelectAll}
              >
                <Users size={14} />
                <span>Select All ({members.length})</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetToSingle}
              >
                <User size={14} />
                <span>Focus Single</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: View Mode, Theme & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
            {/* Front / Back Toggle Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>VIEW:</span>
              <div className="btn-group" style={{ display: 'inline-flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${activeSide === 'both' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, border: 'none' }}
                  onClick={() => setActiveSide('both')}
                >
                  Both Sides
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeSide === 'front' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, border: 'none' }}
                  onClick={() => setActiveSide('front')}
                >
                  Front Only
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeSide === 'back' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, border: 'none' }}
                  onClick={() => setActiveSide('back')}
                >
                  Back Only
                </button>
              </div>
            </div>

            {/* Ministry Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>FILTER:</span>
              <select
                value={ministryFilter}
                onChange={(e) => setMinistryFilter(e.target.value)}
                className="filter-select"
                style={{ padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <option value="ALL">All Ministries</option>
                {ministries.map((min) => (
                  <option key={min.id} value={min.id}>
                    {min.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="search-input-wrapper" style={{ maxWidth: '200px' }}>
              <Search size={13} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ padding: '5px 8px 5px 28px', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Member Selector Chips */}
      <div className="id-card-member-chips no-print" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '20px', border: '1px solid var(--border-color)', background: '#ffffff', padding: '10px 14px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '6px', flexShrink: 0 }}>
          Toggle Card ({selectedIds.length} active):
        </span>
        {filteredMemberList.map((m) => {
          const isSelected = selectedIds.includes(m.id);
          return (
            <button
              key={m.id}
              className={`member-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggleMember(m.id)}
              type="button"
            >
              <span className="chip-avatar" style={{ overflow: 'hidden' }}>
                {m.photo ? (
                  <img src={m.photo} alt={m.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                )}
              </span>
              <span className="chip-name">{m.firstName} {m.lastName}</span>
              {isSelected && <Check size={12} className="chip-check" />}
            </button>
          );
        })}
      </div>

      {/* Main Preview Area */}
      <div className="card" style={{ background: '#f8fafc', border: '1px solid var(--border-color)' }}>
        <div className="card-header no-print" style={{ background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="var(--primary)" />
            <span style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--text-primary)' }}>
              {isSingle ? (
                <>Previewing ID Badge for <strong>{displayMembers[0]?.firstName} {displayMembers[0]?.lastName}</strong> ({displayMembers[0]?.memberId})</>
              ) : (
                <>Batch Preview: <strong>{displayMembers.length} Membership Badges</strong></>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Format: Standard CR80 PVC (3.375" × 2.125")
            </span>
            <button className="btn btn-primary btn-sm" onClick={handlePrintAll} type="button">
              <Printer size={14} />
              <span>Print {displayMembers.length} {displayMembers.length === 1 ? 'Card' : 'Cards'}</span>
            </button>
          </div>
        </div>

        <div className="card-body id-cards-preview-scroll" style={{ background: '#f1f5f9', padding: '28px' }}>
          {displayMembers.length > 0 ? (
            <div className="id-cards-grid id-theme-sapphire">
              {displayMembers.map((member) => {
                const memberMinistries = ministries.filter((min) =>
                  (member.ministryIds || []).includes(min.id)
                );
                const primaryMinistry = memberMinistries[0]?.name || (member.spiritualInfo?.baptismStatus === 'Baptized' ? 'Baptized Member' : 'Church Member');
                const issueYear = new Date().getFullYear();
                const validUntil = issueYear + 3;

                return (
                  <div key={member.id} className="id-card-pair-wrapper">
                    {/* FRONT SIDE */}
                    {(activeSide === 'both' || activeSide === 'front') && (
                      <div className="id-card id-card-front">
                        {/* Top Header */}
                        <div className="id-card-header">
                          <div className="id-card-logo">
                            <Church size={20} color="#ffffff" />
                          </div>
                          <div className="id-card-header-text">
                            <div className="id-church-name">{settings.churchName}</div>
                            <div className="id-church-tagline">{settings.tagline || 'Proclaiming Christ, Growing in Faith'}</div>
                          </div>
                        </div>

                        {/* Gold Accent Line */}
                        <div className="id-accent-line" />

                        {/* Card Body */}
                        <div className="id-card-body">
                          {/* Avatar / Photo Frame */}
                          <div className="id-avatar-frame">
                            <div className="id-avatar" style={{ overflow: 'hidden' }}>
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</span>
                              )}
                            </div>
                            <div className="id-status-badge">
                              {member.status === 'Active' ? 'ACTIVE' : 'MEMBER'}
                            </div>
                          </div>

                          {/* Member Details */}
                          <div className="id-details">
                            <div className="id-member-name">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="id-member-role">
                              {member.familyRole === 'Head of Family' ? 'HEAD OF HOUSEHOLD' : (member.familyRole ? member.familyRole.toUpperCase() : 'CONGREGATION MEMBER')}
                            </div>

                            <div className="id-meta-grid">
                              <div className="id-meta-item">
                                <span className="id-meta-label">MEMBER ID</span>
                                <span className="id-meta-value id-code">{member.memberId}</span>
                              </div>
                              <div className="id-meta-item">
                                <span className="id-meta-label">MINISTRY</span>
                                <span className="id-meta-value" title={primaryMinistry}>{primaryMinistry}</span>
                              </div>
                              <div className="id-meta-item">
                                <span className="id-meta-label">BAPTISM</span>
                                <span className="id-meta-value">{member.spiritualInfo?.baptismStatus || 'Unbaptized'}</span>
                              </div>
                              <div className="id-meta-item">
                                <span className="id-meta-label">VALID THRU</span>
                                <span className="id-meta-value">12 / {validUntil}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: SVG Barcode & QR code */}
                        <div className="id-card-footer">
                          <div className="id-barcode-container">
                            <svg className="id-svg-barcode" viewBox="0 0 160 28" preserveAspectRatio="none">
                              <rect x="0" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="5" y="0" width="1.5" height="28" fill="#1e293b" />
                              <rect x="8" y="0" width="4" height="28" fill="#1e293b" />
                              <rect x="14" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="18" y="0" width="1" height="28" fill="#1e293b" />
                              <rect x="21" y="0" width="3.5" height="28" fill="#1e293b" />
                              <rect x="26" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="30" y="0" width="5" height="28" fill="#1e293b" />
                              <rect x="37" y="0" width="1.5" height="28" fill="#1e293b" />
                              <rect x="40" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="45" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="49" y="0" width="4" height="28" fill="#1e293b" />
                              <rect x="55" y="0" width="1" height="28" fill="#1e293b" />
                              <rect x="58" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="63" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="67" y="0" width="4.5" height="28" fill="#1e293b" />
                              <rect x="73" y="0" width="1" height="28" fill="#1e293b" />
                              <rect x="76" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="81" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="85" y="0" width="4" height="28" fill="#1e293b" />
                              <rect x="91" y="0" width="1.5" height="28" fill="#1e293b" />
                              <rect x="94" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="99" y="0" width="2.5" height="28" fill="#1e293b" />
                              <rect x="103" y="0" width="4" height="28" fill="#1e293b" />
                              <rect x="109" y="0" width="1.5" height="28" fill="#1e293b" />
                              <rect x="113" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="118" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="122" y="0" width="4" height="28" fill="#1e293b" />
                              <rect x="128" y="0" width="1.5" height="28" fill="#1e293b" />
                              <rect x="132" y="0" width="3" height="28" fill="#1e293b" />
                              <rect x="137" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="141" y="0" width="5" height="28" fill="#1e293b" />
                              <rect x="148" y="0" width="2" height="28" fill="#1e293b" />
                              <rect x="152" y="0" width="3.5" height="28" fill="#1e293b" />
                              <rect x="157" y="0" width="2" height="28" fill="#1e293b" />
                            </svg>
                            <span className="id-barcode-num">{member.memberId}</span>
                          </div>

                          <div className="id-qr-badge">
                            <QrCode size={26} color="#0f172a" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BACK SIDE */}
                    {(activeSide === 'both' || activeSide === 'back') && (
                      <div className="id-card id-card-back">
                        <div className="id-card-back-header">
                          <div className="id-church-name-small">{settings.churchName}</div>
                          <div className="id-back-statement">OFFICIAL MEMBERSHIP IDENTIFICATION</div>
                        </div>

                        <div className="id-card-back-body">
                          <div className="id-disclaimer-box">
                            <p>
                              This card certifies that the bearer is a recognized active member of {settings.churchName}. Please present this badge for sacred ordinances, general assemblies, and official ministry functions.
                            </p>
                          </div>

                          <div className="id-back-details">
                            <div className="id-back-row">
                              <MapPin size={12} color="var(--primary)" />
                              <span>{settings.address}</span>
                            </div>
                            <div className="id-back-row">
                              <Phone size={12} color="var(--primary)" />
                              <span>{settings.phone} • {settings.email}</span>
                            </div>
                          </div>

                          <div className="id-back-signatures">
                            <div className="id-signature-block">
                              <div className="id-sig-line">
                                <span className="id-sig-script">{settings.seniorPastor || 'Reverend (Kes) Desta Guyo'}</span>
                              </div>
                              <span className="id-sig-label">Senior Reverend (Kes)</span>
                            </div>
                            <div className="id-signature-block">
                              <div className="id-church-seal">
                                <div className="seal-ring">
                                  <Sparkles size={13} color="#d97706" />
                                  <span>OFFICIAL SEAL</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="id-card-back-footer">
                          <span>If found, please return to {settings.churchName} Administration Office.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CreditCard size={28} />
              </div>
              <h4>No Member Selected</h4>
              <p>Select a member from the dropdown above or click a recipient chip to preview their ID badge.</p>
              <button className="btn btn-primary" onClick={handleResetToSingle}>
                <User size={16} />
                <span>Select First Member</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
