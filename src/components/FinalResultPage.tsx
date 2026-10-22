import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { BADGES } from '../data/badges';
import {
  Trophy,
  Award,
  Puzzle,
  RotateCcw,
  MapPin,
  Sparkles,
  BookOpen,
  Printer,
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface FinalResultPageProps {
  studentRecord: StudentRecord;
  onResetStudentProgress: (id: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const FinalResultPage: React.FC<FinalResultPageProps> = ({
  studentRecord,
  onResetStudentProgress,
  onNavigate,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const progress = studentRecord.progress;
  const correctCount = progress.completedQuestions.length;
  const totalScore = progress.score;
  const percentage = Math.round((correctCount / 25) * 100);
  const totalAttempts = Object.values(progress.attempts).reduce((a, b) => a + b, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    audioManager.playClickSound();
    onResetStudentProgress(studentRecord.profile.id);
    setShowConfirmReset(false);
    onNavigate('board');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-10 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9]">
      <div className="max-w-3xl mx-auto">
        {/* Certificate Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-2xl relative overflow-hidden text-center print:border-none print:shadow-none">
          {/* Decorative ribbons / badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFF9E7] border-2 border-[#FFC928] px-4 py-1.5 rounded-full shadow-xs mb-4">
            <span className="text-xl">🌟</span>
            <span className="text-xs sm:text-sm font-black text-[#123D68] tracking-wider uppercase">
              Rapor Hasil Petualang Belajar
            </span>
            <span className="text-xl">🌟</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-fredoka text-[#123D68]">
            Selamat, Petualang Tangguh!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1 max-w-lg mx-auto">
            Kamu telah berani menjelajahi peta dan terus bertumbuh dari setiap pengalaman!
          </p>

          {/* Student Name Box */}
          <div className="my-6 p-4 bg-gradient-to-r from-sky-50 via-emerald-50 to-sky-50 rounded-2xl border-2 border-emerald-300 inline-block w-full max-w-md">
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Diberikan Kepada:
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#21A447] my-0.5">
              {studentRecord.profile.name}
            </div>
            <div className="text-xs font-bold text-slate-600">
              Kelas: {studentRecord.profile.grade} • SDN Harapan Bangsa
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {/* Score */}
            <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-3.5">
              <div className="text-2xl sm:text-3xl font-black font-fredoka text-[#123D68]">
                {totalScore}
              </div>
              <div className="text-[11px] font-bold text-amber-800 uppercase mt-0.5">
                Skor (Maks 250)
              </div>
            </div>

            {/* Questions Solved */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5">
              <div className="text-2xl sm:text-3xl font-black font-fredoka text-[#21A447]">
                {correctCount} / 25
              </div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase mt-0.5">
                Soal Tuntas
              </div>
            </div>

            {/* Percentage */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-3.5">
              <div className="text-2xl sm:text-3xl font-black font-fredoka text-sky-800">
                {percentage}%
              </div>
              <div className="text-[11px] font-bold text-sky-800 uppercase mt-0.5">
                Ketuntasan
              </div>
            </div>

            {/* Total Attempts */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3.5">
              <div className="text-2xl sm:text-3xl font-black font-fredoka text-purple-900">
                {totalAttempts}
              </div>
              <div className="text-[11px] font-bold text-purple-800 uppercase mt-0.5">
                Total Percobaan
              </div>
            </div>
          </div>

          {/* Puzzle & Badges Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
            {/* Puzzle Progress */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Puzzle className="w-5 h-5 text-purple-600" />
                <h4 className="text-sm font-bold font-fredoka text-[#123D68]">
                  Puzzle yang Terkumpul ({progress.unlockedPuzzlePieces.length}/6)
                </h4>
              </div>
              <p className="text-xs text-slate-600 font-semibold mb-2">
                {progress.unlockedPuzzlePieces.length === 6
                  ? '“KESALAHAN ADALAH BAGIAN DARI PROSES BELAJAR”'
                  : `${progress.unlockedPuzzlePieces.length} keping telah berhasil dikumpulkan.`}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: `${(progress.unlockedPuzzlePieces.length / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Badges Earned */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold font-fredoka text-[#123D68]">
                  Badge yang Diraih ({progress.unlockedBadges.length}/5)
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {progress.unlockedBadges.map((bId) => {
                  const bInfo = BADGES.find((b) => b.id === bId);
                  return (
                    <span
                      key={bId}
                      className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg"
                    >
                      {bInfo?.titleBadge || bId}
                    </span>
                  );
                })}
                {progress.unlockedBadges.length === 0 && (
                  <span className="text-xs text-slate-400">Belum ada badge terbuka.</span>
                )}
              </div>
            </div>
          </div>

          {/* Growth Reassurance Message */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-2xl p-4 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed mb-6">
            “Kecerdasan bukanlah hal yang tetap. Setiap kali kamu mencoba kembali soal yang sulit dan memikirkan strategi baru, jaringan otakmu sedang bertumbuh lebih kuat!”
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('board');
              }}
              className="bg-[#21A447] hover:bg-emerald-600 text-white font-fredoka font-bold text-sm sm:text-base py-3 px-6 rounded-2xl shadow-md border-b-3 border-emerald-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Kembali ke Peta</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('reflection');
              }}
              className="bg-white hover:bg-slate-50 text-[#123D68] border-2 border-slate-300 font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lihat Refleksi</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat</span>
            </button>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        </div>

        {/* Modal Confirm Restart Game */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl animate-pop text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-[#123D68] mb-2">
                Mulai Petualangan Baru?
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Catatan sesi saat ini tersimpan di browser. Apakah kamu ingin mengatur ulang papan permainan untuk mencoba rute dari awal?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl bg-[#21A447] text-white font-bold text-xs hover:bg-emerald-600 cursor-pointer"
                >
                  Ya, Mulai Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
