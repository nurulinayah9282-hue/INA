import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { AppSettings, resetAllStudents, saveStoredStudents } from '../utils/storage';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
  Download,
  Upload,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface TeacherSettingsProps {
  students: Record<string, StudentRecord>;
  settings: AppSettings;
  onUpdateStudents: (updated: Record<string, StudentRecord>) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const TeacherSettings: React.FC<TeacherSettingsProps> = ({
  students,
  settings,
  onUpdateStudents,
  onUpdateSettings,
  onNavigate,
}) => {
  const [studentNames, setStudentNames] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    Object.values(students).forEach((s) => {
      map[s.profile.id] = s.profile.name;
    });
    return map;
  });

  const [classNameInput, setClassNameInput] = useState(settings.className || 'IV B');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [autoNarrate, setAutoNarrate] = useState(settings.autoNarrate);
  const [showConfirmResetAll, setShowConfirmResetAll] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleNameChange = (id: string, newName: string) => {
    setStudentNames((prev) => ({ ...prev, [id]: newName }));
  };

  const handleSaveAll = () => {
    audioManager.playCorrectSound();

    // Update student records
    const updated = { ...students };
    Object.keys(studentNames).forEach((id) => {
      if (updated[id]) {
        updated[id] = {
          ...updated[id],
          profile: {
            ...updated[id].profile,
            name: studentNames[id] || updated[id].profile.name,
            grade: classNameInput,
          },
        };
      }
    });

    onUpdateStudents(updated);

    const newSettings: AppSettings = {
      className: classNameInput,
      soundEnabled,
      autoNarrate,
    };
    onUpdateSettings(newSettings);
    audioManager.setMuted(!soundEnabled);

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleResetAll = () => {
    const defaults = resetAllStudents();
    onUpdateStudents(defaults);
    const newNames: Record<string, string> = {};
    Object.values(defaults).forEach((s) => {
      newNames[s.profile.id] = s.profile.name;
    });
    setStudentNames(newNames);
    setShowConfirmResetAll(false);
    audioManager.playEncouragingSound();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ students, settings }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Grow_Puzzle_Kelas_IV_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students) {
          onUpdateStudents(parsed.students);
          saveStoredStudents(parsed.students);
          if (parsed.settings) {
            onUpdateSettings(parsed.settings);
          }
          alert('Berhasil memuat data cadangan!');
        }
      } catch {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-4 bg-slate-50 text-[#123D68]">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('teacher_dashboard');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE DASHBOARD</span>
          </button>

          <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
            Pengaturan Aplikasi & Siswa
          </span>
        </div>

        {/* Local Storage Disclaimer Box */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-[#123D68]">Penyimpanan Data Lokal: </span>
            Aplikasi ini menyimpan seluruh progres permainan, skor, refleksi, dan nama siswa di peramban (browser) dan perangkat komputer/tablet yang sama. Data tetap tersimpan aman saat halaman dimuat ulang. Untuk memindahkan data ke perangkat lain, gunakan fitur Cadangkan / Ekspor JSON di bawah ini.
          </div>
        </div>

        {/* Global Settings Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6">
          <h3 className="text-xl font-bold font-fredoka text-[#123D68] mb-4">
            Pengaturan Umum Kelas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-extrabold text-[#123D68] mb-1.5 uppercase">
                Nama Kelas:
              </label>
              <input
                type="text"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-sm font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold text-[#123D68]">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Aktifkan Efek Suara & Musik Permainan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold text-[#123D68]">
                <input
                  type="checkbox"
                  checked={autoNarrate}
                  onChange={(e) => setAutoNarrate(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Baca Narasi Soal Otomatis Saat Dibuka</span>
              </label>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Cadangkan File JSON</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Pulihkan dari File JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 37 Student Names Editor */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-fredoka text-[#123D68]">
                Kelola Daftar Nama 37 Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Ubah nama siswa default (Siswa 01 s/d Siswa 37) sesuai dengan nama asli murid di kelasmu.
              </p>
            </div>
            <span className="text-xs font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
              37 Siswa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {Object.values(students).map((st, idx) => (
              <div
                key={st.profile.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2"
              >
                <span className="w-6 text-center text-xs font-bold text-slate-400">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={studentNames[st.profile.id] || ''}
                  onChange={(e) => handleNameChange(st.profile.id, e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-[#123D68] focus:outline-none focus:ring-1 focus:ring-[#21A447]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Save Bar & Reset */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-emerald-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setShowConfirmResetAll(true)}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Seluruh Data Kelas ke Nilai Awal</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="w-full sm:w-auto bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-base py-3 px-8 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
          >
            {saveToast ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>PERUBAHAN BERHASIL DISIMPAN!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>SIMPAN SEMUA PERUBAHAN</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Confirm Reset All */}
        {showConfirmResetAll && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-rose-300 shadow-2xl animate-pop text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-[#123D68] mb-2">
                Reset Seluruh Data Kelas?
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Seluruh catatan permainan, skor, keping puzzle, badge, dan refleksi 37 siswa akan dikembalikan ke kondisi awal (belum mulai).
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmResetAll(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                >
                  Ya, Reset Semua
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
