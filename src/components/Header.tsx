import React from 'react';
import { NavigationPage, StudentProfile } from '../types';
import {
  Volume2,
  VolumeX,
  Map,
  BookOpen,
  Puzzle,
  Award,
  Users,
  Home,
  LogOut,
  Cloud,
  Sprout,
  GraduationCap,
  Smile,
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  activeStudent?: StudentProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  score: number;
  currentUser: FirebaseUser | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  isCloudConnected: boolean;
}

interface NavItemConfig {
  id: NavigationPage;
  num: number;
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  activeBg: string;
  iconColor: string;
  isActive: (page: NavigationPage) => boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'grow_map_initial',
    num: 1,
    label: 'Grow MAP Awal',
    tooltip: 'Grow MAP Awal: Menu pertama untuk asesmen awal',
    icon: Sprout,
    activeBg: 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300',
    iconColor: 'text-emerald-600',
    isActive: (p) => p === 'grow_map_initial',
  },
  {
    id: 'material',
    num: 2,
    label: 'Materi',
    tooltip: 'Materi: Menu untuk membaca materi seperti yang ada saat ini',
    icon: BookOpen,
    activeBg: 'bg-[#55C7F2] text-white shadow-sm ring-2 ring-sky-300',
    iconColor: 'text-sky-600',
    isActive: (p) => p === 'material',
  },
  {
    id: 'board',
    num: 3,
    label: 'Peta',
    tooltip: 'Peta: Menu untuk petualangan puzzle nomor 1-25',
    icon: Map,
    activeBg: 'bg-[#21A447] text-white shadow-sm ring-2 ring-green-300',
    iconColor: 'text-[#21A447]',
    isActive: (p) => p === 'board' || p === 'dice' || p === 'challenge',
  },
  {
    id: 'grow_map_final',
    num: 4,
    label: 'Grow MAP Akhir',
    tooltip: 'Grow MAP Akhir: Menu untuk kuis/asesmen akhir setelah belajar',
    icon: GraduationCap,
    activeBg: 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300',
    iconColor: 'text-blue-600',
    isActive: (p) => p === 'grow_map_final' || p === 'final_result',
  },
  {
    id: 'reflection',
    num: 5,
    label: 'Refleksi',
    tooltip: 'Refleksi: Menu untuk siswa mengisi kesan belajar',
    icon: Smile,
    activeBg: 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-300',
    iconColor: 'text-pink-600',
    isActive: (p) => p === 'reflection',
  },
  {
    id: 'puzzle',
    num: 6,
    label: 'Puzzle',
    tooltip: 'Puzzle: Menu untuk mengetahui puzzle yang sudah terkumpul',
    icon: Puzzle,
    activeBg: 'bg-[#FF9F1C] text-white shadow-sm ring-2 ring-amber-300',
    iconColor: 'text-amber-500',
    isActive: (p) => p === 'puzzle',
  },
  {
    id: 'badges',
    num: 7,
    label: 'Badge',
    tooltip: 'Badge: Badge penghargaan petualang yang sudah di buka',
    icon: Award,
    activeBg: 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300',
    iconColor: 'text-purple-600',
    isActive: (p) => p === 'badges',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  activeStudent,
  soundEnabled,
  onToggleSound,
  score,
  currentUser,
  onSignInGoogle,
  onSignOut,
  isCloudConnected,
}) => {
  const isTeacherView =
    currentPage === 'teacher_dashboard' ||
    currentPage === 'teacher_settings' ||
    currentPage === 'dashboard_guru';
  const isLoginView = currentPage === 'login';
  const isTeacherUser = currentUser?.email === 'nurulinayah9282@gmail.com';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-sky-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and title */}
        <div
          onClick={() => {
            audioManager.playClickSound();
            onNavigate('cover');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#21A447] to-[#55C7F2] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <span className="text-xl sm:text-2xl">🧭</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-bold font-fredoka tracking-wide text-[#123D68]">
                GROW PUZZLE <span className="text-[#21A447]">DIGITAL</span>
              </h1>
              {isCloudConnected && (
                <span
                  title="Tersinkronisasi Live ke Firebase Cloud Firestore"
                  className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  <Cloud className="w-3 h-3 text-emerald-600" />
                  <span>Cloud Live</span>
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden md:block">
              Petualangan Mengenal Peta — IPAS Kelas IV SD
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              audioManager.playClickSound();
              onToggleSound();
            }}
            title={soundEnabled ? 'Matikan Suara Audio' : 'Aktifkan Suara Audio'}
            className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Battle of Map Explorers Quick Access Button */}
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('battle_explorers');
            }}
            title="Buka Mode Kompetisi Kelompok: Battle of Map Explorers"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs border-2 ${
              currentPage === 'battle_explorers'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 ring-2 ring-amber-300/80 scale-105'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:scale-102'
            }`}
          >
            <span>⚔️</span>
            <span className="hidden md:inline">Battle Kelompok</span>
          </button>

          {/* Current student chip or login indicator */}
          {isLoginView ? (
            <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-2xl shadow-xs">
              <span>🔑</span>
              <span>Masuk Petualang</span>
            </div>
          ) : !isTeacherView ? (
            <div
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('login');
              }}
              className="flex items-center gap-2 bg-[#FFF9E7] hover:bg-amber-100 border-2 border-amber-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl cursor-pointer transition-all shadow-sm"
              title="Klik untuk Ganti Siswa / Masuk dengan Kode Lain"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFC928] flex items-center justify-center text-sm font-bold border border-amber-400">
                {activeStudent?.avatar?.startsWith('girl') ? '👧' : '👦'}
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold text-[#123D68] leading-tight max-w-[85px] sm:max-w-[120px] truncate">
                  {activeStudent?.name || 'Petualang'}
                </div>
                <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                  <span>⭐ {score} poin</span>
                  <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">• Ganti</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('board');
              }}
              className="flex items-center gap-1.5 bg-[#21A447] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-sm transition-all"
            >
              <Home className="w-4 h-4" />
              Kembali ke Game
            </button>
          )}

          {/* Google Sign-in / User Profile Widget */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-300 rounded-2xl px-2 py-1 shadow-xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Akun Google'}
                  className="w-7 h-7 rounded-full border border-sky-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <div className="hidden md:block text-left text-[11px] leading-tight max-w-[90px] truncate">
                <span className="font-extrabold text-[#123D68] block truncate">
                  {currentUser.displayName?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[9px] text-emerald-700 font-bold block">
                  {isTeacherUser ? 'Guru' : 'Siswa'}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Keluar dari Akun Google"
                className="p-1 text-slate-500 hover:text-rose-600 transition-colors ml-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-extrabold text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Masuk dengan Akun Google untuk sinkronisasi cloud live"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Google Sign-in</span>
            </button>
          )}

          {/* Mode Guru Button */}
          {!isTeacherView ? (
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('dashboard_guru');
              }}
              className="flex items-center gap-1.5 bg-[#123D68] hover:bg-[#1b4b7c] text-white font-extrabold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-sm transition-all cursor-pointer border border-sky-300"
              title="Buka /dashboard-guru (Pemantauan Real-time Siswa)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
              <Users className="w-4 h-4 text-sky-300" />
              <span>Dashboard Guru</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {currentPage !== 'dashboard_guru' && (
                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onNavigate('dashboard_guru');
                  }}
                  className="flex items-center gap-1 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs px-2.5 py-1.5 rounded-xl cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Dashboard Live</span>
                </button>
              )}
              <button
                onClick={() => {
                  audioManager.playClickSound();
                  onNavigate('teacher_settings');
                }}
                className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'teacher_settings'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Pengaturan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7-Step Navigation Menu Bar in exact specified order */}
      {!isTeacherView && !isLoginView && (
        <nav
          aria-label="Navigasi Menu Utama Petualangan"
          className="bg-gradient-to-r from-amber-50/95 via-sky-50/90 to-emerald-50/95 border-t border-sky-100 px-2 sm:px-4 py-1.5 shadow-xs"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(currentPage);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audioManager.playClickSound();
                    onNavigate(item.id);
                  }}
                  title={item.tooltip}
                  className={`group flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer select-none ${
                    active
                      ? `${item.activeBg} scale-102`
                      : 'bg-white/95 text-[#123D68] hover:bg-white hover:text-emerald-700 border border-amber-200/90 shadow-xs hover:shadow-sm hover:scale-102'
                  }`}
                >
                  <span
                    className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-extrabold ${
                      active
                        ? 'bg-white/25 text-white'
                        : 'bg-amber-100 text-amber-900 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                    }`}
                  >
                    {item.num}
                  </span>
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-115 ${
                      active ? 'text-white' : item.iconColor
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dedicated Battle of Map Explorers Badge in Nav Bar */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('battle_explorers');
              }}
              title="Kompetisi Kelompok: Battle of Map Explorers (5 Babak Proyektor)"
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer select-none border-2 shadow-xs ${
                currentPage === 'battle_explorers'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 ring-2 ring-amber-300/80 scale-105'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 hover:from-amber-100 hover:to-orange-100 border-amber-300 hover:scale-102'
              }`}
            >
              <span className="text-sm">⚔️</span>
              <span>Battle Kelompok</span>
              <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                Baru
              </span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

