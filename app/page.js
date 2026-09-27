import Header from "../components/Header";
import Footer from "../components/Footer";
import { STAGES } from "../lib/stages";
import { buildFamilyMapSvg } from "../lib/familyMap";

export const metadata = {
  title: "Draft My Will — get your affairs sorted",
};

const wrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
const btn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "11px 22px",
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: "none",
  fontSize: 15,
};
const card = { background: "#fff", border: "1px solid #e3d9c8", borderRadius: 12, padding: 22 };
const eyebrow = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontSize: 12,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "#7a5225",
  fontWeight: 700,
};
const eyebrowDot = { content: '""', width: 7, height: 7, borderRadius: "50%", background: "#9c6b32", display: "inline-block" };
const sectionTag = { ...eyebrow };
const sectionHead = { maxWidth: "62ch", marginBottom: 28 };

// ---- Example Family & Estate Map, hard-coded for the homepage. This is
// NOT generated from anyone's real data — it's a fixed illustration so
// visitors can see what their own live map will look like once they start
// their Will. The real, editable-by-answers version lives on Stage 9.
const exampleMapModel = {
  testatorName: "Alex Whitfield",
  hasPartner: true,
  partnerName: "Jordan Whitfield",
  beneficiaries: [
    { name: "Sam
