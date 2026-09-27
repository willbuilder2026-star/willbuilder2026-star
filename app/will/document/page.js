"use client";

import { useEffect, useState } from "react";
import { fetchWillData, JURISDICTION_LABELS } from "../../../lib/willData";
import { buildWillText } from "../../../lib/willText";
import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import { card, btn, btnSmall } from "../../../components/styles";

function Document({ willId }) {
  const [text, setText] = useState("");
  const [jurisdiction, setJurisdiction] = useState(null);
  const [copied, setCopied] = useState(false);
  const [makingPdf, setMakingPdf] = useState(false);

  useEffect(() => {
    fetchWillData(willId).then((data) => {
      setJurisdiction(data.will?.jurisdiction);
      setText(buildWillText(data.will?.jurisdiction, data));
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

    doc.setFont("times", "normal");
    doc.setFontSize(11);

    let y = margin;
    const rawLines = text.split("\n");

    rawLines.forEach((rawLine) => {
      const isHeading = /^[0-9]+\.\s/.test(rawLine) || rawLine === rawLine.toUpperCase();
      doc.setFont("times", isHeading && rawLine.trim() ? "bold" : "normal");

      const wrapped = doc.splitTextToSize(rawLine || " ", maxWidth);
      wrapped.forEach((line) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    });

    doc.save("my-will-draft.pdf");
    setMakingPdf(false);
  }

  if (!text) return <p>Building your document…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: "#7a7266" }}>
        This is a first draft built from your answers, for {JURISDICTION_LABELS[jurisdiction] || jurisdiction}. Read
        it carefully — if anything looks wrong, go back and fix that stage rather than editing this text directly,
        so your answers stay in sync.
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
        The PDF is for printing and signing (see the next stage) — it isn't a substitute for the physical, signed
        paper original once you've witnessed it.
      </p>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <WillStageShell>
      {(willId) => (
        <div style={card}>
          <StageHeader n={13} title="Document Pack" desc="Your draft Will document, generated from everything you've entered." />
          <Document willId={willId} />
          <StageNav backHref={`../review/?id=${willId}`} nextHref={`../signing/?id=${willId}`} nextLabel="Continue to signing →" />
        </div>
      )}
    </WillStageShell>
  );
}
