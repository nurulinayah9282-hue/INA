import React, { useState, useEffect, useRef } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { logActivityLive, saveStudentToFirestore, LiveActivityItem } from '../lib/firestoreService';
import { exportStudentsToCSV, clearStoredStudentsRecap, resetDefaultStudentsList } from '../utils/storage';
import { StudentDetailModal } from './StudentDetailModal';
import { audioManager } from '../utils/audio';
import { User as FirebaseUser } from 'firebase/auth';
import { STUDENT_CODES, getAllStudentCodes, StudentCodeEntry } from '../data/studentCodes';
import { saveStoredStudents } from '../utils/storage';
import { ManageStudentCodesTab } from './ManageStudentCodesTab';
import {
  Users,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Home,
  CheckCircle2,
  Sparkles,
  Eye,
  Play,
  Activity,
  Radio,
  Clock,
  RefreshCw,
  LogIn,
  Zap,
  Award,
  Puzzle,
  ChevronRight,
  TrendingUp,
  KeyRound,
  UserPlus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface DashboardGuruLivePageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectStudent: (studentId: string) => void;
  currentUser: FirebaseUser | null;
  onSignInGoogle: () => void;
  initialStudents?: Record<string, StudentRecord>;
  isTeacherAuthenticated?: boolean;
  onClearAllStudents?: () => void;
}

