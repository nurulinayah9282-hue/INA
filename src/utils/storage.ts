import { StudentRecord, GameProgress } from '../types';
import { getDefaultStudents, createDefaultProgress } from '../data/defaultStudents';

const STORAGE_KEY_STUDENTS = 'grow_puzzle_students_v1';
const STORAGE_KEY_ACTIVE_STUDENT = 'grow_puzzle_active_student_v1';
const STORAGE_KEY_SETTINGS = 'grow_puzzle_settings_v1';

export interface AppSettings {
  soundEnabled: boolean;
  autoNarrate: boolean;
  className: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  autoNarrate: false,
  className: 'IV B',
};

export const getStoredSettings = (): AppSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const clearStoredStudentsRecap = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_STUDENT);
    localStorage.setItem('grow_puzzle_students_cleared', 'true');
  } catch (e) {
    console.error('Failed to clear stored students:', e);
  }
};

export const resetDefaultStudentsList = (): Record<string, StudentRecord> => {
  if (typeof window === 'undefined') return getDefaultStudents();
  try {
    localStorage.removeItem('grow_puzzle_students_cleared');
    const defaults = getDefaultStudents();
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(defaults));
    return defaults;
  } catch {
    return getDefaultStudents();
  }
};

export const getStoredStudents = (): Record<string, StudentRecord> => {
  if (typeof window === 'undefined') return {};
  try {
    if (localStorage.getItem('grow_puzzle_students_cleared') === 'true') {
      return {};
    }
    const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
    const defaults = getDefaultStudents();
    if (!data) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(defaults));
      return defaults;
    }
    const parsed: Record<string, StudentRecord> = JSON.parse(data);
    
    // Check if stored data has outdated mock names (e.g. siswa_06 is not ALESHA ZAHRA)
    const isOutdated = !parsed['siswa_06'] || !parsed['siswa_06'].profile.name.toUpperCase().includes('ALESHA') || Object.keys(parsed).length < 37;
    if (isOutdated) {
      // Merge official students while preserving existing progress if any
      const merged: Record<string, StudentRecord> = { ...defaults };
      Object.keys(defaults).forEach((id) => {
        if (parsed[id] && parsed[id].progress) {
          merged[id].progress = {
            ...merged[id].progress,
            ...parsed[id].progress,
          };
        }
      });
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return getDefaultStudents();
  }
};

export const saveStoredStudents = (students: Record<string, StudentRecord>): void => {
  if (typeof window === 'undefined') return;
  try {
    if (Object.keys(students).length > 0) {
      localStorage.removeItem('grow_puzzle_students_cleared');
    }
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
};

export const getActiveStudentId = (): string => {
  if (typeof window === 'undefined') return 'siswa_01';
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_STUDENT);
    return stored || 'siswa_01';
  } catch {
    return 'siswa_01';
  }
};

export const setActiveStudentId = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_STUDENT, id);
  } catch (e) {
    console.error('Failed to set active student ID', e);
  }
};

// Check badges eligibility
export const computeEligibleBadges = (progress: GameProgress): string[] => {
  const badges: string[] = [];

  // 1. Brave Explorer: Solved at least 1 challenge
  if (progress.completedQuestions.length >= 1) {
    badges.push('brave_explorer');
  }

  // 2. Never Give Up: Persisted through questions with 2 or more attempts
  const hasMultipleAttempts = Object.values(progress.attempts).some((a) => a >= 2);
  if (hasMultipleAttempts && progress.completedQuestions.length >= 1) {
    badges.push('never_give_up');
  }

  // 3. Mistake Learner: Solved at least 3 questions or used hints/material
  if (progress.completedQuestions.length >= 3) {
    badges.push('mistake_learner');
  }

  // 4. Good Supporter: Solved challenges in zone 4 (like #20, #24, #25) or marked support challenge
  const zone4Solved = progress.completedQuestions.some((id) => id >= 20 && id <= 25);
  if (zone4Solved || progress.supportChallengeDone) {
    badges.push('good_supporter');
  }

  // 5. Growth Champion: Completed all 25 questions and reflection
  if (progress.completedQuestions.length >= 25 && (progress.finalGrowMapCompleted || Object.keys(progress.reflectionAnswers).length > 0)) {
    badges.push('growth_champion');
  }

  return badges;
};

// Calculate unlocked puzzle pieces (0..5) based on progress
export const computePuzzlePieces = (completedCount: number): number[] => {
  // 6 pieces total for 25 questions:
  // Piece 0 at 4 questions
  // Piece 1 at 8 questions
  // Piece 2 at 12 questions
  // Piece 3 at 16 questions
  // Piece 4 at 20 questions
  // Piece 5 at 25 questions
  const pieces: number[] = [];
  if (completedCount >= 4) pieces.push(0);
  if (completedCount >= 8) pieces.push(1);
  if (completedCount >= 12) pieces.push(2);
  if (completedCount >= 16) pieces.push(3);
  if (completedCount >= 20) pieces.push(4);
  if (completedCount >= 25) pieces.push(5);
  return pieces;
};

