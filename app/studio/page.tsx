"use client";

import { useEffect, useRef, useState } from "react";
import "./studio.css";

const offerOptions = [
  { id: "credits", icon: "✦", name: "AI credits", value: "1,000", unit: "AI CREDITS", note: "Usage added to a workspace" },
  { id: "trial", icon: "◌", name: "Free trial", value: "14", unit: "DAYS ACCESS", note: "Time to experience the product" },
  { id: "beta", icon: "◇", name: "Private beta", value: "EARLY", unit: "BETA ACCESS", note: "A controlled feature release" },
  { id: "feature", icon: "⌁", name: "Feature unlock", value: "PRO", unit: "FEATURE UNLOCK", note: "Access to a premium capability" },
  { id: "demo", icon: "▷", name: "Product story", value: "02:18", unit: "PRIVATE DEMO", note: "A focused product walkthrough" },
];
const steps = ["Offer", "Recipient", "Branding", "Message", "Delivery"];

function StudioMark() {
  return <span className="studio-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export default function StudioMockup() {
  const [step, setStep] = useState(0);
  const [offerId, setOfferId] = useState("credits");
  const [recipient, setRecipient] = useState("Morrowvale Labs");
  const [sender, setSender] = useState("Kovaelin AI");
  const [value, setValue] = useState("1,000");
  const [expires, setExpires] = useState("14 days");
  const [message, setMessage] = useState("We created something useful for your team.");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [singleUse, setSingleUse] = useState(true);
  const [locked, setLocked] = useState(true);
  const [published, setPublished] = useState(false);
  const [notice, setNotice] = useState("Ready to customize");
  const [email, setEmail] = useState("maya@morrowvale.example");
  const [linkText, setLinkText] = useState("Open your private access");
  const [finish, setFinish] = useState("silver");
  const [accent, setAccent] = useState("blue");
  const [privateLink, setPrivateLink] = useState("");
  const [preview, setPreview] = useState(false);
  const [journey, setJourney] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const [activated, setActivated] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const offer = offerOptions.find((item) => item.id === offerId) || offerOptions[0];
  const expiryLabel = expires === "Never" ? "No expiration" : `Expires in ${expires}`;
  const summary = offerId === "credits" ? `${value} AI credits` : offerId === "trial" ? `${value} days of access` : offerId === "beta" ? "Private beta access" : offerId === "feature" ? `${value} feature access` : "A private product walkthrough";

  useEffect(() => {
    function loadPreview() {
    if (!location.hash.startsWith("#preview=")) return;
    try {
      const data = JSON.parse(decodeURIComponent(location.hash.slice(9)));
      const field = (name: string, max: number) => typeof data[name] === "string" ? data[name].slice(0, max) : "";
      if (!offerOptions.some((item) => item.id === data.offerId)) throw new Error("Invalid offer");
      setOfferId(data.offerId); setRecipient(field("recipient", 48)); setSender(field("sender", 36));
      setValue(field("value", 10)); setMessage(field("message", 300)); setLinkText(field("linkText", 42));
      setExpires(["7 days", "14 days", "30 days", "Never"].includes(data.expires) ? data.expires : "14 days");
      setFinish(data.finish === "graphite" ? "graphite" : "silver"); setAccent(data.accent === "cyan" ? "cyan" : "blue");
      setSingleUse(data.singleUse !== false); setLocked(data.locked !== false);
      setJourney(0); setCode(""); setError(""); setPreview(true); setOpened(true);
    } catch { setNotice("This preview link is invalid. Create a new one below."); }
    }
    loadPreview();
    window.addEventListener("hashchange", loadPreview);
    return () => window.removeEventListener("hashchange", loadPreview);
  }, []);

  useEffect(() => {
    setPublished(false); setPrivateLink(""); setActivated(false);
  }, [offerId, recipient, sender, value, expires, message, email, linkText, finish, accent, singleUse, locked]);

  useEffect(() => {
    if (preview) dialog.current?.showModal();
    else dialog.current?.close();
  }, [preview]);

  function chooseOffer(id: string) {
    const next = offerOptions.find((item) => item.id === id)!;
    setOfferId(id); setValue(next.value); setNotice("Offer updated");
  }
  async function copy(valueToCopy: string, label: string) {
    try { await navigator.clipboard.writeText(valueToCopy); setNotice(`${label} copied`); }
    catch { setNotice(`Select and copy the ${label.toLowerCase()}`); }
  }
  function publish() {
    if (!recipient.trim() || !sender.trim() || !value.trim() || !linkText.trim()) { setNotice("Add a product name, recipient, value, and link text first."); return; }
    if (locked && !/^\S+@\S+\.\S+$/.test(email)) { setStep(1); setNotice("Enter a valid recipient email."); return; }
    const data = { offerId, recipient, sender, value, expires, message, linkText, finish, accent, singleUse, locked };
    setPrivateLink(`${location.origin}/studio#preview=${encodeURIComponent(JSON.stringify(data))}`);
    setPublished(true); setNotice("Preview link created. Ready to copy.");
  }
  function openPreview() { setJourney(0); setCode(""); setError(""); setPreview(true); setOpened(true); }
  async function copyAccessCode() {
    try { await navigator.clipboard.writeText("DEMO-ACCESS-1000"); setError("Code copied"); }
    catch { setError("Select the code and copy it manually."); }
  }
  function activatePreview() {
    if (code.trim().toUpperCase() !== "DEMO-ACCESS-1000") { setError("Enter the code from your card."); return; }
    setActivated(true); setJourney(3); setError("");
  }

  return (
    <main className={`studio-page finish-${finish} accent-${accent}`}>
      <div className="studio-grid" aria-hidden="true" />
      <header className="studio-topbar">
        <a className="studio-brand" href="/"><span className="studio-brand-word">REWARDLAB</span><i /><span>ACCESS STUDIO</span><small>V2</small></a>
        <div className="studio-top-actions">
          <a className="studio-preview-button" href="/#experience">Customer journey <span>↗</span></a>
          <button type="button" className="studio-publish-button" onClick={publish}>{published ? "Refresh preview link" : "Create preview link"} <span>↗</span></button>
        </div>
      </header>

      <section className="studio-intro">
        <div><p className="studio-eyebrow">YOUR PRODUCT. PERSONALLY DELIVERED.</p><h1>Shape your <em>first impression.</em></h1><p>Choose your offer. Make it personal. Preview every moment.</p></div>
        <span className="prototype-badge">Interactive concept</span>
      </section>
      <p className="studio-notice" role="status" aria-live="polite">{notice}</p>

      <section className="studio-workspace" aria-label="Interactive private access creator">
        <aside className="studio-config">
          <div className="studio-panel-head"><span>CONFIGURATION</span><small>{String(step + 1).padStart(2, "0")} / 05</small></div>
          <div className="studio-step-list" aria-label="Studio steps">
            {steps.map((label, index) => <button key={label} type="button" aria-pressed={step === index} className={step === index ? "active" : ""} onClick={() => setStep(index)}><b>{String(index + 1).padStart(2, "0")}</b><span>{label}</span></button>)}
          </div>

          {step === 0 && <div key="offer" className="studio-form-section">
            <label>WHAT ARE YOU SENDING?</label>
            <div className="studio-offers compact-offers">
              {offerOptions.map((item) => <button type="button" key={item.id} aria-pressed={offerId === item.id} className={offerId === item.id ? "selected" : ""} onClick={() => chooseOffer(item.id)}><span>{item.icon}</span><div><strong>{item.name}</strong><small>{item.note}</small></div><i>{offerId === item.id ? "✓" : ""}</i></button>)}
            </div>
            <div className="studio-field-group"><label htmlFor="offer-value">DISPLAY VALUE</label><input id="offer-value" className="studio-input" maxLength={10} value={value} onChange={(event) => setValue(event.target.value)} /></div>
            <div className="studio-field-group"><label htmlFor="offer-expiry">EXPIRES</label><select id="offer-expiry" className="studio-input" value={expires} onChange={(event) => setExpires(event.target.value)}><option>7 days</option><option>14 days</option><option>30 days</option><option>Never</option></select></div>
          </div>}
          {step === 1 && <div key="recipient" className="studio-form-section studio-fields">
            <label htmlFor="recipient-company">RECIPIENT COMPANY</label><input id="recipient-company" className="studio-input" maxLength={48} value={recipient} onChange={(event) => setRecipient(event.target.value)} />
            <label htmlFor="recipient-email">WORK EMAIL</label><input id="recipient-email" type="email" className="studio-input" value={email} onChange={(event) => setEmail(event.target.value)} />
            <p className="studio-helper">Personalize the card, then create a new preview link. The email is not included in the link.</p>
          </div>}
          {step === 2 && <div key="branding" className="studio-form-section studio-fields">
            <label htmlFor="sender-company">PRODUCT NAME</label><input id="sender-company" className="studio-input" maxLength={36} value={sender} onChange={(event) => setSender(event.target.value)} />
            <label>CARD FINISH</label><div className="finish-picker">{["silver", "graphite"].map((item) => <button key={item} className={finish === item ? "active" : ""} aria-pressed={finish === item} type="button" onClick={() => setFinish(item)}><i />{item === "silver" ? "Sculpted silver" : "Graphite"}</button>)}</div>
            <label>CARD EDGE ACCENT</label><div className="accent-picker"><button className={accent === "blue" ? "active" : ""} aria-pressed={accent === "blue"} aria-label="Electric blue" type="button" onClick={() => setAccent("blue")} /><button className={accent === "cyan" ? "active" : ""} aria-pressed={accent === "cyan"} aria-label="Pale cyan" type="button" onClick={() => setAccent("cyan")} /></div>
          </div>}
          {step === 3 && <div key="message" className="studio-form-section studio-fields">
            <label htmlFor="sender-message">CUSTOMER MESSAGE</label><textarea id="sender-message" className="studio-input studio-textarea" maxLength={300} value={message} onChange={(event) => setMessage(event.target.value)} />
            <label htmlFor="link-label">LINK TEXT</label><input id="link-label" className="studio-input" maxLength={42} value={linkText} onChange={(event) => setLinkText(event.target.value)} />
            <p className="studio-helper">Short copy keeps the value clear before the card reveal.</p>
          </div>}
          {step === 4 && <div key="delivery" className="studio-form-section studio-fields">
            <label>ACCESS CONTROLS</label>
            <button className="setting-row" type="button" role="switch" aria-checked={singleUse} onClick={() => setSingleUse(!singleUse)}><span><strong>Single-use code</strong><small>Proposed redemption rule</small></span><i className={singleUse ? "on" : ""}>{singleUse ? "ON" : "OFF"}</i></button>
            <button className="setting-row" type="button" role="switch" aria-checked={locked} onClick={() => setLocked(!locked)}><span><strong>Lock to recipient</strong><small>Proposed email verification</small></span><i className={locked ? "on" : ""}>{locked ? "ON" : "OFF"}</i></button>
            <div className="integration-row"><span>INTEGRATION PREVIEW</span><strong>access.activated</strong><b>SIMULATED</b><p>Production requires your product API. Access rules are not enforced in this demo.</p></div>
          </div>}
          <button className="step-next" type="button" onClick={() => step < 4 ? setStep(step + 1) : openPreview()}>{step < 4 ? `Next: ${steps[step + 1]}` : "Preview customer journey"}<span>→</span></button>
        </aside>

        <section className={`studio-preview ${device}`}>
          <div className="studio-panel-head studio-preview-head"><span><b /> LIVE RECIPIENT PREVIEW</span><div><button type="button" className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}>Desktop</button><button type="button" className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}>Mobile</button></div></div>
          <div className="studio-preview-stage">
            <div className="stage-shadow" aria-hidden="true" />
            <article className={`studio-access-card ${value.length > 6 ? "long-value" : ""}`}>
              <header><span><StudioMark /> {sender.toUpperCase()}</span><span>PRIVATE ACCESS / 001</span></header>
              <div className="studio-card-recipient"><small>CREATED FOR</small><h2>{recipient}</h2></div>
              <div className="studio-card-value"><small>INCLUDES</small><strong>{value}</strong><span>{offer.unit}</span></div>
              <footer><span>{singleUse ? "SINGLE USE" : "REUSABLE"}</span><span>{expiryLabel.toUpperCase()} <b>↗</b></span></footer>
            </article>
            <div className="studio-stage-actions"><p className="studio-stage-caption">{offer.name} · {expiryLabel}</p><button type="button" onClick={openPreview}>Preview journey <span>↗</span></button></div>
          </div>
          <div className="studio-recipient-strip"><span>FOR</span><strong>{recipient}</strong><i /><span>FROM</span><strong>{sender}</strong><b>{offer.name.toUpperCase()}</b></div>
        </section>

        <aside className="studio-share">
          <div className="studio-panel-head"><span>THE HANDOFF</span><small className={published ? "live-status" : ""}>{published ? "LINK READY" : "DRAFT"}</small></div>
          <div className="studio-link-block"><label htmlFor="preview-url">SHAREABLE PREVIEW</label><input id="preview-url" readOnly value={privateLink} placeholder="Create a preview link below" /><button disabled={!privateLink} type="button" onClick={() => copy(privateLink, "Link")}>Copy link <span>⧉</span></button></div>
          <div className="studio-message-head"><label>CUSTOMER MESSAGE</label><span>EMAIL</span></div>
          <article className="studio-message"><p className="message-to">To {email || "your customer"}</p><p>{message}</p><p><strong>{summary}</strong><br />Created for {recipient}.</p><button className="message-preview-link" type="button" onClick={openPreview}>{linkText || "Preview access"} ↗</button><footer><span>{sender.toUpperCase()}</span><span>{expiryLabel.toUpperCase()}</span></footer></article>
          <button disabled={!privateLink} type="button" className="studio-copy-message" onClick={() => copy(`${message}\n${summary}\n${linkText}: ${privateLink}`, "Message")}>Copy message <span>⧉</span></button>
          <div className="activity-panel">
            <div className="studio-panel-head"><span>PREVIEW ACTIVITY</span><small>THIS SESSION</small></div>
            <ol><li className={published ? "complete" : "current"}><i /><span><strong>{published ? "Preview link created" : "Draft in progress"}</strong><small>{published ? "Ready to share" : "Customize your experience"}</small></span></li><li className={opened ? "complete" : "pending"}><i /><span><strong>{opened ? "Preview opened" : "Awaiting preview"}</strong><small>Customer experience</small></span></li><li className={activated ? "complete" : "pending"}><i /><span><strong>{activated ? "Demo activation complete" : "Awaiting demo activation"}</strong><small>Simulated product handoff</small></span></li></ol>
          </div>
          <button type="button" className="studio-publish-wide" onClick={publish}>{published ? "Refresh preview link" : "Create preview link"}<span>↗</span></button>
          <p className="studio-helper">Preview links are public demos. No email is sent and no real access is issued.</p>
        </aside>
      </section>

      <section className="studio-metrics" aria-label="Sample campaign data"><div><span>SAMPLE DATA</span><strong>What you could measure</strong></div><article><small>SENT</small><strong>24</strong></article><article><small>OPENED</small><strong>19</strong><span>79%</span></article><article><small>ACTIVATED</small><strong>12</strong><span>50%</span></article><article><small>TIME TO VALUE</small><strong>4m 18s</strong></article></section>
      <dialog ref={dialog} className="customer-preview-dialog" onCancel={() => setPreview(false)} onClose={() => setPreview(false)} aria-labelledby="preview-title">
        <header><span>{sender} · Customer preview</span><button type="button" aria-label="Close preview" onClick={() => setPreview(false)}>×</button></header>
        <div className="customer-preview-body">
          <p className="preview-eyebrow">{["PERSONALLY DELIVERED", "YOUR ACCESS CODE", "PRODUCT WORKSPACE", "ACCESS ACTIVATED"][journey]}</p>
          <h2 id="preview-title">{["Made for your team.", "Your access is ready.", "Activate your access.", "You’re ready to go."][journey]}</h2>
          <p>{journey === 3 ? `${summary} activated for ${recipient} in this demonstration.` : `${summary} for ${recipient}.`}</p>
          {journey === 0 && <><div className="preview-mini-card"><span>{sender}</span><strong>{value}</strong><span>{offer.unit}</span></div><p>{message}</p><button className="preview-primary" onClick={() => setJourney(1)}>Reveal access code →</button></>}
          {journey === 1 && <><div className="preview-code"><code>DEMO-ACCESS-1000</code><button onClick={copyAccessCode}>Copy code</button></div><p className="preview-expiry">{expiryLabel} · Demo code</p><button className="preview-primary" onClick={() => { setJourney(2); setError(""); }}>Continue to workspace ↗</button></>}
          {journey === 2 && <form onSubmit={(event) => { event.preventDefault(); activatePreview(); }}><label htmlFor="studio-activation-code">Activation code</label><input id="studio-activation-code" autoComplete="off" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} placeholder="Paste the code from your card" /><button className="preview-secondary" type="button" onClick={() => setCode("DEMO-ACCESS-1000")}>Use demo code</button><button className="preview-primary" type="submit">Activate access →</button></form>}
          {journey === 3 && <><div className="webhook-preview"><span>SIMULATED HANDOFF</span><code>access.activated</code><strong>200 OK · {recipient}</strong></div><button className="preview-primary" onClick={() => { setJourney(0); setCode(""); setError(""); }}>Replay experience ↻</button></>}
          <p className="preview-feedback" role="status">{error}</p>
        </div><footer>Interactive concept. Credits, security checks, and webhooks are simulated.</footer>
      </dialog>
      <footer className="studio-footer"><span>INTERACTIVE PROTOTYPE · FICTIONAL DEMONSTRATION</span><p>No real product access is issued.</p><a href="https://github.com/bhavya-gx/rewardlab" target="_blank" rel="noreferrer">OPEN SOURCE · MIT LICENSE</a></footer>
    </main>
  );
}
