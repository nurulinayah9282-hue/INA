import React, { useState, useEffect } from 'react';
import { NavigationPage, MaterialInfographic } from '../types';
import { MATERIAL_LESSONS, MAP_INFOGRAPHICS_GALLERY, GalleryInfographicItem } from '../data/materials';
import { ReferenceVillageMap } from './ReferenceVillageMap';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Play,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Image as ImageIcon,
  BookOpen,
  Layers,
  Download,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface MaterialPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const MaterialPage: React.FC<MaterialPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'gallery'>('modules');
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedQuickAnswer, setSelectedQuickAnswer] = useState<number | null>(null);
  const [activeLegendSymbol, setActiveLegendSymbol] = useState<string | null>(null);
  const [compassAngle, setCompassAngle] = useState<number>(0);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  const lesson = MATERIAL_LESSONS[currentLessonIndex];

  // Stop audio speech on cleanup
  useEffect(() => {
    return () => {
      audioManager.stopSpeech();
    };
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleReadLesson = () => {
    if (isPlayingAudio) {
      audioManager.stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const sectionsText = lesson.sections.map((s) => `${s.heading}. ${s.content}`).join(' ');
    const fullText = `${lesson.badge}: ${lesson.title}. ${lesson.summary}. ${sectionsText}`;

    setIsPlayingAudio(true);
    audioManager.speak(fullText, () => setIsPlayingAudio(false));
  };

  const handleNextLesson = () => {
    audioManager.stopSpeech();
    setIsPlayingAudio(false);
    setSelectedQuickAnswer(null);
    if (currentLessonIndex < MATERIAL_LESSONS.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    audioManager.stopSpeech();
    setIsPlayingAudio(false);
    setSelectedQuickAnswer(null);
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Open Lightbox by gallery item or lesson infographic
  const openLightboxBySrc = (src: string) => {
    const foundIndex = MAP_INFOGRAPHICS_GALLERY.findIndex((g) => g.src === src);
    if (foundIndex !== -1) {
      setLightboxIndex(foundIndex);
    } else {
      setLightboxIndex(0);
    }
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  const openLightboxByIndex = (index: number) => {
    setLightboxIndex(index);
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % MAP_INFOGRAPHICS_GALLERY.length));
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! - 1 + MAP_INFOGRAPHICS_GALLERY.length) % MAP_INFOGRAPHICS_GALLERY.length));
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  const zoomIn = () => {
    setLightboxZoom((z) => Math.min(z + 0.3, 2.5));
    audioManager.playClickSound();
  };

  const zoomOut = () => {
    setLightboxZoom((z) => Math.max(z - 0.3, 0.7));
    audioManager.playClickSound();
  };

  const resetZoom = () => {
    setLightboxZoom(1);
    audioManager.playClickSound();
  };

  // Interactive symbols for Lesson 4
  const SYMBOL_LIST = [
    { icon: '🏫', name: 'Sekolah', desc: 'Tempat belajar siswa dan bapak/ibu guru' },
    { icon: '🏠', name: 'Rumah Warga', desc: 'Tempat tinggal dan pemukiman warga desa' },
    { icon: '🌳', name: 'Taman Bermain', desc: 'Tempat rekreasi hijau dan area olahraga santai' },
    { icon: '🛒', name: 'Pasar Tradisional', desc: 'Pusat jual beli kebutuhan sehari-hari warga' },
    { icon: '🏥', name: 'Puskesmas', desc: 'Fasilitas kesehatan dan tempat berobat masyarakat' },
    { icon: '🕌', name: 'Masjid', desc: 'Tempat ibadah umat Islam di lingkungan desa' },
    { icon: '🌊', name: 'Sungai', desc: 'Aliran perairan alami yang mengalir melintasi desa' },
    { icon: '🌉', name: 'Jembatan Kayu', desc: 'Penghubung jalan di atas aliran sungai' },
  ];

  const currentLightboxItem: GalleryInfographicItem | undefined =
    lightboxIndex !== null ? MAP_INFOGRAPHICS_GALLERY[lightboxIndex] : undefined;

  return (
    <div className="min-h-[calc(100vh-68px)] py-5 sm:py-7 px-3 sm:px-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            onClick={() => {
              audioManager.stopSpeech();
              audioManager.playClickSound();
              onNavigate('board');
            }}
            className="flex items-center gap-2 bg-white/95 hover:bg-white text-[#123D68] font-bold text-xs sm:text-sm px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>KEMBALI KE PETA</span>
          </button>

          {/* Mode Switcher: Modules vs Full Infographic Gallery */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border-2 border-amber-200 shadow-xs">
            <button
              onClick={() => {
                audioManager.playClickSound();
                setActiveTab('modules');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-[#21A447] text-white shadow-xs'
                  : 'text-[#123D68] hover:bg-amber-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Modul Belajar (1-8)</span>
            </button>
            <button
              onClick={() => {
                audioManager.playClickSound();
                setActiveTab('gallery');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#FF9F1C] text-white shadow-xs'
                  : 'text-[#123D68] hover:bg-amber-50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galeri 6 Poster 🖼️</span>
            </button>
          </div>

          {activeTab === 'modules' && (
            <button
              onClick={handleReadLesson}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white/95 border-2 border-sky-300 text-sky-800 hover:bg-sky-50 shadow-sm'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Hentikan Audio ⏹️' : 'Dengarkan Penjelasan 🔊'}</span>
            </button>
          )}
        </div>

        {/* Lesson Header Banner with Glassmorphism */}
        <div className="text-center mb-5">
          <div className="bg-white/85 backdrop-blur-md rounded-3xl py-3.5 px-6 border border-white/70 shadow-sm inline-block max-w-xl mx-auto">
            <div className="inline-block bg-[#55C7F2] text-white font-extrabold text-[11px] sm:text-xs uppercase px-3.5 py-1 rounded-full mb-1 tracking-wider shadow-xs">
              Bekal Petualang: Mengenal Peta
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68]">
              IPAS Kelas IV SD — Fase B
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Dilengkapi gambar infografis edukatif penuh warna untuk memudahkan anak memahami peta!
            </p>
          </div>
        </div>

        {/* VIEW 1: MODULES WITH EMBEDDED PROPORTIONAL INFOGRAPHICS */}
        {activeTab === 'modules' ? (
          <>
            {/* 8 Lesson Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-thin">
              {MATERIAL_LESSONS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => {
                    audioManager.stopSpeech();
                    audioManager.playClickSound();
                    setIsPlayingAudio(false);
                    setSelectedQuickAnswer(null);
                    setCurrentLessonIndex(idx);
                  }}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    currentLessonIndex === idx
                      ? 'bg-[#21A447] text-white shadow-md scale-102 border-2 border-emerald-700'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.badge}
                </button>
              ))}
            </div>

            {/* Main Lesson Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border-3 border-sky-200 shadow-xl mb-6 relative overflow-hidden">
              {/* Badge & Title */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b pb-3">
                <div>
                  <span className="text-xs font-black text-[#FF9F1C] bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {lesson.badge} • Modul Belajar
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68] mt-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">{lesson.subheading}</p>
                </div>

                {lesson.infographic && (
                  <button
                    onClick={() => openLightboxBySrc(lesson.infographic!.src)}
                    className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-2xl shadow-xs transition-transform hover:scale-105 cursor-pointer"
                    title="Klik untuk membuka gambar poster dalam ukuran penuh"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Perbesar Poster 🔍</span>
                  </button>
                )}
              </div>

              {/* Key Summary Box */}
              <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-2xl p-4 mb-5">
                <p className="text-sm sm:text-base font-bold text-[#123D68] leading-relaxed">
                  ⭐ {lesson.summary}
                </p>
              </div>

              {/* EMBEDDED PROPORTIONAL EDUCATIONAL INFOGRAPHIC POSTER */}
              {lesson.infographic && (
                <div className="my-6 bg-gradient-to-tr from-sky-50 via-amber-50/50 to-emerald-50 rounded-3xl p-3.5 sm:p-5 border-3 border-sky-200 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FF9F1C] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Poster Edukasi
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#123D68]">
                        {lesson.infographic.title}
                      </h4>
                    </div>

                    <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                      🔍 Klik gambar untuk memperbesar
                    </span>
                  </div>

                  {/* Proportional Image Container (Maintains 1491x1055 Landscape Ratio) */}
                  <div
                    onClick={() => openLightboxBySrc(lesson.infographic!.src)}
                    className="relative w-full aspect-[1491/1055] max-h-[500px] bg-white rounded-2xl overflow-hidden border-2 border-sky-300 shadow-sm cursor-zoom-in group select-none transition-all hover:border-amber-400 hover:shadow-md flex items-center justify-center"
                  >
                    <img
                      src={lesson.infographic.src}
                      alt={lesson.infographic.alt}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                      loading="eager"
                    />

                    {/* Hover Overlay Prompt */}
                    <div className="absolute inset-0 bg-sky-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-white text-[#123D68] font-extrabold text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                        <ZoomIn className="w-4 h-4 text-emerald-600" />
                        <span>Klik untuk Memperbesar Poster (Layar Penuh)</span>
                      </span>
                    </div>

                    {/* Corner Zoom Pill */}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/75 hover:bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                      <span>Perbesar Detail</span>
                    </div>
                  </div>

                  {/* Caption & Key Highlights Box */}
                  <div className="mt-3 bg-white/90 rounded-2xl p-3 sm:p-3.5 border border-sky-100 text-[#123D68]">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      💡 <strong className="text-[#123D68]">Penjelasan Gambar:</strong>{' '}
                      {lesson.infographic.caption}
                    </p>

                    {lesson.infographic.highlights && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">
                          Fokus Pelajaran:
                        </span>
                        {lesson.infographic.highlights.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-[11px] font-extrabold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sections Content */}
              <div className="space-y-6 mb-8 text-[#123D68]">
                {lesson.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-base sm:text-lg font-bold font-fredoka text-[#21A447] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#21A447]" />
                      <span>{sec.heading}</span>
                    </h4>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      {sec.content}
                    </p>

                    {sec.keyPoints && (
                      <ul className="bg-sky-50/60 rounded-2xl p-4 space-y-1.5 border border-sky-100 mt-2">
                        {sec.keyPoints.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="text-xs sm:text-sm text-slate-800 font-semibold flex items-start gap-2"
                          >
                            <span className="text-emerald-600 mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Interactive Feature for Lesson 4 (Legenda & Simbol) */}
              {lesson.id === 4 && (
                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-3 border-amber-300 rounded-3xl p-5 mb-8">
                  <h4 className="text-base sm:text-lg font-bold font-fredoka text-[#123D68] mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Aktivitas Interaktif: Tekan Simbol untuk Melihat Artinya!</span>
                  </h4>
                  <p className="text-xs text-slate-600 mb-4">
                    Klik ikon simbol di bawah ini untuk mendengarkan penjelasan singkatnya.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SYMBOL_LIST.map((sym) => (
                      <button
                        key={sym.name}
                        onClick={() => {
                          audioManager.playClickSound();
                          setActiveLegendSymbol(sym.name);
                          audioManager.speak(`Simbol ${sym.name}: ${sym.desc}`);
                        }}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          activeLegendSymbol === sym.name
                            ? 'bg-emerald-100 border-emerald-500 shadow-md scale-105'
                            : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-3xl block mb-1">{sym.icon}</span>
                        <span className="text-xs font-extrabold text-[#123D68] block">
                          {sym.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {activeLegendSymbol && (
                    <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-800 text-center animate-pop">
                      {SYMBOL_LIST.find((s) => s.name === activeLegendSymbol)?.icon}{' '}
                      {activeLegendSymbol}:{' '}
                      {SYMBOL_LIST.find((s) => s.name === activeLegendSymbol)?.desc}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Feature for Lesson 5 (Arah Mata Angin Kompas) */}
              {lesson.id === 5 && (
                <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-6 mb-8 text-center">
                  <h4 className="text-lg font-bold font-fredoka text-[#123D68] mb-2">
                    🧭 Kompas Navigasi Interaktif
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-md mx-auto">
                    Tekan tombol putar kompas untuk melatih orientasimu membaca arah peta!
                  </p>

                  <div className="flex justify-center my-4">
                    <div
                      className="w-40 h-40 rounded-full bg-white border-4 border-sky-400 shadow-xl relative flex items-center justify-center transition-transform duration-500"
                      style={{ transform: `rotate(${compassAngle}deg)` }}
                    >
                      <div className="absolute top-2 text-xs font-black text-rose-600">
                        U (Utara)
                      </div>
                      <div className="absolute right-2 text-xs font-black text-[#123D68]">
                        T (Timur)
                      </div>
                      <div className="absolute bottom-2 text-xs font-black text-[#123D68]">
                        S (Selatan)
                      </div>
                      <div className="absolute left-2 text-xs font-black text-[#123D68]">
                        B (Barat)
                      </div>

                      {/* Compass needle */}
                      <div className="w-2 h-28 relative flex flex-col items-center">
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[50px] border-b-rose-600" />
                        <div className="w-3 h-3 rounded-full bg-slate-800 my-0.5 z-10" />
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[50px] border-t-slate-700" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        audioManager.playClickSound();
                        setCompassAngle((prev) => prev + 90);
                      }}
                      className="bg-white border-2 border-sky-300 text-sky-800 font-bold text-xs px-4 py-2 rounded-xl shadow-xs hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Putar 90° (+Arah)</span>
                    </button>
                    <button
                      onClick={() => {
                        audioManager.playClickSound();
                        setCompassAngle(0);
                      }}
                      className="bg-white border-2 border-slate-300 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                    >
                      Reset ke Utara
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Feature for Lesson 6 (Peta Desa Referensi) */}
              {lesson.id === 6 && (
                <div className="mb-8">
                  <ReferenceVillageMap
                    compact={false}
                    title="Peta Referensi: Membaca Letak Tempat Lingkungan Desa"
                    highlighted={['sekolah', 'pasar', 'taman', 'perumahan', 'masjid', 'puskesmas']}
                  />
                </div>
              )}

              {/* Quick Check Question */}
              {lesson.quickCheck && (
                <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-3xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="text-sm sm:text-base font-bold font-fredoka text-[#123D68]">
                      Pertanyaan Cepat Pemahaman:
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[#123D68] mb-3">
                    {lesson.quickCheck.question}
                  </p>

                  <div className="space-y-2">
                    {lesson.quickCheck.options.map((opt, oIdx) => {
                      const isSelected = selectedQuickAnswer === oIdx;
                      const isCorrect = oIdx === lesson.quickCheck!.correctIndex;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            audioManager.playClickSound();
                            setSelectedQuickAnswer(oIdx);
                            if (isCorrect) {
                              audioManager.playCorrectSound();
                            } else {
                              audioManager.playEncouragingSound();
                            }
                          }}
                          className={`w-full text-left p-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm'
                                : 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 hover:border-amber-300 text-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedQuickAnswer !== null && (
                    <div
                      className={`mt-3 p-3 rounded-2xl text-xs sm:text-sm font-bold animate-pop ${
                        selectedQuickAnswer === lesson.quickCheck.correctIndex
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {selectedQuickAnswer === lesson.quickCheck.correctIndex
                        ? `🎉 ${lesson.quickCheck.explanation}`
                        : 'Ayo coba lagi! Baca kembali ringkasan materi di atas ya.'}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Prev / Next lesson buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                    currentLessonIndex === 0
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Materi Sebelumnya</span>
                </button>

                <span className="text-xs font-bold text-slate-400">
                  {currentLessonIndex + 1} dari {MATERIAL_LESSONS.length} Modul
                </span>

                {currentLessonIndex < MATERIAL_LESSONS.length - 1 ? (
                  <button
                    onClick={handleNextLesson}
                    className="flex items-center gap-1.5 bg-[#21A447] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm border-b-3 border-emerald-800 transition-all cursor-pointer"
                  >
                    <span>Materi Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audioManager.stopSpeech();
                      audioManager.playClickSound();
                      onNavigate('board');
                    }}
                    className="flex items-center gap-1.5 bg-[#FF9F1C] hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm border-b-3 border-amber-800 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Mulai Bermain di Peta</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* VIEW 2: FULL 6 POSTER EDUCATIONAL GALLERY */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-300 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🖼️</span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-fredoka text-[#123D68]">
                  Galeri 6 Lembar Poster Edukasi Peta
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Koleksi lengkap 6 poster infografis IPAS Fase B Kelas IV. Klik poster mana saja untuk membuka tampilan layar penuh, memperbesar tulisan (*zoom in*), dan membaca detail komponen peta!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MAP_INFOGRAPHICS_GALLERY.map((poster, pIdx) => (
                <div
                  key={poster.id}
                  onClick={() => openLightboxByIndex(pIdx)}
                  className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-sky-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badge & Title */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="bg-[#21A447] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs">
                        {poster.badge}
                      </span>
                      <span className="text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        Poster #{poster.number}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-fredoka text-[#123D68] group-hover:text-emerald-700 transition-colors">
                      {poster.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold mb-3">
                      {poster.subtitle}
                    </p>

                    {/* Proportional Thumbnail */}
                    <div className="relative w-full aspect-[1491/1055] bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-amber-300 shadow-inner mb-3">
                      <img
                        src={poster.src}
                        alt={poster.alt}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-sky-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/95 text-[#123D68] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5">
                          <ZoomIn className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Perbesar Poster</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {poster.description}
                    </p>
                  </div>

                  {/* Tags & Action Button */}
                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {poster.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightboxByIndex(pIdx);
                      }}
                      className="w-full bg-[#123D68] group-hover:bg-[#21A447] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Buka Poster Ukuran Penuh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN INTERACTIVE LIGHTBOX MODAL */}
      {lightboxIndex !== null && currentLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 select-none animate-fade-in"
        >
          {/* Top Lightbox Bar */}
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-2 text-white bg-slate-900/80 px-3 sm:px-5 py-2.5 rounded-2xl border border-slate-700 shadow-lg">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-[#21A447] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shrink-0">
                {currentLightboxItem.badge}
              </span>
              <h3 className="text-xs sm:text-base font-extrabold font-fredoka truncate text-amber-300">
                {currentLightboxItem.title}
              </h3>
              <span className="text-[11px] text-slate-400 hidden md:inline shrink-0">
                ({lightboxIndex + 1} dari {MAP_INFOGRAPHICS_GALLERY.length})
              </span>
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={zoomOut}
                disabled={lightboxZoom <= 0.7}
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-colors cursor-pointer disabled:opacity-40"
                title="Perkecil (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={resetZoom}
                className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-slate-600 transition-colors cursor-pointer"
                title="Reset Ukuran (100%)"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>

              <button
                onClick={zoomIn}
                disabled={lightboxZoom >= 2.5}
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-colors cursor-pointer disabled:opacity-40"
                title="Perbesar (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-6 bg-slate-700 mx-1 hidden sm:block" />

              <a
                href={currentLightboxItem.src}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-bold"
                title="Buka File Gambar Asli"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden md:inline">Buka Tab Asli</span>
              </a>

              <button
                onClick={closeLightbox}
                className="p-1.5 sm:p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors cursor-pointer ml-1"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Container with Zoom & Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center overflow-auto my-2 p-1 sm:p-4">
            {/* Prev Poster Button */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-[#21A447] text-white border-2 border-slate-600 hover:border-emerald-400 shadow-xl transition-all cursor-pointer hover:scale-110"
              title="Poster Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Lightbox Proportional Image */}
            <div
              className="relative max-w-5xl w-full flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'center center' }}
            >
              <img
                src={currentLightboxItem.src}
                alt={currentLightboxItem.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-slate-700 bg-white"
              />
            </div>

            {/* Next Poster Button */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-[#21A447] text-white border-2 border-slate-600 hover:border-emerald-400 shadow-xl transition-all cursor-pointer hover:scale-110"
              title="Poster Berikutnya (Panah Kanan)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Lightbox Caption Bar */}
          <div className="max-w-6xl w-full mx-auto bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs sm:text-sm text-slate-200 leading-snug">
                <span className="font-extrabold text-amber-300">💡 Inti Pelajaran: </span>
                {currentLightboxItem.description}
              </div>

              {/* Poster dots indicator */}
              <div className="flex items-center gap-1.5 shrink-0 self-center sm:self-auto">
                {MAP_INFOGRAPHICS_GALLERY.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => {
                      setLightboxIndex(dotIdx);
                      setLightboxZoom(1);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      lightboxIndex === dotIdx
                        ? 'w-6 bg-emerald-400'
                        : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    title={`Pindah ke Poster ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
