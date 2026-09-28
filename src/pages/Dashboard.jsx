import React from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Users,
  UserPlus,
  CreditCard,
  Award,
  Layers,
  ChevronRight,
  FileText,
  Calendar,
  CheckCircle,
  Home
} from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, onClick, subtitle }) => (
  <button className="dash-stat-card" onClick={onClick} type="button">
    <div className="dash-stat-icon dash-stat-icon--unified">
      <Icon size={20} />
    </div>
    <div className="dash-stat-body">
      <span className="dash-stat-value">{value}</span>
      <span className="dash-stat-label">{label}</span>
      {subtitle && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</span>}
    </div>
  </button>
);

// ── Section Header ─────────────────────────────────────────────
const SectionHeader = ({ title, action, onAction }) => (
  <div className="dash-section-header">
    <span className="dash-section-header__title">{title}</span>
    {action && (
      <button className="dash-section-header__link" onClick={onAction} type="button">
        {action} <ChevronRight size={13} />
      </button>
    )}
  </div>
);

// ── Recent Member Row ──────────────────────────────────────────
const MemberRow = ({ member, onViewProfile }) => (
  <div className="dash-member-row">
    <div className="dash-member-row__avatar">
      {member.photo ? (
        <img
          src={member.photo}
          alt={`${member.firstName} ${member.lastName}`}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span>{member.firstName?.charAt(0)}{member.lastName?.charAt(0)}</span>
      )}
    </div>
    <div className="dash-member-row__info">
      <span className="dash-member-row__name">{member.firstName} {member.lastName}</span>
      <span className="dash-member-row__meta">
        <span className="member-id-pill">{member.memberId}</span>
        {member.registeredAt && <span>• {member.registeredAt}</span>}
        <span className={`badge ${member.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`} style={{ fontSize: '0.65rem' }}>
          {member.spiritualInfo?.baptismStatus || 'Unbaptized'}
        </span>
      </span>
    </div>
    <span className={`badge ${member.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
      {member.status}
    </span>
    <button className="btn btn-secondary btn-sm" onClick={() => onViewProfile(member.id)} type="button">
      View
    </button>
  </div>
);

// ── Ministry Summary Row ────────────────────────────────────────
const MinistrySummaryRow = ({ ministry, memberCount, onNavigate }) => (
  <div className="dash-member-row">
    <div className="dash-member-row__avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
      {ministry.name.charAt(0)}
    </div>
    <div className="dash-member-row__info">
      <span className="dash-member-row__name">{ministry.name}</span>
      <span className="dash-member-row__meta">
        <span>{ministry.category || 'Ministry'}</span>
        <span>• {ministry.meetingSchedule || 'Weekly'}</span>
      </span>
    </div>
    <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>
      {memberCount} Members
    </span>
    <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('ministries')} type="button">
      Manage
    </button>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────
export const Dashboard = ({ onNavigate, onOpenRegisterMember, onSelectMemberProfile }) => {
  const { members, families, ministries, currentRole, settings } = useChurch();

  const totalMembers    = members.length;
  const activeMembers   = members.filter((m) => m.status === 'Active').length;
  const baptizedMembers = members.filter((m) => m.spiritualInfo?.baptismStatus === 'Baptized').length;
  const unbaptizedCount = totalMembers - baptizedMembers;

  const currentYear     = new Date().getFullYear();
  const newThisYear     = members.filter((m) => m.registeredAt?.startsWith(String(currentYear))).length;
  const recentMembers   = [...members].sort((a, b) => (b.registeredAt || '').localeCompare(a.registeredAt || '')).slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-container animate-fade-in">
      {/* Greeting Hero with Cross Logo */}
      <div className="dash-greeting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <img
              src="/church-logo.png"
              alt="EECMY Cross Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 className="dash-greeting__title">
              {greeting}
            </h2>
            <p className="dash-greeting__sub">
              {settings.churchName} · {currentRole === 'admin' ? 'Administrator Portal' : 'Staff / Kes Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-actions">
        <button className="btn btn-primary" onClick={onOpenRegisterMember} type="button">
          <UserPlus size={16} />
          <span>Register New Member</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onNavigate('idcards')}
          type="button"
        >
          <CreditCard size={16} />
          <span>Member ID Cards</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onNavigate('baptism')}
          type="button"
        >
          <Award size={16} />
          <span>Baptism Register</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onNavigate('reports')}
          type="button"
        >
          <FileText size={16} />
          <span>Monthly & Yearly Reports</span>
        </button>
      </div>

      {/* Unified Stats Grid */}
      <div className="dash-stats">
        <StatCard
          label="Total Congregation"
          value={totalMembers}
          icon={Users}
          onClick={() => onNavigate('members')}
          subtitle={`${activeMembers} Active Members`}
        />
        <StatCard
          label="Holy Baptisms"
          value={baptizedMembers}
          icon={Award}
          onClick={() => onNavigate('baptism')}
          subtitle={`${unbaptizedCount} In Baptism Preparation`}
        />
        <StatCard
          label="Family Households"
          value={families.length}
          icon={Home}
          onClick={() => onNavigate('families')}
          subtitle="Registered Family Units"
        />
        <StatCard
          label="Ministry Groups"
          value={ministries.length}
          icon={Layers}
          onClick={() => onNavigate('ministries')}
          subtitle="Sanctuary Departments"
        />
      </div>

      {/* Two-column lists */}
      <div className="dash-grid">
        {/* Recent Registrations */}
        <div className="card">
          <SectionHeader
            title="Recent Church Registrations"
            action="View Directory"
            onAction={() => onNavigate('members')}
          />
          <div className="dash-list">
            {recentMembers.length > 0 ? (
              recentMembers.map((m) => (
                <MemberRow key={m.id} member={m} onViewProfile={onSelectMemberProfile} />
              ))
            ) : (
              <div className="dash-empty">No members registered yet.</div>
            )}
          </div>
        </div>

        {/* Active Ministries Overview */}
        <div className="card">
          <SectionHeader
            title="Ministry Departments"
            action="All Ministries"
            onAction={() => onNavigate('ministries')}
          />
          <div className="dash-list">
            {ministries.length > 0 ? (
              ministries.slice(0, 6).map((min) => {
                const count = members.filter((m) => (m.ministryIds || []).includes(min.id)).length;
                return (
                  <MinistrySummaryRow
                    key={min.id}
                    ministry={min}
                    memberCount={count}
                    onNavigate={onNavigate}
                  />
                );
              })
            ) : (
              <div className="dash-empty">No ministry groups created.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
