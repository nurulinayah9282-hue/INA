import React from 'react';
import { BattleSessionState } from '../../types';
import { generateBattleCsvString, downloadCsvFile } from '../../utils/battleStorage';
import { audioManager } from '../../utils/audio';
import {
  Trophy,
  Medal,
  Download,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';

interface BattleLeaderboardProps {
  session: BattleSessionState;
  onBackToArena: () => void;
  onResetBattle?: () => void;
}

export const BattleLeaderboard: React.FC<BattleLeaderboardProps> = ({
  session,
  onBackToArena,
  onResetBattle,
}) => {
  const sortedGroups = [...session.groups].sort((a, b) => b.score - a.score);

  const handleDownloadCsv = () => {
    audioManager.playClickSound();
    const csv = generateBattleCsvString(session);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsvFile(csv, `Rekap_Battle_Map_Explorers_${dateStr}.csv`);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 font-nunito select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-4 border-amber-300 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm shrink-0">
              🏆
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FFF9E7] border border-amber-300 px-3 py-0.5 rounded-full text-[11px] font-black text-amber-900 uppercase tracking-wide">
                <span>⚔️</span>
                <span>Klasemen Kompetisi Kelompok</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-fredoka text-[#123D68]">
                Papan Skor & Peringkat Juara
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="bg-[#21A447] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              title="Unduh Rekap Nilai ke Format CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioManager.playClickSound();
                onBackToArena();
              }}
              className="bg-[#123D68] hover:bg-sky-900 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali Bertanding</span>
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {sortedGroups.length >= 3 && (
          <div className="my-8 grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto">
            {/* Rank 2 (Left) */}
            <div className="bg-gradient-to-t from-slate-200 to-slate-50 rounded-3xl p-3 sm:p-4 border-3 border-slate-300 text-center shadow-md flex flex-col items-center">
              <span className="text-3xl sm:text-4xl">🥈</span>
              <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 mt-1">
                Juara 2
              </span>
              <span className="text-2xl mt-1">{sortedGroups[1].icon}</span>
              <h3 className="font-extrabold font-fredoka text-xs sm:text-sm text-[#123D68] mt-1 truncate max-w-full">
                {sortedGroups[1].name}
              </h3>
              <div className="mt-2 bg-white px-3 py-1 rounded-xl border border-slate-200 font-black text-sm sm:text-base text-[#123D68]">
                {sortedGroups[1].score} Pts
              </div>
            </div>

            {/* Rank 1 (Center, Elevated) */}
            <div className="bg-gradient-to-t from-amber-200 via-amber-100 to-yellow-50 rounded-3xl p-4 sm:p-5 border-4 border-amber-400 text-center shadow-xl flex flex-col items-center transform -translate-y-3">
              <span className="text-4xl sm:text-5xl animate-bounce">👑</span>
              <span className="text-xs sm:text-sm font-black uppercase text-amber-800 mt-1">
                Juara 1
              </span>
              <span className="text-3xl mt-1">{sortedGroups[0].icon}</span>
              <h3 className="font-extrabold font-fredoka text-sm sm:text-base text-[#123D68] mt-1 truncate max-w-full">
                {sortedGroups[0].name}
              </h3>
              <div className="mt-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-1.5 rounded-2xl border-2 border-white font-black text-base sm:text-lg shadow-sm">
                {sortedGroups[0].score} Pts
              </div>
            </div>

            {/* Rank 3 (Right) */}
            <div className="bg-gradient-to-t from-amber-100/70 to-orange-50 rounded-3xl p-3 sm:p-4 border-3 border-amber-300 text-center shadow-md flex flex-col items-center">
              <span className="text-3xl sm:text-4xl">🥉</span>
              <span className="text-[10px] sm:text-xs font-black uppercase text-amber-700 mt-1">
                Juara 3
              </span>
              <span className="text-2xl mt-1">{sortedGroups[2].icon}</span>
              <h3 className="font-extrabold font-fredoka text-xs sm:text-sm text-[#123D68] mt-1 truncate max-w-full">
                {sortedGroups[2].name}
              </h3>
              <div className="mt-2 bg-white px-3 py-1 rounded-xl border border-amber-200 font-black text-sm sm:text-base text-[#123D68]">
                {sortedGroups[2].score} Pts
              </div>
            </div>
          </div>
        )}

        {/* Detailed Leaderboard Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#123D68] border-b-2 border-slate-200 font-black">
                <th className="py-3 px-3 rounded-l-2xl text-center w-12">#</th>
                <th className="py-3 px-3">Kelompok</th>
                <th className="py-3 px-2 text-center">B1</th>
                <th className="py-3 px-2 text-center">B2</th>
                <th className="py-3 px-2 text-center">B3</th>
                <th className="py-3 px-2 text-center">B4</th>
                <th className="py-3 px-2 text-center">B5</th>
                <th className="py-3 px-2 text-center">Bonus</th>
                <th className="py-3 px-3 rounded-r-2xl text-right">Total Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedGroups.map((group, idx) => (
                <tr
                  key={group.id}
                  className={`hover:bg-amber-50/50 transition-colors ${
                    idx === 0 ? 'bg-amber-50/70 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center font-black">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{group.icon}</span>
                      <div>
                        <span className="font-extrabold text-[#123D68] block">
                          {group.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {group.members.length} Anggota Siswa
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {group.roundScores[1] || 0}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {group.roundScores[2] || 0}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {group.roundScores[3] || 0}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {group.roundScores[4] || 0}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {group.roundScores[5] || 0}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-amber-700">
                    +{group.growthBonus || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-black font-fredoka text-base text-[#123D68]">
                    {group.score} Pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            💡 Keterangan Babak: B1 (Tebak Cepat) • B2 (Duel Arah) • B3 (Detektif Simbol) • B4 (Puzzle Rute) • B5 (Growth Mindset)
          </span>

          {onResetBattle && (
            <button
              type="button"
              onClick={onResetBattle}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Ulang Kompetisi Baru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
