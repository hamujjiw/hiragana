export default function Mascot({ size = 48, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ imageRendering: "pixelated", ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Basket */}
      <rect x="5" y="22" width="22" height="7" rx="3" fill="#8B5E3C" />
      <rect x="6" y="23" width="20" height="2" fill="#A0714F" />
      <rect x="7" y="25" width="3" height="1" fill="#B8956A" />
      <rect x="11" y="25" width="3" height="1" fill="#B8956A" />
      <rect x="15" y="25" width="3" height="1" fill="#B8956A" />
      <rect x="19" y="25" width="3" height="1" fill="#B8956A" />
      {/* Blanket */}
      <rect x="6" y="21" width="20" height="3" fill="#B8D4E8" />
      <rect x="8" y="21" width="2" height="3" fill="#FFFFFF" />
      <rect x="12" y="21" width="2" height="3" fill="#FFFFFF" />
      <rect x="16" y="21" width="2" height="3" fill="#FFFFFF" />
      <rect x="20" y="21" width="2" height="3" fill="#FFFFFF" />
      {/* Body - curled */}
      <rect x="8" y="14" width="16" height="10" rx="5" fill="#9B9B9B" />
      <rect x="9" y="13" width="14" height="10" rx="4" fill="#ABABAB" />
      {/* Stripes */}
      <rect x="11" y="13" width="2" height="5" fill="#787878" opacity="0.5" />
      <rect x="15" y="13" width="2" height="6" fill="#787878" opacity="0.5" />
      <rect x="19" y="14" width="2" height="5" fill="#787878" opacity="0.5" />
      {/* Head */}
      <rect x="7" y="10" width="12" height="10" rx="4" fill="#ABABAB" />
      {/* Ears */}
      <rect x="7" y="7" width="4" height="5" rx="1" fill="#ABABAB" />
      <rect x="8" y="8" width="2" height="3" fill="#D4A0A0" />
      <rect x="13" y="6" width="4" height="5" rx="1" fill="#9B9B9B" />
      <rect x="14" y="7" width="2" height="3" fill="#D4A0A0" />
      {/* Face - sleeping */}
      <rect x="9" y="14" width="4" height="1" fill="#555555" rx="1" />
      <rect x="15" y="14" width="4" height="1" fill="#555555" rx="1" />
      {/* Nose */}
      <rect x="12" y="16" width="2" height="1" fill="#E8A0A0" />
      {/* Mouth */}
      <rect x="11" y="17" width="1" height="1" fill="#888888" />
      <rect x="14" y="17" width="1" height="1" fill="#888888" />
      {/* White chest */}
      <rect x="9" y="17" width="6" height="4" rx="2" fill="#E0E0E0" />
      {/* Paws */}
      <rect x="8" y="20" width="4" height="3" rx="2" fill="#E0E0E0" />
      <rect x="13" y="21" width="3" height="2" rx="1" fill="#E0E0E0" />
      {/* Tail */}
      <rect x="20" y="18" width="4" height="3" rx="2" fill="#9B9B9B" />
      <rect x="22" y="16" width="3" height="3" rx="1" fill="#ABABAB" />
    </svg>
  );
}
