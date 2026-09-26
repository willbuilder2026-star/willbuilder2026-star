"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const card = {
  maxWidth: 420,
  margin: "60px auto",
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
  width: "100%",
  padding: "11px",
  background: "#9c6b32",
  color: "#fff8ee",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};
const label = { fontSize: 13, fontWeight: 600, color: "#7a7266" };

export default function Home() {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("signup"); // signup | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [wills, setWills] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadWills();
  }, [session]);

  async function loadWills() {
    const { data, error } = await supabase.from("wills").select("*").order("created_at", { ascending: false });
    if (!error) setWills(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "Account created. Check your email if confirmation is required, otherwise you're signed in below.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "");
    }
    setLoading(false);
  }

  async function createDraftWill() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;
    const { error } = await supabase.from("wills").insert({
      user_id: user.id,
      jurisdiction: "england_wales",
      status: "draft",
    });
    if (error) setMessage(error.message);
    else loadWills();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setWills([]);
  }

  if (session) {
    return (
      <div style={card}>
        <div style={{ fontSize: 13, color: "#7a7266", marginBottom: 8 }}>Signed in as</div>
        <div style={{ fontWeight: 700, marginBottom: 20 }}>{session.user.email}</div>

        <button style={btn} onClick={createDraftWill}>+ Create a draft Will row</button>

        <div style={{ marginTop: 24 }}>
          <div style={label}>YOUR WILLS TABLE (live from Supabase)</div>
          {wills.length === 0 && <p style={{ color: "#7a7266", fontSize: 14 }}>No rows yet — click the button above.</p>}
          {wills.map((w) => (
            <div key={w.id} style={{ border: "1px solid #e3d9c8", borderRadius: 8, padding: 10, marginTop: 8, fontSize: 13 }}>
              <div><b>id:</b> {w.id}</div>
              <div><b>jurisdiction:</b> {w.jurisdiction}</div>
              <div><b>status:</b> {w.status}</div>
              <div><b>created:</b> {new Date(w.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <button style={{ ...btn, background: "#f6e6dc", color: "#a8541f", marginTop: 24 }} onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={card}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Draft My Will</h1>
      <p style={{ color: "#7a7266", fontSize: 14, marginBottom: 20 }}>
        Real Supabase auth test. Creating an account here actually creates a row in your project's <code>auth.users</code> table.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button
          onClick={() => setMode("signup")}
          style={{ ...btn, background: mode === "signup" ? "#9c6b32" : "#f1e4d0", color: mode === "signup" ? "#fff8ee" : "#7a5225" }}
        >
          Sign up
        </button>
        <button
          onClick={() => setMode("login")}
          style={{ ...btn, background: mode === "login" ? "#9c6b32" : "#f1e4d0", color: mode === "login" ? "#fff8ee" : "#7a5225" }}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label style={label}>Email</label>
        <input style={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label style={label}>Password</label>
        <input style={input} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={btn} type="submit" disabled={loading}>
          {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>

      {message && <p style={{ marginTop: 14, fontSize: 13, color: "#a8541f" }}>{message}</p>}
    </div>
  );
}
