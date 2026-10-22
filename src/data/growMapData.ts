import { GrowMapStatement } from '../types';

export const GROW_MAP_STATEMENTS: GrowMapStatement[] = [
  // A. Berani Mencoba
  {
    id: 1,
    aspect: 'A',
    aspectTitle: 'Berani Mencoba',
    text: 'Saya berani mencoba soal yang terlihat sulit.',
  },
  {
    id: 2,
    aspect: 'A',
    aspectTitle: 'Berani Mencoba',
    text: 'Saya mau mencoba meskipun belum yakin dengan jawaban saya.',
  },
  {
    id: 3,
    aspect: 'A',
    aspectTitle: 'Berani Mencoba',
    text: 'Saya percaya kemampuan dapat berkembang melalui latihan.',
  },
  {
    id: 4,
    aspect: 'A',
    aspectTitle: 'Berani Mencoba',
    text: 'Saya bersedia mengambil tantangan baru saat belajar.',
  },
  {
    id: 5,
    aspect: 'A',
    aspectTitle: 'Berani Mencoba',
    text: 'Saya mau bertanya ketika belum memahami sesuatu.',
  },

  // B. Gigih Menghadapi Kesulitan
  {
    id: 6,
    aspect: 'B',
    aspectTitle: 'Gigih Menghadapi Kesulitan',
    text: 'Saya tetap berusaha ketika soal terasa sulit.',
  },
  {
    id: 7,
    aspect: 'B',
    aspectTitle: 'Gigih Menghadapi Kesulitan',
    text: 'Saya mencoba strategi lain ketika cara pertama belum berhasil.',
  },
  {
    id: 8,
    aspect: 'B',
    aspectTitle: 'Gigih Menghadapi Kesulitan',
    text: 'Saya membagi tugas sulit menjadi langkah-langkah kecil.',
  },
  {
    id: 9,
    aspect: 'B',
    aspectTitle: 'Gigih Menghadapi Kesulitan',
    text: 'Saya meluangkan waktu untuk berlatih agar lebih paham.',
  },
  {
    id: 10,
    aspect: 'B',
    aspectTitle: 'Gigih Menghadapi Kesulitan',
    text: 'Saya mau menyelesaikan tantangan meskipun membutuhkan waktu.',
  },

  // C. Belajar dari Kesalahan
  {
    id: 11,
    aspect: 'C',
    aspectTitle: 'Belajar dari Kesalahan',
    text: 'Saya memeriksa kembali jawaban yang belum tepat.',
  },
  {
    id: 12,
    aspect: 'C',
    aspectTitle: 'Belajar dari Kesalahan',
    text: 'Saya berusaha memahami penyebab kesalahan.',
  },
  {
    id: 13,
    aspect: 'C',
    aspectTitle: 'Belajar dari Kesalahan',
    text: 'Saya menggunakan umpan balik untuk memperbaiki jawaban.',
  },
  {
    id: 14,
    aspect: 'C',
    aspectTitle: 'Belajar dari Kesalahan',
    text: 'Saya menganggap kesalahan sebagai kesempatan belajar.',
  },
  {
    id: 15,
    aspect: 'C',
    aspectTitle: 'Belajar dari Kesalahan',
    text: 'Saya dapat mencoba lagi tanpa malu ketika jawaban salah.',
  },

  // D. Terbuka terhadap Bantuan dan Strategi Baru
  {
    id: 16,
    aspect: 'D',
    aspectTitle: 'Terbuka terhadap Bantuan & Strategi Baru',
    text: 'Saya bersedia mendengarkan penjelasan atau saran teman.',
  },
  {
    id: 17,
    aspect: 'D',
    aspectTitle: 'Terbuka terhadap Bantuan & Strategi Baru',
    text: 'Saya mau mencoba cara belajar yang baru.',
  },
  {
    id: 18,
    aspect: 'D',
    aspectTitle: 'Terbuka terhadap Bantuan & Strategi Baru',
    text: 'Saya menggunakan materi atau petunjuk saat membutuhkan bantuan.',
  },
  {
    id: 19,
    aspect: 'D',
    aspectTitle: 'Terbuka terhadap Bantuan & Strategi Baru',
    text: 'Saya menghargai teman yang memiliki cara belajar berbeda.',
  },
  {
    id: 20,
    aspect: 'D',
    aspectTitle: 'Terbuka terhadap Bantuan & Strategi Baru',
    text: 'Saya bisa meminta bantuan dan tetap berusaha sendiri.',
  },
];

export const SCALE_OPTIONS = [
  { value: 4, label: 'Sangat Sesuai', short: '4', color: 'bg-emerald-500 text-white' },
  { value: 3, label: 'Sesuai', short: '3', color: 'bg-green-500 text-white' },
  { value: 2, label: 'Kadang-kadang', short: '2', color: 'bg-amber-400 text-slate-800' },
  { value: 1, label: 'Belum Sesuai', short: '1', color: 'bg-rose-400 text-white' },
];

export const ASPECT_NAMES: Record<string, string> = {
  A: 'Berani Mencoba',
  B: 'Gigih Menghadapi Kesulitan',
  C: 'Belajar dari Kesalahan',
  D: 'Terbuka Bantuan & Strategi',
};