// Update a question result for a student
export const recordQuestionAttempt = (
  students: Record<string, StudentRecord>,
  studentId: string,
  questionId: number,
  answerIndex: number,
  isCorrect: boolean
): { updatedStudents: Record<string, StudentRecord>; newlyCompleted: boolean } => {
  const currentRecord = students[studentId];
  if (!currentRecord) {
    return { updatedStudents: students, newlyCompleted: false };
  }

  const p = { ...currentRecord.progress };
  const currentAttempts = p.attempts[questionId] || 0;
  p.attempts = { ...p.attempts, [questionId]: currentAttempts + 1 };
  p.answers = { ...p.answers, [questionId]: answerIndex };

  let newlyCompleted = false;
  if (isCorrect && !p.completedQuestions.includes(questionId)) {
    p.completedQuestions = [...p.completedQuestions, questionId];
    newlyCompleted = true;
  }

  // Score: 10 points per completed question, capped at 250
  p.score = Math.min(250, p.completedQuestions.length * 10);

  // Status
  if (p.completedQuestions.length >= 25) {
    p.status = 'selesai';
  } else if (p.completedQuestions.length > 0 || p.initialGrowMapCompleted) {
    p.status = 'sedang_bermain';
  }

  // Update puzzle pieces
  p.unlockedPuzzlePieces = computePuzzlePieces(p.completedQuestions.length);

  // Update badges
  p.unlockedBadges = computeEligibleBadges(p);

  p.lastUpdated = new Date().toISOString();

  const updatedStudents = {
    ...students,
    [studentId]: {
      ...currentRecord,
      progress: p,
    },
  };

  saveStoredStudents(updatedStudents);
  return { updatedStudents, newlyCompleted };
};

// Reset a student's progress
export const resetStudentProgress = (
  students: Record<string, StudentRecord>,
  studentId: string
): Record<string, StudentRecord> => {
  const currentRecord = students[studentId];
  if (!currentRecord) return students;

  const updated = {
    ...students,
    [studentId]: {
      ...currentRecord,
      progress: createDefaultProgress(),
    },
  };

  saveStoredStudents(updated);
  return updated;
};

// Reset all students
export const resetAllStudents = (): Record<string, StudentRecord> => {
  const defaults = getDefaultStudents();
  saveStoredStudents(defaults);
  return defaults;
};

// Export to CSV
export const exportStudentsToCSV = (students: Record<string, StudentRecord>): void => {
  const studentList = Object.values(students);

  const headers = [
    'No',
    'ID Siswa',
    'Nama Siswa',
    'Kelas',
    'Status Permainan',
    'Soal Dijawab Benar',
    'Soal Belum Selesai',
    'Skor (Maks 250)',
    'Persentase Ketuntasan (%)',
    'Total Percobaan Menjawab',
    'Jumlah Puzzle Didapat (Maks 6)',
    'Badge yang Diperoleh',
    'GROW MAP Awal Selesai',
    'GROW MAP Akhir Selesai',
    'Rata-rata Nilai GROW MAP Awal (1-4)',
    'Rata-rata Nilai GROW MAP Akhir (1-4)',
    'Refleksi: Tantangan Tersulit',
    'Refleksi: Saat Jawaban Belum Tepat',
    'Refleksi: Pelajaran dari Kesalahan',
    'Refleksi: Strategi Membantu Peta',
    'Refleksi: Ingin Dicoba Berikutnya',
    'Terakhir Aktif',
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = studentList.map((st, index) => {
    const prog = st.progress;
    const correctCount = prog.completedQuestions.length;
    const remainingCount = 25 - correctCount;
    const percentage = ((correctCount / 25) * 100).toFixed(1);
    const totalAttempts = Object.values(prog.attempts).reduce((a, b) => a + b, 0);

    const initialScores = Object.values(prog.growMapInitial);
    const initialAvg = initialScores.length > 0 ? (initialScores.reduce((a, b) => a + b, 0) / initialScores.length).toFixed(2) : '-';

    const finalScores = Object.values(prog.growMapFinal);
    const finalAvg = finalScores.length > 0 ? (finalScores.reduce((a, b) => a + b, 0) / finalScores.length).toFixed(2) : '-';

    const badgeNames = (prog.unlockedBadges || []).join('; ');

    return [
      index + 1,
      escapeCSV(st.profile.id),
      escapeCSV(st.profile.name),
      escapeCSV(st.profile.grade),
      escapeCSV(
        prog.status === 'selesai' ? 'Selesai' : prog.status === 'sedang_bermain' ? 'Sedang Bermain' : 'Belum Mulai'
      ),
      correctCount,
      remainingCount,
      prog.score,
      percentage + '%',
      totalAttempts,
      prog.unlockedPuzzlePieces.length,
      escapeCSV(badgeNames),
      prog.initialGrowMapCompleted ? 'Ya' : 'Belum',
      prog.finalGrowMapCompleted ? 'Ya' : 'Belum',
      initialAvg,
      finalAvg,
      escapeCSV(prog.reflectionAnswers.q1_difficultChallenge || '-'),
      escapeCSV(prog.reflectionAnswers.q2_whenIncorrect || '-'),
      escapeCSV(prog.reflectionAnswers.q3_learnFromMistake || '-'),
      escapeCSV(prog.reflectionAnswers.q4_helpfulStrategy || '-'),
      escapeCSV(prog.reflectionAnswers.q5_tryNextTime || '-'),
      escapeCSV(new Date(prog.lastUpdated).toLocaleString('id-ID')),
    ].join(',');
  });

  // UTF-8 BOM so Excel opens accents and symbols correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_Grow_Puzzle_Digital_Kelas_IV_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
