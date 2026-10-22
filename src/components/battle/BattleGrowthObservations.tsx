import React from 'react';
import { BattleSessionState } from '../../types';
import { GROWTH_OBSERVATION_METRICS } from '../../data/battleQuestions';
import { saveStoredBattleSession } from '../../utils/battleStorage';
import { audioManager } from '../../utils/audio';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Save,
  Users,
} from 'lucide-react';

interface BattleGrowthObservationsProps {
  session: BattleSessionState;
  onUpdateSession: (newSession: BattleSessionState) => void;
  onBackToArena: () => void;
}

export const BattleGrowthObservations: React.FC<BattleGrowthObservationsProps> = ({
  session,
  onUpdateSession,
  onBackToArena,
}) => {
  const handleToggleCheck = (groupId: string, metricId: string) => {
    audioManager.playClickSound();
    const updatedGroups = session.groups.map((g) => {
      if (g.id !== groupId) return g;
      const currentVal = !!g.growthChecks[metricId];
      return {
        ...g,
        growthChecks: {
          ...g.growthChecks,
          [metricId]: !currentVal,
        },
      };
    });

    const updated: BattleSessionState = {
      ...session,
      groups: updatedGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  const handleNotesChange = (groupId: string, notes: string) => {
    const updatedGroups = session.groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        growthNotes: notes,
      };
    });

    const updated: BattleSessionState = {
      ...session,
      groups: updatedGroups,
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 font-nunito select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-4 border-emerald-300 shadow-2xl relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-xs">
              🌱
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-full text-[11px] font-black text-emerald-900 uppercase">
                <span>Rubrik Pengamatan Guru</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-fredoka text-[#123D68]">
                Observasi Karakter & Sikap Growth Mindset
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioManager.playClickSound();
              onBackToArena();
            }}
            className="bg-[#123D68] hover:bg-sky-900 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pertandingan</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="my-4 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
          💡 <strong>Prinsip Penilaian:</strong> Growth Mindset siswa dinilai berdasarkan perilaku nyata yang teramati saat kompetisi berlangsung (bukan hanya dari perolehan skor angka). Centang indikator yang ditunjukkan kelompok dan berikan catatan apresiasi atau pembinaan kualitatif.
        </div>

        {/* 5 Indicators Legend Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-6">
          {GROWTH_OBSERVATION_METRICS.map((m) => (
            <div key={m.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#123D68] mb-1">
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        {/* Groups Observation Checklist Cards */}
        <div className="space-y-4">
          {session.groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-sky-200 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{group.icon}</span>
                  <div>
                    <h3 className="font-extrabold font-fredoka text-base text-[#123D68]">
                      {group.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">
                      {group.members.length} Siswa • Skor: <strong>{group.score} Poin</strong>
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {Object.values(group.growthChecks).filter(Boolean).length} dari 5 Indikator Terpenuhi
                </span>
              </div>

              {/* Checkboxes for 5 Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
                {GROWTH_OBSERVATION_METRICS.map((metric) => {
                  const isChecked = !!group.growthChecks[metric.id];
                  return (
                    <button
                      key={metric.id}
                      type="button"
                      onClick={() => handleToggleCheck(group.id, metric.id)}
                      className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer flex items-start gap-2 ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <div className="text-[11px] leading-tight">
                        <span className="block font-bold">{metric.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Qualitative Notes Textarea */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  Catatan Observasi Perilaku Guru:
                </label>
                <textarea
                  value={group.growthNotes || ''}
                  onChange={(e) => handleNotesChange(group.id, e.target.value)}
                  placeholder="Contoh: Sangat kompak saat berdiskusi, berani mengakui kekeliruan di Babak 2 dan bangkit membetulkan di Babak 5..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#123D68] focus:bg-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
