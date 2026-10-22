import { StudentRecord } from '../types';
import { getAllStudentCodes } from './studentCodes';

export const INITIAL_STUDENTS_LIST = getAllStudentCodes().map((s) => s.name);

export const createDefaultProgress = (): StudentRecord['progress'] => ({
  status: 'belum_mulai',
  score: 0,
  completedQuestions: [],
  attempts: {},
  answers: {},
  currentPosition: 1,
  unlockedPuzzlePieces: [],
  unlockedBadges: [],
  initialGrowMapCompleted: false,
  finalGrowMapCompleted: false,
  growMapInitial: {},
  growMapFinal: {},
  reflectionAnswers: {},
  supportChallengeDone: false,
  lastUpdated: new Date().toISOString(),
});

export const getDefaultStudents = (): Record<string, StudentRecord> => {
  const students: Record<string, StudentRecord> = {};
  getAllStudentCodes().forEach((entry) => {
    students[entry.id] = {
      profile: {
        id: entry.id,
        name: entry.name,
        grade: entry.grade,
        avatar: entry.avatar,
      },
      progress: createDefaultProgress(),
    };
  });
  return students;
};
