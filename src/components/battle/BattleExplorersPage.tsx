import React, { useState, useEffect } from 'react';
import { NavigationPage, BattleSessionState } from '../../types';
import {
  getStoredBattleSession,
  saveStoredBattleSession,
  createInitialBattleSession,
  generateBattleCsvString,
  downloadCsvFile,
} from '../../utils/battleStorage';
import { BattleLobby } from './BattleLobby';
import { BattleArena } from './BattleArena';
import { BattleLeaderboard } from './BattleLeaderboard';
import { BattleGrowthObservations } from './BattleGrowthObservations';
import { audioManager } from '../../utils/audio';
import { Trophy, RotateCcw, Download, BookOpen, ArrowLeft, Sparkles, Award } from 'lucide-react';

interface BattleExplorersPageProps {
  onNavigate: (page: NavigationPage) => void;
}

type BattleSubView = 'lobby' | 'arena' | 'leaderboard' | 'observations' | 'finished';

export const BattleExplorersPage: React.FC<BattleExplorersPageProps> = ({ onNavigate }) => {
  const [session, setSession] = useState<BattleSessionState>(() => getStoredBattleSession());
  const [currentView, setCurrentView] = useState<BattleSubView>(() => {
    return session.isStarted ? 'arena' : 'lobby';
  });

  const handleUpdateSession = (newSession: BattleSessionState) => {
    setSession(newSession);
    saveStoredBattleSession(newSession);
  };

  const handleStartBattle = () => {
    const startedSession: BattleSessionState = {
      ...session,
      isStarted: true,
    };
    handleUpdateSession(startedSession);
    setCurrentView('arena');
    audioManager.playLevelUpSound();
  };

  const handleFinishBattle = () => {
    const finishedSession: BattleSessionState = {
      ...session,
      isFinished: true,
    };
    handleUpdateSession(finishedSession);
    setCurrentView('finished');
    audioManager.playLevelUpSound();
  };

  const handleResetEntireBattle = () => {
    if (window.confirm('Mulai ulang kompetisi baru? Skor dan jawaban kelompok akan direset ke 0.')) {
      audioManager.playClickSound();
      const fresh = createInitialBattleSession(session.groupCount);
      handleUpdateSession(fresh);
      setCurrentView('lobby');
    }
  };

  const sortedGroups = [...session.groups].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-[calc(100vh-70px)] pb-12 pt-4">
      {currentView === 'lobby' && (
        <BattleLobby
          session={session}
          onUpdateSession={handleUpdateSession}
          onStartBattle={handleStartBattle}
          onBackToApp={() => onNavigate('cover')}
        />
      )}

      {currentView === 'arena' && (
        <BattleArena
          session={session}
          onUpdateSession={handleUpdateSession}
          onOpenLeaderboard={() => setCurrentView('leaderboard')}
          onOpenObservations={() => setCurrentView('observations')}
          onReturnToLobby={() => setCurrentView('lobby')}
          onFinishBattle={handleFinishBattle}
        />
      )}

      {currentView === 'leaderboard' && (
        <BattleLeaderboard
          session={session}
          onBackToArena={() => setCurrentView('arena')}
          onResetBattle={handleResetEntireBattle}
        />
      )}

      {currentView === 'observations' && (
        <BattleGrowthObservations
          session={session}
          onUpdateSession={handleUpdateSession}
          onBackToArena={() => setCurrentView('arena')}
        />
      )}

      {/* Finished Victory Podium Screen */}
      {currentView === 'finished' && (
        <div className="max-w-4xl mx-auto px-4 py-8 font-nunito select-none text-center">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-2xl relative overflow-hidden">
            <span className="text-6xl sm:text-7xl animate-bounce block mb-2">🎉</span>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-1 rounded-full text-xs font-black uppercase mb-3">
              <span>Selamat Para Penjelajah Tangguh!</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-fredoka text-[#123D68] mb-2">
              KOMPETISI SELESAI!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-bold max-w-xl mx-auto mb-8">
              Seluruh kelompok telah menunjukkan ketekunan, kerja sama, dan semangat pantang menyerah dalam memecahkan teka-teki peta!
            </p>

            {/* Winner Spotlight Card */}
            {sortedGroups[0] && (
              <div className="max-w-md mx-auto bg-gradient-to-tr from-amber-200 via-amber-100 to-yellow-50 rounded-3xl p-6 border-4 border-amber-400 shadow-xl mb-8">
                <span className="text-5xl">👑</span>
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider block mt-1">
                  Juara 1 Battle of Map Explorers
                </span>
                <span className="text-4xl block my-2">{sortedGroups[0].icon}</span>
                <h2 className="text-2xl font-black font-fredoka text-[#123D68]">
                  {sortedGroups[0].name}
                </h2>
                <div className="mt-3 inline-block bg-white px-5 py-2 rounded-2xl border-2 border-amber-300 font-black text-xl text-[#123D68] shadow-sm">
                  Total Skor: {sortedGroups[0].score} Poin
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  audioManager.playClickSound();
                  const csv = generateBattleCsvString(session);
                  const dateStr = new Date().toISOString().split('T')[0];
                  downloadCsvFile(csv, `Rekap_Battle_Map_Explorers_${dateStr}.csv`);
                }}
                className="bg-[#21A447] hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Unduh Hasil Lengkap (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioManager.playClickSound();
                  setCurrentView('leaderboard');
                }}
                className="bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg border-b-4 border-sky-800 transition-all cursor-pointer flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Lihat Rekap Seluruh Kelompok</span>
              </button>

              <button
                type="button"
                onClick={handleResetEntireBattle}
                className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 font-bold text-sm px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mainkan Kompetisi Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioManager.playClickSound();
                  onNavigate('cover');
                }}
                className="bg-white hover:bg-amber-50 text-[#123D68] border-2 border-amber-300 font-bold text-sm px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Kembali ke Menu Utama</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
