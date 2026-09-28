import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  FileText,
  Printer,
  Download,
  Users,
  Home,
  Layers,
  Award,
  CheckCircle,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';
import { DonutChart, HorizontalBarChart } from '../components/ReportCharts';

export const Reports = () => {
  const {
    settings,
    members,
    families,
    ministries,
    getMinistryMembers,
    getFamilyMembers
  } = useChurch();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState('ALL'); // 'ALL' or '01', '02', ..., '12'
  const [activeReportTab, setActiveReportTab] = useState('executive_summary');
  const [showVisualCharts, setShowVisualCharts] = useState(true);

  const MONTHS = [
    { value: 'ALL', label: 'Entire Year (Annual)' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Filter members by selected year & month
  const periodMembers = useMemo(() => {
    return members.filter((m) => {
      const regDate = m.registeredAt || '';
      if (!regDate.startsWith(selectedYear)) return false;
      if (selectedMonth !== 'ALL') {
        const parts = regDate.split('-');
        if (parts.length >= 2 && parts[1] !== selectedMonth) return false;
      }
      return true;
    });
  }, [members, selectedYear, selectedMonth]);

  // Filter baptisms by selected period
  const periodBaptisms = useMemo(() => {
    return members.filter((m) => {
      if (m.spiritualInfo?.baptismStatus !== 'Baptized') return false;
      const bDate = m.spiritualInfo?.baptismDate || '';
      if (!bDate.startsWith(selectedYear)) return false;
      if (selectedMonth !== 'ALL') {
        const parts = bDate.split('-');
        if (parts.length >= 2 && parts[1] !== selectedMonth) return false;
      }
      return true;
    });
  }, [members, selectedYear, selectedMonth]);

  // Overall totals
  const totalCongregation = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const totalBaptized = members.filter((m) => m.spiritualInfo?.baptismStatus === 'Baptized').length;
  const unbaptizedCandidates = totalCongregation - totalBaptized;

  // Monthly breakdown for selected year (12 months array)
  const monthlyData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames.map((name, idx) => {
      const mStr = String(idx + 1).padStart(2, '0');
      const regCount = members.filter((m) => (m.registeredAt || '').startsWith(`${selectedYear}-${mStr}`)).length;
      const bapCount = members.filter((m) =>
        m.spiritualInfo?.baptismStatus === 'Baptized' &&
        (m.spiritualInfo?.baptismDate || '').startsWith(`${selectedYear}-${mStr}`)
      ).length;
      return { month: name, registrations: regCount, baptisms: bapCount };
    });
  }, [members, selectedYear]);

  // Demographics calculation
  const demographicsData = useMemo(() => {
    let children = 0; // 0-12
    let youth = 0; // 13-19
    let youngAdults = 0; // 20-35
    let adults = 0; // 36-59
    let seniors = 0; // 60+

    const thisYear = new Date().getFullYear();

    members.forEach((m) => {
      if (!m.dob) return;
      const birthYear = parseInt(m.dob.split('-')[0], 10);
      if (isNaN(birthYear)) return;
      const age = thisYear - birthYear;
      if (age <= 12) children++;
      else if (age <= 19) youth++;
      else if (age <= 35) youngAdults++;
      else if (age <= 59) adults++;
      else seniors++;
    });

    return [
      { label: 'Children (0–12 yrs)', count: children, color: '#2563eb' },
      { label: 'Youth (13–19 yrs)', count: youth, color: '#3b82f6' },
      { label: 'Young Adults (20–35 yrs)', count: youngAdults, color: '#60a5fa' },
      { label: 'Adults (36–59 yrs)', count: adults, color: '#1d4ed8' },
      { label: 'Seniors (60+ yrs)', count: seniors, color: '#1e40af' }
    ];
  }, [members]);

  // Ministry enrollment data
  const ministryChartData = useMemo(() => {
    return ministries.map((min) => ({
      label: min.name,
      value: getMinistryMembers(min.id).length,
      color: 'var(--primary)'
    }));
  }, [ministries, getMinistryMembers]);

  // CSV Export
  const handleExportCsv = () => {
    let filename = `church_${activeReportTab}_report_${selectedYear}_${selectedMonth}.csv`;
    let headers = ['Member ID', 'Full Name', 'Gender', 'Phone', 'Email', 'Status', 'Baptism Status', 'Family Role', 'Registered Date'];
    let rows = (periodMembers.length > 0 ? periodMembers : members).map((m) => [
      `"${m.memberId}"`,
      `"${m.firstName} ${m.lastName}"`,
      `"${m.gender || ''}"`,
      `"${m.phone || ''}"`,
      `"${m.email || ''}"`,
      `"${m.status}"`,
      `"${m.spiritualInfo?.baptismStatus || ''}"`,
      `"${m.familyRole || 'Individual'}"`,
      `"${m.registeredAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || 'Annual';

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <h2>Monthly & Yearly Church Reports</h2>
          <p>
            Generate comprehensive membership, baptism, ministry growth, and demographic analytics for church leadership.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className={`btn ${showVisualCharts ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowVisualCharts(!showVisualCharts)}
            title="Toggle Visual Analytics"
          >
            <Eye size={16} />
            <span>{showVisualCharts ? 'Hide Visual Charts' : 'Show Visual Charts'}</span>
          </button>
          <button className="btn btn-secondary" onClick={handleExportCsv} title="Export CSV">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint} title="Print Official Church Report">
            <Printer size={16} />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Period Selector Bar (Year & Month Filters) */}
      <div className="filter-bar no-print" style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="var(--primary)" />
            <span style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-primary)' }}>Report Period:</span>
          </div>

          {/* Year Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="filter-label-inline">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
              style={{ fontWeight: '700', minWidth: '100px' }}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Month Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="filter-label-inline">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
              style={{ minWidth: '160px', fontWeight: '600' }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <span className="badge badge-active" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
            Period: {selectedYear} • {monthLabel}
          </span>
        </div>
      </div>

      {/* Unified KPI Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">New Registrations ({monthLabel})</span>
            <div className="stat-value">{periodMembers.length}</div>
            <span className="stat-desc">
              {selectedMonth === 'ALL' ? `Total registered in ${selectedYear}` : `Joined during ${monthLabel} ${selectedYear}`}
            </span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Holy Baptisms ({monthLabel})</span>
            <div className="stat-value">{periodBaptisms.length}</div>
            <span className="stat-desc">Water baptism milestones recorded</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Award size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Total Congregation</span>
            <div className="stat-value">{totalCongregation}</div>
            <span className="stat-desc">{activeMembers} Active ({Math.round((activeMembers / (totalCongregation || 1)) * 100)}% Retention)</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Ministry Enrollment</span>
            <div className="stat-value">{ministries.length} Groups</div>
            <span className="stat-desc">{families.length} Family Households</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid (Toggleable) */}
      {showVisualCharts && (
        <div className="charts-grid no-print">
          {/* Monthly Registration Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">
                  <TrendingUp size={18} color="var(--primary)" />
                  <span>{selectedYear} Monthly Growth & Registration Trend</span>
                </div>
                <div className="chart-subtitle">New members registered per month</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingTop: '20px', gap: '6px' }}>
              {monthlyData.map((d) => {
                const maxVal = Math.max(...monthlyData.map((m) => m.registrations), 5);
                const heightPct = Math.round((d.registrations / maxVal) * 100);

                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: d.registrations > 0 ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '4px' }}>
                      {d.registrations}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '26px',
                        height: `${Math.max(heightPct, 8)}%`,
                        background: d.registrations > 0 ? 'var(--primary)' : 'var(--border-color)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease'
                      }}
                      title={`${d.month} ${selectedYear}: ${d.registrations} new members, ${d.baptisms} baptisms`}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Baptism Status Donut */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">
                  <Award size={18} color="var(--primary)" />
                  <span>Baptism Spiritual Milestones</span>
                </div>
                <div className="chart-subtitle">Baptized vs Unbaptized candidates</div>
              </div>
            </div>
            <DonutChart
              data={[
                { label: 'Baptized', value: totalBaptized, color: '#2563eb' },
                { label: 'Unbaptized Candidates', value: unbaptizedCandidates, color: '#94a3b8' }
              ]}
              centerValue={totalBaptized}
              centerLabel="Baptized"
            />
          </div>

          {/* Age Demographics Horizontal Bar */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">
                  <Users size={18} color="var(--primary)" />
                  <span>Age Demographics Distribution</span>
                </div>
                <div className="chart-subtitle">Generational congregation breakdown</div>
              </div>
            </div>
            <HorizontalBarChart
              items={demographicsData.map((d) => ({
                label: d.label,
                value: d.count,
                color: d.color
              }))}
              maxVal={Math.max(...demographicsData.map((d) => d.count), 1)}
            />
          </div>

          {/* Ministry Participation */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">
                  <Layers size={18} color="var(--primary)" />
                  <span>Ministry Involvement Roster</span>
                </div>
                <div className="chart-subtitle">Active member participation per group</div>
              </div>
            </div>
            <HorizontalBarChart
              items={ministryChartData}
              maxVal={Math.max(...ministryChartData.map((d) => d.value), 1)}
            />
          </div>
        </div>
      )}

      {/* Sub Report Navigation Tabs */}
      <div className="tabs-nav no-print">
        <button
          className={`tab-btn ${activeReportTab === 'executive_summary' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('executive_summary')}
        >
          Period Member Roster ({periodMembers.length})
        </button>
        <button
          className={`tab-btn ${activeReportTab === 'period_baptisms' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('period_baptisms')}
        >
          Baptisms in Period ({periodBaptisms.length})
        </button>
        <button
          className={`tab-btn ${activeReportTab === 'families' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('families')}
        >
          Family Households ({families.length})
        </button>
        <button
          className={`tab-btn ${activeReportTab === 'ministries' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('ministries')}
        >
          Ministries Roster ({ministries.length})
        </button>
      </div>

      {/* Print Document Header (Visible when printed) */}
      <div className="print-header print-only">
        <h1>{settings.churchName}</h1>
        <p>{settings.address} • {settings.phone} • {settings.email}</p>
        <div style={{ marginTop: '10px', padding: '8px', border: '1px solid #000', fontWeight: 'bold' }}>
          OFFICIAL CHURCH REPORT • PERIOD: {selectedYear} ({monthLabel.toUpperCase()}) • GENERATED: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Report Data Card */}
      <div className="card">
        {/* TAB 1: Period Members */}
        {activeReportTab === 'executive_summary' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Full Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Baptism</th>
                    <th>Family Role</th>
                    <th>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(periodMembers.length > 0 ? periodMembers : members).map((m) => (
                    <tr key={m.id}>
                      <td><span className="member-id-pill">{m.memberId}</span></td>
                      <td><strong>{m.firstName} {m.lastName}</strong></td>
                      <td>{m.gender}</td>
                      <td>{m.phone || '—'}</td>
                      <td>
                        <span className={`badge ${m.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${m.spiritualInfo?.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-unbaptized'}`}>
                          {m.spiritualInfo?.baptismStatus || 'Unbaptized'}
                        </span>
                      </td>
                      <td>{m.familyRole || 'Individual'}</td>
                      <td>{m.registeredAt || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Period Baptisms */}
        {activeReportTab === 'period_baptisms' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Candidate Name</th>
                    <th>Baptism Date</th>
                    <th>Officiated By</th>
                    <th>Certificate No.</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {(periodBaptisms.length > 0 ? periodBaptisms : members.filter(m => m.spiritualInfo?.baptismStatus === 'Baptized')).map((m) => (
                    <tr key={m.id}>
                      <td><span className="member-id-pill">{m.memberId}</span></td>
                      <td><strong>{m.firstName} {m.lastName}</strong></td>
                      <td>{m.spiritualInfo?.baptismDate || 'Recorded'}</td>
                      <td>{m.spiritualInfo?.officiatedBy || settings.seniorPastor || 'Reverend (Kes)'}</td>
                      <td><span className="badge badge-baptized">{m.spiritualInfo?.certificateNo || 'BAP-CERT'}</span></td>
                      <td>{m.spiritualInfo?.location || 'Sanctuary Baptistery'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Families */}
        {activeReportTab === 'families' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Family Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Total Members</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {families.map((fam) => {
                    const count = getFamilyMembers(fam.id).length;
                    return (
                      <tr key={fam.id}>
                        <td><strong>{fam.familyName}</strong></td>
                        <td>{fam.address}</td>
                        <td>{fam.contactPhone}</td>
                        <td><span className="badge badge-role">{count} members</span></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{fam.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Ministries */}
        {activeReportTab === 'ministries' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ministry Name</th>
                    <th>Category</th>
                    <th>Leader</th>
                    <th>Schedule</th>
                    <th>Enrolled Members</th>
                  </tr>
                </thead>
                <tbody>
                  {ministries.map((min) => {
                    const count = getMinistryMembers(min.id).length;
                    return (
                      <tr key={min.id}>
                        <td><strong>{min.name}</strong></td>
                        <td><span className="badge badge-role">{min.category}</span></td>
                        <td>{min.leaderName}</td>
                        <td>{min.meetingSchedule}</td>
                        <td><span className="badge badge-active">{count} active</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Official Sign-off Box on Print */}
      <div className="print-only" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ borderTop: '1px solid #000', width: '220px', paddingTop: '6px', textAlign: 'center' }}>
          <strong>{settings.seniorPastor || 'Reverend (Kes)'}</strong>
          <div>Senior Reverend (Kes) / Minister</div>
        </div>
        <div style={{ borderTop: '1px solid #000', width: '220px', paddingTop: '6px', textAlign: 'center' }}>
          <strong>Church Administrator</strong>
          <div>Administrative General Secretary</div>
        </div>
      </div>
    </div>
  );
};
