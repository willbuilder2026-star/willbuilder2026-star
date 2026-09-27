"use client";

import { useEffect, useState } from "react";
import { fetchWillData, JURISDICTION_LABELS } from "../../../lib/willData";
import { buildWillText, buildWillSections, openingLines } from "../../../lib/willText";
import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";
import { btn, btnSmall } from "../../../components/styles";

function Document({ willId }) {
  const [text, setText] = useState("");
  const [built, setBuilt] = useState(null); // { jurisdiction, name, sections }
  const [copied, setCopied] = useState(false);
  const [makingPdf, setMakingPdf] = useState(false);

  useEffect(() => {
    fetchWillData(willId).then((data) => {
      setText(buildWillText(data.will?.jurisdiction, data));
      setBuilt({
        jurisdiction: data.will?.jurisdiction,
        name: data.about?.full_name || "",
        opening: openingLines(data.about),
        sections: buildWillSections(data.will?.jurisdiction, data),
      });
    });
  }, [willId]);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function downloadTxt() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-will-draft.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPdf() {
    setMakingPdf(true);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const margin = 56;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 15;
    const jurLabel = JURISDICTION_LABELS[built.jurisdiction] || built.jurisdiction;

    // ---- Cover page: centered horizontally AND vertically ----
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.text("LAST WILL AND TESTAMENT", pageWidth / 2, pageHeight / 2 - 36, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(15);
    doc.text(`(${jurLabel})`, pageWidth / 2, pageHeight / 2 - 6, { align: "center" });
    doc.setFontSize(13);
    doc.text(`This is the last Will and Testament of ${built.name}`, pageWidth / 2, pageHeight / 2 + 26, { align: "center" });

    // ---- Content pages ----
    doc.addPage();
    let y = margin;

    function runningHeading() {
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.text("LAST WILL AND TESTAMENT", pageWidth / 2, y, { align: "center" });
      y += 18;
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text(`(${jurLabel})`, pageWidth / 2, y, { align: "center" });
      y += 16;
      doc.text(`This is the last Will and Testament of ${built.name}`, pageWidth / 2, y, { align: "center" });
      y += 26;
    }
    runningHeading();

    function ensureSpace(extra = 0) {
      if (y + extra > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    }

    // opening lines (born / address), left-aligned under the centered heading
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    built.opening.slice(1).forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 10;

    built.sections.forEach((s) => {
      if (s.type === "para" && s.text === "") {
        y += lineHeight * 0.6;
        return;
      }
      if (s.type === "heading") {
        ensureSpace(lineHeight * 2);
        y += 8;
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.splitTextToSize(s.text, maxWidth).forEach((line) => {
          ensureSpace(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });
        y += 2;
      } else if (s.type === "bullet") {
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        const bulletIndent = 16;
        const wrapped = doc.splitTextToSize(s.text, maxWidth - bulletIndent);
        wrapped.forEach((line, i) => {
          ensureSpace(lineHeight);
          if (i === 0) doc.text("•", margin, y);
          doc.text(line, margin + bulletIndent, y);
          y += lineHeight;
        });
      } else {
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.splitTextToSize(s.text, maxWidth).forEach((line) => {
          ensureSpace(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });
      }
    });

    doc.save("my-will-draft.pdf");
    setMakingPdf(false);
  }

  if (!text) return <p>Building your document…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: "#7a7266" }}>
        This is a first draft built from your answers, for {JURISDICTION_LABELS[built?.jurisdiction] || built?.jurisdiction}.
        Read it carefully — if anything looks wrong, go back and fix that stage rather than editing this text
        directly, so your answers stay in sync.
      </p>
      <pre
        style={{
          background: "#faf7f1",
          border: "1px solid #e3d9c8",
          borderRadius: 10,
          padding: 18,
          fontSize: 13,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          maxHeight: 420,
          overflowY: "auto",
          fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        {text}
      </pre>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button type="button" style={btn} onClick={downloadPdf} disabled={makingPdf}>
          {makingPdf ? "Building PDF…" : "Download PDF"}
        </button>
        <button type="button" style={btnSmall} onClick={copy}>
          {copied ? "Copied ✓" : "Copy text"}
        </button>
        <button type="button" style={btnSmall} onClick={downloadTxt}>
          Download .txt
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: "#7a7266", marginTop: 12 }}>
        The PDF opens with a title page, then the full document with dates shown UK-style (DD/MM/YYYY) and each
        list bulleted — it's for printing and signing (see the next stage), not a substitute for the physical,
        signed paper original once witnessed.
      </p>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <WillStageShell>
      {(willId) => (
        <WillPageFrame willId={willId} current={13} desc="Your draft Will document, generated from everything you've entered." nextLabel="Continue to Stage 14: Signing">
          <Document willId={willId} />
        </WillPageFrame>
      )}
    </WillStageShell>
  );
}
