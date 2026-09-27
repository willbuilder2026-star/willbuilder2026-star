"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { card } from "./styles";

function Inner({ children }) {
  const params = useSearchParams();
  const willId = params.get("id");
  const [session, setSession] = useState(undefined); // undefined = still loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

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

  return children(willId, session.user.id);
}

// Handles the loading / logged-out / no-will-id states shared by every
// stage page, then calls children(willId, userId) once ready.
export default function WillStageShell({ children }) {
  return (
    <Suspense fallback={<div style={card}>Loading…</div>}>
      <Inner>{children}</Inner>
    </Suspense>
  );
}
