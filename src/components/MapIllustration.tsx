import React from 'react';

export const MapIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full select-none pointer-events-none overflow-hidden">
      {/* 3D Isometric Cartoon Educational Adventure Village SVG Canvas */}
      <svg
        viewBox="0 0 1000 620"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#76D3FB" />
            <stop offset="50%" stopColor="#B3ECFE" />
            <stop offset="100%" stopColor="#E4F8FE" />
          </linearGradient>

          {/* Distant Blue Mountains */}
          <linearGradient id="distMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6FA8D8" />
            <stop offset="55%" stopColor="#96C6E8" />
            <stop offset="100%" stopColor="#C6E3F6" />
          </linearGradient>

          {/* Mid Ridge Green Hills */}
          <linearGradient id="midMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4D9B68" />
            <stop offset="60%" stopColor="#6EBF87" />
            <stop offset="100%" stopColor="#9DE0B3" />
          </linearGradient>

          {/* Isometric Rolling Hills Gradients */}
          <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6FD844" />
            <stop offset="50%" stopColor="#4EC227" />
            <stop offset="100%" stopColor="#3DA31B" />
          </linearGradient>

          <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#91EC67" />
            <stop offset="60%" stopColor="#66CF38" />
            <stop offset="100%" stopColor="#48AD1F" />
          </linearGradient>

          <linearGradient id="mainValleyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5FBD8" />
            <stop offset="35%" stopColor="#CEF5BC" />
            <stop offset="75%" stopColor="#B3ECA0" />
            <stop offset="100%" stopColor="#9DE487" />
          </linearGradient>

          {/* Terraced Rice Fields (Sawah) Water & Earth Gradients */}
          <linearGradient id="sawahWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B6F0FF" />
            <stop offset="50%" stopColor="#7ADDFC" />
            <stop offset="100%" stopColor="#53CAEF" />
          </linearGradient>

          <linearGradient id="sawahBermGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9FD84C" />
            <stop offset="60%" stopColor="#7BB931" />
            <stop offset="100%" stopColor="#5B8E20" />
          </linearGradient>

          {/* River Water Gradient */}
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7AE6FF" />
            <stop offset="40%" stopColor="#30C3F2" />
            <stop offset="100%" stopColor="#149DD5" />
          </linearGradient>

          {/* Ocean Water Gradient */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43D4F6" />
            <stop offset="50%" stopColor="#18A9E6" />
            <stop offset="100%" stopColor="#0B79B5" />
          </linearGradient>

          {/* Sandy Beach Shore Gradient */}
          <linearGradient id="beachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEBAA" />
            <stop offset="60%" stopColor="#F9D785" />
            <stop offset="100%" stopColor="#E5BE64" />
          </linearGradient>

          {/* Sun Ray Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9D1" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFE568" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFCC2E" stopOpacity="0" />
          </radialGradient>

          {/* 3D Winding Adventure Trail Gradients (Cream & Warm Earth) */}
          <linearGradient id="trailBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF7DA" />
            <stop offset="40%" stopColor="#FDEAB1" />
            <stop offset="85%" stopColor="#F5D88E" />
            <stop offset="100%" stopColor="#E8C370" />
          </linearGradient>

          <linearGradient id="trailBorderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D9A859" />
            <stop offset="50%" stopColor="#BD8436" />
            <stop offset="100%" stopColor="#8A5A1C" />
          </linearGradient>

          {/* Wooden Bridge Planks Gradient */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0924E" />
            <stop offset="50%" stopColor="#B6672A" />
            <stop offset="100%" stopColor="#7F4213" />
          </linearGradient>

          {/* 3D Isometric Drop Shadow Filters */}
          <filter id="softShadow" x="-15%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="3.5" floodColor="#0A2C4A" floodOpacity="0.25" />
          </filter>

          <filter id="trailShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#3B2308" floodOpacity="0.28" />
          </filter>

          <filter id="buildingIsoShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="4" dy="7" stdDeviation="4.5" floodColor="#0F304B" floodOpacity="0.32" />
          </filter>

          {/* Cobblestone Pattern */}
          <pattern id="cobblePattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <ellipse cx="5" cy="5" rx="3.5" ry="2" fill="#E6C176" opacity="0.35" />
            <ellipse cx="15" cy="14" rx="4" ry="2.2" fill="#E6C176" opacity="0.35" />
            <ellipse cx="14" cy="4" rx="3" ry="1.8" fill="#F8E5A7" opacity="0.4" />
            <ellipse cx="4" cy="15" rx="3" ry="1.8" fill="#F8E5A7" opacity="0.4" />
          </pattern>
        </defs>

        {/* ========================================================================= */}
        {/* 1. SKY, SUN, DISTANT HORIZON & CLOUDS */}
        {/* ========================================================================= */}
        <rect width="1000" height="230" fill="url(#skyGrad)" />

        {/* Morning Cheerful Sun */}
        <g opacity="0.95">
          <circle cx="560" cy="65" r="75" fill="url(#sunGlow)" />
          <circle cx="560" cy="65" r="35" fill="#FFF28F" />
          <circle cx="560" cy="65" r="26" fill="#FFE245" />
        </g>

        {/* Distant Mountain Peaks (North & Far West) */}
        <path
          d="M0,165 L40,115 L95,148 L170,95 L250,145 L320,85 L410,135 L490,75 L590,130 L680,70 L770,125 L850,80 L930,120 L980,95 L1000,105 L1000,230 L0,230 Z"
          fill="url(#distMtnGrad)"
          opacity="0.9"
        />
        {/* Snow Caps on distant peaks */}
        <path d="M170,95 L155,110 L185,110 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M320,85 L306,100 L334,100 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M490,75 L475,92 L505,92 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M680,70 L665,88 L695,88 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M850,80 L836,95 L864,95 Z" fill="#FFFFFF" opacity="0.8" />

        {/* Middle Mountain Ridge with 3D Depth */}
        <path
          d="M0,190 Q120,125 260,160 T560,135 T840,145 T1000,135 L1000,260 L0,260 Z"
          fill="url(#midMtnGrad)"
          opacity="0.95"
        />

        {/* Rolling 3D Isometric Green Hills Valley */}
        <path
          d="M0,225 Q200,150 430,205 T790,170 T1000,185 L1000,380 L0,380 Z"
          fill="url(#hillGrad1)"
        />
        <path
          d="M0,260 Q170,205 370,245 T740,220 T1000,235 L1000,620 L0,620 Z"
          fill="url(#hillGrad2)"
        />

        {/* Valley Floor Basin */}
        <rect y="300" width="1000" height="320" fill="url(#mainValleyGrad)" />

        {/* Terraced 3D Contours / Layered Plateau Mounds */}
        <path d="M0,620 Q130,460 270,550 T530,620 Z" fill="#8CE560" opacity="0.4" />
        <path d="M380,620 Q510,480 670,570 T820,620 Z" fill="#8CE560" opacity="0.3" />

        {/* Fluffy Cartoon Clouds in Sky */}
        <g opacity="0.95">
          <g className="animate-cloud" transform="translate(120, 38)">
            <ellipse cx="40" cy="20" rx="36" ry="16" fill="#FFFFFF" />
            <ellipse cx="25" cy="14" rx="20" ry="16" fill="#FFFFFF" />
            <ellipse cx="55" cy="15" rx="18" ry="14" fill="#FFFFFF" />
          </g>
          <g className="animate-cloud-rev" transform="translate(710, 32)">
            <ellipse cx="46" cy="22" rx="42" ry="17" fill="#FFFFFF" />
            <ellipse cx="28" cy="15" rx="22" ry="16" fill="#FFFFFF" />
            <ellipse cx="64" cy="16" rx="22" ry="15" fill="#FFFFFF" />
          </g>
          <g className="animate-cloud" transform="translate(380, 75)">
            <ellipse cx="24" cy="12" rx="22" ry="10" fill="#FFFFFF" opacity="0.85" />
            <ellipse cx="15" cy="8" rx="12" ry="9" fill="#FFFFFF" opacity="0.85" />
          </g>
        </g>

        {/* Flying Birds in V-Formation */}
        <g stroke="#3A6C8C" strokeWidth="2.2" fill="none" opacity="0.6">
          <path d="M210,80 Q216,74 222,80 Q228,74 234,80" />
          <path d="M236,68 Q241,63 246,68 Q251,63 256,68" />
          <path d="M660,95 Q665,90 670,95 Q675,90 680,95" />
        </g>

        {/* ========================================================================= */}
        {/* 2. SAWAH TERASERING (3D TERRACED RICE PADDIES) - WEST/NORTHWEST AREA */}
        {/* ========================================================================= */}
        <g transform="translate(310, 260)" filter="url(#softShadow)" opacity="0.95">
          {/* Terrace 1: Top Paddy */}
          <path
            d="M-45,-15 Q-15,-25 35,-18 Q55,-12 45,5 Q10,12 -35,5 Z"
            fill="url(#sawahWaterGrad)"
            stroke="url(#sawahBermGrad)"
            strokeWidth="5"
          />
          {/* Rice Seedlings Rows Terrace 1 */}
          <g fill="#21A447" opacity="0.85">
            <circle cx="-30" cy="-8" r="1.8" /><circle cx="-18" cy="-12" r="1.8" /><circle cx="-6" cy="-14" r="1.8" /><circle cx="6" cy="-12" r="1.8" /><circle cx="18" cy="-10" r="1.8" /><circle cx="30" cy="-6" r="1.8" />
            <circle cx="-25" cy="0" r="1.8" /><circle cx="-12" cy="-2" r="1.8" /><circle cx="0" cy="-3" r="1.8" /><circle cx="12" cy="-2" r="1.8" /><circle cx="24" cy="0" r="1.8" />
          </g>

          {/* Terrace 2: Middle Paddy */}
          <path
            d="M-55,8 Q-20,-2 30,5 Q60,12 50,28 Q15,36 -45,28 Z"
            fill="url(#sawahWaterGrad)"
            stroke="url(#sawahBermGrad)"
            strokeWidth="5"
          />
          {/* Rice Seedlings Rows Terrace 2 */}
          <g fill="#21A447" opacity="0.85">
            <circle cx="-40" cy="15" r="1.8" /><circle cx="-25" cy="12" r="1.8" /><circle cx="-10" cy="10" r="1.8" /><circle cx="5" cy="12" r="1.8" /><circle cx="20" cy="15" r="1.8" /><circle cx="35" cy="18" r="1.8" />
            <circle cx="-32" cy="22" r="1.8" /><circle cx="-18" cy="20" r="1.8" /><circle cx="-2" cy="19" r="1.8" /><circle cx="14" cy="20" r="1.8" /><circle cx="28" cy="23" r="1.8" />
          </g>

          {/* Terrace 3: Lower Paddy */}
          <path
            d="M-62,32 Q-25,24 25,30 Q55,38 42,50 Q10,58 -52,50 Z"
            fill="url(#sawahWaterGrad)"
            stroke="url(#sawahBermGrad)"
            strokeWidth="5"
          />
          {/* Rice Seedlings Rows Terrace 3 */}
          <g fill="#21A447" opacity="0.85">
            <circle cx="-48" cy="38" r="1.8" /><circle cx="-32" cy="36" r="1.8" /><circle cx="-16" cy="35" r="1.8" /><circle cx="0" cy="37" r="1.8" /><circle cx="16" cy="40" r="1.8" /><circle cx="30" cy="42" r="1.8" />
            <circle cx="-38" cy="45" r="1.8" /><circle cx="-22" cy="44" r="1.8" /><circle cx="-6" cy="44" r="1.8" /><circle cx="10" cy="46" r="1.8" />
          </g>

          {/* Cute Little Farm Thatched Gazebo / Saung Sawah */}
          <g transform="translate(48, 14)">
            {/* Wooden Stilts */}
            <line x1="-7" y1="4" x2="-7" y2="15" stroke="#7A3E17" strokeWidth="2" />
            <line x1="7" y1="4" x2="7" y2="15" stroke="#7A3E17" strokeWidth="2" />
            {/* Floor Deck */}
            <rect x="-9" y="4" width="18" height="3" rx="1" fill="#B46D29" stroke="#5E2C0C" strokeWidth="0.8" />
            {/* Pyramid Thatched Straw Roof */}
            <polygon points="0,-8 -12,4 12,4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
            <polygon points="0,-8 0,4 12,4" fill="#D97706" opacity="0.35" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 3. OCEAN BAY, SANDY BEACH & SAILBOAT (SOUTHEAST / FINISH AREA) */}
        {/* ========================================================================= */}
        <path
          d="M760,620 C780,510 830,440 910,410 C960,390 1000,380 1000,380 L1000,620 Z"
          fill="url(#beachGrad)"
        />
        <path
          d="M790,620 C810,530 855,470 925,445 C965,430 1000,420 1000,420 L1000,620 Z"
          fill="#E7C475"
          opacity="0.6"
        />
        <path
          d="M820,620 C835,550 880,500 945,475 C975,465 1000,460 1000,460 L1000,620 Z"
          fill="url(#oceanGrad)"
        />
        <path
          d="M820,620 C835,550 880,500 945,475 C975,465 1000,460 1000,460"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Ocean Ripples / Waves */}
        <g stroke="#FFFFFF" fill="none" opacity="0.65" strokeWidth="2.2">
          <path d="M870,580 Q910,540 970,530" className="animate-water" strokeDasharray="14,14" />
          <path d="M900,610 Q940,570 990,560" className="animate-water" strokeDasharray="12,12" />
          <ellipse cx="940" cy="520" rx="28" ry="10" strokeDasharray="6,10" className="animate-water" />
          <ellipse cx="900" cy="570" rx="20" ry="7" strokeDasharray="5,8" className="animate-water" />
        </g>

        {/* Cute 3D Coastal Lighthouse (Mercusuar Teluk) */}
        <g transform="translate(965, 415)" filter="url(#softShadow)">
          {/* Base rock */}
          <ellipse cx="0" cy="18" rx="16" ry="7" fill="#64748B" />
          {/* Tower Body with Red/White Stripes */}
          <path d="M-8,16 L-5,-20 L5,-20 L8,16 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
          <polygon points="-7,8 -6,0 6,0 7,8" fill="#EF4444" />
          <polygon points="-6,-10 -5,-18 5,-18 6,-10" fill="#EF4444" />
          {/* Lantern Room & Dome */}
          <rect x="-6" y="-26" width="12" height="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <ellipse cx="0" cy="-26" rx="7" ry="4" fill="#DC2626" />
          <line x1="0" y1="-30" x2="0" y2="-26" stroke="#991B1B" strokeWidth="1.5" />
          {/* Light Beacon Beam */}
          <polygon points="0,-26 -35,-42 -25,-48" fill="#FEF08A" opacity="0.4" />
        </g>

        {/* Cute Sailboat in Ocean Bay */}
        <g transform="translate(915, 520) scale(0.9)">
          <path d="M-18,12 L18,12 L12,22 L-12,22 Z" fill="#C25E2E" stroke="#7A320E" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="0" y2="-16" stroke="#5A2E12" strokeWidth="2.5" />
          <path d="M1,-14 L18,10 L1,10 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M1,-6 L12,10 L1,10 Z" fill="#EF4444" opacity="0.85" />
          <path d="M-1,-12 L-12,10 L-1,10 Z" fill="#38BDF8" opacity="0.9" />
          <polygon points="0,-16 6,-14 0,-12" fill="#FBBF24" />
        </g>

        {/* ========================================================================= */}
        {/* 4. CRYSTAL CLEAR BLUE RIVER (WINDING FROM NORTH TO SOUTHEAST) */}
        {/* ========================================================================= */}
        {/* Outer River Embankment */}
        <path
          d="M740,150 C720,230 835,300 815,385 C795,455 830,510 860,560 L895,620"
          fill="none"
          stroke="#48BB78"
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* Sandy River Edge */}
        <path
          d="M740,150 C720,230 835,300 815,385 C795,455 830,510 860,560 L895,620"
          fill="none"
          stroke="#E6D394"
          strokeWidth="52"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Main River Stream */}
        <path
          d="M740,150 C720,230 835,300 815,385 C795,455 830,510 860,560 L895,620"
          fill="none"
          stroke="url(#riverGrad)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        {/* Animated River Stream Shimmer Lines */}
        <path
          d="M740,150 C720,230 835,300 815,385 C795,455 830,510 860,560 L895,620"
          fill="none"
          stroke="#EBFBFF"
          strokeWidth="4.5"
          strokeDasharray="12,20"
          strokeLinecap="round"
          className="animate-water"
        />
        <path
          d="M740,150 C720,230 835,300 815,385 C795,455 830,510 860,560 L895,620"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="8,16"
          strokeLinecap="round"
          className="animate-water"
          opacity="0.8"
        />

        {/* Lily Pads & Lotus Flowers on River */}
        <g opacity="0.9">
          <ellipse cx="760" cy="275" rx="7" ry="4" fill="#2E9E47" />
          <circle cx="761" cy="274" r="2" fill="#F472B6" />
          <ellipse cx="828" cy="340" rx="8" ry="4.5" fill="#2E9E47" />
          <circle cx="829" cy="339" r="2.2" fill="#F472B6" />
        </g>

        {/* ========================================================================= */}
        {/* 5. 3D WINDING ADVENTURE TRAIL (CREAM PATH, EMBANKED CURB & WHITE DASHES) */}
        {/* ========================================================================= */}
        {/*
          Smooth Bezier path mathematically passing through all 25 game nodes:
          P1(80,520) -> P2(140,452) -> P3(210,465) -> P4(290,496) -> P5(370,434) -> P6(280,341) ->
          P7(210,285) -> P8(170,205) -> P9(260,149) -> P10(360,124) -> P11(440,143) -> P12(520,124) -> P13(590,174) ->
          P14(510,273) -> P15(440,372) -> P16(520,422) -> P17(620,446) -> P18(710,397) -> P19(670,291) ->
          P20(640,211) -> P21(660,136) -> P22(770,136) -> P23(870,211) -> P24(820,347) -> P25(880,533)
        */}

        {/* Layer A: Ambient Soft Ground Drop Shadow */}
        <path
          d="M80,520 Q120,440 140,452 Q180,480 210,465 Q250,510 290,496 Q340,480 370,434 Q340,380 280,341 Q240,310 210,285 Q170,260 170,205 Q220,150 260,149 Q310,120 360,124 Q400,150 440,143 Q480,110 520,124 Q560,140 590,174 Q560,230 510,273 Q450,330 440,372 Q470,430 520,422 Q580,460 620,446 Q680,440 710,397 Q710,330 670,291 Q630,240 640,211 Q635,160 660,136 Q720,120 770,136 Q830,150 870,211 Q880,280 820,347 Q780,430 830,480 Q860,500 880,533"
          fill="none"
          stroke="#422506"
          strokeWidth="42"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          filter="url(#trailShadow)"
        />

        {/* Layer B: Raised Earthen Curb Border (Tepi Jalan Berbayang Lembut) */}
        <path
          d="M80,520 Q120,440 140,452 Q180,480 210,465 Q250,510 290,496 Q340,480 370,434 Q340,380 280,341 Q240,310 210,285 Q170,260 170,205 Q220,150 260,149 Q310,120 360,124 Q400,150 440,143 Q480,110 520,124 Q560,140 590,174 Q560,230 510,273 Q450,330 440,372 Q470,430 520,422 Q580,460 620,446 Q680,440 710,397 Q710,330 670,291 Q630,240 640,211 Q635,160 660,136 Q720,120 770,136 Q830,150 870,211 Q880,280 820,347 Q780,430 830,480 Q860,500 880,533"
          fill="none"
          stroke="url(#trailBorderGrad)"
          strokeWidth="34"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer C: Main Winding Cream Cobblestone Roadbed (Warna Krem) */}
        <path
          d="M80,520 Q120,440 140,452 Q180,480 210,465 Q250,510 290,496 Q340,480 370,434 Q340,380 280,341 Q240,310 210,285 Q170,260 170,205 Q220,150 260,149 Q310,120 360,124 Q400,150 440,143 Q480,110 520,124 Q560,140 590,174 Q560,230 510,273 Q450,330 440,372 Q470,430 520,422 Q580,460 620,446 Q680,440 710,397 Q710,330 670,291 Q630,240 640,211 Q635,160 660,136 Q720,120 770,136 Q830,150 870,211 Q880,280 820,347 Q780,430 830,480 Q860,500 880,533"
          fill="none"
          stroke="url(#trailBaseGrad)"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer D: Textured Cobblestone Edge Stepping Details */}
        <path
          d="M80,520 Q120,440 140,452 Q180,480 210,465 Q250,510 290,496 Q340,480 370,434 Q340,380 280,341 Q240,310 210,285 Q170,260 170,205 Q220,150 260,149 Q310,120 360,124 Q400,150 440,143 Q480,110 520,124 Q560,140 590,174 Q560,230 510,273 Q450,330 440,372 Q470,430 520,422 Q580,460 620,446 Q680,440 710,397 Q710,330 670,291 Q630,240 640,211 Q635,160 660,136 Q720,120 770,136 Q830,150 870,211 Q880,280 820,347 Q780,430 830,480 Q860,500 880,533"
          fill="none"
          stroke="#C89748"
          strokeWidth="7"
          strokeDasharray="6,12"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Layer E: Crisp Dashed White Center Line (Garis Putus-Putus Putih) */}
        <path
          d="M80,520 Q120,440 140,452 Q180,480 210,465 Q250,510 290,496 Q340,480 370,434 Q340,380 280,341 Q240,310 210,285 Q170,260 170,205 Q220,150 260,149 Q310,120 360,124 Q400,150 440,143 Q480,110 520,124 Q560,140 590,174 Q560,230 510,273 Q450,330 440,372 Q470,430 520,422 Q580,460 620,446 Q680,440 710,397 Q710,330 670,291 Q630,240 640,211 Q635,160 660,136 Q720,120 770,136 Q830,150 870,211 Q880,280 820,347 Q780,430 830,480 Q860,500 880,533"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeDasharray="7,14"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* ========================================================================= */}
        {/* 6. RUSTIC 3D WOODEN BRIDGE (JEMBATAN KAYU DI ATAS SUNGAI) */}
        {/* ========================================================================= */}
        <g transform="rotate(-18 815 398)">
          {/* Bridge Ground & River Shadow */}
          <rect x="765" y="405" width="86" height="26" rx="5" fill="#0E3224" opacity="0.35" />
          {/* Heavy timber support posts under bridge */}
          <rect x="770" y="386" width="10" height="32" rx="3" fill="#582C0E" />
          <rect x="836" y="386" width="10" height="32" rx="3" fill="#582C0E" />
          {/* Wooden Deck Planks with 3D bevel */}
          <rect x="768" y="388" width="80" height="26" rx="4" fill="url(#woodGrad)" stroke="#582C0E" strokeWidth="2" />
          {/* Individual wood plank slits */}
          <line x1="780" y1="388" x2="780" y2="414" stroke="#582C0E" strokeWidth="2" />
          <line x1="792" y1="388" x2="792" y2="414" stroke="#582C0E" strokeWidth="2" />
          <line x1="804" y1="388" x2="804" y2="414" stroke="#582C0E" strokeWidth="2" />
          <line x1="816" y1="388" x2="816" y2="414" stroke="#582C0E" strokeWidth="2" />
          <line x1="828" y1="388" x2="828" y2="414" stroke="#582C0E" strokeWidth="2" />
          <line x1="840" y1="388" x2="840" y2="414" stroke="#582C0E" strokeWidth="2" />
          {/* Sturdy Timber Railings */}
          <rect x="766" y="385" width="84" height="4.5" rx="2" fill="#4A240A" />
          <rect x="766" y="413" width="84" height="4.5" rx="2" fill="#4A240A" />
          {/* Brass Railing Caps */}
          <circle cx="772" cy="387" r="3" fill="#FFE248" />
          <circle cx="844" cy="387" r="3" fill="#FFE248" />
          <circle cx="772" cy="415" r="3" fill="#FFE248" />
          <circle cx="844" cy="415" r="3" fill="#FFE248" />
        </g>

        {/* ========================================================================= */}
        {/* 7. LUSH 3D CARTOON TREES, FLOWERBEDS & PARK ENVIRONMENT */}
        {/* ========================================================================= */}
        {/* West Forest Grove */}
        <g opacity="0.95">
          <ellipse cx="83" cy="326" rx="22" ry="8" fill="#1B4D25" opacity="0.3" />
          <rect x="80" y="315" width="7" height="15" fill="#6A3B18" rx="2" />
          <circle cx="83" cy="295" r="24" fill="#258E3E" />
          <circle cx="83" cy="291" r="18" fill="#3DB559" />
          <circle cx="95" cy="305" r="18" fill="#1C7430" />
          <circle cx="72" cy="304" r="15" fill="#299643" />
          {/* Apple Dots */}
          <circle cx="78" cy="288" r="2.5" fill="#EF4444" />
          <circle cx="88" cy="294" r="2.5" fill="#EF4444" />
        </g>

        {/* North-West Forest near Post Office */}
        <g opacity="0.95">
          <ellipse cx="298" cy="155" rx="18" ry="7" fill="#1B4D25" opacity="0.3" />
          <rect x="295" y="145" width="6" height="14" fill="#6A3B18" rx="2" />
          <circle cx="298" cy="130" r="20" fill="#22873B" />
          <circle cx="298" cy="126" r="15" fill="#3DB559" />
          <circle cx="318" cy="138" r="17" fill="#1B712F" />
        </g>

        {/* North Ridge Pine Trees */}
        <g opacity="0.9">
          <polygon points="610,75 596,110 624,110" fill="#1B6C32" />
          <polygon points="610,95 592,126 628,126" fill="#258540" />
          <polygon points="638,82 626,114 650,114" fill="#1B6C32" />
          <polygon points="638,98 622,128 654,128" fill="#258540" />
        </g>

        {/* East Riverbank Lush Trees */}
        <g opacity="0.95">
          <ellipse cx="948" cy="285" rx="22" ry="8" fill="#1B4D25" opacity="0.3" />
          <rect x="945" y="275" width="7" height="15" fill="#6A3B18" rx="2" />
          <circle cx="948" cy="255" r="24" fill="#279442" />
          <circle cx="948" cy="250" r="18" fill="#44BE61" />
          <circle cx="968" cy="265" r="19" fill="#1E7A33" />
        </g>

        {/* South-West Orchard Trees */}
        <g opacity="0.9">
          <ellipse cx="183" cy="595" rx="16" ry="6" fill="#1B4D25" opacity="0.3" />
          <rect x="180" y="585" width="6" height="12" fill="#6A3B18" rx="2" />
          <circle cx="183" cy="570" r="18" fill="#289743" />
          <circle cx="183" cy="566" r="13" fill="#44BE61" />
        </g>

        {/* Blooming Wildflower Clusters */}
        <g opacity="0.9">
          <circle cx="130" cy="565" r="3.5" fill="#FF4D80" />
          <circle cx="138" cy="560" r="3" fill="#FFC928" />
          <circle cx="145" cy="568" r="3.5" fill="#A855F7" />
          <circle cx="330" cy="575" r="3.5" fill="#FF4D80" />
          <circle cx="340" cy="570" r="3" fill="#FFC928" />
          <circle cx="348" cy="576" r="3.5" fill="#38BDF8" />
          <circle cx="700" cy="535" r="3.5" fill="#FF4D80" />
          <circle cx="710" cy="530" r="3" fill="#FFC928" />
        </g>

        {/* ========================================================================= */}
        {/* 8. 3D ISOMETRIC CARTOON LANDMARK BUILDINGS */}
        {/* ========================================================================= */}

        {/* 1. SD HARAPAN (CENTER / PUSAT ACUAN: x=488, y=310) */}
        <g transform="translate(488, 305)" filter="url(#buildingIsoShadow)">
          {/* Foundation Lawn with 3D Depth */}
          <ellipse cx="0" cy="22" rx="48" ry="16" fill="#4CAF50" opacity="0.5" />
          {/* Isometric Building Left/Shadow Wall */}
          <polygon points="-34,-18 -42,-10 -42,22 -34,16" fill="#E2E8F0" />
          {/* Main School Building Front Facade */}
          <rect x="-34" y="-18" width="68" height="34" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Brick Basement line */}
          <rect x="-34" y="10" width="68" height="6" fill="#F43F5E" opacity="0.85" />
          {/* School Red Tiled Roof with 3D Isometric Pitch */}
          <polygon points="0,-36 -42,-14 40,-14" fill="#E11D48" stroke="#BE123C" strokeWidth="1.5" />
          <polygon points="0,-36 0,-14 40,-14" fill="#BE123C" opacity="0.3" />
          {/* Roof detail line */}
          <polygon points="0,-33 -34,-14 34,-14" fill="#F43F5E" opacity="0.7" />
          {/* Clock Tower / Bell Tower on roof */}
          <rect x="-10" y="-48" width="20" height="16" fill="#FFFFFF" stroke="#BE123C" strokeWidth="1.5" />
          <polygon points="0,-58 -12,-48 12,-48" fill="#BE123C" />
          {/* Clock face */}
          <circle cx="0" cy="-40" r="5.5" fill="#FFF9E7" stroke="#123D68" strokeWidth="1" />
          <line x1="0" y1="-40" x2="0" y2="-43" stroke="#123D68" strokeWidth="1.2" />
          <line x1="0" y1="-40" x2="2.5" y2="-40" stroke="#123D68" strokeWidth="1.2" />
          {/* Classroom Windows */}
          <rect x="-26" y="-8" width="10" height="12" rx="1.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
          <rect x="16" y="-8" width="10" height="12" rx="1.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
          {/* Main Door */}
          <rect x="-6" y="-2" width="12" height="18" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
          <circle cx="2" cy="7" r="1.2" fill="#FEF3C7" />
          {/* Flagpole with Indonesian Red & White Flag */}
          <line x1="38" y1="-38" x2="38" y2="16" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <rect x="38" y="-36" width="14" height="5" fill="#EF4444" />
          <rect x="38" y="-31" width="14" height="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        </g>

        {/* 2. PASAR DESA (NORTH / UTARA: x=480, y=65) */}
        <g transform="translate(480, 62)" filter="url(#softShadow)">
          <ellipse cx="0" cy="18" rx="42" ry="12" fill="#2D5A25" opacity="0.3" />
          <rect x="-30" y="-8" width="60" height="24" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5" rx="3" />
          {/* Striped Canopy Awning */}
          <path d="M-36,-12 L36,-12 L40,0 L-40,0 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
          <polygon points="-24,-12 -14,-12 -16,0 -26,0" fill="#FFFFFF" />
          <polygon points="-4,-12 6,-12 4,0 -6,0" fill="#FFFFFF" />
          <polygon points="16,-12 26,-12 24,0 14,0" fill="#FFFFFF" />
          {/* Awning Scallops */}
          <circle cx="-34" cy="0" r="3" fill="#EF4444" />
          <circle cx="-20" cy="0" r="3" fill="#FFFFFF" />
          <circle cx="-6" cy="0" r="3" fill="#EF4444" />
          <circle cx="8" cy="0" r="3" fill="#FFFFFF" />
          <circle cx="22" cy="0" r="3" fill="#EF4444" />
          <circle cx="35" cy="0" r="3" fill="#FFFFFF" />
          {/* Fresh Fruit Baskets */}
          <circle cx="-16" cy="10" r="4.5" fill="#F97316" />
          <circle cx="-8" cy="10" r="4.5" fill="#EF4444" />
          <circle cx="8" cy="10" r="4.5" fill="#84CC16" />
          <circle cx="16" cy="10" r="4.5" fill="#EAB308" />
        </g>

        {/* 3. TAMAN BERMAIN (WEST / BARAT: x=125, y=250) */}
        <g transform="translate(125, 250)" filter="url(#softShadow)">
          <ellipse cx="0" cy="15" rx="38" ry="14" fill="#4EAE24" opacity="0.4" />
          <rect x="-28" y="2" width="22" height="14" rx="2" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2" />
          <polygon points="-19,7 -15,7 -16,13 -18,13" fill="#EF4444" />
          {/* Playground Slide */}
          <path d="M-6,14 L4,-12 L10,-12 L10,14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <path d="M10,-12 Q24,0 30,14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <line x1="4" y1="-8" x2="-2" y2="14" stroke="#EF4444" strokeWidth="2" />
          <line x1="8" y1="-3" x2="2" y2="14" stroke="#EF4444" strokeWidth="2" />
          {/* Park Bench */}
          <rect x="-10" y="16" width="18" height="3" rx="1" fill="#92400E" />
          <line x1="-8" y1="19" x2="-8" y2="23" stroke="#451A03" strokeWidth="1.5" />
          <line x1="6" y1="19" x2="6" y2="23" stroke="#451A03" strokeWidth="1.5" />
        </g>

        {/* 4. PERUMAHAN WARGA (EAST / TIMUR: x=775, y=280) */}
        <g transform="translate(775, 280)" filter="url(#softShadow)">
          {/* House 1 (Blue Roof) */}
          <rect x="-32" y="-6" width="28" height="22" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.2" />
          <polygon points="-18,-20 -36,-5 0,-5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <polygon points="-18,-20 0,-5 0,-5" fill="#1D4ED8" opacity="0.3" />
          <rect x="-24" y="0" width="7" height="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
          <rect x="-13" y="4" width="7" height="12" fill="#B45309" />
          {/* Chimney puffing smoke */}
          <rect x="-8" y="-18" width="5" height="8" fill="#DC2626" />
          <circle cx="-6" cy="-22" r="3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="-4" cy="-27" r="4" fill="#FFFFFF" opacity="0.5" />

          {/* House 2 (Red Roof) */}
          <rect x="2" y="-2" width="28" height="20" rx="2" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.2" />
          <polygon points="16,-16 -2,-2 34,-2" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <polygon points="16,-16 34,-2 34,-2" fill="#B91C1C" opacity="0.3" />
          <rect x="18" y="4" width="7" height="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
          <rect x="7" y="6" width="7" height="12" fill="#B45309" />

          {/* Picket Fence */}
          <line x1="-36" y1="17" x2="34" y2="17" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="-30" y1="13" x2="-30" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="-16" y1="13" x2="-16" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="13" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="13" x2="16" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 5. MASJID DESA (SOUTH / SELATAN: x=485, y=510) */}
        <g transform="translate(485, 510)" filter="url(#softShadow)">
          <ellipse cx="0" cy="22" rx="44" ry="14" fill="#1E4D2B" opacity="0.3" />
          <rect x="-26" y="-6" width="52" height="26" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Emerald Green 3D Dome */}
          <ellipse cx="0" cy="-6" rx="22" ry="16" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <path d="M-14,-10 Q0,-18 14,-10" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
          {/* Golden Crescent Moon Spire */}
          <line x1="0" y1="-22" x2="0" y2="-28" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="0" cy="-30" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
          {/* Minaret Tower */}
          <rect x="28" y="-24" width="9" height="44" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" rx="1.5" />
          <polygon points="32.5,-32 26,-24 39,-24" fill="#10B981" stroke="#047857" strokeWidth="1" />
          <circle cx="32.5" cy="-34" r="1.5" fill="#FBBF24" />
          {/* Arched Entrance Door */}
          <path d="M-8,20 L-8,4 Q0,-4 8,4 L8,20 Z" fill="#047857" stroke="#064E3B" strokeWidth="1.2" />
          <circle cx="3" cy="12" r="1.2" fill="#FBBF24" />
        </g>

        {/* 6. PUSKESMAS CERIA (NORTH-EAST / TIMUR LAUT: x=775, y=90) */}
        <g transform="translate(775, 88)" filter="url(#softShadow)">
          <rect x="-28" y="-10" width="56" height="28" rx="4" fill="#FFFFFF" stroke="#99F6E4" strokeWidth="1.5" />
          <polygon points="0,-24 -32,-8 32,-8" fill="#14B8A6" stroke="#0D9488" strokeWidth="1.5" />
          <polygon points="0,-24 32,-8 32,-8" fill="#0D9488" opacity="0.3" />
          {/* Red Cross Emblem */}
          <circle cx="0" cy="-14" r="7" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1" />
          <rect x="-1.5" y="-18" width="3" height="8" fill="#EF4444" />
          <rect x="-4" y="-15.5" width="8" height="3" fill="#EF4444" />
          {/* Windows & Door */}
          <rect x="-22" y="-2" width="10" height="10" rx="1.5" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1" />
          <rect x="12" y="-2" width="10" height="10" rx="1.5" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1" />
          <rect x="-5" y="2" width="10" height="16" fill="#0D9488" rx="1.5" />
        </g>

        {/* 7. KANTOR POS (NORTH-WEST / BARAT LAUT: x=180, y=95) */}
        <g transform="translate(180, 95)" filter="url(#softShadow)">
          <rect x="-26" y="-8" width="52" height="26" rx="3" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
          <polygon points="0,-22 -30,-6 30,-6" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
          <polygon points="0,-22 30,-6 30,-6" fill="#C2410C" opacity="0.3" />
          {/* Mail Envelope Emblem Badge */}
          <rect x="-8" y="-16" width="16" height="10" rx="1.5" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1" />
          <path d="M-8,-16 L0,-10 L8,-16" fill="none" stroke="#C2410C" strokeWidth="1" />
          <rect x="-5" y="4" width="10" height="14" fill="#B45309" rx="1.5" />
          {/* Classic Red Post Box */}
          <rect x="16" y="2" width="7" height="14" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <line x1="17" y1="5" x2="22" y2="5" stroke="#FFFFFF" strokeWidth="1" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 9. CLEAR LANDMARK BADGES (POSITIONED PRECISELY TO AVOID ALL PINS) */}
      {/* ========================================================================= */}

      {/* 1. SD HARAPAN (PUSAT ACUAN: located above Node 16 & below SD roof) */}
      <div className="absolute top-[57%] left-[49%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 sm:px-3 py-1 rounded-2xl shadow-md border-2 border-amber-400 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-sm">🏫</span>
          <div className="text-left leading-none">
            <span className="text-[8px] sm:text-[9px] font-black text-amber-700 uppercase tracking-wider block">
              Pusat Acuan
            </span>
            <span className="text-[11px] sm:text-xs font-black text-[#123D68]">SD Harapan</span>
          </div>
        </div>
      </div>

      {/* 2. PASAR DESA (UTARA: top=11% left=48% well above Node 11-12) */}
      <div className="absolute top-[11%] left-[48%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-orange-400 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">🛒</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-orange-600 uppercase block">Utara</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Pasar Desa</span>
          </div>
        </div>
      </div>

      {/* 3. TAMAN BERMAIN (BARAT: top=45% left=11% to the left of Node 7-8) */}
      <div className="absolute top-[45%] left-[11%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-emerald-400 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">🎡</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-emerald-600 uppercase block">Barat</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Taman</span>
          </div>
        </div>
      </div>

      {/* 4. SAWAH TERASERING (BARAT-TENGAH: top=38% left=31%) */}
      <div className="absolute top-[38%] left-[31%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/90 hover:bg-white px-2 py-0.5 rounded-xl shadow-xs border border-emerald-400 flex items-center gap-1 transition-transform hover:scale-105">
          <span className="text-xs">🌾</span>
          <div className="text-left leading-none">
            <span className="text-[9px] font-extrabold text-[#123D68]">Sawah Hijau</span>
          </div>
        </div>
      </div>

      {/* 5. PERUMAHAN WARGA (TIMUR: top=51% left=77% safely between Node 19 & 23) */}
      <div className="absolute top-[51%] left-[77%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-blue-400 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">🏡</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-blue-600 uppercase block">Timur</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Perumahan</span>
          </div>
        </div>
      </div>

      {/* 6. MASJID DESA (SELATAN: top=89% left=48% below Node 16) */}
      <div className="absolute top-[89%] left-[48%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-teal-400 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">🕌</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-teal-600 uppercase block">Selatan</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Masjid Desa</span>
          </div>
        </div>
      </div>

      {/* 7. PUSKESMAS (TIMUR LAUT: top=18% left=77% near Node 22) */}
      <div className="absolute top-[18%] left-[77%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-teal-500 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">🏥</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-teal-700 uppercase block">Timur Laut</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Puskesmas</span>
          </div>
        </div>
      </div>

      {/* 8. KANTOR POS (BARAT LAUT: top=19% left=18% near Node 8-9) */}
      <div className="absolute top-[19%] left-[18%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-md border-2 border-amber-500 flex items-center gap-1.5 transition-transform hover:scale-105">
          <span className="text-xs sm:text-sm">📮</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-amber-700 uppercase block">Barat Laut</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#123D68]">Kantor Pos</span>
          </div>
        </div>
      </div>

      {/* 9. JEMBATAN KAYU (TENGGARA: top=70% left=82% on the river crossing) */}
      <div className="absolute top-[70%] left-[82%] -translate-x-1/2 flex flex-col items-center z-15 pointer-events-auto">
        <div className="bg-white/95 hover:bg-white px-2 py-0.5 rounded-xl shadow-md border-2 border-amber-700 flex items-center gap-1 transition-transform hover:scale-105">
          <span className="text-xs">🌉</span>
          <div className="text-left leading-none">
            <span className="text-[8px] font-black text-amber-800 uppercase block">Tenggara</span>
            <span className="text-[10px] font-black text-[#123D68]">Jembatan</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. COMPASS ROSE WIDGET (ARAH MATA ANGIN) IN TOP-LEFT CORNER */}
      {/* ========================================================================= */}
      <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-25 bg-white/95 backdrop-blur-xs p-1.5 sm:p-2.5 rounded-2xl shadow-lg border-2 border-sky-300 flex flex-col items-center select-none pointer-events-auto">
        <div className="text-[9px] sm:text-[11px] font-black text-rose-600 tracking-wide flex items-center gap-1">
          <span>U (Utara)</span>
          <span>⬆️</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-[#123D68] my-0.5 sm:my-1">
          <span>⬅️ B</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shadow-xs">
            🧭
          </div>
          <span>T ➡️</span>
        </div>
        <div className="text-[9px] sm:text-[11px] font-black text-sky-800 tracking-wide flex items-center gap-1">
          <span>⬇️</span>
          <span>S (Selatan)</span>
        </div>
      </div>
    </div>
  );
};
