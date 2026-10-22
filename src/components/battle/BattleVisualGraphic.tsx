import React from 'react';
import { BattleQuestion } from '../../types';

interface BattleVisualGraphicProps {
  question: BattleQuestion;
}

export const BattleVisualGraphic: React.FC<BattleVisualGraphicProps> = ({ question }) => {
  const { visualType, visualMeta } = question;

  if (visualType === 'compass') {
    const angle = visualMeta?.bearingAngle ?? 0;
    return (
      <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-sky-50 to-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md flex flex-col items-center">
        <div className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full mb-3 uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
          <span>🧭</span>
          <span>Kompas 8 Arah Mata Angin</span>
        </div>

        <svg viewBox="0 0 240 240" className="w-48 h-48 sm:w-56 sm:h-56 filter drop-shadow-md">
          <defs>
            <radialGradient id="compassDial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </radialGradient>
            <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer ring */}
          <circle cx="120" cy="120" r="110" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
          <circle cx="120" cy="120" r="102" fill="url(#compassDial)" stroke="#F59E0B" strokeWidth="3" />

          {/* Degree ticks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = 120 + 88 * Math.cos(rad);
            const y1 = 120 + 88 * Math.sin(rad);
            const x2 = 120 + 98 * Math.cos(rad);
            const y2 = 120 + 98 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0284C7" strokeWidth="2.5" />;
          })}

          {/* Direction Stars / Points */}
          <polygon points="120,34 125,120 120,120 115,120" fill="#EF4444" />
          <polygon points="120,206 125,120 120,120 115,120" fill="#64748B" />
          <polygon points="206,120 120,125 120,120 120,115" fill="#64748B" />
          <polygon points="34,120 120,125 120,120 120,115" fill="#64748B" />

          {/* Text Labels 8 Directions */}
          <text x="120" y="26" textAnchor="middle" fill="#DC2626" fontSize="15" fontWeight="900" fontFamily="Fredoka">U</text>
          <text x="188" y="58" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="800">TL</text>
          <text x="214" y="125" textAnchor="middle" fill="#0369A1" fontSize="15" fontWeight="900" fontFamily="Fredoka">T</text>
          <text x="188" y="194" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="800">TG</text>
          <text x="120" y="222" textAnchor="middle" fill="#0369A1" fontSize="15" fontWeight="900" fontFamily="Fredoka">S</text>
          <text x="52" y="194" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="800">BD</text>
          <text x="26" y="125" textAnchor="middle" fill="#0369A1" fontSize="15" fontWeight="900" fontFamily="Fredoka">B</text>
          <text x="52" y="58" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="800">BL</text>

          {/* Rotating Target Needle */}
          <g transform={`rotate(${angle} 120 120)`} filter="url(#needleShadow)">
            <polygon points="120,38 128,120 120,112 112,120" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <polygon points="120,202 128,120 120,128 112,120" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
            <circle cx="120" cy="120" r="9" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="120" cy="120" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {visualMeta && (
          <div className="mt-3 text-center bg-white border border-sky-200 rounded-2xl py-1.5 px-3 w-full">
            <span className="text-[11px] font-bold text-slate-500 block">Posisi Gerak Navigator:</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#123D68]">
              {visualMeta.fromLocation} ➔ <span className="text-amber-600">{visualMeta.toLocation}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  if (visualType === 'village_map') {
    return (
      <div className="w-full max-w-md mx-auto bg-gradient-to-tr from-sky-50 via-emerald-50/50 to-amber-50 rounded-3xl p-4 border-3 border-emerald-300 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span>🗺️</span>
            <span>Sketsa Peta Desa Belajar</span>
          </span>
          <span className="text-[11px] font-extrabold text-slate-500 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
            Orientasi: Atas = Utara
          </span>
        </div>

        <svg viewBox="0 0 400 250" className="w-full h-auto rounded-2xl bg-[#E0F2FE] border-2 border-emerald-400">
          {/* Green Lands */}
          <path d="M 0,0 L 400,0 L 400,250 L 0,250 Z" fill="#DCFCE7" />

          {/* River Stream */}
          <path
            d="M 50,0 Q 120,80 180,120 T 320,180 T 400,250"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 50,0 Q 120,80 180,120 T 320,180 T 400,250"
            fill="none"
            stroke="#0284C7"
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Road Network */}
          <path d="M 200,0 L 200,250" stroke="#FDE68A" strokeWidth="18" strokeLinecap="square" />
          <path d="M 0,125 L 400,125" stroke="#FDE68A" strokeWidth="18" strokeLinecap="square" />
          <path d="M 200,0 L 200,250" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M 0,125 L 400,125" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 5" />

          {/* Bridge */}
          <rect x="188" y="115" width="24" height="20" fill="#92400E" rx="3" stroke="#FBBF24" strokeWidth="1.5" />
          <text x="200" y="129" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">Jembatan</text>

          {/* North Landmark: Lapangan Sepak Bola */}
          <rect x="165" y="18" width="70" height="42" fill="#22C55E" rx="6" stroke="#15803D" strokeWidth="2" />
          <text x="200" y="38" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">⚽ Lapangan</text>
          <text x="200" y="52" fill="#DCFCE7" fontSize="8" fontWeight="bold" textAnchor="middle">(Utara)</text>

          {/* Center Landmark: SDN Nusantara */}
          <rect x="155" y="98" width="90" height="52" fill="#3B82F6" rx="8" stroke="#1D4ED8" strokeWidth="2.5" />
          <text x="200" y="122" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">🏫 SDN Nusantara</text>
          <text x="200" y="137" fill="#FEF08A" fontSize="9" fontWeight="bold" textAnchor="middle">(Titik Tengah)</text>

          {/* South Landmark: Puskesmas */}
          <rect x="160" y="185" width="80" height="44" fill="#EF4444" rx="6" stroke="#B91C1C" strokeWidth="2" />
          <text x="200" y="206" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">🏥 Puskesmas</text>
          <text x="200" y="220" fill="#FEE2E2" fontSize="8" fontWeight="bold" textAnchor="middle">(Selatan)</text>

          {/* Southwest Landmark: Danau Biru (Pojok Kiri Bawah) */}
          <ellipse cx="65" cy="200" rx="45" ry="32" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <text x="65" y="198" fill="#0C4A6E" fontSize="10" fontWeight="900" textAnchor="middle">🌊 Danau Biru</text>
          <text x="65" y="214" fill="#0369A1" fontSize="8" fontWeight="extrabold" textAnchor="middle">(Barat Daya)</text>

          {/* East Landmark: Balai Desa */}
          <rect x="310" y="105" width="75" height="42" fill="#F59E0B" rx="6" stroke="#B45309" strokeWidth="2" />
          <text x="347" y="125" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">🏛️ Balai Desa</text>
          <text x="347" y="139" fill="#FFFBEB" fontSize="8" fontWeight="bold" textAnchor="middle">(Timur)</text>

          {/* Mini Compass Rose in Top-Right */}
          <g transform="translate(365, 30)">
            <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <polygon points="0,-14 4,0 0,-2 -4,0" fill="#EF4444" />
            <polygon points="0,14 4,0 0,2 -4,0" fill="#64748B" />
            <text x="0" y="-4" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle">U</text>
          </g>
        </svg>

        {visualMeta && (
          <div className="mt-2.5 text-center bg-white/90 border border-emerald-200 rounded-xl py-1.5 px-3">
            <span className="text-xs font-extrabold text-[#123D68]">
              Target Navigasi: <span className="text-emerald-700">{visualMeta.fromLocation}</span> ➔ <span className="text-amber-600">{visualMeta.toLocation}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  if (visualType === 'symbol_legend') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-4 border-3 border-amber-300 shadow-md">
        <div className="flex items-center gap-2 mb-3 bg-[#FFF9E7] p-2 rounded-2xl border border-amber-200">
          <span className="text-xl">📋</span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#123D68]">Kartu Pengamatan Detektif Simbol</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Berdasarkan Standar Legenda Peta Tematik Nasional</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Simbol Titik */}
          <div className="bg-sky-50 rounded-2xl p-3 border-2 border-sky-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-sky-400 flex items-center justify-center text-xl shadow-xs">
              🕌
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase block">1. Simbol Titik</span>
              <span className="text-xs font-extrabold text-slate-900">Masjid / Bangunan</span>
            </div>
          </div>

          {/* Card 2: Simbol Garis */}
          <div className="bg-emerald-50 rounded-2xl p-3 border-2 border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-emerald-400 flex items-center justify-center text-xl shadow-xs">
              〰️
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">2. Simbol Garis</span>
              <span className="text-xs font-extrabold text-slate-900">Aliran Sungai</span>
            </div>
          </div>

          {/* Card 3: Simbol Segitiga Merah */}
          <div className="bg-rose-50 rounded-2xl p-3 border-2 border-rose-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-rose-400 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <polygon points="12,2 22,20 2,20" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-800 uppercase block">Segitiga Merah</span>
              <span className="text-xs font-extrabold text-slate-900">Gunung Aktif</span>
            </div>
          </div>

          {/* Card 4: Simbol Area */}
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-amber-400 flex items-center justify-center text-xl shadow-xs">
              🌲
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block">3. Simbol Area</span>
              <span className="text-xs font-extrabold text-slate-900">Hutan / Kawasan</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'route_puzzle') {
    return (
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-purple-50 to-white rounded-3xl p-4 border-3 border-purple-300 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span>🧩</span>
            <span>Diagram Puzzle Rute Alternatif</span>
          </span>
          <span className="text-[11px] font-extrabold text-purple-700 bg-white px-2.5 py-0.5 rounded-lg border border-purple-200">
            Skala: 1 : 10.000
          </span>
        </div>

        <svg viewBox="0 0 380 180" className="w-full h-auto rounded-2xl bg-slate-900 border-2 border-purple-400">
          {/* Start Point: Balai Desa */}
          <circle cx="50" cy="90" r="24" fill="#0284C7" stroke="#38BDF8" strokeWidth="3" />
          <text x="50" y="88" fill="#FFFFFF" fontSize="16" textAnchor="middle">🏛️</text>
          <text x="50" y="104" fill="#E0F2FE" fontSize="8" fontWeight="bold" textAnchor="middle">Mulai</text>

          {/* Route Red (Danger): Upper loop */}
          <path d="M 74,80 C 130,20 220,20 290,75" fill="none" stroke="#EF4444" strokeWidth="6" strokeDasharray="8 4" />
          {/* Red X over broken bridge */}
          <g transform="translate(180, 36)">
            <circle cx="0" cy="0" r="14" fill="#991B1B" stroke="#FCA5A5" strokeWidth="2" />
            <text x="0" y="5" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">❌</text>
            <text x="0" y="24" fill="#FCA5A5" fontSize="7" fontWeight="bold" textAnchor="middle">Jembatan Rusak (2 cm)</text>
          </g>

          {/* Route Green (Safe): Lower road */}
          <path d="M 74,100 C 140,165 240,165 290,105" fill="none" stroke="#22C55E" strokeWidth="7" />
          {/* Green bridge icon */}
          <g transform="translate(190, 152)">
            <rect x="-24" y="-10" width="48" height="20" fill="#15803D" rx="4" stroke="#86EFAC" strokeWidth="2" />
            <text x="0" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">Jembatan Beton (4 cm)</text>
          </g>

          {/* Destination: Bukit Pinus */}
          <circle cx="320" cy="90" r="26" fill="#F59E0B" stroke="#FDE68A" strokeWidth="3" />
          <text x="320" y="88" fill="#FFFFFF" fontSize="16" textAnchor="middle">🏕️</text>
          <text x="320" y="104" fill="#FEF3C7" fontSize="8" fontWeight="bold" textAnchor="middle">Tujuan</text>
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-bold">
          <div className="bg-rose-50 border border-rose-300 text-rose-800 p-1.5 rounded-xl">
            ⛔ Rute Merah: 2 cm (Jembatan Rusak)
          </div>
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-1.5 rounded-xl">
            ✅ Rute Hijau: 4 cm (Bebas Hambatan)
          </div>
        </div>
      </div>
    );
  }

  // Scale Ruler Visual
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-3xl p-4 border-3 border-sky-300 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-black text-sky-900 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
          <span>📏</span>
          <span>Skala Grafis Batang Pengukur</span>
        </span>
        <span className="text-[11px] font-bold text-slate-500">
          {visualMeta?.scaleRatio || '1 cm = 500 meter'}
        </span>
      </div>

      <div className="p-3 bg-white rounded-2xl border-2 border-slate-200">
        <svg viewBox="0 0 320 60" className="w-full h-auto">
          {/* Main ruler bars */}
          <rect x="20" y="20" width="70" height="14" fill="#1E293B" />
          <rect x="90" y="20" width="70" height="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <rect x="160" y="20" width="70" height="14" fill="#1E293B" />
          <rect x="230" y="20" width="70" height="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

          {/* Scale numbers */}
          <text x="20" y="14" fill="#0F172A" fontSize="10" fontWeight="900" textAnchor="middle">0</text>
          <text x="90" y="14" fill="#0F172A" fontSize="10" fontWeight="900" textAnchor="middle">500 m</text>
          <text x="160" y="14" fill="#0F172A" fontSize="10" fontWeight="900" textAnchor="middle">1.000 m</text>
          <text x="230" y="14" fill="#0F172A" fontSize="10" fontWeight="900" textAnchor="middle">1.500 m</text>
          <text x="300" y="14" fill="#0F172A" fontSize="10" fontWeight="900" textAnchor="middle">2.000 m</text>

          {/* Unit callout */}
          <text x="160" y="52" fill="#0284C7" fontSize="9" fontWeight="bold" textAnchor="middle">
            Setiap 1 cm pada peta = 500 meter sebenarnya di lapangan
          </text>
        </svg>
      </div>
    </div>
  );
};
