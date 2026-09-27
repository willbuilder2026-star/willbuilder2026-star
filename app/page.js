import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Draft My Will — get your affairs sorted",
};

const wrap = { maxWidth: 1000, margin: "0 auto", padding: "0 20px" };
const btn = {
  display: "inline-block",
  padding: "13px 26px",
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: "none",
  fontSize: 15,
};
const card = { background: "#fff", border: "1px solid #e3d9c8", borderRadius: 12, padding: 20 };
const eyebrow = { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#7a5225", fontWeight: 700 };

const steps = [
  { n: "1", h: "Create your account", p: "Sign up free — no payment needed until you're ready to finish." },
  { n: "2", h: "Answer plain-English questions", p: "Family, property, gifts and more — save as you go, come back any time." },
  { n: "3", h: "Check your Family & Estate Map", p: "See exactly who gets what before you commit to anything." },
  { n: "4", h: "Sign and store it safely", p: "Get clear signing instructions for your jurisdiction, plus 30 days of free changes." },
];

const jurisdictions = [
  { h: "England & Wales", p: "Full Wills Act-compliant drafting, with two independent witnesses required." },
  { h: "Scotland", p: "Scots law succession rules built in, including legal rights for spouses and children." },
  { h: "Northern Ireland", p: "NI-specific execution and witnessing requirements handled automatically." },
];

export default function Landing() {
  return (
    <div>
      <Header base="./" />

      <section style={{ ...wrap, padding: "60px 20px 40px" }}>
        <div style={eyebrow}>UK Will writing, done properly</div>
        <h1 style={{ fontSize: 36, lineHeight: 1.2, margin: "10px 0 0" }}>
          Get your affairs sorted. A simple Will, without the solicitor-sized bill.
        </h1>
        <p style={{ color: "#4a5867", fontSize: 17, marginTop: 18, lineHeight: 1.6, maxWidth: 640 }}>
          Answer a guided set of questions in plain English, see exactly how your estate will be split with a
          live Family &amp; Estate Map, and get a proper Will document — covering England &amp; Wales,
          Scotland and Northern Ireland.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="./app/" style={{ ...btn, background: "#9c6b32", color: "#fff8ee" }}>
            Start your Will — it's free to begin
          </a>
          <a href="./how-it-works/" style={{ ...btn, background: "#f1e4d0", color: "#7a5225" }}>
            See how it works
          </a>
        </div>
        <p style={{ marginTop: 14, fontSize: 13, color: "#7a7266" }}>
          You can read everything on this site without an account. You only need to sign up when you're ready
          to start writing your Will.
        </p>
      </section>

      <section style={{ ...wrap, padding: "20px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { h: "Answer at your own pace", p: "Save as you go and come back any time before you're ready to sign." },
            { h: "See it laid out clearly", p: "A live map shows exactly who gets what, before you finish." },
            { h: "30 days of free changes", p: "Made a mistake or changed your mind? Amend it free for the first month." },
          ].map((c, i) => (
            <div key={i} style={card}>
              <h3 style={{ fontSize: 16, margin: 0 }}>{c.h}</h3>
              <p style={{ fontSize: 14, color: "#4a5867", marginTop: 8 }}>{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#fff", borderTop: "1px solid #e3d9c8", borderBottom: "1px solid #e3d9c8" }}>
        <div style={{ ...wrap, padding: "50px 20px" }}>
          <div style={eyebrow}>How it works</div>
          <h2 style={{ fontSize: 26, margin: "8px 0 24px" }}>Four steps, at your own pace</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {steps.map((s) => (
              <div key={s.n}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#f1e4d0",
                    color: "#7a5225",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontSize: 15, marginTop: 12 }}>{s.h}</h3>
                <p style={{ fontSize: 13.5, color: "#4a5867", marginTop: 6, lineHeight: 1.5 }}>{s.p}</p>
              </div>
            ))}
          </div>
          <a href="./how-it-works/" style={{ display: "inline-block", marginTop: 24, color: "#7a5225", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Read the full walkthrough →
          </a>
        </div>
      </section>

      <section style={{ ...wrap, padding: "50px 20px" }}>
        <div style={eyebrow}>Covers the whole UK</div>
        <h2 style={{ fontSize: 26, margin: "8px 0 24px" }}>Written for your jurisdiction</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {jurisdictions.map((j, i) => (
            <div key={i} style={card}>
              <h3 style={{ fontSize: 16, margin: 0 }}>{j.h}</h3>
              <p style={{ fontSize: 14, color: "#4a5867", marginTop: 8 }}>{j.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#1c2b3a", color: "#fff8ee" }}>
        <div style={{ ...wrap, padding: "50px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 24, margin: 0 }}>Ready to get your affairs sorted?</h2>
            <p style={{ color: "#cdbfa8", marginTop: 8, fontSize: 15 }}>
              Creating an account is free — you only pay when your Will is ready to finish.
            </p>
          </div>
          <a href="./app/" style={{ ...btn, background: "#9c6b32", color: "#fff8ee" }}>
            Start your Will
          </a>
        </div>
      </section>

      <div style={wrap}>
        <Footer base="./" />
      </div>
    </div>
  );
}
