"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { isValidUKPostcode, normalisePostcode } from "../../lib/postcode";
import WillStageShell from "../../components/WillStageShell";
import WillPageFrame from "../../components/WillPageFrame";
import { input, label, btn } from "../../components/styles";

function AboutForm({ willId, userId, onDirtyChange }) {
  const [loadingRow, setLoadingRow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    address: "",
    postcode: "",
    marital_status: "single",
  });

  useEffect(() => {
    loadAbout();
  }, [willId]);

  async function loadAbout() {
    setLoadingRow(true);
    const { data, error } = await supabase.from("will_about").select("*").eq("will_id", willId).maybeSingle();
    if (!error && data) {
      setForm({
        full_name: data.full_name || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
        postcode: data.postcode || "",
        marital_status: data.marital_status || "single",
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

    if (form.postcode && !isValidUKPostcode(form.postcode)) {
      setPostcodeError("That doesn't look like a valid UK postcode — check it and try again.");
      return;
    }
    setPostcodeError("");

    const { error } = await supabase.from("will_about").upsert(
      {
        will_id: willId,
        user_id: userId,
        full_name: form.full_name,
        date_of_birth: form.date_of_birth || null,
        address: form.address,
        postcode: form.postcode ? normalisePostcode(form.postcode) : null,
        marital_status: form.marital_status,
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
      <label style={label}>Full legal name</label>
      <input style={input} type="text" value={form.full_name} onChange={(e) => update({ full_name: e.target.value })} />

      <label style={label}>Date of birth</label>
      <input style={input} type="date" value={form.date_of_birth} onChange={(e) => update({ date_of_birth: e.target.value })} />

      <label style={label}>Home address (excluding postcode)</label>
      <textarea style={{ ...input, minHeight: 70 }} value={form.address} onChange={(e) => update({ address: e.target.value })} />

      <label style={label}>Postcode</label>
      <input
        style={{ ...input, maxWidth: 160, textTransform: "uppercase" }}
        type="text"
        value={form.postcode}
        onChange={(e) => update({ postcode: e.target.value })}
        onBlur={(e) => {
          if (e.target.value) update({ postcode: normalisePostcode(e.target.value) });
        }}
        placeholder="e.g. OL6 7RB"
      />
      {postcodeError && <p style={{ marginTop: -10, marginBottom: 14, fontSize: 13, color: "#a8541f" }}>{postcodeError}</p>}

      <label style={label}>Marital status</label>
      <select style={input} value={form.marital_status} onChange={(e) => update({ marital_status: e.target.value })}>
        <option value="single">Single</option>
        <option value="married">Married</option>
        <option value="civil_partnership">Civil partnership</option>
        <option value="divorced">Divorced</option>
        <option value="widowed">Widowed</option>
      </select>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={btn} type="submit">
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
      {message && !saved && <p style={{ marginTop: 12, fontSize: 13, color: "#a8541f" }}>{message}</p>}
    </form>
  );
}

function AboutPageInner({ willId, userId }) {
  const [dirty, setDirty] = useState(false);
  return (
    <WillPageFrame
      willId={willId}
      current={1}
      desc="The same core details are used for whichever jurisdiction you picked, so this is only entered once."
      unsaved={dirty}
    >
      <AboutForm willId={willId} userId={userId} onDirtyChange={setDirty} />
    </WillPageFrame>
  );
}

export default function AboutPage() {
  return <WillStageShell base="./">{(willId, userId) => <AboutPageInner willId={willId} userId={userId} />}</WillStageShell>;
}
