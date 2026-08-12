import React from "react";
import {
  LayoutDashboard, UsersRound, FlaskConical, ClipboardList,
  FileCheck2, CreditCard, UserCog, Settings, CircleHelp, Menu
} from "lucide-react";
import Logo from "./Logo";

const iconMap = {
  dashboard: LayoutDashboard,
  clients: UsersRound,
  services: FlaskConical,
  orders: ClipboardList,
  results: FileCheck2,
  payments: CreditCard,
  staff: UserCog,
  settings: Settings,
  help: CircleHelp,
};

export default function Sidebar({ t, active, setActive, open, setOpen }) {
  const mainItems = ["dashboard", "clients", "services", "orders", "results", "payments", "staff", "settings"];
  return (
    <>
      <div className={`sidebar-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close menu">
            <Menu size={19} />
          </button>
        </div>

        <nav className="nav-list">
          {mainItems.map((key) => {
            const Icon = iconMap[key];
            return (
              <button
                key={key}
                className={`nav-item ${active === key ? "active" : ""}`}
                onClick={() => { setActive(key); setOpen(false); }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{t[key]}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <CircleHelp size={19} strokeWidth={1.8} />
            <span>{t.help}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
