import { btn } from "./styles";

// backHref / nextHref: full relative hrefs already including ?id=...
// nextLabel defaults to "Continue →"
export default function StageNav({ backHref, backLabel = "← Back", nextHref, nextLabel = "Continue →" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        paddingTop: 18,
        borderTop: "1px solid #e3d9c8",
      }}
    >
      {backHref ? (
        <a href={backHref} style={{ color: "#7a5225", fontSize: 14 }}>
          {backLabel}
        </a>
      ) : (
        <span />
      )}
      {nextHref && (
        <a
          href={nextHref}
          style={{ ...btn, textDecoration: "none", display: "inline-block" }}
        >
          {nextLabel}
        </a>
      )}
    </div>
  );
}
