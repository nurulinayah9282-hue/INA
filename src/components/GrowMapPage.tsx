import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { GROW_MAP_STATEMENTS, SCALE_OPTIONS, ASPECT_NAMES } from '../data/growMapData';
import { ArrowLeft, Save, Sparkles, CheckCircle2, Volume2, TrendingUp, HelpCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface GrowMapPageProps {
  mode: 'initial' | 'final';
  studentRecord: StudentRecord;
  onSave: (updatedRecord: StudentRecord) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const GrowMapPage: React.FC<GrowMapPageProps> = ({
  mode,
  studentRecord,
  onSave,
  onNavigate,
}) => {
  const isFinal = mode === 'final';
  const existingAnswers = isFinal
    ? { ...studentRecord.progress.growMapFinal }
    : { ...studentRecord.progress.growMapInitial };

  const [answers, setAnswers] = useState<Record<number, number>>(existingAnswers);
  const [activeAspectFilter, setActiveAspectFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectScale = (statementId: number, value: number) => {
    audioManager.playClickSound();
    setAnswers((prev) => ({ ...prev, [statementId]: value }));
  };

  const handleReadInstruction = () => {
    const text = isFinal
      ? 'GROW MAP Refleksi Setelah Bermain. Pilih jawaban yang paling sesuai dengan keadaanmu setelah menyelesaikan petualangan ini. Jawablah dengan jujur untuk melihat perkembangan kebiasaan belajarmu!'
      : 'GROW MAP Pemetaan Awal. Pilih jawaban yang paling sesuai dengan keadaanmu saat ini. Tidak ada jawaban benar atau salah. Jawablah dengan jujur agar kamu mengenali hal yang sudah kuat dan hal yang ingin terus dilatih.';
    setIsPlayingAudio(true);
    audioManager.speak(text, () => setIsPlayingAudio(false));
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === GROW_MAP_STATEMENTS.length;

  const handleSaveAndContinue = () => {
    const updated = { ...studentRecord };
    const p = { ...updated.progress };

    if (isFinal) {
      p.growMapFinal = answers;
      p.finalGrowMapCompleted = true;
    } else {
      p.growMapInitial = answers;
      p.initialGrowMapCompleted = true;
    }
    p.lastUpdated = new Date().toISOString();
    updated.progress = p;

    onSave(updated);
    audioManager.playCorrectSound();
    setSavedSuccess(true);

    setTimeout(() => {
      if (isFinal) {
        onNavigate('final_result');
      } else {
        onNavigate('board');
      }
    }, 1200);
  };

  // Calculate scores per aspect for analysis
  const calculateAspectScore = (aspect: 'A' | 'B' | 'C' | 'D', sourceAnswers: Record<number, number>) => {
    const ids = GROW_MAP_STATEMENTS.filter((s) => s.aspect === aspect).map((s) => s.id);
    let total = 0;
    let count = 0;
    ids.forEach((id) => {
      if (sourceAnswers[id] !== undefined) {
        total += sourceAnswers[id];
        count++;
      }
    });
    return { total, max: ids.length * 4, count, avg: count > 0 ? (total / count).toFixed(1) : '-' };
  };

  const filteredStatements =
    activeAspectFilter === 'ALL'
      ? GROW_MAP_STATEMENTS
      : GROW_MAP_STATEMENTS.filter((s) => s.aspect === activeAspectFilter);

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-4 bg-gradient-to-b from-[#EBF9FF] to-[#FFF9E7]">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate(isFinal ? 'reflection' : 'profile');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI</span>
          </button>

          <button
            onClick={handleReadInstruction}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white border-2 border-sky-300 text-sky-800 hover:bg-sky-50 shadow-sm'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Sedang Membaca...' : 'Dengarkan Petunjuk 🔊'}</span>
          </button>
        </div>

        {/* Page Title Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-sky-200 shadow-md mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4">
            <div>
              <div className="inline-block bg-[#55C7F2] text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full mb-1">
                {isFinal ? 'Refleksi Akhir Petualangan' : 'Pemetaan Respons Awal'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68]">
                GROW MAP {isFinal ? '— Refleksi Setelah Bermain' : '— Pemetaan Kebiasaan Belajar'}
              </h2>
            </div>

            {/* Student metadata banner */}
            <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold text-[#123D68] shrink-0">
              <div>Siswa: <span className="text-[#21A447]">{studentRecord.profile.name}</span></div>
              <div>Kelas: {studentRecord.profile.grade} • Tanggal: {new Date().toLocaleDateString('id-ID')}</div>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-[#123D68]">Petunjuk Pengisian: </span>
            “Pilih jawaban yang paling sesuai dengan keadaanmu saat ini. Tidak ada jawaban benar atau salah. Jawablah dengan jujur agar kamu bisa mengenali hal yang sudah kuat dan hal yang masih ingin dilatih bersama!”
          </div>

          {/* Progress counter */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Terisi: <span className="text-[#21A447] font-extrabold">{answeredCount}</span> dari 20 pernyataan
            </span>
            <div className="w-40 sm:w-56 bg-slate-100 rounded-full h-3 overflow-hidden border">
              <div
                className="bg-gradient-to-r from-[#21A447] to-[#55C7F2] h-full transition-all duration-300"
                style={{ width: `${(answeredCount / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* If Final mode, show aspect comparison card if initial was completed! */}
        {isFinal && studentRecord.progress.initialGrowMapCompleted && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-3 border-emerald-300 rounded-3xl p-5 mb-6 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold font-fredoka text-[#123D68]">
                Perbandingan Respons: Sebelum vs Setelah Bermain
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Data ini disajikan sebagai bahan percakapan refleksi dan perencanaan belajar berikutnya, bukan diagnosis atau label kemampuan tetap.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((asp) => {
                const initScore = calculateAspectScore(asp, studentRecord.progress.growMapInitial);
                const finScore = calculateAspectScore(asp, answers);
                return (
                  <div key={asp} className="bg-white rounded-2xl p-3.5 border shadow-xs">
                    <div className="text-xs font-bold text-slate-500">{ASPECT_NAMES[asp]}</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xs text-slate-400">Awal: {initScore.avg}</span>
                      <span className="text-sm font-extrabold text-[#21A447]">
                        {finScore.count > 0 ? `Akhir: ${finScore.avg}` : 'Mengisi...'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Aspect Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-slate-500 mr-1">Filter Aspek:</span>
          {(['ALL', 'A', 'B', 'C', 'D'] as const).map((asp) => (
            <button
              key={asp}
              onClick={() => {
                audioManager.playClickSound();
                setActiveAspectFilter(asp);
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeAspectFilter === asp
                  ? 'bg-[#123D68] text-white shadow-xs'
                  : 'bg-white text-slate-700 border hover:bg-slate-100'
              }`}
            >
              {asp === 'ALL' ? 'Semua Aspek (20)' : `Aspek ${asp}: ${ASPECT_NAMES[asp]}`}
            </button>
          ))}
        </div>

        {/* Statements List */}
        <div className="space-y-4 mb-8">
          {filteredStatements.map((item) => {
            const currentVal = answers[item.id];
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-sm ${
                  currentVal !== undefined
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.id}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        Aspek {item.aspect}: {item.aspectTitle}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-[#123D68] leading-snug">
                        {item.text}
                      </p>
                    </div>
                  </div>
                  {currentVal !== undefined && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  )}
                </div>

                {/* 4 Scale Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {SCALE_OPTIONS.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectScale(item.id, opt.value)}
                        className={`py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#21A447] text-white border-emerald-600 shadow-md scale-102'
                            : 'bg-[#FFF9E7] hover:bg-amber-100 text-[#123D68] border-amber-200'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white/30 text-xs flex items-center justify-center font-extrabold">
                          {opt.value}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save & Continue Bar */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-amber-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>
              {isAllAnswered
                ? 'Semua 20 pernyataan telah dijawab lengkap!'
                : `Masih ada ${20 - answeredCount} pernyataan yang belum dijawab.`}
            </span>
          </div>

          <button
            onClick={handleSaveAndContinue}
            disabled={!isAllAnswered}
            className={`w-full sm:w-auto font-fredoka font-bold text-base sm:text-lg py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAllAnswered
                ? 'bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white border-b-4 border-emerald-800'
                : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
            }`}
          >
            {savedSuccess ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>TERSIMPAN! MENGALIHKAN...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{isFinal ? 'SIMPAN REFLEKSI & LIHAT HASIL' : 'SIMPAN & LANJUTKAN KE PETA'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
