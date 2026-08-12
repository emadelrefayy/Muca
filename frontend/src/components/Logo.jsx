import React from "react";

export default function Logo({ compact = false }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`}>
      <img src="/muca-logo.svg" alt="Muca" />
    </div>
  );
}
