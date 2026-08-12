import React from "react";

export default function StatCard({ icon: Icon, title, value, change, color, note }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={20} /></div>
      <div className="stat-copy">
        <span>{title}</span>
        <strong>{value}</strong>
        <small className={change < 0 ? "negative" : ""}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% <em>{note}</em>
        </small>
      </div>
    </article>
  );
}
