import React from 'react';
import {
  Users,
  Award,
  Layers,
  Home,
  CheckCircle
} from 'lucide-react';

// SVG Donut Chart Component
export const DonutChart = ({
  data = [], // [{ label, value, color }]
  centerValue,
  centerLabel,
  size = 130,
  strokeWidth = 18
}) => {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="donut-wrapper">
      <div className="donut-svg-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Slices */}
          {data.map((item, idx) => {
            const fraction = total > 0 ? item.value / total : 0;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += fraction * circumference;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
              />
            );
          })}
        </svg>

        <div className="donut-center-text">
          <div className="donut-center-val">{centerValue !== undefined ? centerValue : total}</div>
          {centerLabel && <div className="donut-center-lbl">{centerLabel}</div>}
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        {data.map((item, idx) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={idx} className="chart-legend-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="legend-color-dot" style={{ backgroundColor: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{item.value}</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Horizontal Bar Chart Component
export const HorizontalBarChart = ({ items = [], maxVal = 0 }) => {
  const computedMax = maxVal || Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bar-chart-list">
      {items.map((item, idx) => {
        const percent = Math.round((item.value / computedMax) * 100);
        return (
          <div key={idx} className="bar-row">
            <div className="bar-row-info">
              <span className="bar-label">{item.label}</span>
              <span className="bar-val">
                {item.value} {item.unit || 'members'}
              </span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${percent}%`,
                  backgroundColor: item.color || 'var(--primary)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Ready-to-use Report Charts Bundle
export const ReportCharts = ({
  members = [],
  families = [],
  ministries = []
}) => {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const inactiveMembers = totalMembers - activeMembers;

  const baptized = members.filter((m) => m.spiritualInfo?.baptismStatus === 'Baptized').length;
  const unbaptized = totalMembers - baptized;

  const males = members.filter((m) => m.gender === 'Male').length;
  const females = members.filter((m) => m.gender === 'Female').length;

  // Ministry counts
  const ministryBars = ministries.map((min) => {
    const count = members.filter((m) => (m.ministryIds || []).includes(min.id)).length;
    return {
      label: min.name,
      value: count,
      color: 'var(--primary)'
    };
  });

  return (
    <div className="charts-grid no-print">
      {/* Chart 1: Active vs Inactive Retention */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <Users size={18} color="var(--primary)" />
            <span>Congregation Activity</span>
          </div>
          <span className="chart-subtitle">{totalMembers} Total Members</span>
        </div>
        <DonutChart
          data={[
            { label: 'Active', value: activeMembers, color: '#2563eb' },
            { label: 'Inactive', value: inactiveMembers, color: '#94a3b8' }
          ]}
          centerValue={`${Math.round((activeMembers / (totalMembers || 1)) * 100)}%`}
          centerLabel="Active Rate"
        />
      </div>

      {/* Chart 2: Baptism Status Breakdown */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <Award size={18} color="var(--primary)" />
            <span>Water Baptism Status</span>
          </div>
          <span className="chart-subtitle">Milestones</span>
        </div>
        <DonutChart
          data={[
            { label: 'Baptized', value: baptized, color: '#2563eb' },
            { label: 'Unbaptized', value: unbaptized, color: '#94a3b8' }
          ]}
          centerValue={baptized}
          centerLabel="Baptized"
        />
      </div>

      {/* Chart 3: Gender Demographics */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <Users size={18} color="var(--primary)" />
            <span>Gender Distribution</span>
          </div>
          <span className="chart-subtitle">Demographics</span>
        </div>
        <DonutChart
          data={[
            { label: 'Male', value: males, color: '#2563eb' },
            { label: 'Female', value: females, color: '#60a5fa' }
          ]}
          centerValue={totalMembers}
          centerLabel="Total"
        />
      </div>

      {/* Chart 4: Ministries Enrollment Distribution */}
      <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
        <div className="chart-header">
          <div className="chart-title">
            <Layers size={18} color="var(--primary)" />
            <span>Ministry & Fellowship Group Enrollment</span>
          </div>
          <span className="chart-subtitle">Members per Ministry Group</span>
        </div>
        <HorizontalBarChart items={ministryBars} />
      </div>
    </div>
  );
};
