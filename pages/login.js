import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "../lib/auth";
import { AuthProvider } from "../lib/auth";

function LoginPageInner() {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else router.replace("/");
    } else {
      if (password.length < 6) { setError("Password must be at least 6 characters."); setSubmitting(false); return; }
      const { error } = await signUp(email, password, { data: { full_name: name } });
      if (error) setError(error.message);
      else setInfo("Account created! Check your email to confirm, then log in.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a1a" }}>
      <div style={{ color: "#555577", fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Head><title>Login — Nihongo Master</title></Head>
      <div style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 48, fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8 }}>日本語</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Nihongo Master</div>
            <div style={{ fontSize: 13, color: "#555577", marginTop: 4 }}>Learn Japanese — step by step</div>
          </div>

          {/* Card */}
          <div style={{ background: "#16213e", border: "1.5px solid #2d2d6a", borderRadius: 20, padding: 32 }}>
            {/* Mode toggle */}
            <div style={{ display: "flex", background: "#0a0a1a", borderRadius: 10, padding: 3, marginBottom: 28 }}>
              {["login", "register"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(""); setInfo(""); }}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: mode === m ? "#16213e" : "transparent", color: mode === m ? "#fff" : "#555577", fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer" }}>
                  {m === "login" ? "Log In" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && (
                <div>
                  <label style={{ fontSize: 12, color: "#8888aa", display: "block", marginBottom: 6 }}>Display Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #2d2d4a", background: "#0a0a1a", color: "#fff", fontSize: 14, outline: "none" }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: "#8888aa", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #2d2d4a", background: "#0a0a1a", color: "#fff", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8888aa", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #2d2d4a", background: "#0a0a1a", color: "#fff", fontSize: 14, outline: "none" }} />
              </div>

              {error && <div style={{ background: "#e74c3c22", border: "1px solid #e74c3c44", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e74c3c" }}>{error}</div>}
              {info && <div style={{ background: "#2ecc7122", border: "1px solid #2ecc7144", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2ecc71" }}>{info}</div>}

              <button type="submit" disabled={submitting}
                style={{ marginTop: 6, padding: "13px", borderRadius: 12, border: "none", background: submitting ? "#333355" : "#e74c3c", color: "#fff", fontSize: 15, fontWeight: 700, cursor: submitting ? "default" : "pointer" }}>
                {submitting ? "..." : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return <AuthProvider><LoginPageInner /></AuthProvider>;
}
