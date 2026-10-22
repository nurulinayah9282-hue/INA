import React, { useState } from 'react';
import { NavigationPage } from '../types';
import { Play, BookOpen, Compass, Sparkles, Volume2, Users } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface CoverPageProps {
  onNavigate: (page: NavigationPage) => void;
  activeStudentName: string;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onNavigate, activeStudentName }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeakWelcome = () => {
    const text =
      'Halo Petualang Cilik! Selamat datang di GROW PUZZLE DIGITAL: Petualangan Belajar dengan Semangat Tumbuh dan Berkembang. Mari mengenal peta dan taklukkan dua puluh lima tantangan seru bersama!';
    setIsPlayingAudio(true);
    audioManager.speak(text, () => setIsPlayingAudio(false));
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col justify-between relative overflow-hidden bg-transparent py-6 sm:py-10 px-4">
      {/* Decorative floating cartoon background items */}
      <div className="absolute top-6 left-6 text-4xl animate-bounce duration-1000 select-none opacity-80 pointer-events-none">
        ☁️
      </div>
      <div className="absolute top-12 right-12 text-5xl animate-bounce duration-700 select-none opacity-80 pointer-events-none">
        ☁️
      </div>
      <div className="absolute bottom-16 left-10 text-4xl select-none opacity-40 pointer-events-none">
        🌳
      </div>
      <div className="absolute bottom-12 right-10 text-4xl select-none opacity-40 pointer-events-none">
        🏡
      </div>

      <div className="max-w-3xl mx-auto w-full text-center relative z-10 flex-1 flex flex-col justify-center items-center bg-white/92 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-3 border-sky-300 shadow-2xl my-2">
        {/* Badge header */}
        <div className="inline-flex items-center gap-2 bg-[#FFF9E7] border-2 border-[#FFC928] px-4 py-1.5 rounded-full shadow-sm mb-3 animate-pop">
          <span className="text-lg">🧭</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#123D68] tracking-wide">
            IPAS KELAS IV SD — FASE B
          </span>
          <span className="text-xs font-bold bg-[#21A447] text-white px-2 py-0.5 rounded-full">
            Materi: Mengenal Peta
          </span>
        </div>

        {/* Big title */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-fredoka tracking-tight text-[#123D68] drop-shadow-sm">
            GROW PUZZLE <span className="text-[#21A447]">DIGITAL</span>
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-[#FF9F1C] font-fredoka mt-1 max-w-2xl mx-auto leading-snug">
            Petualangan Belajar dengan Semangat Tumbuh dan Berkembang
          </p>
        </div>

        {/* Mascot / Cartoon Hero Illustration */}
        <div className="relative my-4 sm:my-6 max-w-md w-full">
          <div className="relative bg-white/80 backdrop-blur-sm border-4 border-sky-300 rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
            <div className="flex justify-center items-center gap-4 sm:gap-6 my-2">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-4 border-amber-300 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-md animate-float">
                  👦
                </div>
                <span className="text-xs font-bold text-[#123D68] mt-1 block">Rian</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 border-4 border-emerald-400 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-lg animate-float [animation-delay:500ms]">
                  🧭
                </div>
                <span className="text-xs font-bold text-emerald-800 mt-1 block">Kompas Pintar</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 border-4 border-rose-300 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-md animate-float [animation-delay:1000ms]">
                  👧
                </div>
                <span className="text-xs font-bold text-[#123D68] mt-1 block">Siti</span>
              </div>
            </div>

            {/* Growth Mindset Golden Motto Banner */}
            <div className="mt-4 bg-gradient-to-r from-[#FFF9E7] via-amber-50 to-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-3 shadow-inner">
              <p className="text-xs sm:text-sm font-extrabold text-[#123D68] italic flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>“Aku belum bisa, tetapi aku bisa belajar, mencoba, dan berkembang.”</span>
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              </p>
            </div>
          </div>
        </div>

        {/* Audio greeting prompt */}
        <button
          onClick={handleSpeakWelcome}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full mb-6 transition-all ${
            isPlayingAudio
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-white border-2 border-sky-300 text-sky-800 hover:bg-sky-50 shadow-sm'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Sedang Membaca Sambutan...' : 'Dengarkan Suara Sambutan 🔊'}</span>
        </button>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md px-2">
          {/* MULAI */}
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('login');
            }}
            className="w-full sm:flex-1 bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-lg sm:text-xl py-3.5 px-6 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>MULAI</span>
          </button>

          {/* PELAJARI MATERI */}
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('material');
            }}
            className="w-full sm:flex-1 bg-[#55C7F2] hover:bg-sky-500 active:scale-95 text-white font-fredoka font-bold text-base sm:text-lg py-3.5 px-5 rounded-2xl shadow-lg border-b-4 border-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>PELAJARI MATERI</span>
          </button>
        </div>

        {/* NEW MENU: BATTLE OF MAP EXPLORERS */}
        <div className="w-full max-w-lg mt-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-1 shadow-xl border-2 border-amber-300">
          <div className="bg-white/95 backdrop-blur-xs rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase mb-1">
                <span>⚔️</span>
                <span>Mode Baru Kompetisi Kelas</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-fredoka text-[#123D68] tracking-tight">
                BATTLE OF MAP EXPLORERS
              </h3>
              <p className="text-xs font-bold text-amber-800 leading-snug">
                “Adu Strategi, Kerja Sama, dan Pengetahuan tentang Peta!”
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tantangan 5 babak seru untuk 5-6 kelompok (37 siswa) via 1 proyektor!
              </p>
            </div>

            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('battle_explorers');
              }}
              className="bg-gradient-to-r from-[#FF9F1C] to-orange-500 hover:from-orange-500 hover:to-orange-600 active:scale-95 text-white font-fredoka font-black text-sm sm:text-base py-3 px-5 rounded-2xl shadow-md border-b-3 border-orange-700 transition-all cursor-pointer flex items-center gap-2 shrink-0 group"
            >
              <span>Mulai Kompetisi</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </div>
        </div>

        {/* PETUNJUK PERMAINAN & TEACHER LINK */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('instructions');
            }}
            className="bg-white hover:bg-amber-50 active:scale-95 text-[#123D68] border-2 border-amber-300 font-bold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>PETUNJUK PERMAINAN</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('teacher_dashboard');
            }}
            className="bg-white hover:bg-slate-100 active:scale-95 text-slate-600 border border-slate-300 font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Akses Guru</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-3 pb-1 text-xs text-slate-600 relative z-10">
        <div className="bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full inline-block border border-white/60 shadow-xs">
          Petualang aktif saat ini: <span className="font-bold text-[#123D68]">{activeStudentName}</span> •
          Dilengkapi 25 Tantangan & 6 Keping Puzzle
        </div>
      </footer>
    </div>
  );
};
