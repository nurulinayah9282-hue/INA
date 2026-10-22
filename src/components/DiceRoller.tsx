import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { ArrowLeft, Play, RotateCw, Sparkles, MapPin } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface DiceRollerProps {
  studentRecord: StudentRecord;
  onUpdatePosition: (newPos: number) => void;
  onSelectQuestion: (questionId: number) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  studentRecord,
  onUpdatePosition,
  onSelectQuestion,
  onNavigate,
}) => {
  const currentPos = studentRecord.progress.currentPosition || 1;
  const [diceValue, setDiceValue] = useState<number>(3);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [targetPos, setTargetPos] = useState<number>(currentPos);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    audioManager.playDiceRollSound();

    let rollCount = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rand);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(interval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDice);

        // Move player forward, wrap around 25 if needed or cap at 25
        let nextPos = currentPos + finalDice;
        if (nextPos > 25) {
          nextPos = (nextPos - 1) % 25 + 1;
        }

        setTargetPos(nextPos);
        onUpdatePosition(nextPos);
        setIsRolling(false);
        audioManager.playCorrectSound();
      }
    }, 90);
  };

  const handleOpenChallenge = (pos: number) => {
    audioManager.playClickSound();
    onSelectQuestion(pos);
    onNavigate('challenge');
  };

  const renderDiceDots = (value: number) => {
    // Standard dice dot layouts
    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-rose-500 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-3">
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68] self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-3">
            <span className="w-5 h-5 rounded-full bg-[#123D68] self-start" />
            <span className="w-5 h-5 rounded-full bg-[#123D68] self-center" />
            <span className="w-5 h-5 rounded-full bg-[#123D68] self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-3 gap-6 place-items-center">
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 p-3 place-items-center">
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span />
            <span className="w-5 h-5 rounded-full bg-rose-500" />
            <span />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 p-3 gap-3 place-items-center">
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
            <span className="w-5 h-5 rounded-full bg-[#123D68]" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-10 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9] flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full">
        {/* Top back button */}
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

          <span className="text-xs font-bold bg-[#FFC928] text-[#123D68] px-3 py-1 rounded-full border border-amber-300">
            Mini Game Dadu
          </span>
        </div>

        {/* Dice Arena Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-200 shadow-xl text-center relative overflow-hidden">
          <h2 className="text-3xl font-extrabold font-fredoka text-[#123D68] mb-1">
            Lempar Dadu Petualang!
          </h2>
          <p className="text-sm text-slate-600 mb-6 font-medium">
            Kocok dadu untuk memajukan langkah pionmu di jalur peta petualangan.
          </p>

          {/* Current Position Indicator */}
          <div className="inline-flex items-center gap-2 bg-[#FFF9E7] border-2 border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-[#123D68] mb-8">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>
              Posisi Kamu Saat Ini:{' '}
              <span className="font-extrabold text-[#21A447]">Titik #{currentPos}</span>
            </span>
          </div>

          {/* 3D-style Animated Dice Box */}
          <div className="flex justify-center mb-8">
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 bg-gradient-to-br from-white via-slate-50 to-amber-50 rounded-3xl border-4 border-amber-400 shadow-2xl transition-transform duration-300 flex items-center justify-center relative ${
                isRolling ? 'rotate-180 scale-110 animate-spin' : 'hover:scale-105'
              }`}
            >
              {renderDiceDots(diceValue)}
            </div>
          </div>

          {/* Dice Result text */}
          <div className="mb-6">
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Hasil Lemparan:
            </div>
            <div className="text-4xl font-extrabold font-fredoka text-[#123D68] my-1 flex items-center justify-center gap-2">
              <span>{diceValue} Langkah</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-xs sm:text-sm text-emerald-700 font-bold">
              Langkah membawamu menuju ke Titik #{targetPos}!
            </p>
          </div>

          {/* Roll Button */}
          <div className="space-y-3">
            <button
              onClick={rollDice}
              disabled={isRolling}
              className={`w-full font-fredoka font-bold text-lg sm:text-xl py-3.5 px-6 rounded-2xl shadow-lg border-b-4 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isRolling
                  ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed'
                  : 'bg-[#FF9F1C] hover:bg-amber-600 active:scale-95 text-white border-amber-800'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'SEDANG MENGOKOK DADU...' : 'LEMPAR DADU SEKARANG'}</span>
            </button>

            {/* Direct jump to challenge */}
            <button
              onClick={() => handleOpenChallenge(targetPos)}
              className="w-full bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-base sm:text-lg py-3 px-6 rounded-2xl shadow-md border-b-3 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BUKA TANTANGAN NOMOR #{targetPos}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 py-3">
        Tips: Kamu juga bisa bebas memilih dan mengklik titik mana pun langsung di Papan Permainan!
      </div>
    </div>
  );
};
