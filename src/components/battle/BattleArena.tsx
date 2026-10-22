import React, { useState, useEffect, useRef } from 'react';
import { BattleQuestion, BattleRoundNumber, BattleSessionState } from '../../types';
import { BATTLE_QUESTIONS, BATTLE_ROUNDS_CONFIG } from '../../data/battleQuestions';
import { BattleVisualGraphic } from './BattleVisualGraphic';
import {
  evaluateQuestionAnswers,
  evaluateRetryAnswers,
  saveStoredBattleSession,
} from '../../utils/battleStorage';
import { audioManager } from '../../utils/audio';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Award,
  ChevronRight,
  Lightbulb,
  Eye,
  Settings,
  ClipboardList,
} from 'lucide-react';

interface BattleArenaProps {
  session: BattleSessionState;
  onUpdateSession: (newSession: BattleSessionState) => void;
  onOpenLeaderboard: () => void;
  onOpenObservations: () => void;
  onReturnToLobby: () => void;
  onFinishBattle: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  session,
  onUpdateSession,
  onOpenLeaderboard,
  onOpenObservations,
  onReturnToLobby,
  onFinishBattle,
}) => {
  // Current active questions filtered by active rounds
  const activeQuestions = BATTLE_QUESTIONS.filter((q) =>
    session.activeRounds.includes(q.round)
  );

  const currentQIndex = Math.max(
    0,
    activeQuestions.findIndex((q) => q.id === session.currentQuestionId)
  );
  const currentQuestion: BattleQuestion = activeQuestions[currentQIndex] || activeQuestions[0];

  const roundConfig = BATTLE_ROUNDS_CONFIG[currentQuestion.round];

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(session.discussionDurationSeconds || 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Status for current question
  const isEvaluated = !!session.evaluatedQuestions[currentQuestion.id];
  const isRetryActive = !!session.retryPhase[currentQuestion.id];
  const isRetryEvaluated = !!session.retryEvaluated[currentQuestion.id];

  // Current answers in this question
  const currentQuestionAnswers = session.answers[currentQuestion.id] || {};
  const currentRetryAnswers = session.retryAnswers[currentQuestion.id] || {};
  const currentReasonBonus = session.reasonBonus[currentQuestion.id] || {};

  // Reset timer whenever question changes
  useEffect(() => {
    if (session.discussionDurationSeconds > 0) {
      setTimeLeft(session.discussionDurationSeconds);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [currentQuestion.id, session.discussionDurationSeconds]);

  // Countdown timer ticker
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      audioManager.playBellSound();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  // Handle Teacher Selects Answer for a Group
  const handleSelectGroupAnswer = (groupId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (isEvaluated && !isRetryActive) return;
    audioManager.playClickSound();

    if (isRetryActive && !isRetryEvaluated) {
      // In retry phase (Babak 5)
      const updatedRetryAnswers = {
        ...currentRetryAnswers,
        [groupId]: currentRetryAnswers[groupId] === option ? null : option,
      };
      const updated: BattleSessionState = {
        ...session,
        retryAnswers: {
          ...session.retryAnswers,
          [currentQuestion.id]: updatedRetryAnswers,
        },
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
    } else {
      // Standard phase
      const updatedAnswers = {
        ...currentQuestionAnswers,
        [groupId]: currentQuestionAnswers[groupId] === option ? null : option,
      };
      const updated: BattleSessionState = {
        ...session,
        answers: {
          ...session.answers,
          [currentQuestion.id]: updatedAnswers,
        },
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
    }
  };

  // Toggle Reason Bonus (Babak 3: Detektif Simbol +5 poin)
  const handleToggleReasonBonus = (groupId: string) => {
    audioManager.playClickSound();
    const updatedBonus = {
      ...currentReasonBonus,
      [groupId]: !currentReasonBonus[groupId],
    };
    const updated: BattleSessionState = {
      ...session,
      reasonBonus: {
        ...session.reasonBonus,
        [currentQuestion.id]: updatedBonus,
      },
    };
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
  };

  // Evaluate All Answers
  const handleEvaluateAnswers = () => {
    audioManager.playCorrectSound();
    setIsTimerRunning(false);
    const updatedSession = evaluateQuestionAnswers(session, currentQuestion.id);
    onUpdateSession(updatedSession);
  };

  // Activate Retry Phase (Babak 5: Growth Mindset Challenge)
  const handleActivateRetry = () => {
    audioManager.playClickSound();
    const updated: BattleSessionState = {
      ...session,
      retryPhase: {
        ...session.retryPhase,
        [currentQuestion.id]: true,
      },
    };
    // Pre-populate retry answers with current answers so groups only change if needed
    if (!session.retryAnswers[currentQuestion.id]) {
      updated.retryAnswers = {
        ...session.retryAnswers,
        [currentQuestion.id]: { ...currentQuestionAnswers },
      };
    }
    onUpdateSession(updated);
    saveStoredBattleSession(updated);
    if (session.discussionDurationSeconds > 0) {
      setTimeLeft(30); // Berikan 30 detik diskusi perbaikan
      setIsTimerRunning(true);
    }
  };

  // Evaluate Retry Answers (Babak 5: +5 Bonus points)
  const handleEvaluateRetry = () => {
    audioManager.playCorrectSound();
    setIsTimerRunning(false);
    const updatedSession = evaluateRetryAnswers(session, currentQuestion.id);
    onUpdateSession(updatedSession);
  };

  // Navigate to Next Question or Finish
  const handleNextQuestion = () => {
    audioManager.playClickSound();
    if (currentQIndex < activeQuestions.length - 1) {
      const nextQ = activeQuestions[currentQIndex + 1];
      const updated: BattleSessionState = {
        ...session,
        currentQuestionId: nextQ.id,
        currentRound: nextQ.round,
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All questions completed!
      onFinishBattle();
    }
  };

  const handlePrevQuestion = () => {
    audioManager.playClickSound();
    if (currentQIndex > 0) {
      const prevQ = activeQuestions[currentQIndex - 1];
      const updated: BattleSessionState = {
        ...session,
        currentQuestionId: prevQ.id,
        currentRound: prevQ.round,
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch Round directly via top tabs
  const handleSelectRoundDirectly = (rNum: BattleRoundNumber) => {
    const targetQ = activeQuestions.find((q) => q.round === rNum);
    if (targetQ) {
      audioManager.playClickSound();
      const updated: BattleSessionState = {
        ...session,
        currentQuestionId: targetQ.id,
        currentRound: rNum,
      };
      onUpdateSession(updated);
      saveStoredBattleSession(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 select-none font-nunito">
      {/* Top Projector Navigation & Control Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 border-3 border-sky-300 shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Round Tabs & Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2">
          {session.activeRounds.map((rNum) => {
            const conf = BATTLE_ROUNDS_CONFIG[rNum];
            const isCurrent = currentQuestion.round === rNum;
            return (
              <button
                key={rNum}
                type="button"
                onClick={() => handleSelectRoundDirectly(rNum)}
                className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#123D68] text-white shadow-md scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{conf.icon}</span>
                <span>B{rNum}</span>
              </button>
            );
          })}

          <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl">
              Soal {currentQIndex + 1} dari {activeQuestions.length}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {roundConfig.title}
            </span>
          </div>
        </div>

        {/* Discussion Timer & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visual Timer Countdown */}
          {session.discussionDurationSeconds > 0 && (
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border-2 transition-all ${
                timeLeft <= 10 && timeLeft > 0
                  ? 'bg-rose-100 border-rose-500 text-rose-800 animate-bounce'
                  : timeLeft === 0
                  ? 'bg-slate-100 border-slate-400 text-slate-500'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm sm:text-base font-black font-fredoka">
                {timeLeft > 0 ? `${timeLeft}s` : 'Waktu Habis!'}
              </span>

              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 hover:bg-amber-200/60 rounded-lg text-amber-900 transition-colors cursor-pointer"
                title={isTimerRunning ? 'Jeda waktu' : 'Lanjutkan waktu'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimeLeft(session.discussionDurationSeconds);
                  setIsTimerRunning(true);
                }}
                className="p-1 hover:bg-amber-200/60 rounded-lg text-amber-900 transition-colors cursor-pointer"
                title="Ulangi waktu diskusi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClickSound();
              onOpenLeaderboard();
            }}
            className="bg-[#FFF9E7] hover:bg-amber-100 text-amber-900 border-2 border-amber-300 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Lihat Papan Skor & Klasemen Sementara"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Papan Skor</span>
          </button>

          {/* Growth Observations Button */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClickSound();
              onOpenObservations();
            }}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Catatan Observasi Perilaku Guru"
          >
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Observasi</span>
          </button>

          {/* Lobby Settings Button */}
          <button
            type="button"
            onClick={() => {
              audioManager.playClickSound();
              onReturnToLobby();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-300 transition-colors cursor-pointer"
            title="Pengaturan Kelompok & Waktu"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arena Layout: Split into Question Stage & Teacher Input Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left / Center (8 cols): Large Projector Display of Question & Options */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-2xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#123D68] text-white text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span>{roundConfig.icon}</span>
                  <span>{currentQuestion.roundName}</span>
                </span>
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
                  +{currentQuestion.points} Poin
                </span>
              </div>

              {/* Status Pill */}
              {isEvaluated && (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-3 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Jawaban Selesai Diperiksa</span>
                </span>
              )}
            </div>

            {/* Question Title & Text (Projector-Sized High Contrast Font) */}
            <h2 className="text-xl sm:text-2xl font-black font-fredoka text-[#123D68] mb-2 leading-snug">
              {currentQuestion.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed mb-4 whitespace-pre-line bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              {currentQuestion.question}
            </p>

            {/* Visual Graphic Component (Compass, Map, Symbol, Route, Scale) */}
            <div className="my-4">
              <BattleVisualGraphic question={currentQuestion} />
            </div>

            {/* Multiple Choice Options (A, B, C, D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {currentQuestion.options.map((opt) => {
                const isCorrect = opt.label === currentQuestion.correctAnswer;
                return (
                  <div
                    key={opt.label}
                    className={`p-3.5 rounded-2xl border-3 transition-all flex items-start gap-3 ${
                      isEvaluated && isCorrect
                        ? 'bg-emerald-100 border-emerald-500 shadow-md ring-2 ring-emerald-300 scale-[1.01]'
                        : isEvaluated && !isCorrect
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-sky-200 shadow-xs'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl font-fredoka font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                        isEvaluated && isCorrect
                          ? 'bg-[#21A447] text-white'
                          : 'bg-[#123D68] text-white'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#123D68] leading-snug pt-0.5">
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Answer Explanation & Learning Box (Revealed after evaluation) */}
            {isEvaluated && (
              <div className="mt-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-400 shadow-inner animate-pop">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h4 className="font-black text-sm sm:text-base text-emerald-950 font-fredoka">
                    Kunci Jawaban: Pilihan {currentQuestion.correctAnswer}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Babak 5: Growth Mindset Clue Banner */}
            {currentQuestion.round === 5 && (
              <div className="mt-4 bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 font-fredoka">
                      Zona Growth Mindset: Semangat Pantang Menyerah
                    </h4>
                  </div>
                  {!isRetryActive && isEvaluated && !isRetryEvaluated && (
                    <button
                      type="button"
                      onClick={handleActivateRetry}
                      className="bg-[#EA580C] hover:bg-orange-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buka Petunjuk & Perbaiki (+5 Poin)</span>
                    </button>
                  )}
                </div>

                {isRetryActive ? (
                  <div className="mt-2 bg-white p-3 rounded-xl border border-amber-300 text-xs sm:text-sm text-amber-950 font-bold leading-relaxed animate-pop">
                    {currentQuestion.growthHint}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 font-medium">
                    Jika ada kelompok yang belum tepat, jangan berkecil hati! Tekan tombol "Buka Petunjuk & Perbaiki" untuk memberikan kesempatan berdiskusi kembali.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right (4 cols): Teacher Control & Input Deck */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border-3 border-sky-300 shadow-xl sticky top-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <div>
                  <h3 className="font-black font-fredoka text-base text-[#123D68]">
                    Panel Input Jawaban Guru
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isRetryActive && !isRetryEvaluated
                      ? 'Pilih jawaban hasil perbaikan kelompok:'
                      : 'Pilih jawaban yang diangkat setiap kelompok:'}
                  </p>
                </div>
              </div>
            </div>

            {/* Groups Input Cards */}
            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {session.groups.map((group) => {
                const selectedOpt = isRetryActive && !isRetryEvaluated
                  ? currentRetryAnswers[group.id]
                  : currentQuestionAnswers[group.id];

                const isCorrect = isEvaluated && currentQuestionAnswers[group.id] === currentQuestion.correctAnswer;
                const isRetryCorrect = isRetryEvaluated && currentRetryAnswers[group.id] === currentQuestion.correctAnswer;
                const hasReasonBonus = !!currentReasonBonus[group.id];

                return (
                  <div
                    key={group.id}
                    className={`p-2.5 rounded-2xl border-2 transition-all ${
                      isEvaluated && isCorrect
                        ? 'bg-emerald-50 border-emerald-400'
                        : isEvaluated && !isCorrect
                        ? 'bg-rose-50/60 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{group.icon}</span>
                        <span className="font-extrabold text-xs text-[#123D68] truncate">
                          {group.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                          {group.score} Pts
                        </span>
                        {isEvaluated && (
                          isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )
                        )}
                      </div>
                    </div>

                    {/* Answer Choice Buttons A, B, C, D */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const isChosen = selectedOpt === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectGroupAnswer(group.id, opt)}
                            className={`py-1.5 rounded-xl font-fredoka font-black text-xs transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-[#123D68] text-white shadow-xs scale-105'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Babak 3: Bonus Alasan Ilmiah / Tepat Toggle */}
                    {currentQuestion.round === 3 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600">
                          Alasan Ilmiah Tepat (+5 Pts):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleReasonBonus(group.id)}
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            hasReasonBonus
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-white text-slate-500 border-slate-300'
                          }`}
                        >
                          {hasReasonBonus ? '✓ Diberikan' : '+ Beri Bonus'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Big Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              {!isEvaluated ? (
                <button
                  type="button"
                  onClick={handleEvaluateAnswers}
                  className="w-full py-3 rounded-2xl bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-black text-sm sm:text-base shadow-lg border-b-3 border-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>PERIKSA SEMUA JAWABAN</span>
                </button>
              ) : isRetryActive && !isRetryEvaluated ? (
                <button
                  type="button"
                  onClick={handleEvaluateRetry}
                  className="w-full py-3 rounded-2xl bg-[#EA580C] hover:bg-orange-600 active:scale-95 text-white font-fredoka font-black text-sm sm:text-base shadow-lg border-b-3 border-orange-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>PERIKSA HASIL PERBAIKAN</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={currentQIndex === 0}
                    className="p-3 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 font-bold transition-all cursor-pointer"
                    title="Soal Sebelumnya"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="flex-1 py-3 rounded-2xl bg-[#0284C7] hover:bg-sky-600 active:scale-95 text-white font-fredoka font-black text-sm shadow-md border-b-3 border-sky-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentQIndex < activeQuestions.length - 1
                        ? 'SOAL BERIKUTNYA'
                        : 'SELESAIKAN KOMPETISI 🏆'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
