import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth, AuthProvider } from "../lib/auth";
import CatAvatar from "../components/CatAvatar";

const T = {
  navy: "#0D2B5E", blue: "#1E88E5", bluePale: "#E3EDF8", blueFaint: "#F0F4FB",
  text: "#0D2B5E", textMid: "#5A7BA8", textLight: "#8BADD4",
  border: "#D0DFF0", white: "#FFFFFF", green: "#1D9E75",
  red: "#E53935", redPale: "#FEF0F0",
};

function LoginPageInner() {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login");
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
    setError(""); setInfo(""); setSubmitting(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else router.replace("/");
    } else {
      if (password.length < 6) { setError("Password minimal 6 karakter."); setSubmitting(false); return; }
      const { error } = await signUp(email, password, { data: { full_name: name } });
      if (error) setError(error.message);
      else setInfo("Akun berhasil dibuat! Cek email lalu login.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.blueFaint }}>
      <div style={{ color: T.textLight, fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Head><title>Login — Nihongo Master</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.blueFaint}; font-family: 'DM Sans', sans-serif; }
        input { font-family: 'DM Sans', sans-serif; }
        input:focus { outline: none; border-color: ${T.blue} !important; box-shadow: 0 0 0 3px rgba(30,136,229,0.1); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease; }
        .input-field {
          width: 100%; padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid ${T.border}; background: ${T.white};
          color: ${T.text}; font-size: 15px; transition: border-color 0.2s;
        }
        .submit-btn {
          width: 100%; padding: 13px; border-radius: 12px; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: opacity 0.2s;
        }
        .submit-btn:active { opacity: 0.85; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: T.blueFaint,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}>
        <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <CatAvatar catLevel={1} mood="happy" size={80} animate={true}/>
            <div style={{ fontSize: 11, color: T.textLight, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 10, marginBottom: 4 }}>
              日本語
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.navy }}>Nihongo Master</div>
            <div style={{ fontSize: 13, color: T.textLight, marginTop: 4 }}>Belajar Jepang, mulai dari sekarang</div>
          </div>

          {/* Card */}
          <div style={{ background: T.white, borderRadius: 20, border: `1px solid ${T.border}`, padding: "24px 20px", boxShadow: "0 4px 24px rgba(13,43,94,0.06)" }}>

            {/* Toggle */}
            <div style={{ display: "flex", background: T.blueFaint, borderRadius: 10, padding: 3, marginBottom: 22 }}>
              {["login", "register"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(""); setInfo(""); }}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                    background: mode === m ? T.white : "transparent",
                    color: mode === m ? T.navy : T.textLight,
                    fontSize: 13, fontWeight: mode === m ? 600 : 400,
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: mode === m ? "0 1px 4px rgba(13,43,94,0.08)" : "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mode === "register" && (
                <div>
                  <label style={{ fontSize: 12, color: T.textMid, display: "block", marginBottom: 5, fontWeight: 500 }}>Nama</label>
                  <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu"/>
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: T.textMid, display: "block", marginBottom: 5, fontWeight: 500 }}>Email</label>
                <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kamu@email.com" required/>
              </div>
              <div>
                <label style={{ fontSize: 12, color: T.textMid, display: "block", marginBottom: 5, fontWeight: 500 }}>Password</label>
                <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required/>
              </div>

              {error && (
                <div style={{ background: T.redPale, border: `1px solid ${T.red}33`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: T.red }}>
                  {error}
                </div>
              )}
              {info && (
                <div style={{ background: "#F0FAF5", border: "1px solid #A8DFC0", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: T.green }}>
                  {info}
                </div>
              )}

              <button type="submit" disabled={submitting} className="submit-btn"
                style={{ marginTop: 4, background: submitting ? T.textLight : T.navy, color: T.white }}>
                {submitting ? "..." : mode === "login" ? "Masuk →" : "Buat Akun →"}
              </button>
            </form>

            {/* Divider - siap untuk Google OAuth */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }}/>
              <span style={{ fontSize: 11, color: T.textLight }}>atau</span>
              <div style={{ flex: 1, height: 1, background: T.border }}/>
            </div>

            {/* Google OAuth button */}
            <button onClick={async () => {
              const { supabase } = await import("../lib/supabase");
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/` }
              });
            }} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              border: `1.5px solid ${T.border}`, background: T.white,
              color: T.text, fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s",
            }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: T.textLight }}>
              {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setInfo(""); }}
                style={{ color: T.blue, cursor: "pointer", fontWeight: 600 }}>
                {mode === "login" ? "Daftar" : "Masuk"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return <AuthProvider><LoginPageInner/></AuthProvider>;
}
