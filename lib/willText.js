import { JURISDICTION_LABELS } from "./willData";

// Supabase date inputs give "YYYY-MM-DD" — display everything to the
// person in UK format, DD/MM/YYYY.
export function formatUKDate(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

// Oldest child first (earliest date of birth). Children with no date of
// birth recorded are pushed to the end rather than jumping to the top.
export function sortChildren(children) {
  return [...children].sort((a, b) => (a.date_of_birth || "9999-99-99").localeCompare(b.date_of_birth || "9999-99-99"));
}

// Primary executor(s) always listed before reserve executor(s), keeping the
// order they were added within each group.
export function sortExecutors(executors) {
  return [...executors].sort((a, b) => {
    if (a.role === b.role) return 0;
    return a.role === "primary" ? -1 : 1;
  });
}

// Structured sections (rather than one flat string) so the PDF renderer can
// bold headings and bullet the list items properly, instead of guessing
// from plain text.
export function buildWillSections(jurisdiction, data) {
  const { about, partner, guardians, properties, pensions, gifts, charityGifts, beneficiaries, adminNotes } = data;
  const children = sortChildren(data.children);
  const executors = sortExecutors(data.executors);
  const sections = [];
  const push = (type, text) => sections.push({ type, text });

  push("para", "I hereby revoke all former Wills and testamentary dispositions made by me.");

  if (partner?.has_partner && partner.partner_name) {
    push("heading", "1. FAMILY");
    push("para", `I am ${about?.marital_status === "married" ? "married to" : "in a relationship with"} ${partner.partner_name}.`);
  }

  if (children.length > 0) {
    push("heading", "2. CHILDREN");
    children.forEach((c) => push("bullet", `${c.name}${c.date_of_birth ? ` (born ${formatUKDate(c.date_of_birth)})` : ""}`));
  }

  if (guardians.length > 0) {
    push("heading", "3. GUARDIANS");
    push("para", "If I die while any of my children are under 18, I appoint the following as guardian(s):");
    guardians.forEach((g) => push("bullet", `${g.name}${g.address ? `, of ${g.address}${g.postcode ? `, ${g.postcode}` : ""}` : ""}`));
  }

  push("heading", "4. EXECUTORS");
  if (executors.length > 0) {
    push("para", "I appoint the following as Executor(s) of this my Will:");
    executors.forEach((e) => push("bullet", `${e.name}${e.address ? `, of ${e.address}${e.postcode ? `, ${e.postcode}` : ""}` : ""} (${e.role === "reserve" ? "reserve" : "primary"})`));
  } else {
    push("para", "[No executors added yet.]");
  }

  if (properties.length > 0) {
    push("heading", "5. PROPERTY");
    properties.forEach((p) => push("bullet", `${p.description}${p.ownership_type ? ` (held as: ${p.ownership_type.replace(/_/g, " ")})` : ""}`));
  }

  if (pensions && !pensions.simple_mode && (pensions.provider || pensions.notes)) {
    push("heading", "6. PENSIONS");
    if (pensions.provider) push("para", `Provider: ${pensions.provider}`);
    if (pensions.notes) push("para", pensions.notes);
  }

  if (gifts.length > 0) {
    push("heading", "7. SPECIFIC GIFTS");
    gifts.forEach((g) => push("bullet", `I give ${g.item} to ${g.beneficiary}.`));
  }

  if (charityGifts.length > 0) {
    push("heading", "8. CHARITABLE GIFTS");
    charityGifts.forEach((c) => push("bullet", `I give ${c.amount || "an amount to be confirmed"} to ${c.charity_name}.`));
  }

  push("heading", "9. RESIDUARY ESTATE");
  if (beneficiaries.length > 0) {
    push("para", "I give the remainder of my estate (after debts, expenses and the above gifts) as follows:");
    beneficiaries.forEach((b) => {
      // NOTE: deliberately doesn't assume the beneficiary's "children" are
      // any of the children listed in section 2 — those may not be related
      // to this beneficiary at all (e.g. a step-parent beneficiary).
      const stirpes = b.deceased
        ? " (if they predecease me, this share shall pass to their own surviving children in equal shares, or failing that, back into the residuary estate divided among the surviving beneficiaries below)"
        : "";
      push("bullet", `${b.share_percent}% to ${b.name}${stirpes}`);
    });
  } else {
    push("para", "[No residuary beneficiaries added yet.]");
  }

  if (adminNotes.length > 0) {
    push("heading", "10. NOTES FOR MY EXECUTORS (not legally binding, for guidance only)");
    adminNotes.forEach((n) => push("bullet", n.note_text));
  }

  push("para", "");
  push("para", "SIGNED by the above-named Testator as their last Will in our presence and then by us in theirs:");
  push("para", "");
  push("signature", "Signature: _______________________   Date: _______________");
  push("para", "");
  if (jurisdiction === "scotland") {
    push("para", "Witnessed by one witness (Scotland requires one witness on a formal Will):");
    push("signature", "Witness signature: _______________________  Name: _______________  Address: _______________");
  } else {
    push("para", "Witnessed by two independent witnesses, both present at the same time:");
    push("signature", "Witness 1 signature: _______________________  Name: _______________  Address: _______________");
    push("signature", "Witness 2 signature: _______________________  Name: _______________  Address: _______________");
  }

  return sections;
}

export function openingLines(about) {
  const lines = [`This is the last Will and Testament of ${about?.full_name || "[Full name]"}`];
  if (about?.date_of_birth) lines.push(`Born: ${formatUKDate(about.date_of_birth)}`);
  if (about?.address) lines.push(`Of: ${about.address}${about?.postcode ? `, ${about.postcode}` : ""}`);
  return lines;
}

// Plain-text version, for the copy button and the .txt download.
export function buildWillText(jurisdiction, data) {
  const jur = JURISDICTION_LABELS[jurisdiction] || jurisdiction;
  const lines = ["LAST WILL AND TESTAMENT", `(${jur})`, "", ...openingLines(data.about), ""];
  buildWillSections(jurisdiction, data).forEach((s) => {
    lines.push(s.type === "bullet" ? `• ${s.text}` : s.text);
  });
  return lines.join("\n");
}
