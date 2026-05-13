import { useState, useEffect } from "react";

export default function XPToast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      opacity: visible ? 1 : 0,
      transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
      background: "#0D2B5E", color: "#fff",
      padding: "10px 20px", borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      boxShadow: "0 4px 16px rgba(13,43,94,0.25)",
      pointerEvents: "none", zIndex: 9999,
      whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}
