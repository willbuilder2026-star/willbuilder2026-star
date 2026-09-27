"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";
import { input, label, btn } from "../../../components/styles";

function PartnerForm({ willId, userId, onDirtyChange }) {
  const [loadingRow, setLoadingRow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ has_partner: false, partner_name: "", partner_date_of_birth: "" });

  useEffect(() => {
    load();
  }, [willId]);

  async function load() {
    setLoadingRow(true);
    const { data, error } = await supabase.from("will_partner").select("*").eq("will_id", willId).maybeSingle();
    if (!error && data) {
      setForm({
        has_partner: !!data.has_partner,
        partner_name: data.partner_name || "",
        partner_date_of_birth: data.partner_date_of_birth || "",
      });
    }
    setLoadingRow(false);
    onDirtyChange(false);
  }

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
    onDirtyChange(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.from("will_partner").upsert(
      {
        will_id: willId,
        user_id: userId,
        has_partner: form.has_partner,
        partner_name: form.has_partner ? form.partner_name : null,
        partner_date_of_birth: form.has_partner ? form.partner_date_of_birth || null : null,
      },
      { onConflict: "will_id" }
    );
    if (error) {
      setMessage(error.message);
    } else {
      setSaved(true);
      onDirtyChange(false);
      setMessage("Saved.");
      setTimeout(() => setSaved(false), 1800);
    }
  }

  if (loadingRow) return <p>Loading your answers…</p>;

  return (
    <form onSubmit={handleSave}>
      <label style={label}>Do you have a partner?</label>
      <select style={input} value={form.has_partner ? "yes" : "no"} onChange={(e) => update({ has_partner: e.target.value === "yes" })}>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      {form.has_partner && (
        <>
          <label style={label}>Partner's full name</label>
          <input style={input} type="text" value={form.partner_name} onChange={(e) => update({ partner_name: e.target.value })} />

          <label style={label}>Partner's date of birth</label>
          <input style={input} type="date" value={form.partner_date_of_birth} onChange={(e) => update({ partner_date_of_birth: e.target.value })} />
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

function PartnerPageInner({ willId, userId }) {
  const [dirty, setDirty] = useState(false);
  return (
    <WillPageFrame willId={willId} current={2} unsaved={dirty}>
      <PartnerForm willId={willId} userId={userId} onDirtyChange={setDirty} />
    </WillPageFrame>
  );
}

export default function PartnerPage() {
  return <WillStageShell>{(willId, userId) => <PartnerPageInner willId={willId} userId={userId} />}</WillStageShell>;
}
