import { BattleGroup, BattleSessionState, BattleRoundNumber } from '../types';
import { DEFAULT_STUDENT_CODES } from '../data/studentCodes';
import { BATTLE_QUESTIONS, BATTLE_ROUNDS_CONFIG } from '../data/battleQuestions';

const BATTLE_STORAGE_KEY = 'grow_puzzle_battle_session_v1';

export const DEFAULT_GROUP_PRESETS: {
  name: string;
  colorName: 'blue' | 'green' | 'amber' | 'orange' | 'purple' | 'rose' | 'cyan';
  themeColor: string;
  badgeBg: string;
  icon: string;
}[] = [
  {
    name: 'Kelompok 1 — Rajawali Kompas',
    colorName: 'blue',
    themeColor: '#0284C7',
    badgeBg: 'bg-sky-500 text-white',
    icon: '🦅',
  },
  {
    name: 'Kelompok 2 — Harimau Penjelajah',
    colorName: 'orange',
    themeColor: '#EA580C',
    badgeBg: 'bg-orange-500 text-white',
    icon: '🐯',
  },
  {
    name: 'Kelompok 3 — Lumba-lumba Bahari',
    colorName: 'cyan',
    themeColor: '#0891B2',
    badgeBg: 'bg-cyan-500 text-white',
    icon: '🐬',
  },
  {
    name: 'Kelompok 4 — Elang Samudera',
    colorName: 'green',
    themeColor: '#059669',
    badgeBg: 'bg-emerald-500 text-white',
    icon: '🦜',
  },
  {
    name: 'Kelompok 5 — Komodo Cendekia',
    colorName: 'amber',
    themeColor: '#D97706',
    badgeBg: 'bg-amber-500 text-white',
    icon: '🦎',
  },
  {
    name: 'Kelompok 6 — Garuda Nusantara',
    colorName: 'purple',
    themeColor: '#7C3AED',
    badgeBg: 'bg-purple-500 text-white',
    icon: '🦁',
  },
];

/**
 * Membagi 37 siswa kelas IV B secara merata ke dalam 5 atau 6 kelompok
 */
export const createDefaultBattleGroups = (groupCount: 5 | 6): BattleGroup[] => {
  const allNames = DEFAULT_STUDENT_CODES.map((s) => s.name);
  const total = allNames.length; // 37
  const groups: BattleGroup[] = [];

  const basePerGroup = Math.floor(total / groupCount);
  const remainder = total % groupCount;

  let currentIndex = 0;
  for (let i = 0; i < groupCount; i++) {
    const preset = DEFAULT_GROUP_PRESETS[i % DEFAULT_GROUP_PRESETS.length];
    // Sisanya didistribusikan ke kelompok awal (misal 5 kelompok: 8, 8, 7, 7, 7 = 37)
    const membersCount = i < remainder ? basePerGroup + 1 : basePerGroup;
    const groupMembers = allNames.slice(currentIndex, currentIndex + membersCount);
    currentIndex += membersCount;

    groups.push({
      id: `group_${i + 1}`,
      name: preset.name,
      colorName: preset.colorName,
      themeColor: preset.themeColor,
      badgeBg: preset.badgeBg,
      icon: preset.icon,
      members: groupMembers,
      score: 0,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      growthBonus: 0,
      growthNotes: '',
      growthChecks: {},
    });
  }

  return groups;
};

export const createInitialBattleSession = (groupCount: 5 | 6 = 6): BattleSessionState => {
  const groups = createDefaultBattleGroups(groupCount);
  return {
    isStarted: false,
    groupCount,
    groups,
    currentRound: 1,
    currentQuestionId: BATTLE_QUESTIONS[0]?.id || 'b1_q1',
    discussionDurationSeconds: 60,
    activeRounds: [1, 2, 3, 4, 5],
    answers: {},
    reasonBonus: {},
    evaluatedQuestions: {},
    retryPhase: {},
    retryAnswers: {},
    retryEvaluated: {},
    isFinished: false,
    lastUpdated: new Date().toISOString(),
  };
};

export const getStoredBattleSession = (): BattleSessionState => {
  if (typeof window === 'undefined') return createInitialBattleSession(6);
  try {
    const raw = localStorage.getItem(BATTLE_STORAGE_KEY);
    if (!raw) return createInitialBattleSession(6);
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.groups) || parsed.groups.length < 2) {
      return createInitialBattleSession(6);
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse battle session from storage:', e);
    return createInitialBattleSession(6);
  }
};

export const saveStoredBattleSession = (session: BattleSessionState): void => {
  if (typeof window === 'undefined') return;
  try {
    session.lastUpdated = new Date().toISOString();
    localStorage.setItem(BATTLE_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save battle session:', e);
  }
};

/**
 * Evaluasi jawaban kelompok pada satu soal
 * Mencegah duplikasi pemberian skor untuk soal yang sama.
 */
export const evaluateQuestionAnswers = (
  session: BattleSessionState,
  questionId: string
): BattleSessionState => {
  const question = BATTLE_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return session;

  // Jika sudah dievaluasi sebelumnya, jangan beri poin ganda!
  if (session.evaluatedQuestions[questionId]) {
    return session;
  }

  const questionAnswers = session.answers[questionId] || {};
  const reasonBonusMap = session.reasonBonus[questionId] || {};
  const roundNum = question.round;

  const updatedGroups = session.groups.map((group) => {
    const chosenAnswer = questionAnswers[group.id];
    const isCorrect = chosenAnswer === question.correctAnswer;
    const hasReasonBonus = !!reasonBonusMap[group.id];

    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned += question.points;
      // Babak 3: Alasan tepat memberikan bonus 5 poin
      if (roundNum === 3 && hasReasonBonus) {
        pointsEarned += 5;
      }
    }

    const currentRoundScore = group.roundScores[roundNum] || 0;
    const newRoundScore = currentRoundScore + pointsEarned;
    const newTotalScore = group.score + pointsEarned;

    return {
      ...group,
      score: newTotalScore,
      roundScores: {
        ...group.roundScores,
        [roundNum]: newRoundScore,
      },
    };
  });

  const updatedSession: BattleSessionState = {
    ...session,
    groups: updatedGroups,
    evaluatedQuestions: {
      ...session.evaluatedQuestions,
      [questionId]: true,
    },
    lastUpdated: new Date().toISOString(),
  };

  saveStoredBattleSession(updatedSession);
  return updatedSession;
};

