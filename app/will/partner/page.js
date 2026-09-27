"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

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

function WillStage2() {
  const params = useSearchParams();
  const willId = params.get("id");

  const [session, setSession] = useState(undefined); // undefined = loading
  const [loadingRow, setLoadingRow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    has_partner: false,
    partner_name: "",
    partner_date_of_birth: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    if (session && willId) loadPartner();
  }, [session, willId]);

  async function loadPartner() {
    setLoadingRow(true);
    const { data, error } = await supabase
      .from("will_partner")
      .select("*")
      .eq("will_id", willId)
      .maybeSingle();
    if (!error && data) {
      setForm({
        has_partner: !!data.has_partner,
        partner_name: data.partner_name || "",
        partner_date_of_birth: data.partner_date_of_birth || "",
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

    const { error } = await supabase.from("will_partner").upsert(
      {
        will_id: willId,
        user_id: user.id,
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
        <a href="../../app/" style={{ color: "#7a5225" }}>
          Go to log in →
        </a>
      </div>
    );
  }

  if (!willId) {
    return (
      <div style={card}>
        <p>No Will selected.</p>
        <a href="../../app/" style={{ color: "#7a5225" }}>
          ← Back to your Wills
        </a>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: "#7a5225", fontWeight: 700 }}>
        Stage 2 of 15
      </div>
      <h1 style={{ fontSize: 22, marginTop: 6 }}>Partner &amp; Family</h1>
      <p style={{ color: "#7a7266", fontSize: 14, marginTop: 6, marginBottom: 20 }}>
        Tell us about your spouse, civil partner, or long-term partner, if you have one.
      </p>

      {loadingRow ? (
        <p>Loading your answers…</p>
      ) : (
        <form onSubmit={handleSave}>
          <label style={label}>Do you have a partner?</label>
          <select
            style={input}
            value={form.has_partner ? "yes" : "no"}
            onChange={(e) => setForm({ ...form, has_partner: e.target.value === "yes" })}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {form.has_partner && (
            <>
              <label style={label}>Partner's full name</label>
              <input
                style={input}
                type="text"
                value={form.partner_name}
                onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
              />

              <label style={label}>Partner's date of birth</label>
              <input
                style={input}
                type="date"
                value={form.partner_date_of_birth}
                onChange={(e) => setForm({ ...form, partner_date_of_birth: e.target.value })}
              />
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <a href={`../?id=${willId}`} style={{ color: "#7a5225", fontSize: 14 }}>
              ← Back to Stage 1
            </a>
            <button style={btn} type="submit">
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
          {message && !saved && <p style={{ marginTop: 12, fontSize: 13, color: "#a8541f" }}>{message}</p>}

          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #e3d9c8", textAlign: "right" }}>
            <a
              href={`../children/?id=${willId}`}
              style={{ color: "#7a5225", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              Continue to Children &amp; Guardians →
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default function WillPartnerPage() {
  return (
    <Suspense fallback={<div style={card}>Loading…</div>}>
      <WillStage2 />
    </Suspense>
  );
}
