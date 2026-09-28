import React from 'react';

export const StatCard = ({ label, value, subtext, icon: Icon, color = 'blue', onClick }) => {
  return (
    <div
      className={`stat-card ${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-desc">{subtext}</span>}
      </div>
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
