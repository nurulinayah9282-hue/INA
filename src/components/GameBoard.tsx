import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { QUESTIONS } from '../data/questions';
import { MapIllustration } from './MapIllustration';
import {
  Dice5,
  BookOpen,
  Puzzle,
  Award,
  CheckCircle2,
  Sparkles,
  Compass,
  Trophy,
  HelpCircle,
  Lock,
  Check,
  Star,
  Flag,
  RotateCw,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface GameBoardProps {
  studentRecord: StudentRecord;
  onSelectQuestion: (questionId: number) => void;
  onNavigate: (page: NavigationPage) => void;
}

// Coordinate positions (%) along the illustrated village adventure trail
const NODE_COORDINATES: Record<number, { x: number; y: number }> = {
  // Zona 1: Berani Mencoba (Kuning Keemasan)
  1: { x: 8, y: 84 },
  2: { x: 14, y: 73 },
  3: { x: 21, y: 75 },
  4: { x: 29, y: 80 },
  5: { x: 37, y: 70 },
  6: { x: 28, y: 55 },

  // Zona 2: Pantang Menyerah (Oranye Terang)
  7: { x: 21, y: 46 },
  8: { x: 17, y: 33 },
  9: { x: 26, y: 24 },
  10: { x: 36, y: 20 },
  11: { x: 44, y: 23 },
  12: { x: 52, y: 20 },
  13: { x: 59, y: 28 },

  // Zona 3: Belajar dari Kesalahan (Hijau Zamrud)
  14: { x: 51, y: 44 },
  15: { x: 44, y: 60 },
  16: { x: 52, y: 68 },
  17: { x: 62, y: 72 },
  18: { x: 71, y: 64 },
  19: { x: 67, y: 47 },

  // Zona 4: Sahabat yang Mendukung (Biru Langit & Laut)
  20: { x: 64, y: 34 },
  21: { x: 66, y: 22 },
  22: { x: 77, y: 22 },
  23: { x: 87, y: 34 },
  24: { x: 82, y: 56 },
  25: { x: 88, y: 86 },
};

export const GameBoard: React.FC<GameBoardProps> = ({
  studentRecord,
  onSelectQuestion,
  onNavigate,
}) => {
  const [selectedNodeHover, setSelectedNodeHover] = useState<number | null>(null);
  const progress = studentRecord?.progress || {
    status: 'belum_mulai',
    score: 0,
    completedQuestions: [],
    attempts: {},
    answers: {},
    currentPosition: 1,
    unlockedPuzzlePieces: [],
    unlockedBadges: [],
    initialGrowMapCompleted: false,
    finalGrowMapCompleted: false,
    growMapInitial: {},
    growMapFinal: {},
    reflectionAnswers: {},
    supportChallengeDone: false,
    lastUpdated: new Date().toISOString(),
  };
  const completedIds = progress.completedQuestions || [];
  const currentPos = progress.currentPosition || 1;

  const totalScore = progress.score || 0;
  const completedCount = completedIds.length;
  const puzzleCount = (progress.unlockedPuzzlePieces || []).length;
  const badgesCount = (progress.unlockedBadges || []).length;

  const handleNodeClick = (id: number) => {
    audioManager.playClickSound();
    onSelectQuestion(id);
    onNavigate('challenge');
  };

  const getZoneStyle = (zone: number) => {
    switch (zone) {
      case 1:
        return {
          bg: 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300',
          border: 'border-amber-500',
          ring: 'ring-amber-300',
          text: 'text-amber-950',
          zoneName: 'Zona 1: Berani Mencoba',
          badgeColor: 'bg-amber-100 text-amber-900',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400',
          border: 'border-orange-600',
          ring: 'ring-orange-300',
          text: 'text-white',
          zoneName: 'Zona 2: Pantang Menyerah',
          badgeColor: 'bg-orange-100 text-orange-900',
        };
      case 3:
        return {
          bg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-400',
          border: 'border-emerald-600',
          ring: 'ring-emerald-300',
          text: 'text-white',
          zoneName: 'Zona 3: Belajar dari Kesalahan',
          badgeColor: 'bg-emerald-100 text-emerald-900',
        };
      case 4:
        return {
          bg: 'bg-gradient-to-tr from-sky-500 via-blue-500 to-cyan-400',
          border: 'border-sky-600',
          ring: 'ring-sky-300',
          text: 'text-white',
          zoneName: 'Zona 4: Sahabat yang Mendukung',
          badgeColor: 'bg-sky-100 text-sky-900',
        };
      default:
        return {
          bg: 'bg-slate-400',
          border: 'border-slate-600',
          ring: 'ring-slate-300',
          text: 'text-white',
          zoneName: 'Zona Petualangan',
          badgeColor: 'bg-slate-100 text-slate-900',
        };
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col justify-between p-2.5 sm:p-4 bg-transparent overflow-x-hidden">
      {/* Top Quick Status & Actions Toolbar */}
      <div className="max-w-7xl mx-auto w-full mb-2 sm:mb-3">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 px-3.5 sm:px-5 border-2 border-sky-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
          {/* Active Student Info */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#FFC928] to-amber-200 p-0.5 border border-amber-400 flex items-center justify-center text-lg sm:text-xl shadow-xs">
              {studentRecord.profile.avatar.startsWith('girl') ? '👧' : '👦'}
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">
                Petualang Peta
              </div>
              <div className="text-sm sm:text-base font-extrabold font-fredoka text-[#123D68] leading-tight flex items-center gap-1.5 mt-0.5">
                <span>{studentRecord.profile.name}</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                  {studentRecord.profile.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics & Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            {/* Score */}
            <div className="bg-[#FFF9E7] border border-amber-300 rounded-xl sm:rounded-2xl px-2.5 sm:px-3 py-1 flex items-center gap-1.5 shadow-xs">
              <span className="text-sm sm:text-base">⭐</span>
              <div className="leading-tight">
                <span className="text-[8px] text-amber-800 font-bold uppercase block">Skor</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#123D68]">
                  {totalScore} <span className="text-[9px] text-slate-400">/ 250</span>
                </span>
              </div>
            </div>

            {/* Challenges Completed */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl sm:rounded-2xl px-2.5 sm:px-3 py-1 flex items-center gap-1.5 shadow-xs">
              <span className="text-sm sm:text-base">🗺️</span>
              <div className="leading-tight">
                <span className="text-[8px] text-emerald-800 font-bold uppercase block">Pos Selesai</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#21A447]">
                  {completedCount} <span className="text-[9px] text-slate-400">/ 25</span>
                </span>
              </div>
            </div>

            {/* Puzzle Pieces */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('puzzle');
              }}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl sm:rounded-2xl px-2.5 sm:px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Lihat Keping Puzzle GROW yang sudah terbuka"
            >
              <Puzzle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <div className="text-left leading-tight">
                <span className="text-[8px] text-amber-800 font-bold uppercase block">Puzzle</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#123D68]">
                  {puzzleCount}/6
                </span>
              </div>
            </button>

            {/* Badges */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('badges');
              }}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl sm:rounded-2xl px-2.5 sm:px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Lihat Lencana & Badge Petualang"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <div className="text-left leading-tight">
                <span className="text-[8px] text-purple-800 font-bold uppercase block">Badge</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#123D68]">
                  {badgesCount}
                </span>
              </div>
            </button>

            {/* DICE BUTTON */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('dice');
              }}
              className="bg-[#FF9F1C] hover:bg-orange-600 active:scale-95 text-white font-fredoka font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-b-3 border-orange-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Lempar Dadu untuk Melangkah ke Pos Baru"
            >
              <Dice5 className="w-4 h-4" />
              <span>LEMPAR DADU</span>
            </button>

            {/* MATERI BUTTON */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('material');
              }}
              className="bg-[#55C7F2] hover:bg-sky-500 active:scale-95 text-white font-fredoka font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-b-3 border-sky-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Buka Bekal Rangkuman & Poster Materi Peta"
            >
              <BookOpen className="w-4 h-4" />
              <span>MATERI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Adventure Village Map Arena */}
      <div className="max-w-7xl mx-auto w-full flex-1 relative flex flex-col justify-center">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.6] max-h-[74vh] rounded-3xl border-4 border-sky-300 shadow-2xl overflow-hidden bg-white">
          {/* SVG Map Base Layer with 3D Isometric Living Village */}
          <MapIllustration />

          {/* Start Banner (Pos 1) */}
          <div className="absolute top-[88%] left-[3%] z-15 -translate-y-1/2 pointer-events-none">
            <div className="bg-[#21A447] text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-lg border-2 border-white flex items-center gap-1 animate-bounce">
              <span>🚩</span>
              <span>START</span>
            </div>
          </div>

          {/* Finish Banner (Pos 25 near Ocean Bay) */}
          <div className="absolute top-[88%] left-[91%] z-15 -translate-y-1/2 pointer-events-none">
            <div className="bg-amber-500 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-lg border-2 border-white flex items-center gap-1 animate-pulse">
              <span>🏆</span>
              <span>FINISH</span>
            </div>
          </div>

          {/* 25 Enhanced 3D Cartoon Gemstone Pins */}
          {QUESTIONS.map((q) => {
            const coords = NODE_COORDINATES[q.id] || { x: 50, y: 50 };
            const isCompleted = completedIds.includes(q.id);
            const isCurrentPawn = currentPos === q.id;
            const attemptsCount = progress.attempts[q.id] || 0;
            const isNeedsRetry = !isCompleted && attemptsCount > 0;

            // Pos terkunci: Belum dikerjakan, bukan posisi aktif, dan pos sebelumnya belum selesai
            const isLocked = q.id > 1 && !isCompleted && !isCurrentPawn && !completedIds.includes(q.id - 1);
            const style = getZoneStyle(q.zone);

            return (
              <div
                key={q.id}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                onMouseEnter={() => setSelectedNodeHover(q.id)}
                onMouseLeave={() => setSelectedNodeHover(null)}
              >
                {/* Visual Aura Glow for Active Current Node */}
                {isCurrentPawn && (
                  <>
                    <span className="absolute -inset-2.5 sm:-inset-3.5 rounded-2xl bg-amber-400/40 animate-ping pointer-events-none" />
                    <span className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-amber-300/50 blur-xs pointer-events-none" />
                  </>
                )}
                {isCompleted && (
                  <span className="absolute -inset-1 rounded-2xl bg-emerald-400/30 animate-pulse pointer-events-none" />
                )}

                {/* 3D Cartoon Pin Button */}
                <button
                  type="button"
                  onClick={() => handleNodeClick(q.id)}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm font-fredoka shadow-lg border-2 sm:border-3 transition-all duration-200 cursor-pointer overflow-hidden ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white border-amber-300 ring-2 ring-emerald-400/70 shadow-emerald-900/35 hover:scale-115'
                      : isCurrentPawn
                      ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-900 border-white ring-4 ring-amber-300/80 shadow-xl shadow-amber-500/50 glow-gold-soft scale-110 hover:scale-125'
                      : isNeedsRetry
                      ? 'bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 text-white border-white ring-3 ring-orange-400/80 shadow-md shadow-orange-700/30 hover:scale-115 pulse-warm'
                      : isLocked
                      ? 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 text-slate-600 border-slate-300 ring-1 ring-slate-400/40 opacity-85 hover:opacity-100 hover:scale-110 shadow-sm'
                      : `${style.bg} ${style.text} border-white ring-2 ring-slate-400/40 hover:scale-115 shadow-md`
                  }`}
                  title={`Tantangan #${q.id}: ${q.topic} ${
                    isCompleted
                      ? '(Selesai ✅)'
                      : isCurrentPawn
                      ? '(Pos Aktif 📍)'
                      : isLocked
                      ? '(Terkunci 🔒)'
                      : isNeedsRetry
                      ? '(Perlu Dicoba Lagi 🔄)'
                      : ''
                  }`}
                >
                  {/* Glossy top bevel reflection */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-xl pointer-events-none" />

                  {/* Node Icon Content */}
                  {isCompleted ? (
                    <div className="flex items-center justify-center relative z-10">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 stroke-[3.5] drop-shadow-sm" />
                      <span className="absolute -bottom-1 -right-1 text-[8px] font-black text-emerald-100 opacity-80">
                        {q.id}
                      </span>
                    </div>
                  ) : isCurrentPawn ? (
                    <div className="flex items-center justify-center relative z-10 font-black text-slate-950">
                      <span className="text-xs sm:text-base drop-shadow-xs">{q.id}</span>
                    </div>
                  ) : isLocked ? (
                    <div className="flex items-center justify-center relative z-10 text-slate-600 font-bold">
                      <span className="text-[11px] sm:text-xs">{q.id}</span>
                      <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-slate-700 text-amber-300 rounded-full border border-white flex items-center justify-center shadow-xs">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  ) : isNeedsRetry ? (
                    <div className="flex items-center justify-center relative z-10">
                      <span>{q.id}</span>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 text-white rounded-full border border-white flex items-center justify-center text-[9px] shadow-xs">
                        <RotateCw className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  ) : (
                    <span className="relative z-10 drop-shadow-xs">{q.id}</span>
                  )}
                </button>

                {/* Floating Character Pawn above Current Node */}
                {isCurrentPawn && (
                  <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce z-30 flex flex-col items-center">
                    <div className="bg-[#123D68] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-amber-300 flex items-center gap-1">
                      <span className="text-amber-300 font-mono">Pos #{q.id}</span>
                      <span>📍</span>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#FFC928] to-amber-200 border-2 border-amber-400 flex items-center justify-center text-sm shadow-md mt-0.5">
                      {studentRecord.profile.avatar.startsWith('girl') ? '👧' : '👦'}
                    </div>
                    <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-400 -mt-0.5" />
                  </div>
                )}

                {/* Rich Hover Tooltip Card */}
                {selectedNodeHover === q.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-40 pointer-events-none w-52 sm:w-60 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-2 border-amber-300 text-left animate-pop">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase mb-1">
                      <span className="text-amber-800">{style.zoneName}</span>
                      <span className="font-extrabold">
                        {isCompleted ? (
                          <span className="text-emerald-700">✅ Selesai</span>
                        ) : isCurrentPawn ? (
                          <span className="text-amber-600">🎯 Pos Aktif</span>
                        ) : isLocked ? (
                          <span className="text-slate-500">🔒 Terkunci</span>
                        ) : isNeedsRetry ? (
                          <span className="text-orange-600">🔄 Coba Lagi</span>
                        ) : (
                          <span className="text-sky-700">⏳ Terbuka</span>
                        )}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#123D68] leading-snug">
                      #{q.id}. {q.topic}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between border-t border-slate-100 pt-1">
                      <span>Nilai: 10 Poin</span>
                      <span className="text-amber-700 font-bold">
                        {isLocked ? 'Klik untuk uji tantangan' : 'Klik untuk buka soal!'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Game Map Legend Bar: Status Pos & 4 Zona Belajar */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-white/95 rounded-2xl px-3 sm:px-4 py-2 border-2 border-sky-100 text-[11px] sm:text-xs font-bold text-slate-700 shadow-xs">
          {/* Status Penanda Pos (4 Status Sesuai Ketentuan) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 border-r border-slate-200 pr-3">
            <span className="text-slate-400 uppercase text-[10px] font-black">Status Pos:</span>
            {/* 1. Pos Aktif */}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 border border-white glow-gold-soft flex items-center justify-center text-slate-900 text-[9px] font-black">
                ●
              </span>
              <span className="text-amber-800 font-extrabold">Pos Aktif (Emas)</span>
            </div>
            {/* 2. Pos Selesai */}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-emerald-500 border border-amber-300 flex items-center justify-center text-white text-[9px] font-black">
                ✓
              </span>
              <span className="text-emerald-800 font-extrabold">Selesai (Hijau)</span>
            </div>
            {/* 3. Pos Terkunci */}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-slate-300 border border-slate-400 flex items-center justify-center text-slate-700 text-[9px]">
                🔒
              </span>
              <span className="text-slate-600 font-medium">Terkunci (Abu-abu)</span>
            </div>
            {/* 4. Pos Perlu Dicoba Ulang */}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-orange-500 border border-white flex items-center justify-center text-white text-[9px]">
                🔄
              </span>
              <span className="text-orange-800 font-bold">Coba Lagi (Oranye)</span>
            </div>
          </div>

          {/* 4 Zona Belajar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-black">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>4 Zona:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 inline-block" />
              <span>Zona 1 (1-6)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-700 inline-block" />
              <span>Zona 2 (7-13)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-700 inline-block" />
              <span>Zona 3 (14-19)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-700 inline-block" />
              <span>Zona 4 (20-25)</span>
            </div>
          </div>

          {/* Completion Celebration Shortcut */}
          {completedCount >= 25 && (
            <button
              onClick={() => {
                audioManager.playFanfareSound();
                onNavigate('reflection');
              }}
              className="bg-[#21A447] text-white px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-sm hover:bg-emerald-600 transition-all cursor-pointer animate-pop"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Buka Refleksi Akhir & Sertifikat! 🎓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
