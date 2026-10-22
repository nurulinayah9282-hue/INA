import React, { useState } from 'react';
import { NavigationPage } from '../types';
import { ArrowLeft, Play, Volume2, Sparkles, MapPin, Headphones, Lightbulb, Puzzle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface InstructionsPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const InstructionsPage: React.FC<InstructionsPageProps> = ({ onNavigate }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const steps = [
    {
      number: '1',
      title: 'Pilih Tantangan',
      desc: 'Jelajahi 25 lokasi di peta desa dan sekolah. Kamu bebas memilih titik tantangan di 4 zona belajar!',
      icon: <MapPin className="w-8 h-8 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-300',
      badge: 'Langkah 1',
    },
    {
      number: '2',
      title: 'Baca dan Dengarkan',
      desc: 'Pelajari soal bergambar yang jelas. Tekan tombol audio jika ingin mendengarkan narasi suara.',
      icon: <Headphones className="w-8 h-8 text-sky-600" />,
      bg: 'bg-sky-50 border-sky-300',
      badge: 'Langkah 2',
    },
    {
      number: '3',
      title: 'Jawab dan Belajar',
      desc: 'Pilih jawaban terbaikmu. Jika belum tepat, baca petunjuk hangat dan coba lagi tanpa takut!',
      icon: <Lightbulb className="w-8 h-8 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-300',
      badge: 'Langkah 3',
    },
    {
      number: '4',
      title: 'Kumpulkan Puzzle',
      desc: 'Kumpulkan 6 kepingan emas puzzle edukatif dan dapatkan 5 badge keren sepanjang petualanganmu!',
      icon: <Puzzle className="w-8 h-8 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-300',
      badge: 'Langkah 4',
    },
  ];

  const handleReadInstructions = () => {
    const text =
      'Cara Bermain GROW PUZZLE DIGITAL: Pertama, pilih tantangan pada peta. Kedua, baca dan dengarkan soal. Ketiga, jawab dan belajar dari umpan balik tanpa takut salah. Keempat, kumpulkan enam kepingan puzzle dan raih badge pencapaian. Ingat, kesalahan adalah bagian dari proses belajar!';
    setIsPlayingAudio(true);
    audioManager.speak(text, () => setIsPlayingAudio(false));
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-4 bg-gradient-to-b from-[#EBF9FF] to-[#FFF9E7]">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with back button & audio */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('cover');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#123D68] font-bold text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI</span>
          </button>

          <button
            onClick={handleReadInstructions}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white border-2 border-sky-300 text-sky-800 hover:bg-sky-50 shadow-sm'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Sedang Membacakan...' : 'Dengarkan Petunjuk 🔊'}</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#FFC928] text-[#123D68] font-extrabold text-xs uppercase px-3.5 py-1 rounded-full mb-2 tracking-wider">
            Panduan Petualang
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#123D68]">
            Cara Bermain & Menjelajah
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl mx-auto">
            Ikuti 4 langkah mudah ini untuk menguasai materi peta dan mengembangkan kemampuanmu!
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {steps.map((st) => (
            <div
              key={st.number}
              className={`p-5 rounded-3xl border-3 shadow-md transition-all hover:scale-[1.02] flex flex-col justify-between ${st.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold px-3 py-1 bg-white/90 rounded-full text-[#123D68] shadow-xs">
                    {st.badge}
                  </span>
                  <div className="p-2.5 bg-white rounded-2xl shadow-sm">{st.icon}</div>
                </div>
                <h3 className="text-xl font-bold font-fredoka text-[#123D68] mb-1.5">
                  {st.title}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Heart-warming reassurance message */}
        <div className="bg-white border-3 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-md mb-8 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold font-fredoka text-[#21A447] flex items-center gap-2">
                <span>Pesan Semangat untukmu:</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h4>
              <p className="text-sm sm:text-base text-[#123D68] font-semibold mt-1 leading-relaxed">
                “Tidak apa-apa jika jawabanmu belum tepat. Kamu boleh memeriksa petunjuk, belajar kembali, dan mencoba lagi! Setiap kesalahan adalah petunjuk berharga untuk bertumbuh.”
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('profile');
            }}
            className="w-full sm:w-auto min-w-[280px] bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-lg sm:text-xl py-3.5 px-8 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI PETUALANGAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
