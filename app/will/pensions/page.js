"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import { card, input, label, btn } from "../../../components/styles";

function PensionsForm({ willId, userId }) {
  const [loadingRow, setLoadingRow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ simple_mode: true, provider: "", notes: "" });

  useEffect(() => {
    load();
  }, [willId]);

  async function load() {
    setLoadingRow(true);
    const { data, error } = await supabase.from("pensions").select("*").eq("will_id", willId).maybeSingle();
    if (!error && data) {
      setForm({
        simple_mode: data.simple_mode,
        provider: data.provider || "",
        notes: data.notes || "",
      });
    }
    setLoadingRow(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.from("pensions").upsert(
      {
        will_id: willId,
        user_id: userId,
        simple_mode: form.simple_mode,
        provider: form.simple_mode ? null : form.provider,
        notes: form.simple_mode ? null : form.notes,
      },
      { onConflict: "will_id" }
    );
    if (error) {
      setMessage(error.message);
    } else {
      setSaved(true);
      setMessage("Saved.");
      setTimeout(() => setSaved(false), 1800);
    }
  }

  if (loadingRow) return <p>Loading your answers…</p>;

  return (
    <form onSubmit={handleSave}>
      <label style={label}>How do you want to handle pensions?</label>
      <select
        style={input}
        value={form.simple_mode ? "simple" : "detailed"}
        onChange={(e) => setForm({ ...form, simple_mode: e.target.value === "simple" })}
      >
        <option value="simple">Keep it simple — most pensions pass via a separate nomination form, not your Will</option>
        <option value="detailed">I want to add some notes about my pension(s) for reference</option>
      </select>

      <p style={{ fontSize: 13, color: "#7a7266", marginTop: -6, marginBottom: 14 }}>
        Most UK pensions are paid at the pension provider's discretion to whoever you name on a separate
        "expression of wishes" or nomination form — they don't usually pass through your Will. It's worth
        checking your nomination is up to date directly with your provider(s).
      </p>

      {!form.simple_mode && (
        <>
          <label style={label}>Pension provider(s)</label>
          <input
            style={input}
            type="text"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          />

          <label style={label}>Notes</label>
          <textarea
            style={{ ...input, minHeight: 80 }}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={btn} type="submit">
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
      {message && !saved && <p style={{ marginTop: 12, fontSize: 13, color: "#a8541f" }}>{message}</p>}
    </form>
  );
}

export default function PensionsPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader n={6} title="Pensions & Death Benefits" />
          <PensionsForm willId={willId} userId={userId} />
          <StageNav backHref={`../property/?id=${willId}`} nextHref={`../gifts/?id=${willId}`} />
        </div>
      )}
    </WillStageShell>
  );
}
