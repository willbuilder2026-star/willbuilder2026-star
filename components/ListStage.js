"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { input, label, btnSmall, rowItem } from "./styles";

// Generic "add / list / delete" form for a Supabase table keyed by will_id.
// fields: [{ key, label, type: "text"|"date"|"textarea"|"select", options?: [[value,label],...], default? }]
export default function ListStage({ willId, userId, table, fields, heading, emptyLabel = "Nothing added yet." }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.default ?? ""]));
  const [form, setForm] = useState(blank());

  useEffect(() => {
    if (willId) load();
  }, [willId]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("will_id", willId)
      .order("created_at", { ascending: true });
    if (!error) setRows(data || []);
    setLoading(false);
  }

  async function addRow(e) {
    e.preventDefault();
    setError("");
    const payload = { will_id: willId, user_id: userId };
    for (const f of fields) payload[f.key] = form[f.key] || null;
    const { error } = await supabase.from(table).insert(payload);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(blank());
    load();
  }

  async function removeRow(id) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) load();
  }

  function displayValue(f, row) {
    const v = row[f.key];
    if (f.type === "select" && f.options) {
      const found = f.options.find(([val]) => val === v);
      return found ? found[1] : v;
    }
    return v;
  }

  return (
    <div style={{ marginBottom: 22 }}>
      {heading && <h3 style={{ fontSize: 15, marginBottom: 8 }}>{heading}</h3>}

      {loading ? (
        <p style={{ fontSize: 13.5, color: "#7a7266" }}>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ fontSize: 13.5, color: "#7a7266" }}>{emptyLabel}</p>
      ) : (
        rows.map((row) => (
          <div key={row.id} style={rowItem}>
            <div>
              {fields.map((f) => (
                <div key={f.key} style={{ marginBottom: 2 }}>
                  <strong>{f.label}:</strong> {displayValue(f, row) || "—"}
                </div>
              ))}
            </div>
            <button type="button" style={btnSmall} onClick={() => removeRow(row.id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <form onSubmit={addRow} style={{ marginTop: 14, background: "#faf7f1", border: "1px solid #e3d9c8", borderRadius: 10, padding: 14 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={label}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                style={{ ...input, minHeight: 60 }}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : f.type === "select" ? (
              <select
                style={input}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              >
                {f.options.map(([val, lbl]) => (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                ))}
              </select>
            ) : (
              <input
                style={input}
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <button type="submit" style={btnSmall}>
          + Add
        </button>
        {error && <p style={{ marginTop: 10, fontSize: 13, color: "#a8541f" }}>{error}</p>}
      </form>
    </div>
  );
}