/**
 * Evaluasi babak 5 (Growth Mindset retry dengan petunjuk)
 * Memberikan bonus perbaikan +5 poin jika setelah petunjuk jawabannya menjadi benar
 */
export const evaluateRetryAnswers = (
  session: BattleSessionState,
  questionId: string
): BattleSessionState => {
  const question = BATTLE_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return session;
  if (session.retryEvaluated[questionId]) return session;

  const initialAnswers = session.answers[questionId] || {};
  const retryAnswers = session.retryAnswers[questionId] || {};
  const roundNum = question.round;

  const updatedGroups = session.groups.map((group) => {
    const initiallyCorrect = initialAnswers[group.id] === question.correctAnswer;
    const retryAnswer = retryAnswers[group.id];
    const retryNowCorrect = retryAnswer === question.correctAnswer;

    // Hanya kelompok yang awalnya belum tepat dan setelah petunjuk menjadi benar yang dapat bonus perbaikan 5 poin
    let bonusEarned = 0;
    if (!initiallyCorrect && retryNowCorrect) {
      bonusEarned = 5;
    }

    const currentRoundScore = group.roundScores[roundNum] || 0;
    return {
      ...group,
      score: group.score + bonusEarned,
      growthBonus: group.growthBonus + bonusEarned,
      roundScores: {
        ...group.roundScores,
        [roundNum]: currentRoundScore + bonusEarned,
      },
    };
  });

  const updatedSession: BattleSessionState = {
    ...session,
    groups: updatedGroups,
    retryEvaluated: {
      ...session.retryEvaluated,
      [questionId]: true,
    },
    lastUpdated: new Date().toISOString(),
  };

  saveStoredBattleSession(updatedSession);
  return updatedSession;
};

/**
 * Ekspor Rekap Hasil Kompetisi Kelompok ke Format CSV Siap Unduh
 */
export const generateBattleCsvString = (session: BattleSessionState): string => {
  const nowStr = new Date().toLocaleString('id-ID');
  const sorted = [...session.groups].sort((a, b) => b.score - a.score);

  const lines: string[] = [];
  lines.push(`"REKAP HASIL BATTLE OF MAP EXPLORERS — KOMPETISI KELOMPOK"`);
  lines.push(`"Mata Pelajaran: IPAS Kelas IV SD (Mengenal Peta)"`);
  lines.push(`"Waktu Unduh: ${nowStr}"`);
  lines.push(`"Total Kelompok: ${session.groups.length} Kelompok (Total 37 Siswa)"`);
  lines.push('');

  // Tabel 1: Papan Peringkat & Skor Tiap Babak
  lines.push(`"TABEL 1: KLASEMEN AKHIR & SKOR SETIAP BABAK"`);
  lines.push(`"Peringkat","Nama Kelompok","Babak 1 (Tebak Cepat)","Babak 2 (Duel Arah)","Babak 3 (Detektif Simbol)","Babak 4 (Puzzle Rute)","Babak 5 (Growth Challenge)","Bonus Sikap & Perbaikan","TOTAL SKOR","Daftar Anggota Siswa"`);

  sorted.forEach((g, idx) => {
    const rank = idx + 1;
    const r1 = g.roundScores[1] || 0;
    const r2 = g.roundScores[2] || 0;
    const r3 = g.roundScores[3] || 0;
    const r4 = g.roundScores[4] || 0;
    const r5 = g.roundScores[5] || 0;
    const bonus = g.growthBonus || 0;
    const total = g.score || 0;
    const membersJoined = g.members.join('; ');

    lines.push(`"${rank}","${g.name}","${r1}","${r2}","${r3}","${r4}","${r5}","${bonus}","${total}","${membersJoined}"`);
  });

  lines.push('');
  // Tabel 2: Catatan Observasi Perilaku Growth Mindset
  lines.push(`"TABEL 2: OBSERVASI SIKAP & PERILAKU GROWTH MINDSET OLEH GURU"`);
  lines.push(`"Kelompok","Ketekunan Hadapi Soal","Belajar dari Kesalahan","Penggunaan Petunjuk","Fleksibilitas Strategi","Kerja Sama & Respek","Catatan Kualitatif Guru"`);

  sorted.forEach((g) => {
    const c1 = g.growthChecks['perseverance'] ? 'Ya (Teramati)' : 'Perlu Didorong';
    const c2 = g.growthChecks['learn_from_mistake'] ? 'Ya (Teramati)' : 'Perlu Didorong';
    const c3 = g.growthChecks['hint_utilization'] ? 'Ya (Teramati)' : 'Perlu Didorong';
    const c4 = g.growthChecks['strategy_shift'] ? 'Ya (Teramati)' : 'Perlu Didorong';
    const c5 = g.growthChecks['collaboration'] ? 'Ya (Teramati)' : 'Perlu Didorong';
    const note = (g.growthNotes || '-').replace(/"/g, '""');

    lines.push(`"${g.name}","${c1}","${c2}","${c3}","${c4}","${c5}","${note}"`);
  });

  return '\uFEFF' + lines.join('\r\n');
};

export const downloadCsvFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
