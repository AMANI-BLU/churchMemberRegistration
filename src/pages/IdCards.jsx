import React, { useState, useEffect, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import { ImagePositionModal } from '../components/ImagePositionModal';
import {
  CreditCard,
  Printer,
  Search,
  Check,
  Church,
  Phone,
  MapPin,
  Sparkles,
  Users,
  User,
  ChevronDown,
  X,
  QrCode,
  Maximize2,
  Move
} from 'lucide-react';
import { RealBarcode, RealQRCode } from '../components/IdCodeGenerators';

export const IdCards = ({ initialSelectedIds = null }) => {
  const { settings, members, ministries, updateMember } = useChurch();

  // UX: Starts focused on targeted member(s) or default first member
  const [selectedIds, setSelectedIds] = useState(() => {
    if (initialSelectedIds) {
      const arr = Array.isArray(initialSelectedIds) ? initialSelectedIds : [initialSelectedIds];
      if (arr.length > 0) return arr;
    }
    return members.length > 0 ? [members[0].id] : [];
  });

  // Sync selection whenever initialSelectedIds prop changes (e.g. user clicked ID card from members list)
  useEffect(() => {
    if (initialSelectedIds) {
      const arr = Array.isArray(initialSelectedIds) ? initialSelectedIds : [initialSelectedIds];
      if (arr.length > 0) {
        setSelectedIds(arr);
      }
    }
  }, [initialSelectedIds]);

  const [activeSide, setActiveSide] = useState('both'); // 'front', 'back', 'both'
  const [cardTheme, setCardTheme] = useState('sapphire'); // 'sapphire', 'slate'
  const [searchQuery, setSearchQuery] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('ALL');
  const [qrModalMember, setQrModalMember] = useState(null);
  const [adjustPhotoMember, setAdjustPhotoMember] = useState(null);

  const isFiltering = searchQuery.trim().length > 0 || ministryFilter !== 'ALL';

  // Filtered members matching current search/filters
  const filteredMemberList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const memberId = (m.memberId || '').toLowerCase();
      const phone = (m.phone || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      const address = (m.address || '').toLowerCase();
      const role = (m.familyRole || '').toLowerCase();
      const occupation = (m.occupation || '').toLowerCase();
      const baptismStatus = (m.spiritualInfo?.baptismStatus || '').toLowerCase();

      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        memberId.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        address.includes(q) ||
        role.includes(q) ||
        occupation.includes(q) ||
        baptismStatus.includes(q);

      const matchesMinistry =
        ministryFilter === 'ALL' || (m.ministryIds || []).includes(ministryFilter);

      return matchesSearch && matchesMinistry;
    });
  }, [members, searchQuery, ministryFilter]);

  // Selected members for card rendering
  const displayMembers = useMemo(() => {
    if (isFiltering) {
      const selectedInFilter = filteredMemberList.filter((m) =>
        selectedIds.includes(m.id) || selectedIds.includes(m.memberId)
      );
      if (selectedInFilter.length > 0 && selectedIds.length === 1) {
        return selectedInFilter;
      }
      return filteredMemberList;
    }
    return members.filter((m) => selectedIds.includes(m.id) || selectedIds.includes(m.memberId));
  }, [members, filteredMemberList, selectedIds, isFiltering]);

  // Handle single member selection from dropdown
  const handleSelectSingleMember = (memberId) => {
    if (!memberId) return;
    setSelectedIds([memberId]);
  };

  const handleSelectAll = () => {
    const targetList = isFiltering ? filteredMemberList : members;
    setSelectedIds(targetList.map((m) => m.id));
  };

  const handleResetToSingle = () => {
    const targetList = isFiltering ? filteredMemberList : members;
    if (targetList.length > 0) {
      setSelectedIds([targetList[0].id]);
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
                  {filteredMemberList.length === 0
                    ? '— No matching members found —'
                    : isFiltering
                    ? `— Showing ${displayMembers.length} of ${filteredMemberList.length} Search Results —`
                    : isAllSelected
                    ? `— All Members Selected (${members.length}) —`
                    : `— ${selectedIds.length} Members Selected —`}
                </option>
                {filteredMemberList.map((m) => (
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
                disabled={filteredMemberList.length === 0}
              >
                <Users size={14} />
                <span>Select All ({filteredMemberList.length})</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetToSingle}
                disabled={filteredMemberList.length === 0}
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
            <div className="search-input-wrapper" style={{ minWidth: '220px', position: 'relative' }}>
              <Search size={13} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search by name, ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ padding: '5px 28px 5px 28px', fontSize: '0.78rem', width: '100%' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
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

                // Real structured verification payload for the QR code
                const qrPayload = [
                  `CHURCH: ${settings.churchName || 'EECMY YABELLO'}`,
                  `NAME: ${member.firstName} ${member.lastName}`,
                  `MEMBER ID: ${member.memberId}`,
                  `PHONE: ${member.phone || 'N/A'}`,
                  `MINISTRY: ${primaryMinistry}`,
                  `BAPTISM: ${member.spiritualInfo?.baptismStatus || 'Unbaptized'}`,
                  `ISSUED: ${issueYear} | VALID THRU: 12/${validUntil}`
                ].join('\n');

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
                            <div
                              className="id-avatar"
                              style={{
                                overflow: 'hidden',
                                cursor: member.photo ? 'pointer' : 'default',
                                position: 'relative'
                              }}
                              onClick={() => {
                                if (member.photo) setAdjustPhotoMember(member);
                              }}
                              title={member.photo ? 'Click to adjust photo framing for ID Card' : ''}
                            >
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
                            {member.photo && (
                              <button
                                type="button"
                                className="no-print"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAdjustPhotoMember(member);
                                }}
                                style={{
                                  marginTop: '3px',
                                  fontSize: '0.62rem',
                                  padding: '2px 6px',
                                  background: 'rgba(30, 58, 138, 0.08)',
                                  color: 'var(--primary)',
                                  border: '1px solid rgba(30, 58, 138, 0.2)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  fontWeight: '600'
                                }}
                                title="Adjust Photo Position & Framing"
                              >
                                <Move size={9} />
                                <span>Fix Photo</span>
                              </button>
                            )}
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

                        {/* Card Footer: Real Scannable Barcode & QR code */}
                        <div className="id-card-footer">
                          <div className="id-barcode-container">
                            <RealBarcode value={member.memberId || 'MEM-000'} width={1.4} height={18} />
                            <span className="id-barcode-num">{member.memberId}</span>
                          </div>

                          <div
                            className="id-qr-badge"
                            title="Click to enlarge & scan QR"
                            onClick={() => setQrModalMember({ member, payload: qrPayload })}
                          >
                            <RealQRCode value={qrPayload} size={38} />
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
                              This card certifies that the bearer is a recognized member of {settings.churchName}. Please present this badge for sacred ordinances, general assemblies, and official ministry functions.
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
            <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div className="empty-state-icon">
                <CreditCard size={28} />
              </div>
              <h4>{isFiltering ? 'No Matching Members Found' : 'No Member Selected'}</h4>
              <p style={{ maxWidth: '420px', margin: '8px auto 16px', color: 'var(--text-muted)' }}>
                {isFiltering
                  ? `No church members match your search criteria. Try searching with a different name or member ID.`
                  : 'Select a member from the dropdown above to preview their official church ID badge.'}
              </p>
              {isFiltering ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setMinistryFilter('ALL');
                  }}
                >
                  <X size={14} />
                  <span>Clear Search Filters</span>
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleResetToSingle}>
                  <User size={16} />
                  <span>Select First Member</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* QR ZOOM & SCAN PREVIEW MODAL */}
      {qrModalMember && (
        <div className="qr-zoom-overlay" onClick={() => setQrModalMember(null)}>
          <div className="qr-zoom-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Scan Member QR Code
                </h4>
              </div>
              <button
                className="btn-icon"
                onClick={() => setQrModalMember(null)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b' }}>
              Point any smartphone camera (iPhone Camera or Google Lens) at the code below:
            </p>

            <div className="qr-zoom-display">
              <RealQRCode value={qrModalMember.payload} size={220} />
            </div>

            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a', marginBottom: '4px' }}>
              {qrModalMember.member.firstName} {qrModalMember.member.lastName}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
              ID: <strong>{qrModalMember.member.memberId}</strong>
            </div>

            <div className="qr-zoom-data">
              {qrModalMember.payload}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
              onClick={() => setQrModalMember(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {adjustPhotoMember && (
        <ImagePositionModal
          isOpen={!!adjustPhotoMember}
          imageSrc={adjustPhotoMember.rawPhoto || adjustPhotoMember.photo}
          initialPosition={adjustPhotoMember.photoPosition}
          memberName={`${adjustPhotoMember.firstName} ${adjustPhotoMember.lastName}`}
          onSave={(croppedUrl, positionMetadata) => {
            updateMember(adjustPhotoMember.id, {
              photo: croppedUrl,
              rawPhoto: positionMetadata.rawPhoto || adjustPhotoMember.rawPhoto || adjustPhotoMember.photo,
              photoPosition: positionMetadata
            });
            setAdjustPhotoMember(null);
          }}
          onClose={() => setAdjustPhotoMember(null)}
        />
      )}
    </div>
  );
};
