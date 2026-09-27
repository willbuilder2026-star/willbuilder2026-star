import { eyebrow } from "./styles";

export default function StageHeader({ n, title, desc }) {
  return (
    <>
      <div style={eyebrow}>Stage {n} of 15</div>
      <h1 style={{ fontSize: 22, marginTop: 6 }}>{title}</h1>
      {desc && <p style={{ color: "#7a7266", fontSize: 14, marginTop: 6, marginBottom: 20 }}>{desc}</p>}
    </>
  );
}
