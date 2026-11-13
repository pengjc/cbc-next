"use client";

import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

type Choice = "email" | "whatsapp";
type CaptchaApi = {
  ready: (callback: () => void) => void;
  render: (element: HTMLElement, options: { sitekey: string; action: string; size: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => number;
  reset: (id: number) => void;
};
declare global { interface Window { grecaptcha?: { enterprise: CaptchaApi }; } }

const endpoint = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT;
const productionKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const localKey = process.env.NEXT_PUBLIC_RECAPTCHA_LOCAL_SITE_KEY;
const UpdatesContext = createContext<(choice: Choice, trigger: HTMLElement) => void>(() => {});

function Captcha({ onToken, onError }: { onToken: (token: string) => void; onError: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!ready || !container.current || widget.current !== null) return;
    const api = window.grecaptcha?.enterprise;
    const key = location.hostname === "localhost" ? localKey : productionKey;
    if (!api || !key) return;
    const element = container.current;
    let cancelled = false;
    api.ready(() => {
      if (cancelled) return;
      widget.current = api.render(element, {
        sitekey: key, action: "conference_updates", size: window.innerWidth < 380 ? "compact" : "normal",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": onError,
      });
    });
    return () => {
      cancelled = true;
      if (widget.current !== null) api.reset(widget.current);
      widget.current = null;
      element.replaceChildren();
    };
  }, [ready, onToken, onError]);
  useEffect(() => {
    if (ready || failed) return;
    const timer = window.setTimeout(() => { setFailed(true); onError(); }, 12000);
    return () => window.clearTimeout(timer);
  }, [ready, failed, onError, attempt]);
  return (
    <div className="updates-captcha">
      <Script key={attempt} src={`https://www.google.com/recaptcha/enterprise.js?render=explicit${attempt ? `&retry=${attempt}` : ""}`}
        onReady={() => { setReady(true); setFailed(false); }}
        onError={() => { setFailed(true); onError(); }} />
      <div ref={container} />
      {!ready && !failed && <p role="status">Loading verification…</p>}
      {failed && <button type="button" className="updates-text-button" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>Retry loading verification</button>}
    </div>
  );
}

export function UpdateActions({ tone = "default" }: { tone?: "default" | "light" }) {
  const open = useContext(UpdatesContext);
  return <div className={`update-actions update-actions-${tone}`}>
    <button type="button" data-updates-choice="email" className={`button ${tone === "light" ? "button-light" : "button-dark"}`} onClick={event => open("email", event.currentTarget)}>Email updates <span aria-hidden="true">↗</span></button>
    <button type="button" data-updates-choice="whatsapp" className="button button-whatsapp" onClick={event => open("whatsapp", event.currentTarget)}>Join WhatsApp <span aria-hidden="true">↗</span></button>
  </div>;
}

export function UpdatesPrompt({ welcome = false, light = false }: { welcome?: boolean; light?: boolean }) {
  return <div className={`updates-prompt${welcome ? " updates-prompt-welcome" : ""}${light ? " updates-prompt-light" : ""}`}>
    <div><h3>{welcome ? "Get conference updates" : "Get the latest conference details"}</h3><p>Stay informed by email, WhatsApp, or both.</p></div>
    <UpdateActions tone={light ? "light" : "default"} />
  </div>;
}

