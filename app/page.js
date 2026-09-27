export const metadata = {
  title: "Draft My Will — get your affairs sorted",
};

const wrap = { maxWidth: 760, margin: "0 auto", padding: "0 20px" };
const btn = {
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: "none",
  fontSize: 15,
};

export default function Landing() {
  return (
    <div>
      <header style={{ borderBottom: "1px solid #e3d9c8", padding: "16px 0" }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Draft My Will</div>
          <a href="./app/" style={{ ...btn, background: "#f1e4d0", color: "#7a5225", padding: "8px 16px" }}>
            Log in
          </a>
        </div>
      </header>

      <section style={{ ...wrap, padding: "60px 20px 40px" }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          Get your affairs sorted. A simple Will, without the solicitor-sized bill.
        </h1>
        <p style={{ color: "#4a5867", fontSize: 17, marginTop: 18, lineHeight: 1.6 }}>
          Answer a guided set of questions in plain English, see exactly how your estate will be split with a
          live Family &amp; Estate Map, and get a proper Will document — covering England &amp; Wales,
          Scotland and Northern Ireland.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="./app/" style={{ ...btn, background: "#9c6b32", color: "#fff8ee" }}>
            Start your Will
          </a>
          <a href="./app/" style={{ ...btn, background: "#f1e4d0", color: "#7a5225" }}>
            Log in to an existing account
          </a>
        </div>
      </section>

      <section style={{ ...wrap, padding: "20px 20px 70px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { h: "Answer at your own pace", p: "Save as you go and come back any time before you're ready to sign." },
            { h: "See it laid out clearly", p: "A live map shows exactly who gets what, before you finish." },
            { h: "30 days of free changes", p: "Made a mistake or changed your mind? Amend it free for the first month." },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e3d9c8", borderRadius: 12, padding: 18 }}>
              <h3 style={{ fontSize: 16, margin: 0 }}>{c.h}</h3>
              <p style={{ fontSize: 14, color: "#4a5867", marginTop: 8 }}>{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #e3d9c8", padding: "20px 0", textAlign: "center", color: "#7a7266", fontSize: 13 }}>
        Not legal advice. Product test build — 27 September 2026.
      </footer>
    </div>
  );
}
