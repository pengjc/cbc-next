"use client";
import { ConferenceHotelRate, hiltonGroupBookingUrl } from "../components/ConferenceHotelRate";
import {Captcha} from "../components/RegistrationCaptcha";
import { useCallback, useEffect, useRef, useState } from "react";
import "./registration.css";
import Link from "next/link";
import {changes} from "../../infra/signup/function/record.mjs";
import {missing} from "../../infra/signup/function/family.mjs";

type Fields = Record<string, string>;
type Child = Fields & { id: string };
type Family = { fields: Fields; children: Child[]; rooms: Fields[] };
const blank: Family = { fields: {}, children: [], rooms: [] };
const steps = ["Attendees", "Children", "Pickup", "Hotel & trips", "Review"];
const meetings = {
  satAM: "Saturday, January 16 · 10:00 AM",
  satPM: "Saturday, January 16 · 7:30 PM",
  sunAM: "Lord’s Day, January 17 · 10:00 AM",
};
const endpoint = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT?.replace(
  /\/subscriptions$/,
  "/registration",
);
async function api(
  path: string,
  method: string,
  body?: unknown,
  token?: string,
) {
  if(location.protocol!=="https:" && !["localhost","127.0.0.1"].includes(location.hostname)) throw Error("Use the HTTPS conference website to register.");
  if (!endpoint) throw Error("Registration is temporarily unavailable.");
  const response = await fetch(endpoint + path, {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok)
    throw Error(
      data.errors?.join(" ") ||
        data.error ||
        (response.status === 401 || response.status === 403
          ? (path === "/redeem" ? "This link may have been replaced or expired. Select Email me a new link to reopen your saved registration." : "Your session has expired. Request a new email link.")
          : "Unable to connect. Please try again."),
    );
  return data;
}
function field(
  label: string,
  value: string | undefined,
  change: (s: string) => void,
  choices?: string[],
  type = "text",
) {
  return (
    <label key={label}>
      {label}
      {choices ? (
        <select value={value || ""} onChange={(e) => change(e.target.value)}>
          <option value="">Choose…</option>
          {choices.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          min={type === "number" ? 0 : undefined}
          value={value || ""}
          onChange={(e) => change(e.target.value)}
        />
      )}
    </label>
  );
}
function serialize(f:Family) {
  return {...f.fields,children:f.children.map(c=>({...c,meetings:(c.meetings||"").split(",").filter(Boolean)})),rooms:f.rooms};
}
export default function Register() {
  const [f, set] = useState(blank),
    [step, go] = useState(0),
    [email, address] = useState(""),
    [token, session] = useState(""),
    [status, mark] = useState("draft"),
    [msg, say] = useState(""),
    [busy, wait] = useState(false);
  const version = useRef(0);
  const writes = useRef(Promise.resolve());
  const editRevision = useRef(0);
  const acknowledged = useRef(serialize(blank));
  const immediate = useRef(false);
  const dirty = useRef(false);
  const [opening,setOpening]=useState(true);
  const [captcha,setCaptcha]=useState("");
  const [captchaVersion,resetCaptcha]=useState(0);
  const verificationError=useCallback(()=>{setCaptcha("");say("Verification could not load. Please retry.");},[]);
  const [invite,setInvite]=useState("");
  const [inviteAttempt,retryInvite]=useState(0);
  const [inviteFailed,setInviteFailed]=useState(false);
  useEffect(()=>{
    let active=true;
    setInvite("");setInviteFailed(false);
    if(token) api("/whatsapp","GET",undefined,token).then(({inviteUrl})=>{
      const url=new URL(inviteUrl);
      if(url.origin!=="https://chat.whatsapp.com") throw Error();
      if(active)setInvite(url.href);
    }).catch(()=>{if(active)setInviteFailed(true)});
    return ()=>{active=false};
  },[token,inviteAttempt]);
  useEffect(() => {
    let live = true;
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash);
    // Defer redemption until the mount survives React strict-mode replay.
    const start = async () => {
      let t = sessionStorage.getItem("family-session") || "";
      let data;
      if (params.has("token")) {
        const linkEmail = params.get("email") || "";
        address(linkEmail);
        if (t) {
          const saved = await api("/2027/me", "GET", undefined, t).catch(() => null);
          if (saved?.email === linkEmail) data = saved;
        }
        if (!data) {
          const result = await api("/redeem", "POST", Object.fromEntries(params));
          t = result.token;
          sessionStorage.setItem("family-session", t);
        }
        history.replaceState(null, "", location.pathname);
      }
      if (!t) return;
      data ??= await api("/2027/me", "GET", undefined, t);
      if (!live) return;
      session(t);
      address(data.email);
      version.current = data.version;
      mark(data.status);
      acknowledged.current=data.family || serialize(blank);
      if (data.family) {
        const { children, rooms, ...fields } = data.family;
        set({
          fields,
          rooms,
          children: children.map((c: Child & { meetings: string[] }) => ({
            ...c,
            meetings: c.meetings.join(","),
          })),
        });
      }
    };
    const timer = setTimeout(() => {
      wait(true);
      start()
        .catch((e) => {
          if (live) {
            sessionStorage.removeItem("family-session");
            history.replaceState(null, "", location.pathname);
            say(e.message);
          }
        })
        .finally(() => {
          if (live) {wait(false);setOpening(false);}
        });
    }, 0);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, []);
  function edit(update: (current: Family) => Family, saveImmediately = false) {
    if (saveImmediately) immediate.current = true;
    editRevision.current++;
    dirty.current = true;
    say("Editing…");
    set(update);
  }
  const change = (k: string, v: string) =>
    edit(current => ({ ...current, fields: { ...current.fields, [k]: v } }));
  const input = (k: string, label: string, options?: string[], type?: string) =>
    field(label, f.fields[k], (v) => change(k, v), options, type);
  function editChildren(update: (children: Child[]) => Child[], saveImmediately = false) {
    edit(current => ({...current, children:update(current.children)}), saveImmediately);
  }
  function item(group: "rooms" | "children", i: number, k: string, v: string) {
    if (group === "children") {
      editChildren(children => children.map((c,j)=> j===i ? {...c,[k]:v} : c));
    } else {
      edit(current=>({...current, rooms:current.rooms.map((r,j)=>j===i?{...r,[k]:v}:r)}));
    }
  }
  async function action(fn: () => Promise<void>) {
    wait(true);
    if (!token) say("");
    try {
      await fn();
    } catch (e) {
      say(e instanceof Error ? e.message : "Please try again.");
    } finally {
      wait(false);
    }
  }
  const persist = useCallback((snapshot:Family) => {
    const revision=editRevision.current;
    const write=writes.current.then(async()=>{
      const next=serialize(snapshot);
      const patch=changes(acknowledged.current,next);
      let receipt=true;
      if(patch.length){
        say("Saving…");
        const result=await api("/2027/me","PATCH",{version:version.current,changes:patch},token);
        acknowledged.current=next;
        version.current=result.version;
        mark(result.status);
        receipt=result.receipt!==false;
      }
      if(revision===editRevision.current){
        dirty.current=false;
        say(receipt?"Changes saved.":"Changes saved. The confirmation email could not be sent.");
      }
    });
    writes.current=write.catch(()=>{});
    return write;
  },[token]);
  const flush=useCallback((snapshot:Family)=>persist(snapshot).catch(e=>say("Changes not saved. "+e.message)),[persist]);
  useEffect(()=>{
    if(immediate.current){immediate.current=false;void flush(f);}
  },[f,flush]);

  useEffect(()=>{
    function warn(event:BeforeUnloadEvent){if(dirty.current){event.preventDefault();event.returnValue="";}}
    window.addEventListener("beforeunload",warn);
    return ()=>window.removeEventListener("beforeunload",warn);
  },[]);

  const payload=serialize(f);
  const remaining = missing(payload);
  async function save(next:number){
    if(dirty.current)await persist(f);
    go(next);
  }
  return (
    <main className="family-page">
      <header>
        <Link href="/" onNavigate={event => {
          if (dirty.current) {
            event.preventDefault();
            void action(async () => { await persist(f); location.assign("/"); });
          }
        }}>Carolinas Blending Conference</Link>
        <p>Myrtle Beach · January 15–17, 2027</p>
        <h1>Registration</h1>
      </header>
      <div role="status" aria-live="polite" className={opening || busy || msg ? "registration-notice" : undefined}>
        {opening ? "Opening your registration… Please keep this page open." : busy && !token ? "Sending your registration email…" : msg}
      </div>
      {opening ? null : !token ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            action(async () => {
              try {await api("/link", "POST", { email, captchaToken:captcha });} finally {setCaptcha("");resetCaptcha(v=>v+1);}
              say("Check your inbox for your registration link.");
            });
          }}
        >
          <p>
            Confirm your email to start or edit your registration and receive conference updates.
          </p>
          {field("Email address", email, address, undefined, "email")}
          <Captcha key={captchaVersion} onToken={setCaptcha} onError={verificationError}/>
          <button disabled={busy || !email || !captcha}>Email me a new link</button>
        </form>
      ) : (
        <fieldset disabled={busy} onBlur={e=>{if(dirty.current && e.target.matches("input,select,textarea"))void flush(f);}}>
          <legend>
            {email} · {status === "complete" ? "Complete" : "Incomplete"}
          </legend>
          {dirty.current && msg && !["Editing…","Saving…"].includes(msg) && <button onClick={()=>void flush(f)}>Retry save</button>}
          {remaining.length > 0 && <aside className="registration-remaining" aria-labelledby="remaining-title">
            <strong id="remaining-title">Still needed to complete registration</strong>
            <ul>{remaining.map(message => <li key={message}>{message}</li>)}</ul>
          </aside>}
          <nav>
            {steps.map((s, i) => (
              <button
                key={s}
                aria-current={i === step ? "step" : undefined}
                onClick={() => action(() => save(i))}
              >
                {s}
              </button>
            ))}
          </nav>
          <h2>{steps[step]}</h2>
          {step === 0 && (
            <>
              {input("name", "Primary contact name")}
              {input("locality", "Locality", [
                "Charlotte",
                "Chapel Hill",
                "Columbia",
                "Raleigh",
                "Simpsonville",
                "Other",
              ])}
              {f.fields.locality === "Other" && input("other", "Your locality")}
              <p>
                Count each attendee once. Include K–6 children even if they
                won’t use childcare.
              </p>
              {[
                ["adults", "Adults"],
                ["youth", "Middle and high school students"],
                ["kids", "K–6 children"],
              ].map(([k, l]) => input(k, l, undefined, "number"))}
            </>
          )}
          {step === 1 && (
            <>
              <p>Add a card for each child attending a children’s meeting.</p>
              {f.children.map((c, i) => (
                <details key={c.id} open>
                  <summary>
                    {[c.first, c.last].filter(Boolean).join(" ") ||
                      "Child " + (i + 1)}
                  </summary>
                  {[
                    ["first", "First name"],
                    ["last", "Last name"],
                    ["gender", "Boy or girl"],
                    ["age", "Age"],
                    ["grade", "Grade"],
                    [
                      "notes",
                      "Allergies, medical or special needs and comments (optional)",
                    ],
                  ].map(([k, l]) =>
                    field(
                      l,
                      c[k],
                      (v) => item("children", i, k, v),
                      k === "gender"
                        ? ["Boy", "Girl"]
                        : k === "grade"
                          ? ["K", "1", "2", "3", "4", "5", "6"]
                          : k === "age"
                            ? ["5", "6", "7", "8", "9", "10", "11", "12"]
                            : undefined,
                    ),
                  )}
                  {Object.entries(meetings).map(([k, l]) => (
                    <label key={k}>
                      <input
                        type="checkbox"
                        checked={(c.meetings || "").split(",").includes(k)}
                        onChange={(e) =>
                          item(
                            "children",
                            i,
                            "meetings",
                            e.target.checked
                              ? [c.meetings, k].filter(Boolean).join(",")
                              : c.meetings
                                  .split(",")
                                  .filter((x) => x !== k)
                                  .join(","),
                          )
                        }
                      />
                      {l}
                    </label>
                  ))}
                  <button
                    onClick={() =>
                      editChildren(children => children.filter(x => x.id !== c.id), true)
                    }
                  >
                    Remove child
                  </button>
                </details>
              ))}
              <button
                onClick={() =>
                  editChildren(children => [...children, {id:crypto.randomUUID()}], true)
                }
              >
                Add a child
              </button>
            </>
          )}
          {step === 2 &&
            (f.children.length ? (
              <>
                <p>Primary guardian · {f.fields.name}</p>
                {input("mobile", "Guardian mobile number", undefined, "tel")}
                {input("guardian", "Second guardian (optional)")}
                {input(
                  "guardianPhone",
                  "Second guardian phone",
                  undefined,
                  "tel",
                )}
                {input(
                  "pickup",
                  "Additional authorized pickup person (optional)",
                )}
                {input("pickupPhone", "Pickup person phone", undefined, "tel")}
                {f.children.map((c, i) => (
                  <div key={c.id}>
                    {field(
                      "Pickup instructions or exceptions for " + c.first,
                      c.pickupOverride,
                      (v) => item("children", i, "pickupOverride", v),
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p>No children enrolled in childcare.</p>
            ))}
          {step === 3 && (
            <>
              <p>
                Both registration and childcare require a reservation at The
                Ellie covering January 15 or 16. You can save and come back
                after booking.
              </p>
              <ConferenceHotelRate />
              <button
                onClick={() =>
                  action(async () => {
                    await save(step);
                    location.assign(hiltonGroupBookingUrl);
                  })
                }
              >
                Book at Hilton ↗
              </button>
              <p>We use your confirmation number to match your reservation with Hilton’s records. This helps us verify that the conference met its minimum room commitment.</p>
              {f.rooms.map((r, i) => (
                <section key={r.id}>
                  <h3>Room {i + 1}</h3>
                  {[
                    ["guest", "Booking name"],
                    ["number", "Confirmation number"],
                    ["arrival", "Check-in"],
                    ["departure", "Checkout"],
                  ].map(([k, l]) =>
                    field(
                      l,
                      r[k],
                      (v) => item("rooms", i, k, v),
                      undefined,
                      ["arrival", "departure"].includes(k) ? "date" : "text",
                    ),
                  )}
                  <button
                    onClick={() =>
                      edit(current => ({ ...current, rooms: current.rooms.filter(x => x.id !== r.id) }), true)
                    }
                  >
                    Remove room
                  </button>
                </section>
              ))}
              <button
                onClick={() =>
                  edit(current => ({
                    ...current,
                    rooms: [...current.rooms, { id: crypto.randomUUID() }],
                  }), true)
                }
              >
                Add a reservation
              </button>
              <h3>Monday gospel trips · January 18</h3>
              <fieldset className="trip-choice"><legend>Which gospel trip will you attend?</legend>
                {["Wilmington","Charleston","Not attending"].map(city=><label key={city}>
                  <input type="radio" name="trip-city" checked={(f.fields.tripCity || "Not attending")===city}
                    onChange={()=>edit(current=>({...current,fields:{...current.fields,tripCity:city==="Not attending"?"":city,
                      tripAdults:city==="Not attending"?"":current.fields.tripAdults || "0",
                      tripChildren:city==="Not attending"?"":current.fields.tripChildren || "0"}}))}/> {city}
                </label>)}
              </fieldset>
              {f.fields.tripCity && <>
                {input("tripAdults","Adults attending the trip",undefined,"number")}
                {input("tripChildren","Children attending the trip (including youth)",undefined,"number")}
              </>}
            </>
          )}
          {step === 4 && (
            <>
              <p>
                {f.fields.name} ·{" "}
                {f.fields.locality === "Other"
                  ? f.fields.other
                  : f.fields.locality}
              </p>
              <p>
                Adults {f.fields.adults || 0} · Youth {f.fields.youth || 0} ·
                Children {f.fields.kids || 0}
              </p>
              {f.children.map((c) => (
                <p key={c.id}>
                  {c.first} {c.last} ·{" "}
                  {(c.meetings || "")
                    .split(",")
                    .map((k) => meetings[k as keyof typeof meetings])
                    .join(", ")}
                </p>
              ))}
              {f.rooms.map((r) => (
                <p key={r.id}>
                  {r.guest} · {r.number} · {r.arrival} – {r.departure}
                </p>
              ))}
              {f.fields.tripCity && <p>{f.fields.tripCity} gospel trip · {f.fields.tripAdults || 0} adults · {f.fields.tripChildren || 0} children</p>}

            </>
          )}
          <footer>
            {step>0 && <button onClick={()=>action(()=>save(step-1))}>Back</button>}
            {step<4 && <button onClick={()=>action(()=>save(step+1))}>{step===3?"Review":"Next"}</button>}

          <button
            onClick={() => action(async () => {
              if(dirty.current) await save(step);
              sessionStorage.removeItem("family-session");
              session("");
              set(blank);
              go(0);
              say("");
            })}
          >
            Sign out
          </button>
          <div className="registration-community">
          {invite ? <a className="family-whatsapp" href={invite} target="_blank" rel="noopener noreferrer">Join the conference WhatsApp ↗</a> : inviteFailed ? <button type="button" onClick={()=>retryInvite(v=>v+1)}>Retry loading WhatsApp invitation</button> : <p>Loading WhatsApp invitation…</p>}
          </div>
          </footer>
        </fieldset>
      )}

    </main>
  );
}
