import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Award,
  Eye,
  Home,
  Phone,
  Mail,
  CreditCard,
  Printer,
  Download,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Members = ({
  onOpenRegisterMember,
  onOpenEditMember,
  onSelectMemberProfile,
  onPromptDeleteMember,
  onOpenIdCard
}) => {
  const {
    members,
    families,
    ministries,
    toggleMemberStatus,
    getFamilyById
  } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [baptismFilter, setBaptismFilter] = useState('ALL');
  const [ministryFilter, setMinistryFilter] = useState('ALL');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        (m.memberId && m.memberId.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.address && m.address.toLowerCase().includes(q)) ||
        (m.occupation && m.occupation.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      const matchesBaptism =
        baptismFilter === 'ALL' || m.spiritualInfo?.baptismStatus === baptismFilter;
      const matchesMinistry =
        ministryFilter === 'ALL' || (m.ministryIds || []).includes(ministryFilter);

      return matchesSearch && matchesStatus && matchesBaptism && matchesMinistry;
    });
  }, [members, searchQuery, statusFilter, baptismFilter, ministryFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * entriesPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + entriesPerPage);

  // Checkbox selection handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedMembers.map((m) => m.id);
    const allSelected = pageIds.every((id) => selectedMemberIds.includes(id));
    if (allSelected) {
      setSelectedMemberIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedMemberIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleMemberSelect = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllPageSelected = paginatedMembers.length > 0 && paginatedMembers.every((m) => selectedMemberIds.includes(m.id));

  // Export CSV
  const handleExportSelected = () => {
    const exportTargets = selectedMemberIds.length > 0
      ? members.filter((m) => selectedMemberIds.includes(m.id))
      : filteredMembers;

    const headers = ['Member ID', 'First Name', 'Last Name', 'Gender', 'Phone', 'Email', 'Address', 'Status', 'Baptism Status', 'Family Role', 'Registered Date'];
    const rows = exportTargets.map((m) => [
      `"${m.memberId}"`,
      `"${m.firstName}"`,
      `"${m.lastName}"`,
      `"${m.gender || ''}"`,
      `"${m.phone || ''}"`,
      `"${m.email || ''}"`,
      `"${m.address || ''}"`,
      `"${m.status}"`,
      `"${m.spiritualInfo?.baptismStatus || ''}"`,
      `"${m.familyRole || 'Individual'}"`,
      `"${m.registeredAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `church_members_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-breadcrumb">
            <span>Directory</span>
            <ChevronRight size={12} />
            <span className="current">Members</span>
          </div>
          <h2>
            Church Members <span className="header-count-badge">({members.length})</span>
          </h2>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handlePrintRoster} title="Print Members Roster">
            <Printer size={16} />
            <span className="btn-text">Print Roster</span>
          </button>
          <button className="btn btn-secondary" onClick={handleExportSelected} title="Export to CSV">
            <Download size={16} />
            <span className="btn-text">Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenRegisterMember}>
            <UserPlus size={16} />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* Floating Toolbar & Multi-Filter Bar */}
      <div className="filter-bar no-print">
        <div className="filter-group-left">
          {/* Show Entries */}
          <div className="filter-control-item">
            <span className="filter-label-inline">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="filter-select select-compact"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {/* Baptism Filter */}
          <select
            value={baptismFilter}
            onChange={(e) => {
              setBaptismFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="ALL">All Baptism</option>
            <option value="Baptized">Baptized</option>
            <option value="Unbaptized">Unbaptized</option>
          </select>

          {/* Ministry Filter */}
          <select
            value={ministryFilter}
            onChange={(e) => {
              setMinistryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="ALL">All Ministries</option>
            {ministries.map((min) => (
              <option key={min.id} value={min.id}>
                {min.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Search Input */}
        <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search member name, ID, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {/* Bulk Action Bar if items selected */}
      {selectedMemberIds.length > 0 && (
        <div className="bulk-actions-banner animate-fade-in no-print">
          <div className="bulk-selection-count">
            <span className="bulk-badge">{selectedMemberIds.length}</span>
            <span>{selectedMemberIds.length === 1 ? 'member selected' : 'members selected'}</span>
          </div>

          <div className="bulk-action-buttons">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenIdCard(selectedMemberIds)}
            >
              <CreditCard size={15} />
              <span>Generate ID Cards ({selectedMemberIds.length})</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportSelected}
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedMemberIds([])}
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Members Card & Table */}
      <div className="card member-table-card">
        <div className="card-body" style={{ padding: 0 }}>
          {paginatedMembers.length > 0 ? (
            <>
              <div className="table-responsive desktop-table-view">
                <table className="table table-hover table-arion">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', paddingLeft: '18px' }}>
                        <input
                          type="checkbox"
                          checked={isAllPageSelected}
                          onChange={handleSelectAllOnPage}
                          style={{ cursor: 'pointer' }}
                          title="Select all on page"
                        />
                      </th>
                      <th>MEMBER NAME</th>
                      <th>HOUSEHOLD</th>
                      <th>MINISTRIES</th>
                      <th>BAPTISM</th>
                      <th>REGISTERED</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMembers.map((m) => {
                      const family = m.familyId ? getFamilyById(m.familyId) : null;
                      const memberMinistries = ministries.filter((min) =>
                        (m.ministryIds || []).includes(min.id)
                      );
                      const isSelected = selectedMemberIds.includes(m.id);

                      return (
                        <tr key={m.id} className={isSelected ? 'row-selected' : ''}>
                          <td style={{ paddingLeft: '18px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleMemberSelect(m.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>

                          {/* Avatar + Member Details */}
                          <td>
                            <div className="member-cell">
                              <div
                                className="avatar avatar-glow"
                                onClick={() => onSelectMemberProfile(m.id)}
                                style={{ overflow: 'hidden' }}
                              >
                                {m.photo ? (
                                  <img
                                    src={m.photo}
                                    alt={`${m.firstName} ${m.lastName}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                                )}
                              </div>
                              <div className="member-cell-info">
                                <div
                                  className="member-name-link"
                                  onClick={() => onSelectMemberProfile(m.id)}
                                >
                                  {m.firstName} {m.lastName}
                                </div>
                                <div className="member-subtext">
                                  <span className="member-id-tag">{m.memberId}</span>
                                  {m.email && <span>{m.email}</span>}
                                  {!m.email && m.phone && <span>{m.phone}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Location / Family Household */}
                          <td>
                            <div className="family-cell">
                              {family ? (
                                <>
                                  <div className="family-name-text">
                                    <Home size={12} color="var(--primary)" />
                                    <span>{family.familyName}</span>
                                  </div>
                                  <span className="badge badge-role" style={{ fontSize: '0.68rem', alignSelf: 'flex-start' }}>
                                    {m.familyRole || 'Member'}
                                  </span>
                                </>
                              ) : (
                                <span className="individual-tag">Individual</span>
                              )}
                            </div>
                          </td>

                          {/* Ministries */}
                          <td>
                            <div className="ministries-pill-list">
                              {memberMinistries.slice(0, 2).map((min) => (
                                <span
                                  key={min.id}
                                  className="badge badge-active"
                                  style={{ fontSize: '0.7rem' }}
                                >
                                  {min.name}
                                </span>
                              ))}
                              {memberMinistries.length > 2 && (
                                <span className="badge badge-inactive" style={{ fontSize: '0.68rem' }}>
                                  +{memberMinistries.length - 2}
                                </span>
                              )}
                              {memberMinistries.length === 0 && (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>—</span>
                              )}
                            </div>
                          </td>

                          {/* Baptism Status */}
                          <td>
                            <span className={`badge ${m.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`}>
                              <Award size={11} />
                              {m.spiritualInfo?.baptismStatus || 'Unbaptized'}
                            </span>
                          </td>

                          {/* Registered Date */}
                          <td>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              {m.registeredAt || '—'}
                            </span>
                          </td>

                          {/* Status Pill with dot */}
                          <td>
                            <button
                              className={`status-pill ${m.status === 'Active' ? 'active' : 'inactive'}`}
                              onClick={() => toggleMemberStatus(m.id)}
                              title="Click to toggle status"
                            >
                              <span className="status-dot" />
                              <span>{m.status}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                              <button
                                className="btn-icon sm"
                                onClick={() => onOpenIdCard([m.id])}
                                title="Generate Church Member ID Card"
                              >
                                <CreditCard size={15} />
                              </button>
                              <button
                                className="btn-icon sm"
                                onClick={() => onSelectMemberProfile(m.id)}
                                title="View Member Profile"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                className="btn-icon sm"
                                onClick={() => onOpenEditMember(m)}
                                title="Edit Member Information"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="btn-icon sm delete"
                                onClick={() => onPromptDeleteMember(m)}
                                title="Delete Member"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-cards-view">
                {paginatedMembers.map((m) => {
                  const family = m.familyId ? getFamilyById(m.familyId) : null;
                  const memberMinistries = ministries.filter((min) =>
                    (m.ministryIds || []).includes(min.id)
                  );

                  return (
                    <div key={m.id} className="mobile-data-card">
                      <div className="mobile-data-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ overflow: 'hidden' }}>
                            {m.photo ? (
                              <img
                                src={m.photo}
                                alt={`${m.firstName} ${m.lastName}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--text-primary)' }}
                              onClick={() => onSelectMemberProfile(m.id)}
                            >
                              {m.firstName} {m.lastName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              <span className="member-id-pill">{m.memberId}</span>
                              <span style={{ marginLeft: '4px' }}>{m.gender} • {m.occupation || 'Member'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          className={`status-pill ${m.status === 'Active' ? 'active' : 'inactive'}`}
                          onClick={() => toggleMemberStatus(m.id)}
                        >
                          <span className="status-dot" />
                          <span>{m.status}</span>
                        </button>
                      </div>

                      <div className="mobile-data-card-body">
                        {/* Contacts */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem' }}>
                          {m.phone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                              <Phone size={13} />
                              {m.phone}
                            </span>
                          )}
                          {m.email && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                              <Mail size={13} />
                              {m.email}
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                          <span className={`badge ${m.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`}>
                            <Award size={11} />
                            {m.spiritualInfo?.baptismStatus || 'Unbaptized'}
                          </span>

                          {family && (
                            <span className="badge badge-role">
                              <Home size={11} />
                              {family.familyName} ({m.familyRole || 'Member'})
                            </span>
                          )}

                          {memberMinistries.map((min) => (
                            <span
                              key={min.id}
                              className="badge badge-active"
                              style={{ fontSize: '0.68rem' }}
                            >
                              {min.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mobile-data-card-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenIdCard([m.id])}
                          style={{ flex: 1 }}
                        >
                          <CreditCard size={14} />
                          <span>ID Card</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectMemberProfile(m.id)}
                          style={{ flex: 1 }}
                        >
                          <Eye size={14} />
                          <span>Profile</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenEditMember(m)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onPromptDeleteMember(m)}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Footer: Item Counter & Pagination */}
              <div className="table-pagination-footer no-print">
                <div className="pagination-count-text">
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + entriesPerPage, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong> items
                </div>

                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      title="Previous Page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      title="Next Page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={28} />
              </div>
              <h4>No Members Found</h4>
              <p>
                {searchQuery || statusFilter !== 'ALL' || baptismFilter !== 'ALL' || ministryFilter !== 'ALL'
                  ? 'No members match the current filter selection.'
                  : 'Start building your congregation directory by registering your first member.'}
              </p>
              <button className="btn btn-primary" onClick={onOpenRegisterMember}>
                <UserPlus size={16} />
                <span>Register Member Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
