"use client";

import { useEffect, useRef, useState } from "react";

const scenes = ["Receive", "Open", "Reveal", "Activate", "Ready"];
const accessCode = "MORROW-1K-Q7N4";
const repoUrl = "https://github.com/bhavya-gx/rewardlab";

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-mark ${light ? "light" : ""}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function ProductMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`product-mark ${inverse ? "inverse" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function AccessCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`access-card ${compact ? "compact" : ""}`} aria-label="Private Access card for Morrowvale Labs">
      <div className="card-reflection" aria-hidden="true" />
      <header>
        <span><ProductMark /> KOVAELIN AI</span>
        <span>PRIVATE ACCESS / 001</span>
      </header>
      <div className="card-main">
        <p>CREATED FOR</p>
        <h3>Morrowvale<br />Labs</h3>
      </div>
      <div className="credit-chip">
        <small>INCLUDES</small>
        <strong>1,000</strong>
        <span>AI CREDITS</span>
      </div>
      <footer>
        <span>ONE PRIVATE LINK</span>
        <span>READY TO ACTIVATE <b>↗</b></span>
      </footer>
    </article>
  );
}

function JourneyDemo() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [activating, setActivating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(() => {
      setScene((current) => {
        if (current >= scenes.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, [3000, 4000, 4000, 5000, 4000][scene]);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [scene, playing]);

  useEffect(() => {
    if (!playing) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (scene === 2) timers.push(setTimeout(() => setFeedback("Preview: code copied"), 1800));
    if (scene === 3) {
      timers.push(setTimeout(() => setEnteredCode(accessCode), 900));
      timers.push(setTimeout(() => setActivating(true), 3400));
    }
    return () => timers.forEach(clearTimeout);
  }, [scene, playing]);

  useEffect(() => () => {
    if (actionTimer.current) clearTimeout(actionTimer.current);
  }, []);

  function selectScene(next: number) {
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setPlaying(false);
    setActivating(false);
    setFeedback("");
    setScene(next);
  }

  function replay() {
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setActivating(false);
    setFeedback("");
    setCopied(false);
    setEnteredCode("");
    setScene(0);
    setPlaying(true);
  }

  async function copyCode() {
    setPlaying(false);
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setFeedback("Copied. Continue to the workspace.");
    } catch {
      setFeedback("Select the code and copy it manually.");
    }
  }

  function activate() {
    setPlaying(false);
    if (enteredCode.trim().toUpperCase() !== accessCode) {
      setFeedback("Enter the code shown on your access card.");
      return;
    }
    setFeedback("");
    setActivating(true);
    actionTimer.current = setTimeout(() => {
      setActivating(false);
      setScene(4);
    }, 1200);
  }

  return (
    <div className="journey-shell" data-testid="journey-demo">
      <div className="journey-topbar">
        <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
        <div className="secure-address"><span>⌁</span> private.kovaelin.example/morrowvale</div>
        <button type="button" className="replay-button" onClick={playing ? () => { setPlaying(false); setActivating(false); } : replay}>{playing ? "Pause" : "Play demo"} <span>{playing ? "Ⅱ" : "↻"}</span></button>
      </div>

      <div className="journey-viewport" aria-live="polite">
        <section className={`demo-scene mail-scene ${scene === 0 ? "active" : ""}`} aria-hidden={scene !== 0}>
          <div className="mail-app">
            <aside>
              <div className="mail-logo">M</div>
              <i /><i /><i /><i />
            </aside>
            <div className="mail-content">
              <div className="mail-heading"><span>INBOX</span><span>12:42 PM</span></div>
              <article className="message-card">
                <div className="sender-avatar"><ProductMark inverse /></div>
                <div className="sender-line"><strong>Kovaelin AI</strong><span>to Morrowvale Labs</span></div>
                <small>JUST NOW</small>
                <h3>Your private access is ready.</h3>
                <p>We added 1,000 AI credits to help your team experience Kovaelin.</p>
                <button type="button" onClick={() => selectScene(1)}>Open private link <span>↗</span></button>
                <div className="message-signature">Sent securely by Kovaelin AI</div>
              </article>
            </div>
          </div>
        </section>

        <section className={`demo-scene reveal-scene ${scene === 1 ? "active" : ""}`} aria-hidden={scene !== 1}>
          <div className="reveal-glow" aria-hidden="true" />
          <div className="reveal-nav"><span><ProductMark /> KOVAELIN</span><small>PRIVATE CUSTOMER ACCESS</small></div>
          <div className="reveal-copy">
            <span>FOR MORROWVALE LABS</span>
            <h3>Something useful,<br />made personal.</h3>
            <p>1,000 AI credits are waiting for your team.</p>
            <button type="button" onClick={() => selectScene(2)}>Reveal your access <span>↓</span></button>
          </div>
          <div className="demo-card-wrap"><AccessCard compact /></div>
        </section>

        <section className={`demo-scene code-scene ${scene === 2 ? "active" : ""}`} aria-hidden={scene !== 2}>
          <div className="code-halo" aria-hidden="true" />
          <div className="code-panel">
            <span className="code-kicker">YOUR PRIVATE ACCESS CODE</span>
            <h3>1,000 credits.<br />Ready when you are.</h3>
            <p>Copy this code, then paste it inside Kovaelin AI.</p>
            <div className={`activation-code ${copied ? "copied" : ""}`}>
              <strong>{accessCode}</strong>
              <button type="button" onClick={copyCode}>{copied ? "Copied ✓" : "Copy code"}</button>
            </div>
            <small>Single use · Created for Morrowvale Labs</small>
            <p className="journey-feedback" role="status">{feedback}</p>
            <button className="workspace-link" type="button" onClick={() => selectScene(3)}>Continue to workspace <span>↗</span></button>
          </div>
          <div className="code-card-edge" aria-hidden="true" />
        </section>

        <section className={`demo-scene product-scene ${scene === 3 ? "active" : ""}`} aria-hidden={scene !== 3}>
          <div className="product-app">
            <aside className="product-sidebar">
              <div><ProductMark /> <strong>KOVAELIN</strong></div>
              <nav><span>⌂</span><span>◇</span><span>◫</span><span>⌁</span></nav>
              <div className="profile-dot">M</div>
            </aside>
            <div className="product-canvas">
              <header><div><small>WORKSPACE</small><strong>Morrowvale Labs</strong></div><span>1,000 credits pending</span></header>
              <div className="canvas-lines" aria-hidden="true"><i /><i /><i /></div>
              <div className={`redeem-modal ${activating ? "is-activating" : ""}`} aria-busy={activating}>
                <div className="modal-icon">✦</div>
                <span>ACTIVATE PRIVATE ACCESS</span>
                <h3>Add credits to your workspace.</h3>
                <p>Paste the code from your Kovaelin access link.</p>
                <label>
                  <span>ACTIVATION CODE</span>
                  <input value={enteredCode} disabled={activating} onChange={(event) => { setPlaying(false); setEnteredCode(event.target.value); setFeedback(""); }} placeholder="XXXX-XXXX-XXXX" aria-label="Activation code" />
                </label>
                <button className="fill-demo-code" type="button" disabled={activating} onClick={() => { setPlaying(false); setEnteredCode(accessCode); setFeedback(""); }}>Use demo code <span>↙</span></button>
                <button type="button" disabled={activating} onClick={activate}>{activating ? "Activating credits" : "Activate credits"}<span className={activating ? "activation-spinner" : ""}>{activating ? "" : "↗"}</span></button>
                <p className="journey-feedback" role="status">{feedback}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`demo-scene success-scene ${scene === 4 ? "active" : ""}`} aria-hidden={scene !== 4}>
          <div className="success-grid" aria-hidden="true" />
          <div className="success-product"><ProductMark /><span>KOVAELIN</span></div>
          <div className="success-center">
            <div className="success-ring"><span>✓</span></div>
            <small>ACCESS ACTIVATED</small>
            <h3>Your workspace is ready.</h3>
            <p><strong>1,000 AI credits</strong> have been added to Morrowvale Labs.</p>
            <button type="button" onClick={replay}>Replay the journey <span>↻</span></button>
          </div>
          <div className="credit-toast"><span>AVAILABLE BALANCE</span><strong>1,000</strong><small>AI CREDITS</small></div>
        </section>
      </div>

      <div className="journey-controls" aria-label="Customer journey scenes">
        {scenes.map((label, index) => (
          <button
            type="button"
            key={label}
            data-testid={`scene-${label.toLowerCase()}`}
            className={scene === index ? "active" : ""}
            onClick={() => selectScene(index)}
            aria-current={scene === index ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-light light-one" aria-hidden="true" />
        <div className="hero-light light-two" aria-hidden="true" />

        <nav className="site-nav" aria-label="Primary navigation">
          <a className="brand-link" href="#top" aria-label="Rewardlab home">
            <BrandMark light />
            <span>REWARDLAB</span>
            <small>OPEN SOURCE</small>
          </a>
          <div>
            <a href="/studio">Creator Studio</a>
            <a className="nav-cta" href={repoUrl} target="_blank" rel="noreferrer">View on GitHub <span>↗</span></a>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow"><span>AN OPEN SOURCE CONCEPT</span><i /> FOR B2B AI COMPANIES</p>
            <h1 id="hero-title">Your product.<br /><em>Personally<br /> delivered.</em></h1>
            <p>Send trials or credits in a branded card. Your customer opens a link, copies a code, and activates it in your product.</p>
            <div className="hero-actions">
              <a className="primary-button" href="/rewards">Explore the rewards demo <span>↗</span></a>
              <a className="secondary-link" href="/studio">Try the Creator Studio <span>↗</span></a>
            </div>
          </div>

          <div className="hero-object" aria-hidden="true">
            <div className="object-orbit orbit-a" />
            <div className="object-orbit orbit-b" />
            <div className="object-shadow" />
            <AccessCard />
            <div className="object-note"><i /> FICTIONAL PRODUCT DEMONSTRATION</div>
          </div>
        </div>

        <div className="hero-footnote">
          <span>YOUR BRAND. YOUR CUSTOMER EXPERIENCE.</span>
          <p>Trials · Credits · Product updates</p>
        </div>
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title">
        <div className="experience-heading">
          <div>
            <p className="section-kicker">WHAT THE CUSTOMER SEES</p>
            <h2 id="experience-title">One link.<br /><em>Access unlocked.</em></h2>
          </div>
          <p>Explore your customer journey from inbox to 1,000 activated credits. This is an interactive concept with fictional companies.</p>
        </div>
        <JourneyDemo />
      </section>

      <section className="v2-proof" aria-labelledby="v2-proof-title">
        <div className="v2-proof-heading">
          <p className="section-kicker">FROM SEND TO ACTIVATION</p>
          <h2 id="v2-proof-title">Create the moment.<br /><em>Track what happens.</em></h2>
          <p>Customize an offer, share a preview, and try the customer journey. A working concept of what we can build for your product.</p>
          <a className="primary-button" href="/studio">Open the live prototype <span>↗</span></a>
        </div>
        <div className="v2-proof-grid">
          <article><span>01</span><h3>Five offer types</h3><p>Credits, trials, beta access, feature unlocks, and private product stories.</p></article>
          <article><span>02</span><h3>A personal handoff</h3><p>Your branding, your message, and a shareable customer preview.</p></article>
          <article><span>03</span><h3>Follow the journey</h3><p>Try the reveal and activation flow. Preview activity updates as you go.</p></article>
          <article><span>04</span><h3>Built to connect</h3><p>Explore a simulated product handoff. Real access requires your product API.</p></article>
        </div>
      </section>

      <section className="flow" aria-labelledby="flow-title">
        <div className="flow-heading">
          <p className="section-kicker">HOW IT WORKS</p>
          <h2 id="flow-title">Send. Open.<br /><em>Activate.</em></h2>
        </div>
        <div className="flow-list">
          <article>
            <span>01 / SEND</span>
            <h3>Make it personal</h3>
            <p>Choose the offer, add your branding, and send a customer link.</p>
            <b aria-hidden="true">↗</b>
          </article>
          <article>
            <span>02 / REVEAL</span>
            <h3>Reveal the offer</h3>
            <p>Your customer opens the card and copies the activation code.</p>
            <b aria-hidden="true">✦</b>
          </article>
          <article>
            <span>03 / ACTIVATE</span>
            <h3>Start using it</h3>
            <p>Your customer pastes the code into your product to activate access.</p>
            <b aria-hidden="true">✓</b>
          </article>
        </div>
      </section>

      <section className="capability" aria-labelledby="capability-title">
        <div className="capability-copy">
          <p className="section-kicker">BUILT IN THE OPEN</p>
          <h2 id="capability-title">Built around<br /><em>your product.</em></h2>
          <p>A custom card, customer journey, activation interface, and Creator Studio. Every part of it is in the repository, ready to adapt to your AI product.</p>
          <div className="capability-tags">
            <span>NEXT.JS</span><span>REACT</span><span>TYPESCRIPT</span><span>MIT</span><span>NO TRACKING</span>
          </div>
        </div>
      </section>

      <section className="open-source" id="open-source" aria-labelledby="access-title">
        <div className="access-grid" aria-hidden="true" />
        <div className="access-copy">
          <p className="section-kicker">FULLY OPEN SOURCE</p>
          <h2 id="access-title">No waitlist.<br /><em>Just the code.</em></h2>
          <p>Everything on this site, the landing page, the Creator Studio and the rewards demo, is MIT licensed. Clone it, run it locally, and make it yours.</p>
          <div className="creator-signoff"><BrandMark light /><span>Rewardlab<br /><strong>an open-source concept</strong></span></div>
        </div>
        <div className="access-form-card">
          <div className="form-card-heading"><span>RUN IT YOURSELF</span><small>MIT LICENSE</small></div>
          <div className="open-source-steps">
            <code>git clone {repoUrl}.git</code>
            <code>pnpm install</code>
            <code>pnpm dev</code>
          </div>
          <a className="primary-button" href={repoUrl} target="_blank" rel="noreferrer">View the source on GitHub <span>↗</span></a>
          <small>No signup, no email capture, no analytics. Fork it and build on it.</small>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand-link" href="#top"><BrandMark light /><span>REWARDLAB</span><small>OPEN SOURCE</small></a>
        <p>Kovaelin AI and Morrowvale Labs are fictional names created for this demonstration.</p>
        <a href={repoUrl} target="_blank" rel="noreferrer">MIT LICENSE · SOURCE ON GITHUB</a>
      </footer>
    </main>
  );
}
