"use client";
import Script from "next/script";
import {useState,useEffect,useRef} from "react";
type CaptchaApi = {
  ready: (callback: () => void) => void;
  render: (element: HTMLElement, options: { sitekey: string; action: string; size: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => number;
  reset: (id: number) => void;
};
declare global { interface Window { grecaptcha?: { enterprise: CaptchaApi }; } }


const productionKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const localKey = process.env.NEXT_PUBLIC_RECAPTCHA_LOCAL_SITE_KEY;

export function Captcha({ onToken, onError }: { onToken: (token: string) => void; onError: () => void }) {
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
        sitekey: key, action: "conference_registration", size: window.innerWidth < 380 ? "compact" : "normal",
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
