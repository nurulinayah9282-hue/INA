import { findStudentByAdventureCode, StudentCodeEntry } from '../data/studentCodes';

export interface VerifyCodeResult {
  success: boolean;
  role?: 'student' | 'teacher';
  student?: StudentCodeEntry;
  teacher?: {
    name: string;
    role: string;
  };
  message?: string;
}

/**
 * Daftar kode login rahasia khusus Guru Kelas IV B.
 * Bekerja secara otomatis baik di server maupun di lingkungan statis (Netlify / Vercel).
 */
export const TEACHER_CODES = ['GURU4B', 'GURU', 'GURUPETA', 'GROWGURU4B'];

export function isTeacherCode(rawCode: string): boolean {
  if (!rawCode) return false;
  const clean = rawCode.trim().toUpperCase().replace(/\s+/g, '');
  return TEACHER_CODES.includes(clean);
}

/**
 * Memverifikasi kode petualangan siswa atau kode rahasia guru.
 * Didesain tangguh untuk lingkungan Fullstack (Node/Express) maupun Statis SPA (Netlify/Vercel).
 */
export async function verifyAdventureCode(code: string): Promise<VerifyCodeResult> {
  const cleanCode = code ? code.trim() : '';
  if (!cleanCode) {
    return {
      success: false,
      message: 'Silakan ketikkan kode petualanganmu terlebih dahulu ya! 😊',
    };
  }

  const normalized = cleanCode.toUpperCase().replace(/\s+/g, '');

  // 1. Deteksi Cepat Kode Khusus Guru (Client-side instant check for Netlify/Vercel/Static hosting)
  if (isTeacherCode(normalized)) {
    return {
      success: true,
      role: 'teacher',
      teacher: {
        name: 'Guru Kelas IV B',
        role: 'teacher',
      },
      message: 'Selamat datang, Ibu/Bapak Guru! Membuka Dashboard Pengelolaan...',
    };
  }

  // 2. Coba verifikasi ke backend API Express jika tersedia (/api/verify-code)
  try {
    const response = await fetch('/api/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: cleanCode }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Pada Netlify/Vercel tanpa backend Express, fetch akan gagal atau 404, lanjut ke fallback lokal
    console.info('Backend API verify-code call skipped/failed, using standalone client validation.');
  }

  // 3. Fallback verifikasi lokal mandiri (Standalone client-side verification untuk siswa)
  const student = findStudentByAdventureCode(cleanCode);
  if (student) {
    return {
      success: true,
      role: 'student',
      student,
      message: `Selamat datang, ${student.name}!`,
    };
  }

  return {
    success: false,
    message: 'Kode belum terdaftar, yuk cek lagi kartumu! 🗺️',
  };
}