export const DashboardGuruLivePage: React.FC<DashboardGuruLivePageProps> = ({
  onNavigate,
  onSelectStudent,
  currentUser,
  onSignInGoogle,
  initialStudents = {},
  isTeacherAuthenticated = false,
  onClearAllStudents,
}) => {
  const [students, setStudents] = useState<Record<string, StudentRecord>>(initialStudents);
  const [liveActivities, setLiveActivities] = useState<LiveActivityItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active_now' | 'in_progress' | 'completed' | 'not_started'>('all');
  const [sortBy, setSortBy] = useState<'last_active' | 'score' | 'progress' | 'name' | 'id'>('last_active');
  const [sortAsc, setSortAsc] = useState(false);
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);
  const [lastLiveTimestamp, setLastLiveTimestamp] = useState<Date>(new Date());
  const [isLiveListening, setIsLiveListening] = useState<boolean>(true);
  const [flashingStudentId, setFlashingStudentId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'monitoring' | 'manage_codes'>('monitoring');
  const [totalCodesCount, setTotalCodesCount] = useState<number>(() => getAllStudentCodes().length);
  const previousActivityIdRef = useRef<string | null>(null);

  // Fitur Hapus Riwayat Aktivitas
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [deleteToastMessage, setDeleteToastMessage] = useState<string | null>(null);

  // Dilindungi dan HANYA muncul ketika login menggunakan kode rahasia "GURU4B"
  const isSecretGuruAuth =
    isTeacherAuthenticated ||
    (typeof window !== 'undefined' && localStorage.getItem('grow_puzzle_teacher_auth_code') === 'GURU4B');

  const handleConfirmDeleteAllRecap = () => {
    try {
      // 3. Menghapus seluruh data rekap siswa yang tersimpan di localStorage menggunakan perintah localStorage.removeItem
      localStorage.removeItem('grow_puzzle_students_v1');
      localStorage.removeItem('grow_puzzle_active_student_v1');
      clearStoredStudentsRecap();

      // Otomatis menyegarkan (refresh) tabel dashboard menjadi kosong kembali
      setStudents({});
      setLiveActivities([]);
      if (onClearAllStudents) {
        onClearAllStudents();
      }

      setShowDeleteConfirmModal(false);
      setDeleteToastMessage('Semua data rekap nilai siswa berhasil dihapus dan tabel telah dikosongkan.');
      audioManager.playCorrectSound();

      setTimeout(() => {
        setDeleteToastMessage(null);
      }, 6000);
    } catch (err) {
      console.error('Gagal menghapus data rekap siswa:', err);
    }
  };

  const handleRestoreRoster = () => {
    const defaults = resetDefaultStudentsList();
    setStudents(defaults);
    setDeleteToastMessage(null);
    audioManager.playClickSound();
  };

  const handleStudentAddedOrUpdated = (entry: StudentCodeEntry) => {
    setTotalCodesCount(getAllStudentCodes().length);
    setStudents((prev) => {
      if (prev[entry.id]) {
        const existing = prev[entry.id];
        const upd: StudentRecord = {
          ...existing,
          profile: {
            ...existing.profile,
            name: entry.name,
            grade: entry.grade,
            avatar: entry.avatar,
          },
        };
        const updatedMap = { ...prev, [entry.id]: upd };
        saveStoredStudents(updatedMap);
        saveStudentToFirestore(upd);
        return updatedMap;
      } else {
        const newRecord: StudentRecord = {
          profile: {
            id: entry.id,
            name: entry.name,
            grade: entry.grade,
            avatar: entry.avatar,
          },
          progress: {
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
          },
        };
        const updatedMap = { ...prev, [entry.id]: newRecord };
        saveStoredStudents(updatedMap);
        saveStudentToFirestore(newRecord);
        return updatedMap;
      }
    });
  };

  // Setup Real-time Firestore Listeners (onSnapshot) for students and activities
  useEffect(() => {
    setIsLiveListening(true);

    // 1. Listen to real-time updates for Students collection
    const studentsPath = 'students';
    let unsubStudents: (() => void) | null = null;
    try {
      unsubStudents = onSnapshot(
        collection(db, studentsPath),
        (snapshot) => {
          if (!snapshot.empty) {
            if (typeof window !== 'undefined' && localStorage.getItem('grow_puzzle_students_cleared') === 'true') {
              return;
            }
            const cloudStudents: Record<string, StudentRecord> = {};
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              cloudStudents[data.id] = {
                profile: {
                  id: data.id,
                  name: data.name,
                  grade: data.grade || 'IV B',
                  avatar: data.avatar || 'boy1',
                },
                progress: {
                  status: data.status || 'belum_mulai',
                  score: Number(data.score) || 0,
                  completedQuestions: data.completedQuestions || [],
                  attempts: data.attempts || {},
                  answers: data.answers || {},
                  currentPosition: data.currentPosition || 1,
                  unlockedPuzzlePieces: data.unlockedPuzzlePieces || [],
                  unlockedBadges: data.unlockedBadges || [],
                  initialGrowMapCompleted: Boolean(data.initialGrowMapCompleted),
                  finalGrowMapCompleted: Boolean(data.finalGrowMapCompleted),
                  growMapInitial: data.growMapInitial || {},
                  growMapFinal: data.growMapFinal || {},
                  reflectionAnswers: data.reflectionAnswers || {},
                  supportChallengeDone: Boolean(data.supportChallengeDone),
                  lastUpdated: data.lastUpdated || new Date().toISOString(),
                },
              };
            });
            setStudents(cloudStudents);
            setLastLiveTimestamp(new Date());
          }
        },
        (error) => {
          console.error('Firestore onSnapshot error on students:', error);
          handleFirestoreError(error, OperationType.GET, studentsPath);
        }
      );
    } catch (err) {
      console.error('Failed to attach students onSnapshot listener:', err);
    }

    // 2. Listen to real-time updates for Live Activities collection
    const activitiesPath = 'activities';
    let unsubActivities: (() => void) | null = null;
    try {
      const q = query(collection(db, activitiesPath), orderBy('timestamp', 'desc'), limit(40));
      unsubActivities = onSnapshot(
        q,
        (snapshot) => {
          const items: LiveActivityItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as LiveActivityItem);
          });
          setLiveActivities(items);
          setLastLiveTimestamp(new Date());

          // Trigger visual flash if there is a new activity at top
          if (items.length > 0) {
            const latest = items[0];
            if (latest.id !== previousActivityIdRef.current) {
              previousActivityIdRef.current = latest.id;
              setFlashingStudentId(latest.studentId);
              setTimeout(() => {
                setFlashingStudentId(null);
              }, 2500);
            }
          }
        },
        (error) => {
          console.error('Firestore onSnapshot error on activities:', error);
          handleFirestoreError(error, OperationType.GET, activitiesPath);
        }
      );
    } catch (err) {
      console.error('Failed to attach activities onSnapshot listener:', err);
    }

    return () => {
      if (unsubStudents) unsubStudents();
      if (unsubActivities) unsubActivities();
      setIsLiveListening(false);
    };
  }, []);

  // Compute student list & last activity per student
  const studentList = Object.values(students);

  // Map latest activity to studentId
  const latestActivityByStudent: Record<string, LiveActivityItem> = {};
  liveActivities.forEach((act) => {
    if (!latestActivityByStudent[act.studentId]) {
      latestActivityByStudent[act.studentId] = act;
    }
  });

  // Calculate stats
  const totalStudents = studentList.length;
  const completedCount = studentList.filter((s) => s.progress.status === 'selesai' || s.progress.completedQuestions.length >= 25).length;
  const inProgressCount = studentList.filter(
    (s) => s.progress.status === 'sedang_bermain' || (s.progress.completedQuestions.length > 0 && s.progress.completedQuestions.length < 25)
  ).length;
  const notStartedCount = studentList.filter(
    (s) => s.progress.status === 'belum_mulai' && s.progress.completedQuestions.length === 0
  ).length;

  // Active students right now (either status sedang_bermain or active in the last 20 mins)
  const twentyMinutesAgo = Date.now() - 20 * 60 * 1000;
  const activeNowList = studentList.filter((s) => {
    const isPlaying = s.progress.status === 'sedang_bermain';
    const lastActive = s.progress.lastUpdated ? new Date(s.progress.lastUpdated).getTime() : 0;
    const hasRecentActivity = latestActivityByStudent[s.profile.id] && new Date(latestActivityByStudent[s.profile.id].timestamp).getTime() > twentyMinutesAgo;
    return isPlaying || hasRecentActivity || lastActive > twentyMinutesAgo;
  });

  const totalScore = studentList.reduce((acc, s) => acc + s.progress.score, 0);
  const avgScore = totalStudents > 0 ? (totalScore / totalStudents).toFixed(1) : '0';

  // Filter students
  const filtered = studentList.filter((s) => {
    const matchName =
      s.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.profile.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchName) return false;

    if (filterTab === 'active_now') {
      return activeNowList.some((act) => act.profile.id === s.profile.id);
    }
    if (filterTab === 'in_progress') {
      return s.progress.status === 'sedang_bermain' || (s.progress.completedQuestions.length > 0 && s.progress.completedQuestions.length < 25);
    }
    if (filterTab === 'completed') {
      return s.progress.status === 'selesai' || s.progress.completedQuestions.length >= 25;
    }
    if (filterTab === 'not_started') {
      return s.progress.status === 'belum_mulai' && s.progress.completedQuestions.length === 0;
    }
    return true;
  });

  // Sort students
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'last_active') {
      const timeA = a.progress.lastUpdated ? new Date(a.progress.lastUpdated).getTime() : 0;
      const timeB = b.progress.lastUpdated ? new Date(b.progress.lastUpdated).getTime() : 0;
      cmp = timeB - timeA;
      return sortAsc ? -cmp : cmp;
    }
    if (sortBy === 'score') {
      cmp = a.progress.score - b.progress.score;
    } else if (sortBy === 'progress') {
      cmp = a.progress.completedQuestions.length - b.progress.completedQuestions.length;
    } else if (sortBy === 'name') {
      cmp = a.profile.name.localeCompare(b.profile.name);
    } else if (sortBy === 'id') {
      cmp = a.profile.id.localeCompare(b.profile.id);
    }
    return sortAsc ? cmp : -cmp;
  });

  // Action handlers
  const handleExportCSV = () => {
    audioManager.playClickSound();
    exportStudentsToCSV(students);
  };

  const handlePlayAsStudent = (id: string) => {
    audioManager.playClickSound();
    onSelectStudent(id);
    onNavigate('board');
  };

  // Live test simulation to demonstrate instant real-time onSnapshot listener
  const handleSimulateLiveActivity = async () => {
    if (isSimulating || studentList.length === 0) return;
    setIsSimulating(true);
    audioManager.playClickSound();

    try {
      // Pick a random student or first student
      const randomIndex = Math.floor(Math.random() * Math.min(10, studentList.length));
      const targetStudent = studentList[randomIndex] || studentList[0];
      const randomQuestion = Math.floor(Math.random() * 25) + 1;
      const newScore = Math.min(250, targetStudent.progress.score + 10);

      // Log live activity
      await logActivityLive(
        targetStudent.profile.id,
        targetStudent.profile.name,
        'question_correct',
        `[LIVE DEMO] Menjawab BENAR Tantangan #${randomQuestion} (+10 Poin)`,
        newScore
      );

      // Also update student progress in Firestore
      const updatedStudent: StudentRecord = {
        ...targetStudent,
        progress: {
          ...targetStudent.progress,
          status: 'sedang_bermain',
          score: newScore,
          currentPosition: randomQuestion,
          completedQuestions: Array.from(new Set([...targetStudent.progress.completedQuestions, randomQuestion])),
          lastUpdated: new Date().toISOString(),
        },
      };
      await saveStudentToFirestore(updatedStudent);
      audioManager.playCorrectSound();
    } catch (err) {
      console.error('Error simulating live activity:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Helper to format friendly relative time
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Belum ada aktivitas';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 5) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} detik lalu`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return new Date(isoString).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-3 sm:px-6 bg-[#F8FAFC] text-[#123D68]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Live Real-time Status Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Real-time Listener Aktif (onSnapshot)</span>
              </span>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-sky-600 animate-pulse" />
                <span>Update Terakhir: {lastLiveTimestamp.toLocaleTimeString('id-ID')}</span>
              </span>
              <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                /dashboard-guru
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68]">
              Dashboard Guru — Pemantauan Siswa Live (Real-time)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Data ditarik langsung dari <strong>Firebase Cloud Firestore</strong> menggunakan{' '}
              <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-xs">
                onSnapshot()
              </code>
              . Tabel siswa otomatis terbarui seketika setiap siswa mengklik jawaban, membuka peta, atau mendapatkan nilai tanpa perlu me-refresh halaman!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Live Test simulation button */}
            <button
              onClick={handleSimulateLiveActivity}
              disabled={isSimulating}
              className={`font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isSimulating
                  ? 'bg-amber-100 border-amber-300 text-amber-800 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 border-amber-600 text-slate-900 active:scale-95'
              }`}
              title="Kirim 1 aktivitas simulasi siswa ke Firebase untuk menguji fungsi real-time onSnapshot"
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Mengirim Live...' : '⚡ Tes Simulasi Live'}</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="bg-[#21A447] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Unduh rekap nilai & data siswa lengkap ke format CSV"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>

            {/* Tombol Hapus Semua Riwayat Siswa (Dilindungi khusus ketika login dengan kode rahasia GURU4B) */}
            {isSecretGuruAuth && (
              <button
                onClick={() => {
                  audioManager.playClickSound();
                  setShowDeleteConfirmModal(true);
                }}
                className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-rose-700"
                title="Hapus seluruh data rekap nilai siswa dari localStorage"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Semua Riwayat Siswa</span>
              </button>
            )}

            {/* Back to Game */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('board');
              }}
              className="bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-600" />
              <span>Ke Papan Peta</span>
            </button>
          </div>
        </div>

        {/* Toast Notifikasi Hapus Berhasil */}
        {deleteToastMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl p-4 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-md animate-pop">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="flex-1 leading-snug">
              {deleteToastMessage}
            </div>
            <button
              onClick={() => setDeleteToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 bg-emerald-100 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Google Authentication Alert for Teachers */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-sky-50 via-amber-50 to-emerald-50 border-2 border-sky-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center text-xl shadow-xs shrink-0">
                ☁️
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-[#123D68] block text-sm sm:text-base">
                  Mode Live Firebase Firestore Aktif
                </span>
                <span className="text-slate-600">
                  Aplikasi sedang mendengarkan perubahan database secara langsung. Masuk dengan Google untuk mengelola data kelas dan melihat hak istimewa akun guru.
                </span>
              </div>
            </div>
            <button
              onClick={onSignInGoogle}
              className="bg-[#123D68] hover:bg-[#1b4b7c] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Akun Google</span>
            </button>
          </div>
        )}

        {/* Main Mode Guru Tabs: [1. Pemantauan Live Siswa | 2. Kelola Kode Siswa] */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border-2 border-slate-200 shadow-xs">
          <button
            onClick={() => {
              audioManager.playClickSound();
              setActiveMainTab('monitoring');
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMainTab === 'monitoring'
                ? 'bg-[#123D68] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Pemantauan Live Real-time</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              setActiveMainTab('manage_codes');
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeMainTab === 'manage_codes'
                ? 'bg-[#123D68] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Kelola Kode Siswa</span>
            <span className="bg-amber-100 text-amber-900 font-mono text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-300">
              {totalCodesCount} Siswa
            </span>
          </button>
        </div>

        {activeMainTab === 'manage_codes' ? (
          <ManageStudentCodesTab
            onPlayAsStudent={handlePlayAsStudent}
            onStudentAddedOrUpdated={handleStudentAddedOrUpdated}
          />
        ) : (
          <>
            {/* 4 Summary Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Siswa Aktif Sekarang */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-300 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                Siswa Aktif Live
              </span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#21A447] mt-2">
              {activeNowList.length} <span className="text-xs font-semibold text-slate-400">/ {totalStudents} Siswa</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              Sedang beraktivitas di peta saat ini
            </p>
          </div>

          {/* Card 2: Rata-rata Skor */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-xs">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              Rata-rata Skor Kelas
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-[#FF9F1C] mt-2">
              {avgScore} <span className="text-xs font-semibold text-slate-400">/ 250 Poin</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Maksimum 250 (10 Poin per soal benar)
            </p>
          </div>

          {/* Card 3: Ketuntasan Tantangan */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-sky-300 shadow-xs">
            <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wider">
              Ketuntasan 25 Soal
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-sky-700 mt-2">
              {completedCount}{' '}
              <span className="text-xs font-semibold text-slate-400">
                ({totalStudents > 0 ? ((completedCount / totalStudents) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {completedCount} tuntas, {inProgressCount} sedang bermain
            </p>
          </div>

          {/* Card 4: Total Aktivitas Live Terkirim */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-purple-300 shadow-xs">
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">
              Total Log Aktivitas Live
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-purple-800 mt-2">
              {liveActivities.length}{' '}
              <span className="text-xs font-semibold text-slate-400">Event Tercatat</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-1">
              Stream aktif otomatis tanpa refresh
            </p>
          </div>
        </div>

        {/* Live Stream Activity Ticker (Latest 6 activities received via onSnapshot) */}
        {liveActivities.length > 0 && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-sky-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-extrabold font-fredoka text-[#123D68] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Feed Aktivitas Siswa Secara Langsung (Live Ticker)</span>
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Otomatis bertambah saat siswa menjawab soal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {liveActivities.slice(0, 6).map((act) => (
                <div
                  key={act.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 text-xs ${
                    flashingStudentId === act.studentId
                      ? 'bg-amber-100 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-50 hover:bg-sky-50/60 border-slate-200'
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">
                    {act.activityType === 'question_correct'
                      ? '⭐'
                      : act.activityType === 'question_retry'
                      ? '🔄'
                      : act.activityType === 'puzzle_unlocked'
                      ? '🧩'
                      : act.activityType === 'badge_earned'
                      ? '🏅'
                      : act.activityType === 'game_completed'
                      ? '🏆'
                      : '🧭'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-[#123D68] truncate">
                        {act.studentName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-600 truncate font-medium mt-0.5">{act.description}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="font-bold text-emerald-700">Skor: {act.scoreAtTime} Poin</span>
                      <span className="text-slate-400">{new Date(act.timestamp).toLocaleTimeString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter, Search & Sort Control Bar */}
        <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau ID siswa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setFilterTab('all')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-[#123D68] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Siswa ({totalStudents})
            </button>
            <button
              onClick={() => setFilterTab('active_now')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'active_now'
                  ? 'bg-[#21A447] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sedang Aktif Live ({activeNowList.length})</span>
            </button>
            <button
              onClick={() => setFilterTab('in_progress')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === 'in_progress'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Sedang Bermain ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              Tuntas 25 Soal ({completedCount})
            </button>
            <button
              onClick={() => setFilterTab('not_started')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTab === 'not_started'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Belum Mulai ({notStartedCount})
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urut:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="last_active">Aktivitas Terkini</option>
              <option value="score">Skor Tertinggi</option>
              <option value="progress">Progres Soal</option>
              <option value="name">Nama Siswa</option>
              <option value="id">Nomor Urut</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              title="Balik Arah Urutan"
            >
              {sortAsc ? '⬆️' : '⬇️'}
            </button>
          </div>
        </div>

        {/* Live Updating Students Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-3 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Siswa & Identitas</th>
                  <th className="py-3.5 px-3 text-center">Status Real-time</th>
                  <th className="py-3.5 px-4">Aktivitas Terakhir (Live)</th>
                  <th className="py-3.5 px-3 text-center">Posisi Pion</th>
                  <th className="py-3.5 px-3 text-center">Soal Tuntas</th>
                  <th className="py-3.5 px-3 text-center">Skor Live</th>
                  <th className="py-3.5 px-3 text-center">Ketuntasan</th>
                  <th className="py-3.5 px-3 text-center">Percobaan</th>
                  <th className="py-3.5 px-3 text-center">Puzzle</th>
                  <th className="py-3.5 px-3 text-center">GROW MAP</th>
                  <th className="py-3.5 px-4 text-center">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                          📭
                        </div>
                        <div className="text-slate-800 font-extrabold text-base">
                          Tabel Rekap Nilai Siswa Kosong
                        </div>
                        <p className="text-slate-500 text-xs max-w-md font-medium">
                          Seluruh data rekap nilai siswa telah dihapus dari memori lokal (localStorage). Tabel telah disegarkan menjadi kosong kembali.
                        </p>
                        <button
                          type="button"
                          onClick={handleRestoreRoster}
                          className="mt-2 text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Muat Ulang 37 Siswa Kelas IV B (Reset Skor 0)</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-slate-400 font-bold">
                      Tidak ada siswa yang sesuai dengan filter atau kata kunci pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map((st, index) => {
                    const prog = st.progress;
                    const correct = prog.completedQuestions.length;
                    const pct = ((correct / 25) * 100).toFixed(0);
                    const attempts = Object.values(prog.attempts).reduce((a, b) => a + b, 0);
                    const latestAct = latestActivityByStudent[st.profile.id];
                    const isFlashing = flashingStudentId === st.profile.id;

                    const isCurrentlyActive =
                      prog.status === 'sedang_bermain' ||
                      (latestAct && Date.now() - new Date(latestAct.timestamp).getTime() < 20 * 60 * 1000);

                    return (
                      <tr
                        key={st.profile.id}
                        className={`transition-colors duration-500 ${
                          isFlashing
                            ? 'bg-amber-100/80 animate-pulse'
                            : isCurrentlyActive
                            ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                            : 'hover:bg-sky-50/40'
                        }`}
                      >
                        {/* No */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>

                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-[#123D68] flex items-center gap-2">
                            <span className="text-base">
                              {st.profile.avatar.startsWith('girl') ? '👧' : '👦'}
                            </span>
                            <span>{st.profile.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{st.profile.grade}</span>
                            <span>•</span>
                            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                              🔑 {STUDENT_CODES.find((c) => c.id === st.profile.id)?.code || st.profile.id}
                            </span>
                          </div>
                        </td>

                        {/* Status Real-time */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {prog.status === 'selesai' || correct >= 25 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Selesai</span>
                            </span>
                          ) : isCurrentlyActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              <span>Aktif Sekarang</span>
                            </span>
                          ) : prog.status === 'sedang_bermain' || correct > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <span>Bermain</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                              <span>Belum Mulai</span>
                            </span>
                          )}
                        </td>

                        {/* Live Activity Column */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {latestAct ? (
                            <div>
                              <div className="font-bold text-[#123D68] text-xs truncate flex items-center gap-1">
                                <span>{latestAct.description}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(latestAct.timestamp)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-400 text-xs italic">
                              {formatTimeAgo(prog.lastUpdated)}
                            </div>
                          )}
                        </td>

                        {/* Current Position */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                            Titik #{prog.currentPosition || 1}
                          </span>
                        </td>

                        {/* Completed Questions */}
                        <td className="py-3.5 px-3 text-center font-extrabold text-slate-700">
                          {correct} / 25
                        </td>

                        {/* Live Score */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-black text-[#21A447] text-sm">
                            {prog.score}
                          </span>
                        </td>

                        {/* Progress Bar & Percentage */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-extrabold text-xs">{pct}%</span>
                            <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="bg-[#21A447] h-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Attempts */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-600">
                          {attempts > 0 ? `${attempts}x` : '—'}
                        </td>

                        {/* Puzzle Pieces */}
                        <td className="py-3.5 px-3 text-center font-extrabold text-purple-700">
                          {prog.unlockedPuzzlePieces.length} / 6
                        </td>

                        {/* GROW MAP Indicators */}
                        <td className="py-3.5 px-3 text-center text-[10px]">
                          <div className="flex items-center justify-center gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded font-extrabold ${
                                prog.initialGrowMapCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                              title="GROW MAP Asesmen Awal"
                            >
                              Awal: {prog.initialGrowMapCompleted ? '✅' : '⏳'}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-extrabold ${
                                prog.finalGrowMapCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                              title="GROW MAP Asesmen Akhir"
                            >
                              Akhir: {prog.finalGrowMapCompleted ? '✅' : '⏳'}
                            </span>
                          </div>
                        </td>

                        {/* Teacher Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Inspect Detail */}
                            <button
                              onClick={() => {
                                audioManager.playClickSound();
                                setInspectStudent(st);
                              }}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                              title="Buka Rapor & Analisis Jawaban Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Play as student */}
                            <button
                              onClick={() => handlePlayAsStudent(st.profile.id)}
                              className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition-all cursor-pointer"
                              title="Dampingi / Buka Permainan Sebagai Siswa Ini"
                            >
                              <Play className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Footer Box on onSnapshot mechanism */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-900 font-medium">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Real-time Listener Status:</strong> Terkoneksi ke koleksi{' '}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200">/students</code> dan{' '}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200">/activities</code>. Setiap perubahan data di Firestore langsung memicu pembaruan tabel secara instan tanpa perlu memuat ulang peramban.
            </span>
          </div>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onNavigate('teacher_settings');
            }}
            className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Pengaturan Kelas & Audio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
          </>
        )}
      </div>

      {/* Modal Inspector Detail */}
      <StudentDetailModal
        studentRecord={inspectStudent}
        onClose={() => setInspectStudent(null)}
        onPlayAsStudent={handlePlayAsStudent}
      />

      {/* Pop-up Pengingat Konfirmasi Hapus Semua Riwayat Siswa */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-rose-300 animate-pop relative">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-3xl mx-auto mb-4 text-rose-600">
              ⚠️
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-fredoka text-slate-900 text-center mb-2">
              Konfirmasi Hapus Data
            </h3>

            <p className="text-sm sm:text-base font-extrabold text-slate-800 text-center leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus semua data rekap nilai siswa?
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-6 text-xs text-rose-900 leading-normal font-medium">
              Sistem akan menghapus seluruh data rekap nilai siswa yang tersimpan di <strong>localStorage</strong> dan otomatis menyegarkan tabel dashboard menjadi kosong kembali.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  audioManager.playClickSound();
                  setShowDeleteConfirmModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteAllRecap}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-rose-800"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
