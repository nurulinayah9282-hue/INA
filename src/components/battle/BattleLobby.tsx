import React, { useState } from 'react';
import { BattleGroup, BattleRoundNumber, BattleSessionState } from '../../types';
import { BATTLE_ROUNDS_CONFIG } from '../../data/battleQuestions';
import { createDefaultBattleGroups, saveStoredBattleSession } from '../../utils/battleStorage';
import { audioManager } from '../../utils/audio';
import {
  Users,
  Settings,
  Clock,
  Sparkles,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Shield,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface BattleLobbyProps {
  session: BattleSessionState;
  onUpdateSession: (newSession: BattleSessionState) => void;
  onStartBattle: () => void;
  onBackToApp: () => void;
}

const AVAILABLE_ICONS = ['🦅', '🐯', '🐬', '🦜', '🦎', '🦁', '🧭', '🚀', '🚢', '🗺️', '🏕️', '🏆'];
const COLOR_PRESETS: { name: BattleGroup['colorName']; hex: string; label: string }[] = [
  { name: 'blue', hex: '#0284C7', label: 'Biru Langit' },
  { name: 'green', hex: '#059669', label: 'Hijau Rimba' },
  { name: 'amber', hex: '#D97706', label: 'Kuning Emas' },
  { name: 'orange', hex: '#EA580C', label: 'Oranye Berapi' },
  { name: 'purple', hex: '#7C3AED', label: 'Ungu Bangsawan' },
  { name: 'rose', hex: '#E11D48', label: 'Merah Mawar' },
  { name: 'cyan', hex: '#0891B2', label: 'Toska Bahari' },
];

export const BattleLobby: React.FC<BattleLobbyProps> = ({
  session,
  onUpdateSession,
  onStartBattle,
  onBackToApp,
}) => {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const handleGroupCountChange = (count: 5 | 6) => {
    audioManager.playClickSound();
    const newGroups = createDefaultBattleGroups(count);
    const updated: BattleSessionState = {
      ...session,
      groupCount: count,
      groups: newGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleGroupNameChange = (groupId: string, newName: string) => {
    const updatedGroups = session.groups.map((g) =>
      g.id === groupId ? { ...g, name: newName } : g
    );
    const updated: BattleSessionState = {
      ...session,
      groups: updatedGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleGroupIconChange = (groupId: string, newIcon: string) => {
    audioManager.playClickSound();
    const updatedGroups = session.groups.map((g) =>
      g.id === groupId ? { ...g, icon: newIcon } : g
    );
    const updated: BattleSessionState = {
      ...session,
      groups: updatedGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleGroupColorChange = (groupId: string, colorHex: string, colorName: BattleGroup['colorName']) => {
    audioManager.playClickSound();
    const updatedGroups = session.groups.map((g) =>
      g.id === groupId ? { ...g, themeColor: colorHex, colorName } : g
    );
    const updated: BattleSessionState = {
      ...session,
      groups: updatedGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleToggleRound = (roundNum: BattleRoundNumber) => {
    audioManager.playClickSound();
    const current = [...session.activeRounds];
    let next: BattleRoundNumber[];
    if (current.includes(roundNum)) {
      if (current.length <= 1) return; // minimal 1 babak aktif
      next = current.filter((r) => r !== roundNum);
    } else {
      next = [...current, roundNum].sort((a, b) => a - b);
    }
    const updated: BattleSessionState = {
      ...session,
      activeRounds: next,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleDurationChange = (seconds: number) => {
    audioManager.playClickSound();
    const updated: BattleSessionState = {
      ...session,
      discussionDurationSeconds: seconds,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan pengaturan kelompok dan durasi ke default awal?')) {
      audioManager.playClickSound();
      const freshGroups = createDefaultBattleGroups(session.groupCount);
      const updated: BattleSessionState = {
        ...session,
        groups: freshGroups,
        activeRounds: [1, 2, 3, 4, 5],
        discussionDurationSeconds: 60,
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Top Welcome Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-4 border-amber-300 shadow-2xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-44 h-44 bg-sky-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FFF9E7] border-2 border-amber-300 px-3.5 py-1 rounded-full text-xs font-black text-amber-800 uppercase tracking-wide mb-2 shadow-xs">
              <span>⚔️</span>
              <span>Mode Kompetisi Antarkelompok</span>
              <span className="bg-[#21A447] text-white text-[10px] px-2 py-0.5 rounded-full">
                Satu Laptop Proyektor
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-fredoka text-[#123D68] tracking-tight">
              BATTLE OF <span className="text-[#FF9F1C]">MAP EXPLORERS</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-600 mt-1 max-w-2xl">
              “Adu Strategi, Kerja Sama, dan Pengetahuan tentang Peta!”
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Didesain khusus untuk proyektor kelas: guru menampilkan soal di layar proyektor, kelompok berdiskusi dan mengangkat kartu jawaban (A/B/C/D), lalu sistem memeriksa jawaban serentak!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                audioManager.playClickSound();
                onBackToApp();
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Kembali ke Menu Utama</span>
            </button>

            <button
              onClick={() => {
                audioManager.playCorrectSound();
                onStartBattle();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#21A447] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-fredoka font-black text-base sm:text-lg shadow-xl border-b-4 border-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-2 group animate-pulse"
            >
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              <span>MULAI KOMPETISI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Group Management */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-3 border-sky-300 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 border-2 border-sky-400 flex items-center justify-center text-xl shadow-xs">
                  <Users className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-fredoka text-[#123D68]">
                    Pengaturan Kelompok Siswa
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Total 37 siswa kelas IV B dibagi rata secara otomatis
                  </p>
                </div>
              </div>

              {/* Group Count Switcher: 5 or 6 Groups */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 px-2">Jumlah:</span>
                <button
                  type="button"
                  onClick={() => handleGroupCountChange(5)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    session.groupCount === 5
                      ? 'bg-[#123D68] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  5 Kelompok (7-8 siswa)
                </button>
                <button
                  type="button"
                  onClick={() => handleGroupCountChange(6)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    session.groupCount === 6
                      ? 'bg-[#123D68] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  6 Kelompok (6-7 siswa)
                </button>
              </div>
            </div>

            {/* List of Groups */}
            <div className="space-y-3.5">
              {session.groups.map((group, gIdx) => {
                const isExpanded = expandedGroupId === group.id;
                const isEditing = editingGroupId === group.id;

                return (
                  <div
                    key={group.id}
                    className="bg-slate-50 hover:bg-white rounded-2xl border-2 transition-all p-3.5 sm:p-4 shadow-xs"
                    style={{ borderColor: group.themeColor }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Left: Icon, Number, Name */}
                      <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-white shrink-0"
                          style={{ backgroundColor: `${group.themeColor}25` }}
                        >
                          {group.icon}
                        </div>

                        <div className="flex-1">
                          {isEditing ? (
                            <input
                              type="text"
                              value={group.name}
                              onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                              onBlur={() => setEditingGroupId(null)}
                              autoFocus
                              className="w-full bg-white border-2 border-amber-400 rounded-xl px-2.5 py-1 text-sm font-bold text-[#123D68] focus:outline-none"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3
                                onClick={() => setEditingGroupId(group.id)}
                                className="font-extrabold font-fredoka text-sm sm:text-base text-[#123D68] cursor-pointer hover:text-amber-600"
                                title="Klik untuk mengedit nama kelompok"
                              >
                                {group.name}
                              </h3>
                              <span
                                onClick={() => setEditingGroupId(group.id)}
                                className="text-[10px] bg-slate-200 hover:bg-amber-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                ✏️ Edit
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                            <span className="font-bold text-slate-700">
                              {group.members.length} Anggota Siswa
                            </span>
                            <span>•</span>
                            <span>Skor Saat Ini: <strong>{group.score} Poin</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Icon Selector, Color Dots, Expand Members */}
                      <div className="flex items-center gap-2">
                        {/* Quick Color Picker */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          {COLOR_PRESETS.map((cp) => (
                            <button
                              key={cp.name}
                              type="button"
                              onClick={() => handleGroupColorChange(group.id, cp.hex, cp.name)}
                              style={{ backgroundColor: cp.hex }}
                              className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                                group.colorName === cp.name ? 'scale-125 ring-2 ring-slate-800' : 'opacity-70 hover:opacity-100'
                              }`}
                              title={cp.label}
                            />
                          ))}
                        </div>

                        {/* Quick Icon Select */}
                        <select
                          value={group.icon}
                          onChange={(e) => handleGroupIconChange(group.id, e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-base cursor-pointer focus:outline-none"
                          title="Ubah Maskot Kelompok"
                        >
                          {AVAILABLE_ICONS.map((ic) => (
                            <option key={ic} value={ic}>
                              {ic}
                            </option>
                          ))}
                        </select>

                        {/* Toggle Members Dropdown */}
                        <button
                          type="button"
                          onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                          className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title={isExpanded ? 'Tutup daftar anggota' : 'Lihat daftar anggota'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Members List */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80">
                        <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-2">
                          Daftar Anggota Kelompok ({group.members.length} Siswa):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {group.members.map((memName, mIdx) => (
                            <div
                              key={mIdx}
                              className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                            >
                              <span className="text-[10px] text-slate-400 font-bold">{mIdx + 1}.</span>
                              <span className="truncate">{memName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Rounds & Discussion Duration Settings */}
        <div className="space-y-5">
          {/* Discussion Timer Setting */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-3 border-amber-300 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-black font-fredoka text-[#123D68]">
                Durasi Diskusi per Soal
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-3">
              Waktu hitung mundur bagi kelompok untuk musyawarah sebelum mengangkat kartu jawaban.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { sec: 30, label: '30 Detik' },
                { sec: 45, label: '45 Detik' },
                { sec: 60, label: '60 Detik (Standar)' },
                { sec: 90, label: '90 Detik' },
                { sec: 120, label: '2 Menit (Santai)' },
                { sec: 0, label: 'Tanpa Batas ⏱️' },
              ].map((item) => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => handleDurationChange(item.sec)}
                  className={`p-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                    session.discussionDurationSeconds === item.sec
                      ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Rounds Selection */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-3 border-emerald-300 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-black font-fredoka text-[#123D68]">
                  Pilihan 5 Babak Permainan
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {session.activeRounds.length}/5 Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-3">
              Guru dapat memilih babak mana saja yang akan dimainkan hari ini:
            </p>

            <div className="space-y-2">
              {([1, 2, 3, 4, 5] as BattleRoundNumber[]).map((rNum) => {
                const conf = BATTLE_ROUNDS_CONFIG[rNum];
                const isActive = session.activeRounds.includes(rNum);

                return (
                  <div
                    key={rNum}
                    onClick={() => handleToggleRound(rNum)}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{conf.icon}</span>
                      <div>
                        <span className="text-xs font-black text-[#123D68] block">
                          {conf.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {conf.pointsRule}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-rose-600 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan Pengaturan ke Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
