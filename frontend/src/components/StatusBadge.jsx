import React from "react";

export default function StatusBadge({ status, label }) {
  return <span className={`status-badge ${status}`}>{label}</span>;
}
