import { BadgeInfo } from '../types';

export const BADGES: BadgeInfo[] = [
  {
    id: 'brave_explorer',
    name: 'Brave Explorer',
    titleBadge: 'Penjelajah Pemberani',
    description: 'Berani membuka langkah pertama dan menyelesaikan tantangan dengan percaya diri.',
    iconName: 'compass',
    badgeColor: 'from-amber-400 to-yellow-500',
    requirement: 'Menyelesaikan minimal 1 tantangan soal di papan permainan.',
  },
  {
    id: 'never_give_up',
    name: 'Never Give Up',
    titleBadge: 'Pantang Menyerah',
    description: 'Menunjukkan kegigihan untuk mencoba kembali saat menemui jawaban yang belum tepat.',
    iconName: 'flame',
    badgeColor: 'from-orange-400 to-amber-600',
    requirement: 'Mencoba kembali dan gigih menyelesaikan soal setelah menerima umpan balik.',
  },
  {
    id: 'mistake_learner',
    name: 'Mistake Learner',
    titleBadge: 'Pembelajar Tangguh',
    description: 'Memeriksa petunjuk, membaca materi, dan menjadikan kesalahan sebagai batu loncatan belajar.',
    iconName: 'lightbulb',
    badgeColor: 'from-emerald-400 to-teal-600',
    requirement: 'Membuka petunjuk atau materi dan berhasil memperbaiki pemahaman soal.',
  },
  {
    id: 'good_supporter',
    name: 'Good Supporter',
    titleBadge: 'Sahabat yang Mendukung',
    description: 'Memahami nilai kerja sama, saling menyemangati teman, dan menghargai keberagaman cara belajar.',
    iconName: 'heartHandshake',
    badgeColor: 'from-sky-400 to-blue-600',
    requirement: 'Menyelesaikan tantangan sikap dan kerja sama di Zona Sahabat yang Mendukung.',
  },
  {
    id: 'growth_champion',
    name: 'Growth Champion',
    titleBadge: 'Juara Penjelajah Tumbuh',
    description: 'Menuntaskan seluruh 25 tantangan petualangan peta, mengumpulkan 6 puzzle, dan mengisi refleksi.',
    iconName: 'trophy',
    badgeColor: 'from-purple-500 to-indigo-600',
    requirement: 'Menyelesaikan ke-25 tantangan soal serta mengisi refleksi akhir.',
  },
];

export const PUZZLE_PIECES = [
  { index: 0, text: 'KESALAHAN', color: 'bg-emerald-500', icon: '🌱' },
  { index: 1, text: 'ADALAH', color: 'bg-teal-500', icon: '✨' },
  { index: 2, text: 'BAGIAN', color: 'bg-sky-500', icon: '🧩' },
  { index: 3, text: 'DARI', color: 'bg-blue-500', icon: '🗺️' },
  { index: 4, text: 'PROSES', color: 'bg-indigo-500', icon: '🚀' },
  { index: 5, text: 'BELAJAR', color: 'bg-amber-500', icon: '⭐' },
];

export const FULL_PUZZLE_MOTTO = 'KESALAHAN ADALAH BAGIAN DARI PROSES BELAJAR';
