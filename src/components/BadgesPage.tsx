import React from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { BADGES } from '../data/badges';
import { ArrowLeft, Award, Lock, Sparkles, CheckCircle2, Compass, Flame, Lightbulb, HeartHandshake, Trophy } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface BadgesPageProps {
  studentRecord: StudentRecord;
  onNavigate: (page: NavigationPage) => void;
}

export const BadgesPage: React.FC<BadgesPageProps> = ({ studentRecord, onNavigate }) => {
  const unlockedBadges = studentRecord.progress.unlockedBadges || [];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'compass':
        return <Compass className="w-9 h-9 text-amber-500" />;
      case 'flame':
        return <Flame className="w-9 h-9 text-orange-500" />;
      case 'lightbulb':
        return <Lightbulb className="w-9 h-9 text-emerald-500" />;
      case 'heartHandshake':
        return <HeartHandshake className="w-9 h-9 text-sky-500" />;
      case 'trophy':
      default:
        return <Trophy className="w-9 h-9 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-10 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9]">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('board');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE PETA</span>
          </button>

          <span className="text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1.5 rounded-full">
            {unlockedBadges.length} dari 5 Badge Terbuka
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#FFC928] text-[#123D68] font-extrabold text-xs uppercase px-3.5 py-1 rounded-full mb-2 tracking-wider">
            Apresiasi Sikap & Kemajuan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#123D68]">
            Badge Penghargaan Petualang
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Setiap badge merayakan proses belajar, keberanian mencoba, dan kegigihanmu!
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {BADGES.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-6 rounded-3xl border-3 transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xl scale-102 ring-2 ring-amber-200'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-sm ${
                        isUnlocked
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-slate-100 border-slate-200 grayscale'
                      }`}
                    >
                      {getBadgeIcon(b.iconName)}
                    </div>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Diraih!</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-slate-200 text-slate-500 text-[11px] font-bold px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Terkunci</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-fredoka text-[#123D68] leading-tight">
                    {b.name}
                  </h3>
                  <div className="text-xs font-bold text-amber-700 mb-2">{b.titleBadge}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                    {b.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Syarat Pencapaian:
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    {b.requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth reassurance note */}
        <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-3xl p-5 text-center text-xs sm:text-sm text-[#123D68] font-medium max-w-2xl mx-auto shadow-xs">
          💡 <span className="font-bold">Catatan Pendidik:</span> Badge ini berfungsi sebagai apresiasi atas proses dan usaha belajarmu, bukan sebagai batasan kemampuan tetap. Teruslah bereksplorasi!
        </div>
      </div>
    </div>
  );
};
