"use client";
import Link from "next/link";
import {useEffect,useState,type ReactNode} from "react";

function RegisterLink({light=false}:{light?:boolean}) {
  return <Link className={`button ${light ? "button-light" : "button-dark"}`} href="/register">Register or manage registration</Link>;
}
export function RegistrationPrompt({welcome=false,light=false}:{welcome?:boolean;light?:boolean}) {
  return <div className={`updates-prompt${welcome ? " updates-prompt-welcome" : ""}${light ? " updates-prompt-light" : ""}`}><RegisterLink light={light}/></div>;
}
export function RegistrationBar({children}:{children:ReactNode}) {
  const [floating, setFloating] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [nearPrompt, setNearPrompt] = useState(false);
  useEffect(() => {
    let sessionDismissed = false;
    try { sessionDismissed = sessionStorage.getItem("cbc-updates-dismissed") === "1"; } catch {}
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setFloating(!sessionDismissed && !entry.isIntersecting && entry.boundingClientRect.bottom <= 0));
    observer.observe(hero);
    const visiblePrompts = new Set<Element>();
    const prompts = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visiblePrompts.add(entry.target);
        else visiblePrompts.delete(entry.target);
      }
      setNearPrompt(visiblePrompts.size > 0);
    });
    document.querySelectorAll(".conference-site main .button, .site-footer .button").forEach(element => prompts.observe(element));
    const viewport = window.visualViewport;
    const resize = () => setKeyboard(Boolean(viewport && window.innerWidth < 800 && window.innerHeight - viewport.height > 150));
    viewport?.addEventListener("resize", resize);
    return () => { observer.disconnect(); prompts.disconnect(); viewport?.removeEventListener("resize", resize); };
  }, []);

  const barVisible = floating && !dismissed && !keyboard && !nearPrompt;
  useEffect(() => {
    document.documentElement.classList.toggle("updates-bar-visible", barVisible);
    return () => document.documentElement.classList.remove("updates-bar-visible");
  }, [barVisible]);

  return <>{children}{barVisible && <aside className="updates-floating" aria-label="Registration">
    <RegisterLink/>
    <button className="updates-dismiss" type="button" aria-label="Dismiss registration bar" onClick={() => {setDismissed(true);try {sessionStorage.setItem("cbc-updates-dismissed","1")} catch {}}}>×</button>
  </aside>}</>;
}
