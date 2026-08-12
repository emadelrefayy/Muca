import React from "react";

export default function PlaceholderPage({ title }) {
  return (
    <main className="content">
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p>Module foundation is ready. CRUD and API integration come next.</p>
        </div>
      </div>
      <article className="panel empty-state">
        <div className="empty-icon">M</div>
        <h2>{title}</h2>
        <p>This page is part of the Muca MVP navigation and is ready for its data module.</p>
        <button className="primary-button">Coming next</button>
      </article>
    </main>
  );
}
