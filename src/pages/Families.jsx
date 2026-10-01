import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Home,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Phone,
  MapPin,
  Users,
  Eye
} from 'lucide-react';

export const Families = ({
  onOpenCreateFamily,
  onOpenEditFamily,
  onPromptDeleteFamily,
  onSelectMemberProfile
}) => {
  const { families, members, getFamilyMembers } = useChurch();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFamilies = families.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      f.familyName.toLowerCase().includes(q) ||
      (f.address && f.address.toLowerCase().includes(q)) ||
      (f.contactPhone && f.contactPhone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>Church Families & Households</h2>
          <p>Organize members into households and visualize family relationships clearly.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={onOpenCreateFamily}>
            <Plus size={18} />
            <span>Create New Family</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search families by Family Name, Address, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Families Grid */}
      {filteredFamilies.length > 0 ? (
        <div className="responsive-card-grid">
          {filteredFamilies.map((fam) => {
            const familyMembers = getFamilyMembers(fam.id);
            const headMember = members.find(
              (m) => m.memberId === fam.headMemberId || (m.familyId === fam.id && m.familyRole === 'Head of Family')
            );

            return (
              <div key={fam.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header" style={{ background: 'var(--bg-app)' }}>
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
                      <Home size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {fam.familyName}
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {familyMembers.length} {familyMembers.length === 1 ? 'member' : 'household members'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      className="btn-icon sm"
                      onClick={() => onOpenEditFamily(fam)}
                      title="Edit Family Info"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn-icon sm delete"
                      onClick={() => onPromptDeleteFamily(fam)}
                      title="Delete Family"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Household Address & Contact */}
                  <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {fam.address && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        {fam.address}
                      </span>
                    )}
                    {fam.contactPhone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        {fam.contactPhone}
                      </span>
                    )}
                    {headMember && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: '600' }}>
                        <User size={14} color="var(--primary)" />
                        Head of Household: {headMember.firstName} {headMember.lastName}
                      </span>
                    )}
                  </div>

                  {/* Family Members Chips */}
                  <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Household Members ({familyMembers.length}):
                    </div>

                    {familyMembers.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {familyMembers.map((m) => (
                          <div
                            key={m.id}
                            style={{
                              padding: '6px 12px',
                              background: 'var(--bg-app)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => onSelectMemberProfile(m.id)}
                            title="View member profile"
                          >
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {m.firstName} {m.lastName}
                            </span>
                            {m.familyRole && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                ({m.familyRole})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No members linked to this family yet.
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
              <Home size={28} />
            </div>
            <h4>No Families Found</h4>
            <p>
              {searchQuery
                ? 'No family households match your search query.'
                : 'Create your first family household to organize related congregation members.'}
            </p>
            <button className="btn btn-primary" onClick={onOpenCreateFamily}>
              <Plus size={16} />
              <span>Create First Household</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
