import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Award,
  Search,
  Plus,
  Printer,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  User
} from 'lucide-react';

export const Baptism = ({
  onOpenRecordBaptism,
  onOpenCertificate,
  onSelectMemberProfile
}) => {
  const { members, settings } = useChurch();

  const [activeTab, setActiveTab] = useState('all_baptized'); // 'all_baptized', 'candidates'
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('ALL');

  const currentYear = new Date().getFullYear();

  // Separate members into baptized and candidates
  const baptizedMembers = useMemo(() => {
    return members.filter((m) => m.spiritualInfo?.baptismStatus === 'Baptized');
  }, [members]);

  const baptismCandidates = useMemo(() => {
    return members.filter((m) => m.spiritualInfo?.baptismStatus !== 'Baptized');
  }, [members]);

  // Filtered baptized list
  const filteredBaptized = useMemo(() => {
    return baptizedMembers.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const certNo = (m.spiritualInfo?.certificateNo || '').toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        (m.memberId && m.memberId.toLowerCase().includes(q)) ||
        certNo.includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q));

      const bDate = m.spiritualInfo?.baptismDate || '';
      const matchesYear = yearFilter === 'ALL' || bDate.startsWith(yearFilter);

      return matchesSearch && matchesYear;
    });
  }, [baptizedMembers, searchQuery, yearFilter]);

  // Filtered candidates list
  const filteredCandidates = useMemo(() => {
    return baptismCandidates.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      return (
        !q ||
        fullName.includes(q) ||
        (m.memberId && m.memberId.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q))
      );
    });
  }, [baptismCandidates, searchQuery]);

  const thisYearBaptisms = baptizedMembers.filter((m) =>
    (m.spiritualInfo?.baptismDate || '').startsWith(String(currentYear))
  ).length;

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>Baptism Register & Certification</h2>
          <p>
            Track holy baptism milestones, manage believer candidates, and generate official church certificates.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => onOpenRecordBaptism(null)}>
            <Plus size={18} />
            <span>Record New Baptism</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Total Baptized</span>
            <div className="stat-value">{baptizedMembers.length}</div>
            <span className="stat-desc">{Math.round((baptizedMembers.length / (members.length || 1)) * 100)}% of congregation</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Baptized in {currentYear}</span>
            <div className="stat-value">{thisYearBaptisms}</div>
            <span className="stat-desc">Current ministry year</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Award size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Baptism Candidates</span>
            <div className="stat-value">{baptismCandidates.length}</div>
            <span className="stat-desc">Preparing for believer baptism</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Clock size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Certificates Ready</span>
            <div className="stat-value">{baptizedMembers.length}</div>
            <span className="stat-desc">Official seals & records</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="tabs-nav no-print">
        <button
          className={`tab-btn ${activeTab === 'all_baptized' ? 'active' : ''}`}
          onClick={() => setActiveTab('all_baptized')}
        >
          Baptized Members ({baptizedMembers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          Baptism Candidates / Seekers ({baptismCandidates.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search by candidate name, member ID, certificate #, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {activeTab === 'all_baptized' && (
          <div className="filter-group">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Baptism Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2020">2020 - 2023</option>
            </select>

            {(searchQuery || yearFilter !== 'ALL') && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setYearFilter('ALL');
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab 1: Baptized Members Roster */}
      {activeTab === 'all_baptized' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                Official Holy Baptism Register ({filteredBaptized.length})
              </span>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {filteredBaptized.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Candidate Name</th>
                      <th>Baptism Date</th>
                      <th>Officiating Reverend (Kes)</th>
                      <th>Certificate No.</th>
                      <th>Contact Phone</th>
                      <th style={{ textAlign: 'right' }}>Official Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBaptized.map((m) => {
                      const bDate = m.spiritualInfo?.baptismDate || 'Recorded';
                      const certNo = m.spiritualInfo?.certificateNo || `BAP-${m.memberId.replace(/[^0-9]/g, '')}`;
                      const officiant = m.spiritualInfo?.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo';

                      return (
                        <tr key={m.id}>
                          <td>
                            <span className="member-id-pill">{m.memberId}</span>
                          </td>
                          <td>
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
                                  style={{ fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}
                                  onClick={() => onSelectMemberProfile(m.id)}
                                >
                                  {m.firstName} {m.lastName}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  {m.gender} • {m.maritalStatus || 'Member'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                              <Calendar size={13} color="var(--text-muted)" />
                              {bDate}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                              {officiant}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-baptized" style={{ fontFamily: 'monospace' }}>
                              <Award size={11} />
                              {certNo}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {m.phone || '—'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onOpenCertificate(m.id)}
                                title="Generate Printable Official Certificate"
                              >
                                <Award size={14} />
                                <span>Certificate</span>
                              </button>
                              <button
                                className="btn-icon sm"
                                onClick={() => onSelectMemberProfile(m.id)}
                                title="View Member Profile"
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Award size={28} />
                </div>
                <h4>No Baptism Records Found</h4>
                <p>Record a new believer baptism to automatically issue official certificates.</p>
                <button className="btn btn-primary" onClick={() => onOpenRecordBaptism(null)}>
                  <Plus size={16} />
                  <span>Record First Baptism</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Candidates Preparing for Baptism */}
      {activeTab === 'candidates' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                Believer Candidates & Seekers ({filteredCandidates.length})
              </span>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {filteredCandidates.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Candidate Name</th>
                      <th>Registration Date</th>
                      <th>Contact Phone</th>
                      <th>Email</th>
                      <th>Salvation Date</th>
                      <th style={{ textAlign: 'right' }}>Baptism Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <span className="member-id-pill">{m.memberId}</span>
                        </td>
                        <td>
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
                                style={{ fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}
                                onClick={() => onSelectMemberProfile(m.id)}
                              >
                                {m.firstName} {m.lastName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {m.gender} • {m.occupation || 'Member'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.84rem' }}>{m.registeredAt || '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem' }}>{m.phone || '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{m.email || '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                            {m.spiritualInfo?.salvationDate || 'In discipleship'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => onOpenRecordBaptism(m.id)}
                              title="Record Holy Baptism for this candidate"
                            >
                              <Plus size={14} />
                              <span>Record Baptism</span>
                            </button>
                            <button
                              className="btn-icon sm"
                              onClick={() => onSelectMemberProfile(m.id)}
                              title="View Profile"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CheckCircle size={28} />
                </div>
                <h4>All Church Members Are Baptized</h4>
                <p>There are currently no unbaptized members in the congregation roster.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
