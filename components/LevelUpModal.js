export default function LevelUpModal({ show, catLevel, onClose }) {
  if (!show) return null;
  const stage = catLevel <= 10 ? "Kitten" : catLevel <= 20 ? "Remaja" : "Adult Cat";
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(13,43,94,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9998, padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "36px 28px",
        textAlign: "center", maxWidth: 320, width: "100%",
        boxShadow: "0 20px 60px rgba(13,43,94,0.2)",
        animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)",
      }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes popIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0D2B5E", marginBottom: 6 }}>
          Level Up!
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#1E88E5", marginBottom: 8 }}>
          Level {catLevel}
        </div>
        <div style={{ fontSize: 14, color: "#8BADD4", marginBottom: 24 }}>
          Kucingmu sekarang <b style={{ color: "#0D2B5E" }}>{stage}</b>!
        </div>
        <button onClick={onClose} style={{
          padding: "12px 32px", borderRadius: 12, border: "none",
          background: "#0D2B5E", color: "#fff", fontSize: 14,
          fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          width: "100%",
        }}>
          Lanjutkan Belajar →
        </button>
      </div>
    </div>
  );
}
