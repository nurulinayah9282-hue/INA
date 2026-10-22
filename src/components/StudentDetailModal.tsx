import React from 'react';
import { StudentRecord } from '../types';
import { QUESTIONS } from '../data/questions';
import { BADGES } from '../data/badges';
import { ASPECT_NAMES } from '../data/growMapData';
import { X, CheckCircle2, Clock, Award, Puzzle, TrendingUp, HelpCircle } from 'lucide-react';

interface StudentDetailModalProps {
  studentRecord: StudentRecord | null;
  onClose: () => void;
  onPlayAsStudent: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  studentRecord,
  onClose,
  onPlayAsStudent,
}) => {
  if (!studentRecord) return null;

  const prog = studentRecord.progress;
  const correctCount = prog.completedQuestions.length;
  const percentage = ((correctCount / 25) * 100).toFixed(0);

  // Compute Grow Map summary
  const getAspectAverage = (aspect: 'A' | 'B' | 'C' | 'D', map: Record<number, number>) => {
    // A: 1-5, B: 6-10, C: 11-15, D: 16-20
    const start = aspect === 'A' ? 1 : aspect === 'B' ? 6 : aspect === 'C' ? 11 : 16;
    const end = start + 4;
    let sum = 0;
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (map[i] !== undefined) {
        sum += map[i];
        count++;
      }
    }
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border-4 border-sky-300 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col animate-pop">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#123D68] to-[#1e5287] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl font-bold shadow-md">
              {studentRecord.profile.avatar.startsWith('girl') ? '👧' : '👦'}
            </div>
            <div>
              <h3 className="text-xl font-bold font-fredoka">{studentRecord.profile.name}</h3>
              <p className="text-xs text-sky-200">
                Kelas: {studentRecord.profile.grade} • ID: {studentRecord.profile.id} • Terakhir:{' '}
                {new Date(prog.lastUpdated).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#123D68]">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-3">
              <div className="text-xl sm:text-2xl font-black text-[#123D68]">{prog.score}</div>
              <div className="text-[10px] font-bold text-amber-800 uppercase">Skor / 250</div>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3">
              <div className="text-xl sm:text-2xl font-black text-[#21A447]">
                {correctCount} / 25
              </div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Tuntas ({percentage}%)</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3">
              <div className="text-xl sm:text-2xl font-black text-purple-900">
                {prog.unlockedPuzzlePieces.length} / 6
              </div>
              <div className="text-[10px] font-bold text-purple-800 uppercase">Keping Puzzle</div>
            </div>
            <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-3">
              <div className="text-xl sm:text-2xl font-black text-sky-900">
                {prog.unlockedBadges.length} / 5
              </div>
              <div className="text-[10px] font-bold text-sky-800 uppercase">Badge Diraih</div>
            </div>
          </div>

          {/* 25 Questions Status Matrix */}
          <div>
            <h4 className="text-sm font-bold font-fredoka text-[#123D68] mb-2 flex items-center gap-1.5">
              <span>Status 25 Soal Tantangan & Jumlah Percobaan:</span>
            </h4>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-1.5">
              {QUESTIONS.map((q) => {
                const isCorrect = prog.completedQuestions.includes(q.id);
                const attemptCount = prog.attempts[q.id] || 0;
                return (
                  <div
                    key={q.id}
                    className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : attemptCount > 0
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                    title={`Soal #${q.id}: ${q.topic} (${attemptCount} percobaan)`}
                  >
                    <div>#{q.id}</div>
                    <div className="text-[10px] font-normal">
                      {isCorrect ? '✅' : attemptCount > 0 ? `🔄 ${attemptCount}x` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GROW MAP Aspects Breakdown */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <h4 className="text-sm font-bold font-fredoka text-[#123D68] mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Rata-rata Nilai Aspek GROW MAP (Skala 1 - 4):</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['A', 'B', 'C', 'D'] as const).map((asp) => (
                <div key={asp} className="bg-white p-2.5 rounded-xl border">
                  <div className="font-bold text-slate-600 mb-1">{ASPECT_NAMES[asp]}</div>
                  <div className="flex justify-between text-slate-500">
                    <span>Awal: {getAspectAverage(asp, prog.growMapInitial)}</span>
                    <span className="font-bold text-[#21A447]">
                      Akhir: {getAspectAverage(asp, prog.growMapFinal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Reflection Answers */}
          <div className="bg-[#FFF9E7]/60 border-2 border-amber-200 rounded-2xl p-4">
            <h4 className="text-sm font-bold font-fredoka text-[#123D68] mb-3">
              Catatan Refleksi Siswa:
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700">Tantangan Tersulit: </span>
                <span className="text-slate-900 font-medium">
                  {prog.reflectionAnswers.q1_difficultChallenge || '— Belum diisi'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Saat Jawaban Belum Tepat: </span>
                <span className="text-slate-900 font-medium">
                  {prog.reflectionAnswers.q2_whenIncorrect || '— Belum diisi'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Pelajaran dari Kesalahan: </span>
                <span className="text-slate-900 font-medium">
                  {prog.reflectionAnswers.q3_learnFromMistake || '— Belum diisi'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Strategi Memahami Peta: </span>
                <span className="text-slate-900 font-medium">
                  {prog.reflectionAnswers.q4_helpfulStrategy || '— Belum diisi'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Ingin Dicoba Berikutnya: </span>
                <span className="text-slate-900 font-medium">
                  {prog.reflectionAnswers.q5_tryNextTime || '— Belum diisi'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </button>

          <button
            onClick={() => {
              onPlayAsStudent(studentRecord.profile.id);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#21A447] text-white text-xs font-bold hover:bg-emerald-600 shadow-sm flex items-center gap-1.5"
          >
            <span>Dampingi / Buka Permainan Sebagai Siswa Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
