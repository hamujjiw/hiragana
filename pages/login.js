import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth, AuthProvider } from "../lib/auth";
import Mascot from "../components/Mascot";

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
      else setInfo("Akun berhasil dibuat! Cek email untuk konfirmasi, lalu login.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4FB" }}>
      <div style={{ color: "#8BADD4", fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Head><title>Login</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F4FB; font-family: 'DM Sans', sans-serif; }
        input { font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
        input:focus { outline: none; border-color: #1E88E5 !important; box-shadow: 0 0 0 3px rgba(30,136,229,0.1); }
        @keyframes floatUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: floatUp 0.45s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex" }}>
        {/* Left — navy panel */}
        <div style={{ flex: 1, background: "#0D2B5E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, left: -100, width: 360, height: 360, borderRadius: "50%", background: "rgba(30,136,229,0.07)" }} />
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(30,136,229,0.05)" }} />

          <div className="fade-in" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Mascot size={128} style={{ marginBottom: 28 }} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>日本語</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Belajar Jepang</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 260 }}>
              Dari hiragana hingga kalimat — semua terstruktur dan tersimpan untukmu.
            </div>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "◎", text: "Placement test otomatis" },
                { icon: "◈", text: "Progress tersimpan di cloud" },
                { icon: "⬡", text: "Quiz & flashcard interaktif" },
              ].map((f) => (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                  <span style={{ color: "#4DA8FF" }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: "#F0F4FB" }}>
          <div className="fade-in" style={{ width: "100%", maxWidth: 400 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0D2B5E", marginBottom: 6 }}>
                {mode === "login" ? "Selamat datang kembali" : "Buat akun baru"}
              </div>
              <div style={{ fontSize: 14, color: "#8BADD4" }}>
                {mode === "login" ? "Lanjutkan perjalanan belajarmu" : "Mulai belajar bahasa Jepang hari ini"}
              </div>
            </div>

            <div style={{ display: "flex", background: "#E3EDF8", borderRadius: 10, padding: 3, marginBottom: 28 }}>
              {["login", "register"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(""); setInfo(""); }}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: mode === m ? "#fff" : "transparent", color: mode === m ? "#0D2B5E" : "#8BADD4", fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer", transition: "all 0.2s", boxShadow: mode === m ? "0 1px 4px rgba(13,43,94,0.08)" : "none" }}>
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && (
                <div>
                  <label style={{ fontSize: 12, color: "#5A7BA8", display: "block", marginBottom: 6, fontWeight: 500 }}>Nama</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D0DFF0", background: "#fff", color: "#0D2B5E", fontSize: 14 }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: "#5A7BA8", display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D0DFF0", background: "#fff", color: "#0D2B5E", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#5A7BA8", display: "block", marginBottom: 6, fontWeight: 500 }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D0DFF0", background: "#fff", color: "#0D2B5E", fontSize: 14 }} />
              </div>

              {error && <div style={{ background: "#FEF0F0", border: "1px solid #F5C6C6", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#C0392B" }}>{error}</div>}
              {info && <div style={{ background: "#F0FAF5", border: "1px solid #A8DFC0", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#1E7A4A" }}>{info}</div>}

              <button type="submit" disabled={submitting}
                style={{ marginTop: 6, padding: "13px", borderRadius: 12, border: "none", background: submitting ? "#8BADD4" : "#1E88E5", color: "#fff", fontSize: 15, fontWeight: 700, cursor: submitting ? "default" : "pointer", transition: "background 0.2s" }}>
                {submitting ? "..." : mode === "login" ? "Masuk →" : "Buat Akun →"}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#8BADD4" }}>
              {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setInfo(""); }}
                style={{ color: "#1E88E5", cursor: "pointer", fontWeight: 600 }}>
                {mode === "login" ? "Daftar sekarang" : "Masuk"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return <AuthProvider><LoginPageInner /></AuthProvider>;
}
