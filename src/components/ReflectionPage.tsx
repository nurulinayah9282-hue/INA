import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { ArrowLeft, Save, Sparkles, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface ReflectionPageProps {
  studentRecord: StudentRecord;
  onSaveReflection: (answers: StudentRecord['progress']['reflectionAnswers']) => void;
  onNavigate: (page: NavigationPage) => void;
}

const PRESET_OPTIONS = {
  q1: [
    'Menentukan arah mata angin kebalikan',
    'Membaca letak dua langkah persimpangan',
    'Menghafal arti simbol dan warna legenda',
    'Membedakan Barat dan Timur',
  ],
  q2: [
    'Membaca kembali petunjuk yang diberikan',
    'Membuka bekal materi untuk mengecek peta',
    'Tarik napas dan mencoba lagi dengan tenang',
    'Berdiskusi dan bertanya kepada teman atau guru',
  ],
  q3: [
    'Kesalahan memberi tahu bagian yang perlu saya pelajari lagi',
    'Saya jadi lebih teliti membaca gambar peta',
    'Tidak perlu malu saat belum tepat karena bisa dicoba lagi',
    'Otak saya sedang berlatih dan berkembang',
  ],
  q4: [
    'Memeriksa penunjuk arah kompas di pojok peta',
    'Mencari simbol di kotak legenda',
    'Mendengarkan penjelasan audio',
    'Membayangkan diri sendiri sedang berdiri di lokasi peta',
  ],
  q5: [
    'Mencoba rute peta baru yang lebih menantang',
    'Membantu teman yang masih bingung membaca arah',
    'Lebih sabar dan teliti sebelum memilih jawaban',
    'Membaca legenda terlebih dahulu sebelum menjawab',
  ],
};

export const ReflectionPage: React.FC<ReflectionPageProps> = ({
  studentRecord,
  onSaveReflection,
  onNavigate,
}) => {
  const currentAnswers = studentRecord.progress.reflectionAnswers || {};

  const [q1, setQ1] = useState(currentAnswers.q1_difficultChallenge || '');
  const [q2, setQ2] = useState(currentAnswers.q2_whenIncorrect || '');
  const [q3, setQ3] = useState(currentAnswers.q3_learnFromMistake || '');
  const [q4, setQ4] = useState(currentAnswers.q4_helpfulStrategy || '');
  const [q5, setQ5] = useState(currentAnswers.q5_tryNextTime || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    audioManager.playCorrectSound();
    const answers = {
      q1_difficultChallenge: q1,
      q2_whenIncorrect: q2,
      q3_learnFromMistake: q3,
      q4_helpfulStrategy: q4,
      q5_tryNextTime: q5,
    };
    onSaveReflection(answers);
    setSavedSuccess(true);

    setTimeout(() => {
      onNavigate('grow_map_final');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-4 bg-gradient-to-b from-[#EBF9FF] via-[#FFF9E7] to-[#E9FCE9]">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
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

          <span className="text-xs font-bold bg-[#FFC928] text-[#123D68] px-3.5 py-1.5 rounded-full border border-amber-300">
            Refleksi Diri
          </span>
        </div>

        {/* Header Title */}
        <div className="bg-white rounded-3xl p-6 border-3 border-sky-200 shadow-xl mb-6 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-3xl border-3 border-amber-300 flex items-center justify-center text-3xl mx-auto mb-2 shadow-xs">
            💭
          </div>
          <h2 className="text-3xl font-extrabold font-fredoka text-[#123D68]">
            My Growth Reflection
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto font-medium">
            Renungkan pengalaman belajarmu hari ini. Pilih opsi cepat atau ketik sendiri pemikiranmu!
          </p>

          <div className="mt-4 bg-[#FFF9E7] border border-amber-300 rounded-2xl p-3 text-xs sm:text-sm text-[#123D68] font-bold">
            “Setiap langkah kecil adalah kemajuan. Kamu tidak harus langsung bisa semuanya. Terus belajar dan bertumbuh!”
          </div>
        </div>

        {/* 5 Reflection Prompts */}
        <div className="space-y-6 mb-8">
          {/* Pertanyaan 1 */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <label className="block text-sm sm:text-base font-bold font-fredoka text-[#123D68] mb-2">
              1. Tantangan apa yang paling sulit bagimu hari ini?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_OPTIONS.q1.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ1(opt)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    q1 === opt
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full bg-[#FFF9E7]/40 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Pertanyaan 2 */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <label className="block text-sm sm:text-base font-bold font-fredoka text-[#123D68] mb-2">
              2. Apa yang kamu lakukan ketika jawabanmu belum tepat?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_OPTIONS.q2.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ2(opt)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    q2 === opt
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full bg-[#FFF9E7]/40 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Pertanyaan 3 */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <label className="block text-sm sm:text-base font-bold font-fredoka text-[#123D68] mb-2">
              3. Apa yang kamu pelajari dari kesalahan?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_OPTIONS.q3.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ3(opt)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    q3 === opt
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full bg-[#FFF9E7]/40 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Pertanyaan 4 */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <label className="block text-sm sm:text-base font-bold font-fredoka text-[#123D68] mb-2">
              4. Strategi apa yang membantumu memahami peta?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_OPTIONS.q4.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ4(opt)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    q4 === opt
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full bg-[#FFF9E7]/40 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Pertanyaan 5 */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <label className="block text-sm sm:text-base font-bold font-fredoka text-[#123D68] mb-2">
              5. Apa yang ingin kamu coba lebih baik pada permainan berikutnya?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_OPTIONS.q5.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ5(opt)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    q5 === opt
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={q5}
              onChange={(e) => setQ5(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full bg-[#FFF9E7]/40 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto min-w-[280px] bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-fredoka font-bold text-lg py-3.5 px-8 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>TERSIMPAN!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>SIMPAN & LANJUT KE GROW MAP AKHIR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
