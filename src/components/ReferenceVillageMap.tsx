import React from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';

export interface LandmarkInfo {
  id: string;
  name: string;
  label: string;
  category: string;
  icon: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  pos: { x: number; y: number }; // Percentage on map: 0..100
  dirFromSchool: string;
}

export const VILLAGE_LANDMARKS: Record<string, LandmarkInfo> = {
  sekolah: {
    id: 'sekolah',
    name: 'SD Harapan',
    label: 'SD Harapan (Pusat)',
    category: 'Pendidikan',
    icon: '🏫',
    badgeBg: 'bg-amber-100',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-950',
    pos: { x: 50, y: 50 },
    dirFromSchool: 'Pusat Acuan',
  },
  pasar: {
    id: 'pasar',
    name: 'Pasar Desa',
    label: 'Pasar Desa (Utara)',
    category: 'Perdagangan',
    icon: '🛒',
    badgeBg: 'bg-orange-100',
    borderColor: 'border-orange-400',
    textColor: 'text-orange-950',
    pos: { x: 50, y: 15 },
    dirFromSchool: 'Utara',
  },
  taman: {
    id: 'taman',
    name: 'Taman Bermain',
    label: 'Taman Bermain (Barat)',
    category: 'Rekreasi',
    icon: '🌳',
    badgeBg: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-950',
    pos: { x: 18, y: 50 },
    dirFromSchool: 'Barat',
  },
  masjid: {
    id: 'masjid',
    name: 'Masjid Desa',
    label: 'Masjid Desa (Selatan)',
    category: 'Ibadah',
    icon: '🕌',
    badgeBg: 'bg-teal-100',
    borderColor: 'border-teal-400',
    textColor: 'text-teal-950',
    pos: { x: 50, y: 84 },
    dirFromSchool: 'Selatan',
  },
  kantor_pos: {
    id: 'kantor_pos',
    name: 'Kantor Pos',
    label: 'Kantor Pos (Barat Laut)',
    category: 'Layanan Publik',
    icon: '📮',
    badgeBg: 'bg-sky-100',
    borderColor: 'border-sky-400',
    textColor: 'text-sky-950',
    pos: { x: 20, y: 18 },
    dirFromSchool: 'Barat Laut',
  },
  puskesmas: {
    id: 'puskesmas',
    name: 'Puskesmas',
    label: 'Puskesmas (Timur Laut)',
    category: 'Kesehatan',
    icon: '🏥',
    badgeBg: 'bg-rose-100',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-950',
    pos: { x: 80, y: 18 },
    dirFromSchool: 'Timur Laut / Utara Perumahan',
  },
  perumahan: {
    id: 'perumahan',
    name: 'Perumahan Warga',
    label: 'Perumahan Warga (Timur)',
    category: 'Pemukiman',
    icon: '🏠',
    badgeBg: 'bg-indigo-100',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-950',
    pos: { x: 80, y: 50 },
    dirFromSchool: 'Timur',
  },
  jembatan: {
    id: 'jembatan',
    name: 'Jembatan Kayu',
    label: 'Jembatan Kayu (Tenggara)',
    category: 'Infrastruktur / Sungai',
    icon: '🌉',
    badgeBg: 'bg-amber-100',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-950',
    pos: { x: 80, y: 82 },
    dirFromSchool: 'Tenggara',
  },
};

interface ReferenceVillageMapProps {
  highlighted?: string[]; // IDs or names: e.g. ['sekolah', 'pasar']
  vectorArrow?: {
    from: string; // key of VILLAGE_LANDMARKS
    to: string; // key of VILLAGE_LANDMARKS
    label?: string;
  };
  compact?: boolean;
  title?: string;
  showLegend?: boolean;
}