export function UpdatesProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState(true);
  const [joinWhatsapp, setJoinWhatsapp] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ emailSubscribed: boolean; inviteUrl?: string } | null>(null);
  const [floating, setFloating] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [nearPrompt, setNearPrompt] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const triggerChoice = useRef<Choice>("email");
  const restoreFocus = useRef(false);
  const request = useRef<AbortController | null>(null);

  const show = useCallback((choice: Choice, element: HTMLElement) => {
    trigger.current = element;
    triggerChoice.current = choice;
    setSubscribeEmail(choice === "email");
    setJoinWhatsapp(choice === "whatsapp");
    setResult(null); setMessage(""); setToken(""); setOpen(true);
  }, []);
  const close = useCallback(() => {
    request.current?.abort(); request.current = null;
    restoreFocus.current = true;
    setBusy(false); setOpen(false); setToken("");
  }, []);
  const verificationError = useCallback(() => {
    setToken(""); setMessage("Verification couldn’t load. Please retry or check your connection.");
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
    if (!open && element?.open) element.close();
    if (!open) {
      if (!restoreFocus.current) return;
      restoreFocus.current = false;
      const frame = requestAnimationFrame(() => {
        const target = trigger.current?.isConnected ? trigger.current
          : document.querySelector<HTMLElement>(`.updates-floating [data-updates-choice="${triggerChoice.current}"]`);
        target?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

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
    document.querySelectorAll(".updates-prompt").forEach(element => prompts.observe(element));
    const viewport = window.visualViewport;
    const resize = () => setKeyboard(Boolean(viewport && window.innerWidth < 800 && window.innerHeight - viewport.height > 150));
    viewport?.addEventListener("resize", resize);
    return () => { observer.disconnect(); prompts.disconnect(); viewport?.removeEventListener("resize", resize); };
  }, []);

  const barVisible = floating && !dismissed && !open && !keyboard && !nearPrompt;
  useEffect(() => {
    document.documentElement.classList.toggle("updates-bar-visible", barVisible);
    return () => document.documentElement.classList.remove("updates-bar-visible");
  }, [barVisible]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint || busy || !token || (!subscribeEmail && !joinWhatsapp)) return;
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setBusy(true); setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ subscribeEmail, joinWhatsapp, ...(subscribeEmail ? { email: email.trim().toLowerCase() } : {}), captchaToken: token }),
      });
      const data = await response.json();
      if (request.current !== controller) return;
      if (!response.ok) {
        setMessage(data.code === "invalid_email" ? "Please enter a valid email address."
          : response.status === 403 ? "Please complete verification again and retry."
          : "We couldn’t complete your request. Please verify again and retry shortly.");
        return;
      }
      // Only accept an invite from the trusted API with the expected destination.
      const invite = data.inviteUrl ? new URL(data.inviteUrl) : null;
      if (invite && (invite.protocol !== "https:" || invite.hostname !== "chat.whatsapp.com" || invite.username || invite.password)) throw new Error("Invalid response");
      setResult({ emailSubscribed: data.emailSubscribed === true, ...(invite ? { inviteUrl: invite.href } : {}) });
    } catch {
      if (request.current === controller) setMessage("We couldn’t connect. Please verify again and retry.");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null; setBusy(false); setToken(""); setCaptchaVersion(value => value + 1);
      }
    }
  }

  return <UpdatesContext.Provider value={show}>
    {children}
    {barVisible && <aside className="updates-floating" aria-label="Conference updates">
      <span>Stay informed</span><UpdateActions />
      <button className="updates-dismiss" type="button" aria-label="Dismiss updates bar" onClick={() => { setDismissed(true); try { sessionStorage.setItem("cbc-updates-dismissed", "1"); } catch {} }}>×</button>
    </aside>}
    <dialog ref={dialog} className="updates-dialog" aria-labelledby="updates-heading" aria-describedby="updates-description"
      onCancel={event => { event.preventDefault(); close(); }} onClose={() => { if (open) close(); }}
      onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <button type="button" className="updates-close" aria-label="Close conference updates" onClick={close}>×</button>
      <p className="eyebrow">STAY IN TOUCH</p><h2 id="updates-heading">Get conference updates</h2>
      <p id="updates-description">Choose email, WhatsApp, or both for the latest conference details.</p>
      {open && (result ? <div className="updates-result" role="status">
        <h3>Thank you!</h3>
        {result.emailSubscribed && <p>We’ll email you when more information about the 2027 conference is available.</p>}
        {result.inviteUrl && <><p>Your WhatsApp invitation is ready.</p><a className="button button-whatsapp" href={result.inviteUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp <span aria-hidden="true">↗</span></a></>}
        <button type="button" className="updates-text-button" onClick={() => { setResult(null); setSubscribeEmail(false); setJoinWhatsapp(false); }}>Choose another option</button>
      </div> : !endpoint || !productionKey || (location.hostname === "localhost" && !localKey) ? <p role="status">Signup is temporarily unavailable. Please check back soon.</p> :
        <form method="post" onSubmit={submit} aria-busy={busy}>
          <fieldset disabled={busy}>
            <legend className="sr-only">How would you like to receive updates?</legend>
            <label className="updates-choice"><input type="checkbox" checked={subscribeEmail} onChange={event => setSubscribeEmail(event.target.checked)} /><span><strong>Email updates</strong><span>Registration, hotel reservations, and conference news.</span></span></label>
            {subscribeEmail && <div className="updates-email"><label htmlFor="updates-email">Email address</label><input id="updates-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></div>}
            <label className="updates-choice"><input type="checkbox" checked={joinWhatsapp} onChange={event => setJoinWhatsapp(event.target.checked)} /><span><strong>Join WhatsApp</strong><span>Get the invitation to the conference community.</span></span></label>
          </fieldset>
          <p className="updates-verification-note">One verification covers both choices.</p>
          <Captcha key={captchaVersion} onToken={setToken} onError={verificationError} />
          <p className="updates-feedback" role="status">{message}</p>
          <button type="submit" className="button button-dark updates-continue" disabled={busy || !token || (!subscribeEmail && !joinWhatsapp)}>{busy ? "Please wait…" : "Continue"}</button>
          <p className="updates-privacy">Protected by reCAPTCHA. Google’s <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.</p>
        </form>)}
    </dialog>
  </UpdatesContext.Provider>;
}
