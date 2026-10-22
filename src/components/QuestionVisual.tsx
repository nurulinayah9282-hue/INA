import React from 'react';
import { ReferenceVillageMap } from './ReferenceVillageMap';
import {
  Compass,
  Sparkles,
  MapPin,
  CheckCircle2,
  Navigation,
  Smartphone,
  Layers,
  HeartHandshake,
  Lightbulb,
  Trophy,
  BookOpen,
} from 'lucide-react';

interface QuestionVisualProps {
  questionId: number;
  onOpenFullMap?: () => void;
}

export const QuestionVisual: React.FC<QuestionVisualProps> = ({
  questionId,
  onOpenFullMap,
}) => {
  switch (questionId) {
    // -------------------------------------------------------------
    // JENIS 1: SOAL PENGERTIAN PETA (Q1)
    // -------------------------------------------------------------
    case 1:
      return (
        <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span className="flex items-center gap-1">
              <span>🗺️</span> Gambaran Wilayah Sudut Pandang Atas
            </span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">Bidang Datar</span>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center my-2">
            {/* Real 3D World */}
            <div className="bg-white rounded-xl p-2.5 border-2 border-slate-200 shadow-xs flex flex-col items-center">
              <div className="text-3xl mb-1">🏔️ 🏘️ 🌳</div>
              <span className="text-xs font-black text-slate-700">Permukaan Bumi Nyata</span>
              <span className="text-[10px] text-slate-500 font-medium">Bentuk 3 dimensi yang sangat luas</span>
            </div>

            {/* Flattened 2D Map */}
            <div className="bg-[#FFF9E7] rounded-xl p-2.5 border-2 border-amber-300 shadow-xs flex flex-col items-center">
              <div className="text-3xl mb-1">📜 🧭 📍</div>
              <span className="text-xs font-black text-amber-900">Peta Bidang Datar</span>
              <span className="text-[10px] text-emerald-700 font-bold">Ukuran diperkecil agar mudah dibaca!</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold mt-1">
            Peta menggambarkan permukaan bumi pada kertas atau layar datar dengan skala ukuran diperkecil.
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 2: SOAL FUNGSI PETA (Q2)
    // -------------------------------------------------------------
    case 2:
      return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-100">
            <span className="flex items-center gap-1">
              <span>🧭</span> Merencanakan Rute Perjalanan
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Fungsi Peta</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-amber-200 flex items-center justify-between gap-2 my-2 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-xl border border-sky-300">
                🏠
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block">Titik Awal</span>
                <span className="text-xs font-extrabold text-[#123D68]">Rumah Dito</span>
              </div>
            </div>

            {/* Route indicator */}
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mb-1">
                Jalur Rute Aman ➔
              </span>
              <div className="w-full h-1.5 bg-emerald-400 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl border border-amber-300">
                🏫
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Tujuan</span>
                <span className="text-xs font-extrabold text-[#123D68]">SD Harapan</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold text-center mt-1">
            Peta membantu Dito mengetahui arah, jarak relatif, dan rute perjalanan tercepat menuju sekolah.
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 3: SOAL JUDUL PETA (Q3)
    // -------------------------------------------------------------
    case 3:
      return (
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>🏷️ Contoh Lembar Peta Sederhana</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Unsur Peta</span>
          </div>

          {/* Highlighted Title Box Banner */}
          <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-400 rounded-xl p-3 shadow-md my-2 animate-pop">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
              ⭐ BAGIAN INI YANG DISOROT:
            </span>
            <h4 className="text-sm sm:text-base font-black font-fredoka text-[#123D68]">
              “PETA LINGKUNGAN SDN HARAPAN BANGSA”
            </h4>
          </div>

          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2.5 my-2 text-slate-400 text-xs flex items-center justify-center gap-3">
            <span>[ Gambar Wilayah Desa, Sekolah, Jalan & Sungai ]</span>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold">
            Bagian paling atas memberi tahu pembaca wilayah atau isi apa yang digambarkan pada lembaran peta.
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 4: SOAL SIMBOL PETA (Q4)
    // -------------------------------------------------------------
    case 4:
      return (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-sky-50 rounded-2xl border-2 border-emerald-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-emerald-100">
            <span>🌳 Mengapa Menggunakan Simbol?</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Simbol Peta</span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
              <span className="text-2xl mb-1">🏫</span>
              <span className="text-xs font-bold text-[#123D68]">Gedung Sekolah</span>
              <span className="text-[9px] text-slate-500">Objek Asli Besar</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
              <span className="text-2xl mb-1">🌳</span>
              <span className="text-xs font-bold text-[#123D68]">Taman Luas</span>
              <span className="text-[9px] text-slate-500">Ratusan Pohon</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
              <span className="text-2xl mb-1">🏥</span>
              <span className="text-xs font-bold text-[#123D68]">Puskesmas</span>
              <span className="text-[9px] text-slate-500">Tanda Palang Merah</span>
            </div>
          </div>

          <div className="bg-emerald-100/70 text-emerald-950 rounded-xl p-2 text-[11px] font-bold mt-1">
            Simbol adalah tanda atau gambar sederhana untuk mewakili objek nyata agar muat di lembaran kertas!
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 5: SOAL LEGENDA PETA (Q5)
    // -------------------------------------------------------------
    case 5:
      return (
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-100">
            <span>📋 Kotak Keterangan Simbol</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Unsur Legenda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 items-center">
            {/* Mystery symbol */}
            <div className="bg-slate-50 rounded-xl p-3 border-2 border-dashed border-slate-300 text-center">
              <span className="text-3xl block mb-1">📖</span>
              <span className="text-xs font-bold text-slate-700">Tanda di peta: Buku Terbuka</span>
              <span className="text-[10px] text-amber-700 font-extrabold block mt-0.5">
                Apa artinya tanda ini? 🤔
              </span>
            </div>

            {/* Highlighted Legend Box */}
            <div className="bg-amber-50 rounded-xl p-2.5 border-2 border-amber-400 shadow-xs">
              <div className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md inline-block mb-1">
                KOTAK LEGENDA (Keterangan)
              </div>
              <div className="text-xs font-bold text-[#123D68] space-y-1">
                <div>📖 = Gedung Perpustakaan</div>
                <div>🏥 = Tempat Pengobatan</div>
                <div>🌳 = Kawasan Taman Hijau</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold text-center mt-1">
            Jika tidak tahu arti simbol, periksa selalu <span className="text-amber-800 font-extrabold">Legenda</span>!
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 6: SOAL ARAH MATA ANGIN DASAR (Q6 & Q7)
    // -------------------------------------------------------------
    case 6:
      return (
        <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50 rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>🧭 Orientasi Arah Standar pada Peta</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Arah Mata Angin</span>
          </div>

          {/* Map Sheet with Glowing Top Edge */}
          <div className="relative bg-white rounded-xl border-2 border-slate-300 p-4 shadow-inner max-w-xs mx-auto my-2">
            {/* Glowing top border indicator */}
            <div className="absolute top-0 left-0 right-0 bg-rose-500 text-white font-black text-xs py-1 rounded-t-lg shadow-md animate-pulse">
              SISI ATAS = UTARA (U) ⬆️
            </div>

            <div className="flex items-center justify-between pt-4 pb-2 px-2 text-xs font-black text-[#123D68]">
              <span>⬅️ Kiri = Barat (B)</span>
              <span>Kanan = Timur (T) ➡️</span>
            </div>

            <div className="bg-sky-500 text-white font-black text-xs py-1 rounded-b-lg mt-1">
              SISI BAWAH = SELATAN (S) ⬇️
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold">
            Pada sebagian besar peta sederhana, sisi ATAS selalu menunjukkan arah UTARA.
          </p>
        </div>
      );

    case 7:
      return (
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-100">
            <span>🧭 Menentukan Arah dengan Tubuh Kita</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Praktik Arah</span>
          </div>

          {/* Diagram of child with outstretched arms */}
          <div className="bg-[#FFF9E7] rounded-xl p-3 border-2 border-amber-200 my-2 max-w-sm mx-auto">
            <div className="text-xs font-extrabold text-rose-600 mb-1">
              ⬆️ Menghadap Depan: UTARA (U)
            </div>

            <div className="flex items-center justify-between text-xs font-extrabold text-[#123D68] my-2">
              <span className="bg-sky-100 px-2 py-1 rounded-lg border border-sky-300">
                ⬅️ Tangan Kiri: BARAT
              </span>
              <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xs">
                🧍
              </div>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded-lg border border-emerald-400 font-black animate-bounce">
                Tangan Kanan: TIMUR ➡️
              </span>
            </div>

            <div className="text-xs font-extrabold text-sky-700 mt-1">
              ⬇️ Belakang Punggung: SELATAN (S)
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold">
            Jika menghadap Utara, tangan kananmu selalu menunjuk ke arah <span className="font-extrabold text-emerald-800">TIMUR</span> (matahari terbit).
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 7: SOAL POSISI RELATIF PETA (Q9, Q10, Q11, Q12)
    // Menggunakan Peta Referensi Konsisten dengan Vector Arrow!
    // -------------------------------------------------------------
    case 9:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['sekolah', 'pasar']}
            vectorArrow={{
              from: 'sekolah',
              to: 'pasar',
              label: 'Arah ke UTARA (Atas) ⬆️',
            }}
            compact={true}
            title="Letak Pasar terhadap Sekolah"
          />
        </div>
      );

    case 10:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['pasar', 'sekolah']}
            vectorArrow={{
              from: 'pasar',
              to: 'sekolah',
              label: 'Kebalikan: ke SELATAN (Bawah) ⬇️',
            }}
            compact={true}
            title="Kebalikan: Letak Sekolah dari Pasar"
          />
        </div>
      );

    case 11:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['sekolah', 'taman']}
            vectorArrow={{
              from: 'sekolah',
              to: 'taman',
              label: 'Arah ke BARAT (Kiri) ⬅️',
            }}
            compact={true}
            title="Letak Taman Bermain dari Sekolah"
          />
        </div>
      );

    case 12:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['sekolah', 'perumahan']}
            vectorArrow={{
              from: 'sekolah',
              to: 'perumahan',
              label: 'Arah ke TIMUR (Kanan) ➡️',
            }}
            compact={true}
            title="Letak Perumahan Warga dari Sekolah"
          />
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 8: MEMBACA RUTE BERKELANJUTAN (Q15, Q22)
    // -------------------------------------------------------------
    case 15:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['sekolah', 'perumahan', 'puskesmas']}
            vectorArrow={{
              from: 'perumahan',
              to: 'puskesmas',
              label: 'Langkah 2: Menuju Puskesmas 🏥',
            }}
            compact={true}
            title="Rute Dua Langkah: Sekolah ➔ Timur (Rumah) ➔ Utara (?)"
          />
        </div>
      );

    case 22:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['kantor_pos', 'sekolah']}
            vectorArrow={{
              from: 'kantor_pos',
              to: 'sekolah',
              label: 'Arah: TENGGARA ↘️',
            }}
            compact={true}
            title="Rute Kantor Pos (Barat Laut) menuju Sekolah (Pusat)"
          />
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 9: SIMBOL ALAM, FASILITAS, SKALA, DIGITAL (Q8, Q14, Q16, Q18, Q19, Q21, Q23)
    // -------------------------------------------------------------
    case 8:
      return (
        <div className="bg-white rounded-2xl border-2 border-rose-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-rose-100">
            <span>🏥 Simbol Fasilitas Pelayanan Kesehatan</span>
            <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full font-bold">Simbol Umum</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-3 border-rose-400 flex items-center justify-center text-4xl shadow-md">
              🏥
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-rose-700 uppercase">Tanda Palang Merah</span>
              <p className="text-sm font-extrabold text-[#123D68]">Puskesmas / Rumah Sakit Desa</p>
              <span className="text-[10px] text-slate-500 font-medium">Tempat berobat warga yang sakit</span>
            </div>
          </div>
        </div>
      );

    case 14:
      return (
        <div>
          <ReferenceVillageMap
            highlighted={['sekolah', 'masjid']}
            vectorArrow={{
              from: 'sekolah',
              to: 'masjid',
              label: 'Masjid di SELATAN Sekolah ⬇️',
            }}
            compact={true}
            title="Simbol Tempat Ibadah di Selatan Sekolah"
          />
        </div>
      );

    case 16:
      return (
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>📏 Memahami Skala Peta</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Skala Angka</span>
          </div>

          <div className="bg-[#FFF9E7] border-2 border-amber-300 rounded-xl p-3 my-2 max-w-sm mx-auto shadow-xs">
            <div className="text-base font-black font-fredoka text-[#123D68] mb-1">
              “SKALA 1 : 1.000”
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2 border-t border-amber-200">
              <span>1 cm di peta 🗺️</span>
              <span className="text-amber-800 font-extrabold">mewakili ➔</span>
              <span>1.000 cm (10 meter) jarak asli 🌍</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold mt-1">
            Skala adalah perbandingan ukuran jarak pada kertas peta dengan jarak sebenarnya di alam.
          </p>
        </div>
      );

    case 18:
      return (
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>🌊 Simbol Perairan Alami pada Peta</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Warna Peta</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-3">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 border-3 border-sky-400 flex items-center justify-center text-3xl shadow-md">
              🌉 🌊
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-sky-800 uppercase">Garis Biru Meliuk</span>
              <p className="text-sm font-extrabold text-[#123D68]">Aliran Sungai & Jembatan Kayu</p>
              <span className="text-[10px] text-slate-500 font-medium">Secara konvensional, warna biru = perairan</span>
            </div>
          </div>
        </div>
      );

    case 19:
      return (
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-100">
            <span>🧭 Kasus Khusus: Orientasi Kompas Berbeda</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Ketelitian Peta</span>
          </div>

          <div className="bg-sky-50 rounded-xl p-3 border-2 border-sky-300 my-2 max-w-sm mx-auto flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center text-xl font-black text-rose-600 shadow-sm">
              ➔ U
            </div>
            <div className="text-left text-xs font-bold text-[#123D68]">
              <span className="text-rose-600 font-black block">Panah U menunjuk ke kanan!</span>
              <span>Kita harus selalu mengikuti tanda kompas pada peta tersebut.</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold">
            Penunjuk arah kompas yang tercantum adalah pedoman orientasi yang wajib ditaati pembaca.
          </p>
        </div>
      );

    case 21:
      return (
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>📱 Peta Digital & Teknologi Satelit GPS</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Kehidupan Nyata</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 my-2 max-w-sm mx-auto flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-sky-400 flex items-center justify-center text-3xl shadow-sm">
              📱
            </div>
            <div className="text-left text-xs font-bold text-[#123D68]">
              <span className="text-emerald-700 font-black block">📍 Posisi Bergerak Nyata</span>
              <span>Bisa memandu suara navigasi saat kita bepergian dengan kendaraan.</span>
            </div>
          </div>
        </div>
      );

    case 23:
      return (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-emerald-100">
            <span>⛰️ Simbol Warna Ketinggian Bentang Alam</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Warna Peta</span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2 text-xs font-bold">
            <div className="bg-emerald-100 text-emerald-950 p-2 rounded-xl border border-emerald-300">
              <span className="block text-base">🟢</span>
              <span>Hijau</span>
              <span className="text-[10px] text-slate-600 block">Dataran Rendah</span>
            </div>
            <div className="bg-amber-100 text-amber-950 p-2 rounded-xl border border-amber-300">
              <span className="block text-base">🟡</span>
              <span>Kuning/Jingga</span>
              <span className="text-[10px] text-slate-600 block">Perbukitan</span>
            </div>
            <div className="bg-[#EFE5D9] text-[#5C3D1E] p-2 rounded-xl border-2 border-[#8C5E2E] shadow-xs">
              <span className="block text-base">🟫</span>
              <span className="font-black">Cokelat</span>
              <span className="text-[10px] text-[#8C5E2E] font-bold block">Pegunungan Tinggi</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold mt-1">
            Warna cokelat digunakan untuk melambangkan daerah pegunungan yang tinggi di permukaan bumi.
          </p>
        </div>
      );

    // -------------------------------------------------------------
    // JENIS 10: SOAL GROWTH MINDSET & SAHABAT (Q13, Q17, Q20, Q24, Q25)
    // -------------------------------------------------------------
    case 13:
      return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-100">
            <span>💡 Semangat Bertumbuh Menghadapi Kesulitan</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Growth Mindset</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm">
              👦
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-amber-800">Ahmad Berlatih Catatan Arah</span>
              <p className="text-xs text-slate-700 font-bold">
                “Kemampuan kita dapat berkembang melalui latihan dan strategi baru!”
              </p>
            </div>
          </div>
        </div>
      );

    case 17:
      return (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl border-2 border-emerald-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-emerald-100">
            <span>🌱 Belajar dari Umpan Balik</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Growth Mindset</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-emerald-200 my-2 shadow-xs">
            <div className="text-2xl mb-1">🧩 ➔ 💡 ➔ 🌟</div>
            <p className="text-xs font-extrabold text-[#123D68]">
              “Kesalahan adalah bagian berharga dari proses belajar.”
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              Periksa kembali petunjuk dan coba lagi tanpa rasa takut.
            </span>
          </div>
        </div>
      );

    case 20:
      return (
        <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-2xl border-2 border-sky-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-sky-100">
            <span>🤝 Sahabat yang Saling Mendukung</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Zona Sahabat</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="text-3xl">👧 🤝 👦</div>
            <div className="text-left">
              <span className="text-xs font-black text-sky-800">Belajar Bersama Membaca Legenda</span>
              <p className="text-xs text-slate-700 font-bold">
                Membimbing teman membuat kita berdua semakin paham dan bertumbuh!
              </p>
            </div>
          </div>
        </div>
      );

    case 24:
      return (
        <div className="bg-white rounded-2xl border-2 border-purple-300 p-3 sm:p-4 shadow-sm text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-purple-100">
            <span>🌟 Menghargai Keberagaman Cara Belajar</span>
            <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-bold">Keunikan Diri</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-xs font-bold">
            <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200">
              <span className="text-2xl block mb-1">👀 🗺️</span>
              <span>Gaya Belajar Visual</span>
              <span className="text-[10px] text-slate-500 block">Suka mengamati peta</span>
            </div>

            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-2xl block mb-1">🎧 🗣️</span>
              <span>Gaya Belajar Audio</span>
              <span className="text-[10px] text-slate-500 block">Suka mendengarkan suara</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-semibold">
            Semua cara belajar berharga dan saling melengkapi di kelas petualang kita!
          </p>
        </div>
      );

    case 25:
      return (
        <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-100 rounded-2xl border-3 border-amber-400 p-4 shadow-md text-center">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#123D68] mb-2 pb-1.5 border-b border-amber-200">
            <span>🏆 Puncak Petualangan Mengenal Peta</span>
            <span className="bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full font-black">Tantangan #25</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-4xl mx-auto shadow-md my-2 animate-bounce">
            🏆
          </div>

          <h4 className="text-base font-black font-fredoka text-[#123D68]">
            Juara Penjelajah Peta Sejati
          </h4>
          <p className="text-xs text-emerald-900 font-bold mt-1">
            “Berani mencoba, teliti membaca simbol & arah, serta pantang menyerah saat menemui kesulitan!”
          </p>
        </div>
      );

    default:
      return (
        <div>
          <ReferenceVillageMap compact={true} />
        </div>
      );
  }
};
