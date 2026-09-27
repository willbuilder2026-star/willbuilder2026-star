// Shared data shaping + SVG drawing for the Family & Estate Map, used by
// both the live Stage 9 page and the Document Pack PDF export, so the two
// can never drift out of sync — one function decides what the map looks
// like, and both places just call it.

// Turns the raw fetchWillData() result into the shape the map needs: one
// row per residuary beneficiary, each knowing what actually happens to
// their share if they predecease the Will-writer.
export function buildFamilyMapModel(data) {
  const testatorName = data.about?.full_name || "You";
  const hasPartner = !!(data.partner?.has_partner && data.partner?.partner_name);
  const partnerName = data.partner?.partner_name || "";

  const childrenByBeneficiary = {};
  (data.residuaryChildren || []).forEach((c) => {
    if (!childrenByBeneficiary[c.beneficiary_id]) childrenByBeneficiary[c.beneficiary_id] = [];
    childrenByBeneficiary[c.beneficiary_id].push(c);
  });

  const beneficiaries = (data.beneficiaries || []).map((b) => {
    // `contingency` is the new field; `deceased` is the old one-off
    // checkbox this replaces — read it as a fallback so a will that
    // hasn't had the new migration applied yet still shows something
    // sensible rather than breaking.
    const contingency = b.contingency || (b.deceased ? "to_children" : "none");
    const kidsRaw = childrenByBeneficiary[b.id] || [];

    // If "passes to their children" was chosen but nobody's actually been
    // named, there's nobody for the share to go to — treat it the same as
    // "redistribute" rather than showing an empty dead end on the map.
    const effectiveContingency = contingency === "to_children" && kidsRaw.length === 0 ? "redistribute" : contingency;

    let kids = [];
    if (effectiveContingency === "to_children") {
      const named = kidsRaw.filter((k) => k.share_percent !== null && k.share_percent !== undefined);
      const unnamedCount = kidsRaw.length - named.length;
      const namedTotal = named.reduce((sum, k) => sum + Number(k.share_percent), 0);
      const remaining = Math.max(0, (b.share_percent || 0) - namedTotal);
      const perUnnamed = unnamedCount > 0 ? remaining / unnamedCount : 0;
      kids = kidsRaw.map((k) =>
        k.share_percent !== null && k.share_percent !== undefined
          ? { name: k.name, share: Number(k.share_percent) }
          : { name: k.name, share: Math.round(perUnnamed * 100) / 100 }
      );
    }

    return {
      id: b.id,
      name: b.name,
      share: Number(b.share_percent) || 0,
      contingency,
      effectiveContingency,
      children: kids,
    };
  });

  return { testatorName, hasPartner, partnerName, beneficiaries };
}

const COLORS = {
  ink: "#1c2b3a",
  inkSoft: "#4a5867",
  paperRaised: "#ffffff",
  accent: "#9c6b32",
  accentDeep: "#7a5225",
  line: "#e3d9c8",
  muted: "#7a7266",
  warn: "#a8541f",
  warnSoft: "#f6e6dc",
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nodeBox(x, cy, label, sub, opts = {}) {
  const w = opts.w || 168;
  const h = opts.h || 46;
  const y = cy - h / 2;
  const fill = opts.deceased ? COLORS.warnSoft : COLORS.paperRaised;
  const stroke = opts.deceased ? COLORS.warn : opts.root ? COLORS.accent : COLORS.line;
  const dash = opts.deceased ? ' stroke-dasharray="5,3"' : "";
  const strokeW = opts.root ? 2 : 1.4;
  let out = "<g>";
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"${dash}/>`;
  out += `<text x="${x + 12}" y="${cy - (sub ? 4 : -4)}" font-size="13" font-weight="600" fill="${COLORS.ink}">${esc(label)}</text>`;
  if (sub) {
    out += `<text x="${x + 12}" y="${cy + 14}" font-size="11.5" fill="${opts.deceased ? COLORS.warn : COLORS.muted}">${esc(sub)}</text>`;
  }
  out += "</g>";
  return out;
}

function elbow(x1, y1, x2, y2, color) {
  const midX = x1 + (x2 - x1) * 0.45;
  return `<path d="M${x1} ${y1} L${midX} ${y1} L${midX} ${y2} L${x2} ${y2}" fill="none" stroke="${color || COLORS.line}" stroke-width="1.6"/>`;
}

// Builds a full standalone <svg>…</svg> string — used directly in the live
// page (dangerouslySetInnerHTML) and rasterised to a PNG for the PDF, so
// both show exactly the same drawing.
export function buildFamilyMapSvg(model) {
  const rowH = 56;
  const blocks = model.beneficiaries.map((b) => {
    const deceased = b.effectiveContingency !== "none";
    const rows = b.effectiveContingency === "to_children" ? Math.max(b.children.length, 1) : 1;
    return { b, rows, deceased };
  });
  const totalRows = blocks.reduce((a, b) => a + b.rows, 0) || 1;
  const height = Math.max(220, totalRows * rowH + blocks.length * 14 + 40);

  const rootX = 16;
  const childX = 300;
  const grandX = 470;
  const nodeW1 = 190;
  const nodeW2 = 150;
  const nodeW3 = 156;

  let y = 24;
  const parts = [];
  const rootCy = height / 2;

  blocks.forEach(({ b, rows, deceased }) => {
    const blockH = rows * rowH;
    const cy = y + blockH / 2;
    let shareLabel;
    if (b.effectiveContingency === "none") shareLabel = `${b.share}% of residue`;
    else if (b.effectiveContingency === "to_children") shareLabel = "if deceased";
    else shareLabel = "if deceased";
    parts.push(nodeBox(childX, cy, b.name || "Unnamed", shareLabel, { w: nodeW2, deceased }));
    parts.push(elbow(rootX + nodeW1, rootCy, childX, cy));

    if (b.effectiveContingency === "to_children") {
      b.children.forEach((g, i) => {
        const gcy = y + rowH * i + rowH / 2;
        parts.push(nodeBox(grandX, gcy, g.name || "Unnamed", `${g.share}% of residue`, { w: nodeW3 }));
        parts.push(elbow(childX + nodeW2, cy, grandX, gcy, COLORS.warn));
      });
    } else if (b.effectiveContingency === "redistribute") {
      const gcy = y + rowH / 2;
      parts.push(nodeBox(grandX, gcy, "Redistributed", "among surviving beneficiaries", { w: nodeW3 }));
      parts.push(elbow(childX + nodeW2, cy, grandX, gcy, COLORS.warn));
    }
    y += blockH + 14;
  });

  if (model.hasPartner) {
    parts.push(nodeBox(rootX, rootCy - 26, model.testatorName || "Will creator", "Will creator", { w: nodeW1, root: true }));
    parts.push(nodeBox(rootX, rootCy + 26, model.partnerName || "Partner", "Partner", { w: nodeW1 }));
    parts.unshift(
      `<line x1="${rootX + nodeW1 / 2}" y1="${rootCy - 26 + 23}" x2="${rootX + nodeW1 / 2}" y2="${rootCy + 26 - 23}" stroke="${COLORS.line}" stroke-width="1.6"/>`
    );
  } else {
    parts.push(nodeBox(rootX, rootCy, model.testatorName || "Will creator", "Will creator", { w: nodeW1, root: true }));
  }

  const width = grandX + nodeW3 + 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="max-width:100%;height:auto;background:#fff">${parts.join("")}</svg>`;
}
