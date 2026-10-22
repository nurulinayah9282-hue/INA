import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { QUESTIONS } from '../data/questions';
import { PUZZLE_PIECES } from '../data/badges';
import { FeedbackModal } from './FeedbackModal';
import { QuestionVisual } from './QuestionVisual';
import { ReferenceVillageMap } from './ReferenceVillageMap';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Lightbulb,
  BookOpen,
  Sparkles,
  MapPin,
  Check,
  X,
  Map,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface ChallengeCardProps {
  questionId: number;
  studentRecord: StudentRecord;
  onAnswerQuestion: (
    questionId: number,
    answerIndex: number,
    isCorrect: boolean
  ) => { newlyCompleted: boolean };
  onNavigate: (page: NavigationPage) => void;
  onSelectNextQuestion: (nextId: number) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  questionId,
  studentRecord,
  onAnswerQuestion,
  onNavigate,
  onSelectNextQuestion,
}) => {
  const question = QUESTIONS.find((q) => q.id === questionId) || QUESTIONS[0];
  const progress = studentRecord.progress;
  const isAlreadySolved = progress.completedQuestions.includes(question.id);
  const existingAnswer = progress.answers[question.id];

  const [selectedOption, setSelectedOption] = useState<number | null>(
    existingAnswer !== undefined ? existingAnswer : null
  );
  const [showHintBox, setShowHintBox] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showFullMapModal, setShowFullMapModal] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    newPieceText: string | null;
  }>({
    isOpen: false,
    isCorrect: false,
    newPieceText: null,
  });

  const handleSpeakQuestion = () => {
    if (isPlayingAudio) {
      audioManager.stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const optionsText = question.options
      .map((opt, i) => `Pilihan ${String.fromCharCode(65 + i)}: ${opt}.`)
      .join(' ');
    const fullText = `Tantangan nomor ${question.id}: ${question.text}. ${optionsText}`;

    setIsPlayingAudio(true);
    audioManager.speak(fullText, () => setIsPlayingAudio(false));
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    audioManager.stopSpeech();
    setIsPlayingAudio(false);

    const isCorrect = selectedOption === question.correctIndex;
    const { newlyCompleted } = onAnswerQuestion(question.id, selectedOption, isCorrect);

    let newPiece: string | null = null;
    if (newlyCompleted) {
      const newTotal = progress.completedQuestions.length + 1;
      const milestoneIndices: Record<number, number> = {
        4: 0,
        8: 1,
        12: 2,
        16: 3,
        20: 4,
        25: 5,
      };
      if (milestoneIndices[newTotal] !== undefined) {
        newPiece = PUZZLE_PIECES[milestoneIndices[newTotal]].text;
      }
    }

    setFeedbackState({
      isOpen: true,
      isCorrect,
      newPieceText: newPiece,
    });
  };

  const handleRetry = () => {
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
    setSelectedOption(null);
  };

  const handleNextQuestion = () => {
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
    if (question.id < 25) {
      onSelectNextQuestion(question.id + 1);
    } else {
      onNavigate('puzzle');
    }
  };

  const handleBackToBoard = () => {
    setFeedbackState((prev) => ({ ...prev, isOpen: false }));
    onNavigate('board');
  };

  const getOptionLetter = (idx: number) => String.fromCharCode(65 + idx); // A, B, C, D

  return (
    <div className="min-h-[calc(100vh-68px)] py-4 sm:py-6 px-3 sm:px-6 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9]">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={() => {
              audioManager.stopSpeech();
              audioManager.playClickSound();
              onNavigate('board');
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE PETA</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Quick button to view full reference map */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                setShowFullMapModal(true);
              }}
              className="flex items-center gap-1.5 bg-[#FFF9E7] hover:bg-amber-100 text-[#123D68] border-2 border-amber-300 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Buka Peta Referensi Desa Lengkap"
            >
              <Map className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Peta Referensi</span>
            </button>

            {/* Audio narration button */}
            <button
              onClick={handleSpeakQuestion}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white border-2 border-sky-300 text-sky-800 hover:bg-sky-50 shadow-sm'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop' : 'Dengarkan Soal 🔊'}</span>
            </button>

            {/* Hint toggle button */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                setShowHintBox(!showHintBox);
              }}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Petunjuk</span>
            </button>
          </div>
        </div>

        {/* Challenge Main Card Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border-3 border-sky-200 shadow-xl relative overflow-hidden">
          {/* Header Info Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-[#FF9F1C] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                {question.zoneName}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Topik: {question.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAlreadySolved && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Sudah Selesai
                </span>
              )}
              <span className="bg-[#FFF9E7] border border-amber-300 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                Tantangan {question.id} dari 25
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="my-2 mb-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold font-fredoka text-[#123D68] leading-snug">
              {question.text}
            </h2>
          </div>

          {/* Hint Expandable Box */}
          {showHintBox && (
            <div className="my-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 text-xs sm:text-sm text-amber-950 font-medium animate-pop flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Petunjuk Ramah:</span>
                <p>{question.hint}</p>
              </div>
            </div>
          )}

          {/* Responsive 2-Column Layout on Desktop, 1-Column on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 items-start">
            {/* Left Column: Dedicated Educational Graphic / Map Visual */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <QuestionVisual
                questionId={question.id}
                onOpenFullMap={() => setShowFullMapModal(true)}
              />
            </div>

            {/* Right Column: 4 Answer Options */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Pilih Jawaban yang Paling Tepat:
              </div>

              {question.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      audioManager.playClickSound();
                      setSelectedOption(idx);
                    }}
                    className={`w-full text-left p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm md:text-base font-bold border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-md ring-2 ring-sky-300 scale-101'
                        : 'bg-[#FFF9E7]/60 border-amber-200 hover:border-sky-300 text-[#123D68] hover:bg-amber-50'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {getOptionLetter(idx)}
                    </span>
                    <span className="flex-1 leading-snug">{optionText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  audioManager.playClickSound();
                  onNavigate('material');
                }}
                className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Materi Terkait Jika Ragu</span>
              </button>
            </div>

            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`w-full sm:w-auto font-fredoka font-bold text-base sm:text-lg py-3 px-8 rounded-2xl shadow-lg border-b-4 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedOption !== null
                  ? 'bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white border-emerald-800'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>CEK JAWABAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Full Top-Down Village Reference Map */}
      {showFullMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border-4 border-sky-300 shadow-2xl p-4 sm:p-6 my-4 animate-pop">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <h3 className="text-base sm:text-xl font-bold font-fredoka text-[#123D68]">
                  Peta Referensi Lengkap — Lingkungan Desa Harapan
                </h3>
              </div>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ReferenceVillageMap compact={false} />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowFullMapModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#21A447] text-white font-bold text-xs sm:text-sm hover:bg-emerald-600 shadow-sm"
              >
                Tutup Peta & Lanjutkan Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackState.isOpen}
        isCorrect={feedbackState.isCorrect}
        questionNumber={question.id}
        explanation={question.explanation}
        hint={question.hint}
        newPieceUnlocked={feedbackState.newPieceText}
        onRetry={handleRetry}
        onNextQuestion={handleNextQuestion}
        onBackToBoard={handleBackToBoard}
        onOpenMaterial={() => {
          setFeedbackState((prev) => ({ ...prev, isOpen: false }));
          onNavigate('material');
        }}
      />
    </div>
  );
};
