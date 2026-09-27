"use client";

import { useEffect, useState } from "react";
import { fetchWillData } from "../../../lib/willData";
import { buildWillText } from "../../../lib/willText";
import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import { card, btn, btnSmall } from "../../../components/styles";

function Document({ willId }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWillData(willId).then((data) => {
      setText(buildWillText(data.will?.jurisdiction, data));
    });
  }, [willId]);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-will-draft.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!text) return <p>Building your document…</p>;

  return (
    <div>
      <p style={{ fontSize: 13.5, color: "#7a7266" }}>
        This is a first draft built from your answers. Read it carefully — if anything looks wrong, go back and fix
        that stage rather than editing this text directly, so your answers stay in sync.
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
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button type="button" style={btnSmall} onClick={copy}>
          {copied ? "Copied ✓" : "Copy text"}
        </button>
        <button type="button" style={btnSmall} onClick={download}>
          Download .txt
        </button>
      </div>
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
