import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { ArrowLeft, Play, RotateCcw, Compass, Sparkles, Check, AlertTriangle, KeyRound } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { STUDENT_CODES } from '../data/studentCodes';

interface ProfilePageProps {
  students: Record<string, StudentRecord>;
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onUpdateProfile: (id: string, name: string, grade: string, avatar: string) => void;
  onResetStudentProgress: (id: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

const AVATARS = [
  { id: 'boy1', label: 'Rian (Laki-laki)', icon: '👦' },
  { id: 'girl1', label: 'Siti (Perempuan)', icon: '👧' },
  { id: 'boy2', label: 'Budi (Laki-laki)', icon: '🧒' },
  { id: 'girl2', label: 'Ayu (Perempuan)', icon: '👧🏻' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onUpdateProfile,
  onResetStudentProgress,
  onNavigate,
}) => {
  const currentRecord = students[activeStudentId] || Object.values(students)[0];

  const [selectedId, setSelectedId] = useState(activeStudentId);
  const [name, setName] = useState(currentRecord?.profile?.name || '');
  const [grade, setGrade] = useState(currentRecord?.profile?.grade || 'IV B');
  const [avatar, setAvatar] = useState(currentRecord?.profile?.avatar || 'boy1');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const selectedRecord = students[selectedId] || currentRecord;
  const progress = selectedRecord?.progress;
  const hasHistory =
    progress &&
    (progress.completedQuestions?.length > 0 ||
      progress.score > 0 ||
      progress.initialGrowMapCompleted);

  const handleStudentDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    onSelectStudent(id);
    const rec = students[id];
    if (rec) {
      setName(rec.profile.name);
      setGrade(rec.profile.grade);
      setAvatar(rec.profile.avatar);
    }
  };

  const handleStartAdventure = () => {
    audioManager.playClickSound();
    onUpdateProfile(selectedId, name, grade, avatar);

    // If initial Grow Map is already filled, go straight to board; otherwise invite to fill Grow Map
    if (selectedRecord?.progress.initialGrowMapCompleted) {
      onNavigate('board');
    } else {
      onNavigate('grow_map_initial');
    }
  };

  const handleConfirmReset = () => {
    audioManager.playClickSound();
    onResetStudentProgress(selectedId);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-10 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#EBF9FF]">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('cover');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI</span>
          </button>
          <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border">
            Mode Siswa
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-sky-200 shadow-xl relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-amber-100 rounded-3xl border-3 border-amber-300 flex items-center justify-center text-3xl mx-auto mb-2 shadow-sm">
              🧭
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#123D68]">
              Siapa Petualang Hari Ini?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pilih namamu dari daftar 37 siswa atau ubah identitas petualangmu.
            </p>
          </div>

          {/* Student selection dropdown from 37 students */}
          <div className="mb-5">
            <label className="block text-xs sm:text-sm font-extrabold text-[#123D68] mb-2 uppercase tracking-wide">
              Pilih dari Daftar Siswa Kelas IV B:
            </label>
            <select
              value={selectedId}
              onChange={handleStudentDropdownChange}
              className="w-full bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-3 text-sm sm:text-base font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447] cursor-pointer"
            >
              {Object.values(students).map((st) => (
                <option key={st.profile.id} value={st.profile.id}>
                  {st.profile.name} — (Skor: {st.progress.score} poin | Selesai:{' '}
                  {st.progress.completedQuestions.length}/25)
                </option>
              ))}
            </select>
          </div>

          {/* Adventure Code Card for selected student */}
          {(() => {
            const entry = STUDENT_CODES.find((c) => c.id === selectedId);
            return (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
                    🔑
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">
                      Kode Petualangan Siswa Ini:
                    </div>
                    <div className="font-mono font-black text-base text-[#123D68]">
                      {entry?.code || `${selectedId.toUpperCase().replace('_', '')}4B`}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audioManager.playClickSound();
                    onNavigate('login');
                  }}
                  className="bg-white hover:bg-slate-100 text-sky-800 border border-sky-300 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Buka Form Kode
                </button>
              </div>
            );
          })()}

          {/* Name input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-extrabold text-[#123D68] mb-1.5 uppercase tracking-wide">
                Nama Siswa:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama siswa..."
                className="w-full bg-white border-2 border-slate-300 rounded-2xl p-3 text-sm sm:text-base font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#123D68] mb-1.5 uppercase tracking-wide">
                Kelas:
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="IV B"
                className="w-full bg-white border-2 border-slate-300 rounded-2xl p-3 text-sm sm:text-base font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div className="mb-6">
            <label className="block text-xs font-extrabold text-[#123D68] mb-2 uppercase tracking-wide">
              Pilih Avatar Karakter:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    audioManager.playClickSound();
                    setAvatar(av.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    avatar === av.id
                      ? 'bg-amber-100 border-amber-400 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-3xl">{av.icon}</span>
                  <span className="text-xs font-bold text-[#123D68]">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Existing Progress Banner */}
          {hasHistory && progress && (
            <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-[#123D68] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Catatan Petualangan Ditemukan:</span>
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#21A447] text-white">
                  {progress.score} Poin
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-1 font-medium">
                <div>• Tantangan selesai: {progress.completedQuestions.length} dari 25 soal</div>
                <div>• Keping puzzle terkumpul: {progress.unlockedPuzzlePieces.length} dari 6 keping</div>
                <div>• GROW MAP Awal: {progress.initialGrowMapCompleted ? '✅ Sudah diisi' : '⏳ Belum diisi'}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mulai ulang catatan siswa ini</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleStartAdventure}
              className="w-full bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-lg sm:text-xl py-3.5 px-6 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {hasHistory ? 'LANJUTKAN PETUALANGAN' : 'MULAI PETUALANGAN BARU'}
              </span>
            </button>

            {/* Direct button to Grow Map initial */}
            <button
              type="button"
              onClick={() => {
                audioManager.playClickSound();
                onUpdateProfile(selectedId, name, grade, avatar);
                onNavigate('grow_map_initial');
              }}
              className="w-full bg-white hover:bg-sky-50 text-[#123D68] font-bold text-sm py-2.5 px-4 rounded-2xl border-2 border-sky-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-600" />
              <span>
                {selectedRecord?.progress.initialGrowMapCompleted
                  ? 'Periksa Kembali GROW MAP Awal'
                  : 'Isi GROW MAP Awal (Refleksi Pembelajaran)'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Confirm Reset Progress */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-rose-300 shadow-2xl animate-pop text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-[#123D68] mb-2">
                Mulai Ulang Catatan?
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Skor, jawaban soal, puzzle, dan refleksi untuk <span className="font-bold">{name}</span> akan dikembalikan ke awal. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                >
                  Ya, Mulai Ulang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
