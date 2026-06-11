(()=>{"use strict";
const storageKey="dce2b-theme";
const root=document.documentElement;
const safeGet=()=>{try{return localStorage.getItem(storageKey);}catch{return null;}};
const safeSet=v=>{try{localStorage.setItem(storageKey,v);}catch{}};
const prefers=()=>window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
const setTheme=(theme,persist)=>{
  root.dataset.theme=theme;
  if(persist) safeSet(theme);
  syncButtons();
};
const syncButtons=()=>{
  const current=root.dataset.theme||"dark";
  const next=current==="light"?"dark":"light";
  const label=next==="light"?"☀️ Light":"🌙 Dark";
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
    btn.textContent=label;
    btn.setAttribute("aria-label",`Switch to ${next} mode`);
    btn.setAttribute("aria-pressed",current==="dark"?"true":"false");
  });
};
const saved=safeGet();
root.dataset.theme=saved||prefers();
const bind=()=>{
  syncButtons();
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.preventDefault();
      const current=root.dataset.theme||"dark";
      setTheme(current==="light"?"dark":"light",true);
    });
  });
};
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind);
else bind();
})();
