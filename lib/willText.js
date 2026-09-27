import { JURISDICTION_LABELS } from "./willData";

// Turns the collected answers into a plain-text draft Will document.
// This is a starting draft for review, not a substitute for having the
// wording checked before anyone relies on it.
export function buildWillText(jurisdiction, data) {
  const { about, partner, children, guardians, executors, properties, pensions, gifts, charityGifts, beneficiaries, adminNotes } = data;
  const lines = [];
  const jur = JURISDICTION_LABELS[jurisdiction] || jurisdiction;

  lines.push("LAST WILL AND TESTAMENT");
  lines.push(`(${jur})`);
  lines.push("");
  lines.push(`This is the last Will and Testament of ${about?.full_name || "[Full name]"}`);
  if (about?.date_of_birth) lines.push(`Born: ${about.date_of_birth}`);
  if (about?.address) lines.push(`Of: ${about.address}`);
  lines.push("");
  lines.push("I hereby revoke all former Wills and testamentary dispositions made by me.");
  lines.push("");

  if (partner?.has_partner && partner.partner_name) {
    lines.push(`1. FAMILY`);
    lines.push(`I am ${about?.marital_status === "married" ? "married" : "in a relationship with"} ${partner.partner_name}.`);
    lines.push("");
  }

  if (children.length > 0) {
    lines.push("2. CHILDREN");
    children.forEach((c) => lines.push(`- ${c.name}${c.date_of_birth ? ` (born ${c.date_of_birth})` : ""}`));
    lines.push("");
  }

  if (guardians.length > 0) {
    lines.push("3. GUARDIANS");
    lines.push("If I die while any of my children are under 18, I appoint the following as guardian(s):");
    guardians.forEach((g) => lines.push(`- ${g.name}${g.address ? `, of ${g.address}` : ""}`));
    lines.push("");
  }

  lines.push("4. EXECUTORS");
  if (executors.length > 0) {
    lines.push("I appoint the following as Executor(s) of this my Will:");
    executors.forEach((e) => lines.push(`- ${e.name}${e.address ? `, of ${e.address}` : ""} (${e.role === "reserve" ? "reserve" : "primary"})`));
  } else {
    lines.push("[No executors added yet.]");
  }
  lines.push("");

  if (properties.length > 0) {
    lines.push("5. PROPERTY");
    properties.forEach((p) => lines.push(`- ${p.description}${p.ownership_type ? ` (held as: ${p.ownership_type.replace(/_/g, " ")})` : ""}`));
    lines.push("");
  }

  if (pensions && !pensions.simple_mode && (pensions.provider || pensions.notes)) {
    lines.push("6. PENSIONS");
    if (pensions.provider) lines.push(`Provider: ${pensions.provider}`);
    if (pensions.notes) lines.push(pensions.notes);
    lines.push("");
  }

  if (gifts.length > 0) {
    lines.push("7. SPECIFIC GIFTS");
    gifts.forEach((g) => lines.push(`- I give ${g.item} to ${g.beneficiary}.`));
    lines.push("");
  }

  if (charityGifts.length > 0) {
    lines.push("8. CHARITABLE GIFTS");
    charityGifts.forEach((c) => lines.push(`- I give ${c.amount || "an amount to be confirmed"} to ${c.charity_name}.`));
    lines.push("");
  }

  lines.push("9. RESIDUARY ESTATE");
  if (beneficiaries.length > 0) {
    lines.push("I give the remainder of my estate (after debts, expenses and the above gifts) as follows:");
    beneficiaries.forEach((b) => {
      lines.push(`- ${b.share_percent}% to ${b.name}${b.deceased ? " (if they predecease me, per stirpes to their children)" : ""}`);
    });
  } else {
    lines.push("[No residuary beneficiaries added yet.]");
  }
  lines.push("");

  if (adminNotes.length > 0) {
    lines.push("10. NOTES FOR MY EXECUTORS (not legally binding, for guidance only)");
    adminNotes.forEach((n) => lines.push(`- ${n.note_text}`));
    lines.push("");
  }

  lines.push("SIGNED by the above-named Testator as their last Will in our presence and then by us in theirs:");
  lines.push("");
  lines.push("Signature: _______________________   Date: _______________");
  lines.push("");
  if (jurisdiction === "scotland") {
    lines.push("Witnessed by one witness (Scotland requires one witness on a formal Will):");
    lines.push("Witness signature: _______________________  Name: _______________  Address: _______________");
  } else {
    lines.push("Witnessed by two independent witnesses, both present at the same time:");
    lines.push("Witness 1 signature: _______________________  Name: _______________  Address: _______________");
    lines.push("Witness 2 signature: _______________________  Name: _______________  Address: _______________");
  }

  return lines.join("\n");
}
