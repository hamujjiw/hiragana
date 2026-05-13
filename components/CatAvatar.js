import { getCatStage } from "../lib/xp";

export default function CatAvatar({ catLevel = 1, mood = "happy", size = 160, animate = true }) {
  const stage = getCatStage(catLevel);

  const configs = {
    kitten: {
      bodyColor: "#C8A882", bodyShade: "#B09060", bodyLight: "#E8D4B8",
      innerEar: "#F0A0A0", nosePink: "#F08080",
      eyeColor: "#2A5C8A", pupil: "#0D2B5E",
      accessory: null,
    },
    teen: {
      bodyColor: "#9B7A5A", bodyShade: "#7A5A3A", bodyLight: "#C8A882",
      innerEar: "#E09090", nosePink: "#E07070",
      eyeColor: "#1E88E5", pupil: "#0D2B5E",
      accessory: "headband",
    },
    adult: {
      bodyColor: "#7A6050", bodyShade: "#5A4030", bodyLight: "#A88060",
      innerEar: "#D08080", nosePink: "#D06060",
      eyeColor: "#0D2B5E", pupil: "#000428",
      accessory: "collar",
    },
  };

  const c = configs[stage];
  const sc = size / 160;

  const tailAnim = animate ? "tailWag 1.4s ease-in-out infinite" : "none";
  const bodyAnim = animate ? "breathe 3.5s ease-in-out infinite" : "none";
  const blinkAnim = animate ? "blink 4.5s ease-in-out infinite" : "none";
  const earAnim = animate ? "earTwitch 5s ease-in-out infinite" : "none";
  const sleepAnim = animate ? "sleepFloat 2s ease-in-out infinite" : "none";

  let eyesSVG = "";
  if (mood === "happy") {
    eyesSVG = `
      <g style="animation:${blinkAnim}">
        <path d="M61 64 Q66 58 71 64" stroke="${c.eyeColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M89 64 Q94 58 99 64" stroke="${c.eyeColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
      <ellipse cx="64" cy="67" rx="5" ry="3" fill="#FFB3C1" opacity="0.5"/>
      <ellipse cx="96" cy="67" rx="5" ry="3" fill="#FFB3C1" opacity="0.5"/>`;
  } else if (mood === "sleep") {
    eyesSVG = `
      <path d="M61 64 Q66 67 71 64" stroke="${c.eyeColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M89 64 Q94 67 99 64" stroke="${c.eyeColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="106" y="42" font-size="11" fill="#1E88E5" style="animation:${sleepAnim}" opacity="0.8">z</text>
      <text x="114" y="30" font-size="14" fill="#1E88E5" opacity="0.6" style="animation:${sleepAnim};animation-delay:0.4s">z</text>`;
  } else {
    eyesSVG = `
      <g style="animation:${blinkAnim}">
        <ellipse cx="66" cy="63" rx="6" ry="6" fill="${c.eyeColor}"/>
        <ellipse cx="94" cy="63" rx="6" ry="6" fill="${c.eyeColor}"/>
        <ellipse cx="66" cy="63" rx="3" ry="4" fill="${c.pupil}"/>
        <ellipse cx="94" cy="63" rx="3" ry="4" fill="${c.pupil}"/>
        <ellipse cx="68" cy="61" rx="1.5" ry="1.5" fill="white" opacity="0.8"/>
        <ellipse cx="96" cy="61" rx="1.5" ry="1.5" fill="white" opacity="0.8"/>
      </g>
      <ellipse cx="64" cy="68" rx="4" ry="2.5" fill="#FFB3C1" opacity="0.3"/>
      <ellipse cx="96" cy="68" rx="4" ry="2.5" fill="#FFB3C1" opacity="0.3"/>`;
  }

  const accessorySVG = c.accessory === "headband"
    ? `<rect x="48" y="36" width="64" height="7" rx="3.5" fill="#1E88E5" opacity="0.9"/>
       <circle cx="80" cy="39" r="5" fill="#FFD700"/>`
    : c.accessory === "collar"
    ? `<path d="M48 95 Q80 104 112 95" stroke="#0D2B5E" stroke-width="5" fill="none" stroke-linecap="round"/>
       <circle cx="80" cy="102" r="7" fill="#FFD700"/>
       <text x="80" y="106" text-anchor="middle" font-size="7" font-weight="bold" fill="#0D2B5E">N</text>`
    : "";

  const mouthSVG = mood === "happy"
    ? `<path d="M77 76 Q80 80 83 76" stroke="${c.bodyShade}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>`
    : `<path d="M77 77 Q80 75 83 77" stroke="${c.bodyShade}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <style>{`
          @keyframes tailWag { 0%,100%{transform:rotate(-12deg)} 50%{transform:rotate(12deg)} }
          @keyframes breathe { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.03) translateY(-1px)} }
          @keyframes blink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} }
          @keyframes earTwitch { 0%,80%,100%{transform:rotate(0deg)} 88%{transform:rotate(-10deg)} }
          @keyframes sleepFloat { 0%,100%{transform:translateY(0) rotate(-5deg);opacity:0.8} 50%{transform:translateY(-7px) rotate(5deg);opacity:1} }
        `}</style>
      </defs>
      <g transform={`scale(${sc})`}>
        {/* Tail */}
        <g style={{ transformOrigin: "30px 120px", animation: tailAnim }}>
          <path d="M30 120 Q10 100 15 80 Q20 65 35 70" stroke={c.bodyColor} strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M30 120 Q10 100 15 80 Q20 65 35 70" stroke={c.bodyLight} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5"/>
        </g>
        {/* Body */}
        <g style={{ transformOrigin: "80px 110px", animation: bodyAnim }}>
          <ellipse cx="80" cy="115" rx="40" ry="30" fill={c.bodyColor}/>
          <ellipse cx="80" cy="110" rx="22" ry="18" fill={c.bodyLight} opacity="0.55"/>
          <path d="M55 100 Q58 115 55 128" stroke={c.bodyShade} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round"/>
          <path d="M65 98 Q68 114 66 130" stroke={c.bodyShade} strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round"/>
          <path d="M95 98 Q92 114 94 130" stroke={c.bodyShade} strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round"/>
          <path d="M105 100 Q102 115 105 128" stroke={c.bodyShade} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round"/>
        </g>
        {/* Head */}
        <ellipse cx="80" cy="65" rx="34" ry="30" fill={c.bodyColor}/>
        {/* Ears */}
        <g style={{ transformOrigin: "54px 44px", animation: earAnim }}>
          <path d="M46 52 L54 28 L68 48 Z" fill={c.bodyColor}/>
          <path d="M50 50 L56 32 L66 47 Z" fill={c.innerEar} opacity="0.8"/>
        </g>
        <g style={{ transformOrigin: "106px 44px", animation: earAnim, animationDelay: "0.3s" }}>
          <path d="M92 48 L106 28 L114 52 Z" fill={c.bodyColor}/>
          <path d="M94 47 L106 32 L110 50 Z" fill={c.innerEar} opacity="0.8"/>
        </g>
        {/* Face highlight */}
        <ellipse cx="80" cy="70" rx="20" ry="16" fill={c.bodyLight} opacity="0.3"/>
        <path d="M74 40 Q80 35 86 40" stroke={c.bodyShade} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round"/>
        {/* Eyes */}
        <g dangerouslySetInnerHTML={{ __html: eyesSVG }} />
        {/* Nose */}
        <path d={`M77 72 L80 75 L83 72 Q80 70 77 72Z`} fill={c.nosePink}/>
        {/* Whiskers */}
        <line x1="45" y1="73" x2="70" y2="75" stroke={c.bodyShade} strokeWidth="1" opacity="0.45"/>
        <line x1="45" y1="78" x2="70" y2="78" stroke={c.bodyShade} strokeWidth="1" opacity="0.35"/>
        <line x1="90" y1="75" x2="115" y2="73" stroke={c.bodyShade} strokeWidth="1" opacity="0.45"/>
        <line x1="90" y1="78" x2="115" y2="78" stroke={c.bodyShade} strokeWidth="1" opacity="0.35"/>
        {/* Mouth */}
        <g dangerouslySetInnerHTML={{ __html: mouthSVG }} />
        {/* Paws */}
        <ellipse cx="55" cy="140" rx="14" ry="9" fill={c.bodyColor}/>
        <ellipse cx="55" cy="138" rx="10" ry="6" fill={c.bodyLight} opacity="0.45"/>
        <ellipse cx="105" cy="140" rx="14" ry="9" fill={c.bodyColor}/>
        <ellipse cx="105" cy="138" rx="10" ry="6" fill={c.bodyLight} opacity="0.45"/>
        <path d="M48 140 Q55 136 62 140" stroke={c.bodyShade} strokeWidth="1" fill="none" opacity="0.25"/>
        <path d="M98 140 Q105 136 112 140" stroke={c.bodyShade} strokeWidth="1" fill="none" opacity="0.25"/>
        {/* Accessory */}
        <g dangerouslySetInnerHTML={{ __html: accessorySVG }} />
      </g>
    </svg>
  );
}
