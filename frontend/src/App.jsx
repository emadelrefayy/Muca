import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import PlaceholderPage from "./components/PlaceholderPage";
import { translations } from "./i18n/translations";

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("muca-lang") || "en");
  const [dark, setDark] = useState(() => localStorage.getItem("muca-theme") !== "light");
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("muca-lang", lang);
    localStorage.setItem("muca-theme", dark ? "dark" : "light");
  }, [lang, dark]);

  return (
    <div className={`app ${dark ? "theme-dark" : "theme-light"}`}>
      <Sidebar t={t} active={active} setActive={setActive} open={open} setOpen={setOpen} />
      <div className="main-area">
        <Header lang={lang} setLang={setLang} dark={dark} setDark={setDark} setOpen={setOpen} t={t} />
        {active === "dashboard"
          ? <Dashboard t={t} />
          : <PlaceholderPage title={t[active]} />}
      </div>
    </div>
  );
}
