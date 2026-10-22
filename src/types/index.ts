export type NavigationPage =
  | 'cover'
  | 'instructions'
  | 'profile'
  | 'grow_map_initial'
  | 'board'
  | 'dice'
  | 'material'
  | 'challenge'
  | 'puzzle'
  | 'badges'
  | 'reflection'
  | 'grow_map_final'
  | 'final_result'
  | 'teacher_dashboard'
  | 'teacher_settings'
  | 'dashboard_guru'
  | 'login'
  | 'battle_explorers';

export interface StudentProfile {
  id: string; // e.g., 'siswa_01'
  name: string;
  grade: string;
  avatar: string; // 'boy1' | 'girl1' | 'boy2' | 'girl2'
}

export interface StudentRecord {
  profile: StudentProfile;
  progress: GameProgress;
}

export interface GameProgress {
  status: 'belum_mulai' | 'sedang_bermain' | 'selesai';
  score: number; // 0 - 250
  completedQuestions: number[]; // question ids [1..25]
  attempts: Record<number, number>; // questionId -> total attempts
  answers: Record<number, number>; // questionId -> chosen answer index
  currentPosition: number; // 1 - 25 on board
  unlockedPuzzlePieces: number[]; // piece indices [0..5]
  unlockedBadges: string[]; // badge IDs
  initialGrowMapCompleted: boolean;
  finalGrowMapCompleted: boolean;
  growMapInitial: Record<number, number>; // statementId 1..20 -> 1..4
  growMapFinal: Record<number, number>; // statementId 1..20 -> 1..4
  reflectionAnswers: {
    q1_difficultChallenge?: string;
    q2_whenIncorrect?: string;
    q3_learnFromMistake?: string;
    q4_helpfulStrategy?: string;
    q5_tryNextTime?: string;
  };
  supportChallengeDone?: boolean;
  lastUpdated: string;
}

export interface Question {
  id: number;
  zone: 1 | 2 | 3 | 4;
  zoneName: string;
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  mapVisual?: {
    type: 'compass' | 'symbol' | 'grid' | 'route' | 'legend';
    symbolIcon?: string;
    symbolLabel?: string;
    locationFrom?: string;
    locationTo?: string;
    heading?: string;
    note?: string;
  };
}

export interface BadgeInfo {
  id: string;
  name: string;
  titleBadge: string;
  description: string;
  iconName: string;
  badgeColor: string;
  requirement: string;
}

export interface GrowMapStatement {
  id: number;
  aspect: 'A' | 'B' | 'C' | 'D';
  aspectTitle: string;
  text: string;
}

export interface MaterialInfographic {
  src: string;
  alt: string;
  title: string;
  caption: string;
  highlights?: string[];
}

export interface MaterialLesson {
  id: number;
  title: string;
  subheading: string;
  badge: string;
  summary: string;
  infographic?: MaterialInfographic;
  sections: {
    heading: string;
    content: string;
    keyPoints?: string[];
    diagramType?: 'definition' | 'functions' | 'elements' | 'legend' | 'compass' | 'relative' | 'practical' | 'quiz';
  }[];
  quickCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// ==========================================
// BATTLE OF MAP EXPLORERS — KOMPETISI KELOMPOK
// ==========================================

export interface BattleGroup {
  id: string; // 'group_1', 'group_2', etc.
  name: string;
  colorName: 'blue' | 'green' | 'amber' | 'orange' | 'purple' | 'rose' | 'cyan';
  themeColor: string; // Hex color for main UI
  badgeBg: string; // Tailwind class
  icon: string; // Emoji
  members: string[]; // List of student names from the 37 students
  score: number;
  roundScores: Record<number, number>; // round 1..5 -> score
  growthBonus: number;
  growthNotes: string;
  growthChecks: Record<string, boolean>; // indicator key -> true/false
}

export type BattleRoundNumber = 1 | 2 | 3 | 4 | 5;

export interface BattleQuestion {
  id: string;
  round: BattleRoundNumber;
  roundName: string;
  numberInRound: number;
  title: string;
  question: string;
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  points: number; // e.g. 10 (R1), 15 (R2), 20 (R3), 20 (R4), 15 (R5)
  explanation: string;
  growthHint: string; // Used when groups need a clue or retry in Round 5
  visualType: 'compass' | 'village_map' | 'symbol_legend' | 'route_puzzle' | 'scale_ruler';
  visualMeta?: {
    fromLocation?: string;
    toLocation?: string;
    bearingAngle?: number;
    highlightSymbol?: string;
    routeSteps?: string[];
    scaleRatio?: string;
  };
}

export interface GrowthMetricItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface BattleSessionState {
  isStarted: boolean;
  groupCount: 5 | 6;
  groups: BattleGroup[];
  currentRound: BattleRoundNumber;
  currentQuestionId: string;
  discussionDurationSeconds: number; // 0 for infinite, or 30, 45, 60, 90, 120
  activeRounds: BattleRoundNumber[];
  answers: Record<string, Record<string, 'A' | 'B' | 'C' | 'D' | null>>; // questionId -> groupId -> answer
  reasonBonus: Record<string, Record<string, boolean>>; // questionId -> groupId -> true if good explanation (Round 3)
  evaluatedQuestions: Record<string, boolean>; // questionId -> boolean (points awarded)
  retryPhase: Record<string, boolean>; // questionId -> boolean (Round 5 hint active)
  retryAnswers: Record<string, Record<string, 'A' | 'B' | 'C' | 'D' | null>>; // questionId -> groupId -> answer
  retryEvaluated: Record<string, boolean>; // questionId -> boolean (bonus 5 awarded)
  isFinished: boolean;
  lastUpdated: string;
}