export const ReferenceVillageMap: React.FC<ReferenceVillageMapProps> = ({
  highlighted = [],
  vectorArrow,
  compact = false,
  title = 'Peta Referensi Lingkungan Desa Harapan',
  showLegend = true,
}) => {
  const normHighlighted = highlighted.map((h) => h.toLowerCase().trim());

  // Helper to get coordinates for arrow
  const fromLandmark = vectorArrow ? VILLAGE_LANDMARKS[vectorArrow.from.toLowerCase()] : null;
  const toLandmark = vectorArrow ? VILLAGE_LANDMARKS[vectorArrow.to.toLowerCase()] : null;

  return (
    <div className="bg-white rounded-3xl border-3 border-sky-300 shadow-md p-3 sm:p-4 select-none relative overflow-hidden flex flex-col justify-between">
      {/* Map Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-sky-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h4 className="text-xs sm:text-sm font-extrabold font-fredoka text-[#123D68]">
            {title}
          </h4>
        </div>
        <span className="text-[10px] font-bold bg-[#FFF9E7] border border-amber-300 text-amber-900 px-2 py-0.5 rounded-full">
          Fase B Kelas IV
        </span>
      </div>

      {/* Main Map Canvas Area */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border-2 border-sky-200 bg-gradient-to-b from-[#E7F8FF] via-[#E4F8DA] to-[#D5F2C8] ${
          compact ? 'aspect-[4/3] max-h-[320px]' : 'aspect-[16/11] max-h-[460px]'
        }`}
      >
        {/* SVG Background Map Drawing (Grid, roads, river) */}
        <svg
          viewBox="0 0 600 440"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="refRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#63D2F7" />
              <stop offset="100%" stopColor="#25A9E0" />
            </linearGradient>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#E63946" />
            </marker>
          </defs>

          {/* Faint Geographic Grid Lines */}
          <g stroke="#C6E9BA" strokeWidth="1" strokeDasharray="4,6">
            <line x1="120" y1="0" x2="120" y2="440" />
            <line x1="300" y1="0" x2="300" y2="440" />
            <line x1="480" y1="0" x2="480" y2="440" />
            <line x1="0" y1="80" x2="600" y2="80" />
            <line x1="0" y1="220" x2="600" y2="220" />
            <line x1="0" y1="360" x2="600" y2="360" />
          </g>

          {/* River in the East/Southeast */}
          <path
            d="M450,0 C460,90 530,170 510,260 C490,340 550,390 580,440"
            fill="none"
            stroke="url(#refRiverGrad)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          {/* Water ripple flow */}
          <path
            d="M450,0 C460,90 530,170 510,260 C490,340 550,390 580,440"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="8,14"
            className="animate-water"
          />

          {/* Main Roads / Pathways */}
          {/* Horizontal main street connecting West (Taman) -> Center (Sekolah) -> East (Perumahan) */}
          <path
            d="M80,220 L520,220"
            stroke="#FDE4A3"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M80,220 L520,220"
            stroke="#D6A53B"
            strokeWidth="2"
            strokeDasharray="6,8"
          />

          {/* Vertical main street connecting North (Pasar) -> Center (Sekolah) -> South (Masjid) */}
          <path
            d="M300,60 L300,380"
            stroke="#FDE4A3"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M300,60 L300,380"
            stroke="#D6A53B"
            strokeWidth="2"
            strokeDasharray="6,8"
          />

          {/* Diagonal connecting road to Northwest (Kantor Pos) */}
          <path
            d="M120,80 L300,220"
            stroke="#FDE4A3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Road connecting Perumahan to Puskesmas (North of Perumahan) */}
          <path
            d="M480,220 L480,80"
            stroke="#FDE4A3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Road crossing Jembatan Kayu over the river to Southeast */}
          <path
            d="M480,220 L480,360"
            stroke="#FDE4A3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Jembatan Kayu symbol on river */}
          <rect
            x="485"
            y="320"
            width="36"
            height="18"
            rx="3"
            fill="#B26A28"
            stroke="#63390F"
            strokeWidth="2"
            transform="rotate(15 503 329)"
          />

          {/* Directional vector arrow between two compared landmarks (if requested) */}
          {fromLandmark && toLandmark && (
            <g>
              <line
                x1={(fromLandmark.pos.x / 100) * 600}
                y1={(fromLandmark.pos.y / 100) * 440}
                x2={(toLandmark.pos.x / 100) * 600}
                y2={(toLandmark.pos.y / 100) * 440}
                stroke="#E63946"
                strokeWidth="5"
                strokeDasharray="8,6"
                markerEnd="url(#arrowhead)"
              />
            </g>
          )}
        </svg>

        {/* Vector Arrow floating badge in center of the line */}
        {fromLandmark && toLandmark && vectorArrow?.label && (
          <div
            style={{
              left: `${(fromLandmark.pos.x + toLandmark.pos.x) / 2}%`,
              top: `${(fromLandmark.pos.y + toLandmark.pos.y) / 2}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 bg-rose-600 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white animate-bounce"
          >
            {vectorArrow.label}
          </div>
        )}

        {/* Compass Rose Widget in Top-Left / Side */}
        <div className="absolute top-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-xs p-2 rounded-2xl shadow-md border-2 border-sky-300 flex flex-col items-center">
          <div className="text-[10px] sm:text-[11px] font-black text-rose-600 leading-tight">
            U (Utara) ⬆️
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-[#123D68] my-0.5">
            <span>⬅️ B</span>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              🧭
            </div>
            <span>T ➡️</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-black text-sky-800 leading-tight">
            ⬇️ S (Selatan)
          </div>
        </div>

        {/* Interactive Landmark Pins */}
        {Object.values(VILLAGE_LANDMARKS).map((lm) => {
          const isHighlighted =
            normHighlighted.includes(lm.id) ||
            normHighlighted.includes(lm.name.toLowerCase()) ||
            normHighlighted.includes(lm.dirFromSchool.toLowerCase());

          return (
            <div
              key={lm.id}
              style={{
                left: `${lm.pos.x}%`,
                top: `${lm.pos.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-300"
            >
              <div
                className={`flex flex-col items-center text-center transition-all ${
                  isHighlighted ? 'scale-115 z-30' : 'scale-100 hover:scale-105'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 transition-all ${
                    isHighlighted
                      ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-300/80 animate-bounce'
                      : `${lm.badgeBg} ${lm.borderColor}`
                  }`}
                >
                  <span>{lm.icon}</span>
                </div>

                {/* Name Label */}
                <div
                  className={`mt-1 px-2 py-0.5 rounded-xl shadow-xs font-extrabold text-[10px] sm:text-[11px] whitespace-nowrap border ${
                    isHighlighted
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-200'
                      : 'bg-white/95 text-[#123D68] border-slate-200'
                  }`}
                >
                  {lm.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Legend Box at bottom */}
      {showLegend && (
        <div className="mt-2.5 pt-2 border-t border-sky-100 bg-[#FFF9E7]/70 rounded-xl p-2 text-[10px] sm:text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-extrabold text-[#123D68] flex items-center gap-1">
              <span>📋</span> Kotak Legenda Peta:
            </span>
            <span className="text-slate-500 font-medium">Titik Acuan: SD Harapan (Pusat)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-slate-700 font-semibold">
            <div>🏫 SD Harapan (Pusat)</div>
            <div>🛒 Pasar (Utara)</div>
            <div>🌳 Taman (Barat)</div>
            <div>🏠 Perumahan (Timur)</div>
            <div>🕌 Masjid (Selatan)</div>
            <div>🏥 Puskesmas (Timur Laut)</div>
            <div>📮 Kantor Pos (Barat Laut)</div>
            <div>🌉 Jembatan (Tenggara)</div>
          </div>
        </div>
      )}
    </div>
  );
};
