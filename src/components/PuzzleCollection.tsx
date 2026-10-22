import React, { useEffect } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { PUZZLE_PIECES, FULL_PUZZLE_MOTTO } from '../data/badges';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, Award, Lock, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface PuzzleCollectionProps {
  studentRecord: StudentRecord;
  onNavigate: (page: NavigationPage) => void;
}

export const PuzzleCollection: React.FC<PuzzleCollectionProps> = ({
  studentRecord,
  onNavigate,
}) => {
  const progress = studentRecord.progress;
  const unlockedPieces = progress.unlockedPuzzlePieces; // e.g. [0, 1, 2, 3, 4, 5]
  const isAllCompleted = unlockedPieces.length === 6;

  useEffect(() => {
    if (isAllCompleted) {
      audioManager.playFanfareSound();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  }, [isAllCompleted]);

  // Question milestone needed for each piece
  const MILESTONES = [4, 8, 12, 16, 20, 25];

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-10 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9] flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('board');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE PETA</span>
          </button>

          <span className="text-xs font-bold bg-[#FF9F1C] text-white px-3 py-1.5 rounded-full shadow-xs">
            {unlockedPieces.length} dari 6 Keping Terbuka
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#FFC928] text-[#123D68] font-extrabold text-xs uppercase px-3.5 py-1 rounded-full mb-2 tracking-wider">
            Koleksi Puzzle Karakter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#123D68]">
            {isAllCompleted ? 'Selamat! Puzzle Berhasil Disusun!' : 'Puzzle yang Kamu Kumpulkan'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            {isAllCompleted
              ? 'Enam kepingan emas telah bersatu membentuk pesan pembelajar sejati!'
              : 'Selesaikan tantangan di peta untuk membuka setiap kepingan kata rahasia!'}
          </p>
        </div>

        {/* 6 Puzzle Pieces Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-200 shadow-xl mb-8 relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {PUZZLE_PIECES.map((piece, idx) => {
              const isUnlocked = unlockedPieces.includes(piece.index);
              const milestone = MILESTONES[idx];

              return (
                <div
                  key={piece.index}
                  className={`aspect-[4/3] rounded-3xl border-3 p-4 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden select-none ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-[#FFF9E7] to-amber-100 border-amber-400 shadow-lg scale-102 animate-pop'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <div className="text-3xl sm:text-4xl mb-1">{piece.icon}</div>
                      <div className="text-lg sm:text-2xl font-black font-fredoka text-[#123D68] tracking-wider text-center">
                        {piece.text}
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-full mt-1">
                        Keping #{idx + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-8 h-8 mb-2 text-slate-300" />
                      <span className="text-xs font-bold text-slate-400 text-center">
                        Terbuka pada {milestone} Soal
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        (Selesai: {progress.completedQuestions.length}/{milestone})
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grand assembled message banner */}
          <div
            className={`rounded-2xl p-5 border-3 transition-all text-center ${
              isAllCompleted
                ? 'bg-gradient-to-r from-emerald-100 via-amber-100 to-sky-100 border-emerald-400 shadow-md'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-1">
              {isAllCompleted ? 'Pesan Emas Terangkai Sempurna:' : 'Pesan yang Sedang Disusun:'}
            </div>
            <div
              className={`text-xl sm:text-2xl md:text-3xl font-black font-fredoka ${
                isAllCompleted ? 'text-[#123D68]' : 'text-slate-400'
              }`}
            >
              “{isAllCompleted ? FULL_PUZZLE_MOTTO : '??? ??? ??? ??? ??? ???'}”
            </div>
          </div>
        </div>

        {/* Encouraging message if completed */}
        {isAllCompleted && (
          <div className="bg-emerald-50 border-3 border-emerald-300 rounded-3xl p-5 sm:p-6 mb-8 text-center animate-pop">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
              🏆
            </div>
            <h4 className="text-lg font-bold font-fredoka text-[#21A447]">
              Hebat Sekali, {studentRecord.profile.name}!
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-lg mx-auto mt-1 leading-relaxed">
              “Ingat selalu, kemampuanmu dapat berkembang ketika kamu rajin berlatih, berani mencoba strategi baru, dan belajar dari kesalahan!”
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('badges');
            }}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-fredoka font-bold text-sm sm:text-base py-3 px-6 rounded-2xl shadow-md border-b-3 border-purple-900 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>LIHAT BADGE SAYA</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('reflection');
            }}
            className="bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-sm sm:text-base py-3 px-6 rounded-2xl shadow-md border-b-3 border-emerald-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>ISI REFLEKSI BELAJAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
