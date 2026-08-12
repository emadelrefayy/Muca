import React from "react";
import { Bell, Moon, Sun, ChevronDown, Search, Menu } from "lucide-react";
import Logo from "./Logo";

export default function Header({ lang, setLang, dark, setDark, setOpen, t }) {
  return (
    <header className="header">
      <div className="mobile-brand"><Logo compact /></div>
      <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="search-box">
        <Search size={17} />
        <input placeholder={t.search} />
      </div>

      <div className="header-actions">
        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={19} />
          <span>3</span>
        </button>
        <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="language-button" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
          {lang === "en" ? "العربية" : "EN"} <ChevronDown size={15} />
        </button>
        <div className="profile">
          <div className="avatar">A</div>
          <div className="profile-text">
            <strong>Ahmed Ali</strong>
            <span>{t.labManager}</span>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
