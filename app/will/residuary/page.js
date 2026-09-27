"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";
import PersonPicker from "../../../components/PersonPicker";
import { input, label, btn, btnSmall, rowItem } from "../../../components/styles";

function ResiduaryForm({ willId, userId }) {
  const [loading, setLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [spouseFirst, setSpouseFirst] = useState(true);
  const [form, setForm] = useState({ name: "", share_percent: "", deceased: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, [willId]);

  async function load() {
    setLoading(true);
    const [{ data: rows }, { data: settings }] = await Promise.all([
      supabase.from("residuary_beneficiaries").select("*").eq("will_id", willId).order("created_at"),
      supabase.from("residuary_settings").select("*").eq("will_id", willId).maybeSingle(),
    ]);
    setBeneficiaries(rows || []);
    if (settings) setSpouseFirst(settings.spouse_first);
    setLoading(false);
  }

  async function saveSettings(nextValue) {
    setSpouseFirst(nextValue);
    await supabase.from("residuary_settings").upsert({ will_id: willId, user_id: userId, spouse_first: nextValue }, { onConflict: "will_id" });
  }

  async function addBeneficiary(e) {
    e.preventDefault();
    setMessage("");
    if (!form.name || form.share_percent === "") return;
    const { error } = await supabase.from("residuary_beneficiaries").insert({
      will_id: willId,
      user_id: userId,
      name: form.name,
      share_percent: Number(form.share_percent),
      deceased: form.deceased,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setForm({ name: "", share_percent: "", deceased: false });
    load();
  }

  async function removeBeneficiary(id) {
    await supabase.from("residuary_beneficiaries").delete().eq("id", id);
    load();
  }

  if (loading) return <p>Loading your answers…</p>;

  const total = beneficiaries.reduce((sum, b) => sum + Number(b.share_percent || 0), 0);
  const totalOk = Math.round(total * 100) / 100 === 100;

  return (
    <div>
      <label style={label}>If you have a partner, should they inherit everything first?</label>
      <select style={input} value={spouseFirst ? "yes" : "no"} onChange={(e) => saveSettings(e.target.value === "yes")}>
        <option value="yes">Yes — my partner inherits everything; the beneficiaries below only inherit if they don't survive me</option>
        <option value="no">No — split the residuary estate as set out below regardless</option>
      </select>

      <h3 style={{ fontSize: 15, marginTop: 24, marginBottom: 8 }}>Residuary beneficiaries</h3>
      <p style={{ fontSize: 13.5, color: "#7a7266", marginTop: -4 }}>
        Everything left over after debts, expenses, and the gifts you added earlier — split by percentage. Should add up to 100%.
      </p>

      {beneficiaries.length === 0 ? (
        <p style={{ fontSize: 13.5, color: "#7a7266" }}>No beneficiaries added yet.</p>
      ) : (
        beneficiaries.map((b) => (
          <div key={b.id} style={rowItem}>
            <div>
              <strong>{b.name}</strong> — {b.share_percent}%
              {b.deceased && <span style={{ color: "#a8541f" }}> (if they predecease me, their own children inherit instead)</span>}
            </div>
            <button type="button" style={btnSmall} onClick={() => removeBeneficiary(b.id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 700, color: totalOk ? "#3a7a4e" : "#a8541f" }}>
        Total: {total}% {totalOk ? "✓" : "— should add up to 100%"}
      </div>

      <form onSubmit={addBeneficiary} style={{ marginTop: 14, background: "#faf7f1", border: "1px solid #e3d9c8", borderRadius: 10, padding: 14 }}>
        <label style={label}>Beneficiary name</label>
        <PersonPicker willId={willId} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />

        <label style={label}>Share (%)</label>
        <input
          style={input}
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.share_percent}
          onChange={(e) => setForm({ ...form, share_percent: e.target.value })}
        />

        <label style={{ ...label, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <input type="checkbox" checked={form.deceased} onChange={(e) => setForm({ ...form, deceased: e.target.checked })} />
          Plan for this beneficiary predeceasing me (their share passes to their own children instead)
        </label>

        <button type="submit" style={{ ...btnSmall, marginTop: 10 }}>
          + Add beneficiary
        </button>
        {message && <p style={{ marginTop: 10, fontSize: 13, color: "#a8541f" }}>{message}</p>}
      </form>
    </div>
  );
}

export default function ResiduaryPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <WillPageFrame willId={willId} current={9} desc="Who gets what's left of your estate, once specific and charitable gifts are accounted for.">
          <ResiduaryForm willId={willId} userId={userId} />
        </WillPageFrame>
      )}
    </WillStageShell>
  );
}
