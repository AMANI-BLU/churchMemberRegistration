import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Calendar,
  Users,
  Phone,
  UserPlus
} from 'lucide-react';

export const Ministries = ({
  onOpenCreateMinistry,
  onOpenEditMinistry,
  onPromptDeleteMinistry,
  onSelectMemberProfile,
  onOpenAssignMinistry
}) => {
  const { ministries, members, getMinistryMembers } = useChurch();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = Array.from(new Set(ministries.map((m) => m.category || 'General')));

  const filteredMinistries = ministries.filter((min) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      min.name.toLowerCase().includes(q) ||
      (min.category && min.category.toLowerCase().includes(q)) ||
      (min.leaderName && min.leaderName.toLowerCase().includes(q)) ||
      (min.description && min.description.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || min.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>Ministries & Fellowship Groups</h2>
          <p>
            Manage church departments, assign servant leaders, and coordinate active volunteer rosters.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={onOpenCreateMinistry}>
            <Plus size={18} />
            <span>Add New Ministry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search ministries by name, leader, schedule, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(searchQuery || categoryFilter !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Ministries Grid */}
      {filteredMinistries.length > 0 ? (
        <div className="responsive-card-grid">
          {filteredMinistries.map((min) => {
            const enrolledMembers = getMinistryMembers(min.id);

            return (
              <div
                key={min.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: '4px solid var(--primary)'
                }}
              >
                {/* Header */}
                <div className="card-header" style={{ background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {min.name}
                      </h3>
                      <span className="badge badge-role" style={{ fontSize: '0.7rem' }}>
                        {min.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      className="btn-icon sm"
                      onClick={() => onOpenEditMinistry(min)}
                      title="Edit Ministry Details"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-icon sm delete"
                      onClick={() => onPromptDeleteMinistry(min)}
                      title="Delete Ministry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {min.description && (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {min.description}
                    </p>
                  )}

                  {/* Leader and Meeting Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                    {min.leaderName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <User size={13} color="var(--primary)" />
                        <span>Leader: <strong>{min.leaderName}</strong></span>
                        {min.leaderContact && <span style={{ color: 'var(--text-muted)' }}>({min.leaderContact})</span>}
                      </div>
                    )}
                    {min.meetingSchedule && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Calendar size={13} color="var(--primary)" />
                        <span>Meets: {min.meetingSchedule}</span>
                      </div>
                    )}
                  </div>

                  {/* Enrolled Members Roster */}
                  <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        Active Members ({enrolledMembers.length})
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenAssignMinistry(min)}
                        style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                      >
                        <UserPlus size={12} />
                        <span>Manage Roster</span>
                      </button>
                    </div>

                    {enrolledMembers.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {enrolledMembers.slice(0, 6).map((m) => (
                          <div
                            key={m.id}
                            style={{
                              padding: '4px 10px',
                              background: '#f1f5f9',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            onClick={() => onSelectMemberProfile(m.id)}
                            title="Click to view member profile"
                          >
                            {m.firstName} {m.lastName.charAt(0)}.
                          </div>
                        ))}
                        {enrolledMembers.length > 6 && (
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{enrolledMembers.length - 6} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No members assigned yet. Click "Manage Roster" to enroll congregation members.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Layers size={28} />
            </div>
            <h4>No Ministries Found</h4>
            <p>
              {searchQuery
                ? 'No ministry groups match your search.'
                : 'Create your first ministry group to organize church fellowship and service.'}
            </p>
            <button className="btn btn-primary" onClick={onOpenCreateMinistry}>
              <Plus size={16} />
              <span>Add Ministry Group</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
