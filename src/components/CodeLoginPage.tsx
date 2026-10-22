import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { verifyAdventureCode } from '../lib/authService';
import { getAllStudentCodes, StudentCodeEntry } from '../data/studentCodes';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Volume2,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CodeLoginPageProps {
  onSuccessLogin: (studentEntry: StudentCodeEntry) => void;
  onTeacherLogin?: () => void;
  onNavigate: (page: NavigationPage) => void;
  activeStudentName?: string;
}

export const CodeLoginPage: React.FC<CodeLoginPageProps> = ({
  onSuccessLogin,
  onTeacherLogin,
  onNavigate,
  activeStudentName,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<StudentCodeEntry | null>(null);
  const [teacherSuccess, setTeacherSuccess] = useState<boolean>(false);
  const [showCodeList, setShowCodeList] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');

  const allAvailableStudents = getAllStudentCodes();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmed = code.trim();
    if (!trimmed) {
      setErrorMessage('Ups! Kamu belum mengisi kode. Masukkan kode unik petualanganmu dulu ya! 😊');
      audioManager.playWrongSound();
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyAdventureCode(trimmed);

      // 1. Deteksi Login Khusus Guru (GURU4B)
      if (result.success && result.role === 'teacher') {
        localStorage.setItem('grow_puzzle_teacher_auth_code', 'GURU4B');
        localStorage.setItem('grow_puzzle_teacher_mode', 'true');
        setTeacherSuccess(true);
        audioManager.playCorrectSound();
        try {
          audioManager.speakText('Selamat datang, Ibu Guru! Membuka Dashboard Pengelolaan Guru.');
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore sound/confetti errors
        }

        // Langsung arahkan guru ke halaman Dashboard Guru tanpa membuka petualangan siswa
        setTimeout(() => {
          if (onTeacherLogin) {
            onTeacherLogin();
          } else {
            onNavigate('dashboard_guru');
          }
        }, 1200);
        return;
      }

      // 2. Deteksi Login Siswa
      if (result.success && result.student) {
        localStorage.removeItem('grow_puzzle_teacher_auth_code');
        localStorage.removeItem('grow_puzzle_teacher_mode');
        setSuccessInfo(result.student);
        audioManager.playCorrectSound();
        try {
          audioManager.speakText(`Selamat datang, ${result.student.name} dari Kelas ${result.student.grade}!`);
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore sound/confetti errors
        }

        // Delay slightly for celebration animation then callback
        setTimeout(() => {
          onSuccessLogin(result.student!);
        }, 1200);
      } else {
        setErrorMessage(
          result.message || 'Kode belum terdaftar, yuk cek lagi kartumu! 🗺️'
        );
        audioManager.playWrongSound();
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Kode belum terdaftar, yuk cek lagi kartumu! 🗺️');
      audioManager.playWrongSound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPresetCode = (presetCode: string) => {
    setCode(presetCode);
    setErrorMessage(null);
    audioManager.playClickSound();
  };

  const filteredPresetCodes = allAvailableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(codeSearch.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-68px)] py-8 px-4 bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Adventure Background Elements */}
      <div className="absolute top-6 left-6 text-6xl opacity-30 select-none pointer-events-none animate-pulse hidden sm:block">
        🗺️
      </div>
      <div className="absolute top-10 right-10 text-6xl opacity-30 select-none pointer-events-none animate-bounce hidden sm:block">
        🧭
      </div>
      <div className="absolute bottom-6 left-8 text-5xl opacity-25 select-none pointer-events-none hidden md:block">
        🏔️
      </div>
      <div className="absolute bottom-8 right-8 text-5xl opacity-25 select-none pointer-events-none hidden md:block">
        🏕️
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Top App Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/90 border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-xs mb-3">
            <span className="text-xl">🧭</span>
            <span className="text-xs font-black tracking-wide text-[#123D68] uppercase">
              GROW PUZZLE DIGITAL • KELAS IV B
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#123D68] leading-tight">
            Masuk Petualangan Peta
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Masukkan kode unik petualangmu untuk membuka peta dan memulai tantangan seru!
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-200 shadow-2xl relative overflow-hidden">
          {/* Audio helper icon */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-extrabold text-[#21A447] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Login Siswa Kelas IV B</span>
            </span>

            <button
              onClick={() => {
                audioManager.speakText(
                  'Halo petualang cilik! Silakan masukkan kode petualanganmu, lalu klik tombol Mulai Berpetualang.'
                );
              }}
              title="Dengarkan Petunjuk"
              className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengar</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="adventure-code-input"
                className="block text-xs sm:text-sm font-extrabold text-[#123D68] mb-2 flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Masukkan Kode Petualanganmu:</span>
              </label>

              <div className="relative">
                <input
                  id="adventure-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="Contoh: AZ77 atau GURU4B"
                  autoFocus
                  disabled={isLoading || successInfo !== null || teacherSuccess}
                  className={`w-full px-4 py-3.5 rounded-2xl text-center text-lg sm:text-xl font-mono font-black tracking-widest text-[#123D68] border-3 transition-all focus:outline-none uppercase ${
                    errorMessage
                      ? 'border-rose-400 bg-rose-50/50 focus:ring-4 focus:ring-rose-200'
                      : teacherSuccess
                      ? 'border-amber-400 bg-amber-50 text-amber-900 ring-4 ring-amber-200'
                      : successInfo
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : 'border-sky-300 bg-slate-50 focus:bg-white focus:border-[#21A447] focus:ring-4 focus:ring-emerald-100'
                  }`}
                />
                {code && !isLoading && !successInfo && !teacherSuccess && (
                  <button
                    type="button"
                    onClick={() => {
                      setCode('');
                      setErrorMessage(null);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200 hover:bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center font-medium">
                Ketik kode unik siswa (misal: <strong>AZ77</strong>) atau kode khusus Guru (<strong>GURU4B</strong>).
              </p>
            </div>

            {/* Error Message Alert (Friendly Tone as requested) */}
            {errorMessage && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl p-3.5 text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-bounce-short">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Teacher Success Message Alert */}
            {teacherSuccess && (
              <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-2 border-amber-400 text-[#123D68] rounded-2xl p-4 text-xs sm:text-sm font-bold flex items-center gap-3 animate-pop shadow-lg">
                <span className="text-3xl">👨‍🏫</span>
                <div className="leading-snug">
                  Selamat datang, <strong className="text-amber-900 text-sm sm:text-base">Ibu/Bapak Guru Kelas IV B</strong>! 🎓
                  <div className="text-slate-600 font-medium text-xs mt-0.5">
                    Kode Khusus Guru terverifikasi. Mengarahkan langsung ke <strong>Mode Guru / Dashboard Guru</strong>...
                  </div>
                </div>
              </div>
            )}

            {/* Student Success Message Alert */}
            {successInfo && (
              <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl p-4 text-xs sm:text-sm font-bold flex items-center gap-3 animate-pop shadow-md">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="leading-snug">
                  Selamat datang, <strong className="text-emerald-800 text-sm sm:text-base">{successInfo.name}</strong> dari Kelas <strong>{successInfo.grade}</strong>! 🗺️ Membuka petualanganmu...
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successInfo !== null || teacherSuccess}
              className={`w-full py-3.5 px-6 rounded-2xl font-fredoka font-bold text-lg sm:text-xl shadow-lg border-b-4 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLoading || successInfo || teacherSuccess
                  ? 'bg-emerald-500 text-white border-emerald-700 cursor-not-allowed opacity-90'
                  : 'bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white border-emerald-800'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>MEMERIKSA KODE...</span>
                </>
              ) : teacherSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-200" />
                  <span>KODE GURU DITERIMA! MASUK...</span>
                </>
              ) : successInfo ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>KODE DITERIMA! MASUK...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>MULAI BERPETUALANG</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Code Drawer / Helper for Elementary Students & Teachers */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setShowCodeList(!showCodeList);
                audioManager.playClickSound();
              }}
              className="w-full flex items-center justify-between text-xs font-extrabold text-sky-800 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 p-2.5 rounded-xl border border-sky-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Bantuan: Lihat Daftar Kode Siswa Kelas IV B ({allAvailableStudents.length})</span>
              </div>
              {showCodeList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCodeList && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <input
                  type="text"
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  placeholder="Cari namamu..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#21A447]"
                />

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {filteredPresetCodes.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleSelectPresetCode(st.code)}
                      className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {st.avatar.startsWith('girl') ? '👧' : '👦'}
                        </span>
                        <span className="font-extrabold text-[#123D68]">{st.name}</span>
                        <span className="text-[10px] text-slate-400">({st.grade})</span>
                      </div>
                      <span className="font-mono font-bold text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                        {st.code}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-center italic">
                  Klik pada namamu untuk langsung mengisi kode secara otomatis!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Shortcut to Dashboard Guru for Teachers */}
        <div className="mt-5 flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('cover');
            }}
            className="hover:text-slate-800 hover:underline cursor-pointer"
          >
            ← Kembali ke Sampul
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('dashboard_guru');
            }}
            className="hover:text-sky-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Mode Guru (/dashboard-guru)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
