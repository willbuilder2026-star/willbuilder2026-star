"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const card = {
  maxWidth: 520,
  margin: "40px auto",
  background: "#fff",
  border: "1px solid #e3d9c8",
  borderRadius: 14,
  padding: 28,
};
const input = {
  width: "100%",
  padding: "10px 12px",
  marginTop: 6,
  marginBottom: 14,
  border: "1px solid #e3d9c8",
  borderRadius: 8,
  fontSize: 15,
  boxSizing: "border-box",
};
const btn = {
  padding: "11px 22px",
  background: "#9c6b32",
  color: "#fff8ee",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};
const label = { fontSize: 13, fontWeight: 600, color: "#7a7266", display: "block" };

function WillStage1() {
  const params = useSearchParams();
  const willId = params.get("id");

  const [session, setSession] = useState(undefined); // undefined = loading
  const [loadingRow, setLoadingRow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    address: "",
    marital_status: "single",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    if (session && willId) loadAbout();
  }, [session, willId]);

  async function loadAbout() {
    setLoadingRow(true);
    const { data, error } = await supabase
      .from("will_about")
      .select("*")
      .eq("will_id", willId)
      .maybeSingle();
    if (!error && data) {
      setForm({
        full_name: data.full_name || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
        marital_status: data.marital_status || "single",
      });
    }
    setLoadingRow(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user || !willId) return;

    const { error } = await supabase.from("will_about").upsert(
      {
        will_id: willId,
        user_id: user.id,
        full_name: form.full_name,
        date_of_birth: form.date_of_birth || null,
        address: form.address,
        marital_status: form.marital_status,
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

  if (session === undefined) {
    return <div style={card}>Loading…</div>;
  }

  if (!session) {
    return (
      <div style={card}>
        <p>You need to be logged in to answer these questions.</p>
        <a href="../app/" style={{ color: "#7a5225" }}>
          Go to log in →
        </a>
      </div>
    );
  }

  if (!willId) {
    return (
      <div style={card}>
        <p>No Will selected.</p>
        <a href="../app/" style={{ color: "#7a5225" }}>
          ← Back to your Wills
        </a>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: "#7a5225", fontWeight: 700 }}>
        Stage 1 of 15
      </div>
      <h1 style={{ fontSize: 22, marginTop: 6 }}>About You</h1>
      <p style={{ color: "#7a7266", fontSize: 14, marginTop: 6, marginBottom: 20 }}>
        The same core details are used for whichever jurisdiction you picked, so this is only entered once.
      </p>

      {loadingRow ? (
        <p>Loading your answers…</p>
      ) : (
        <form onSubmit={handleSave}>
          <label style={label}>Full legal name</label>
          <input
            style={input}
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />

          <label style={label}>Date of birth</label>
          <input
            style={input}
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />

          <label style={label}>Home address</label>
          <textarea
            style={{ ...input, minHeight: 70 }}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <label style={label}>Marital status</label>
          <select
            style={input}
            value={form.marital_status}
            onChange={(e) => setForm({ ...form, marital_status: e.target.value })}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="civil_partnership">Civil partnership</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <a href="../app/" style={{ color: "#7a5225", fontSize: 14 }}>
              ← Back to your Wills
            </a>
            <button style={btn} type="submit">
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
          {message && !saved && <p style={{ marginTop: 12, fontSize: 13, color: "#a8541f" }}>{message}</p>}
        </form>
      )}
    </div>
  );
}

export default function WillPage() {
  return (
    <Suspense fallback={<div style={card}>Loading…</div>}>
      <WillStage1 />
    </Suspense>
  );
}
