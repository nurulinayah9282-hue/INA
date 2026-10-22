import React, { useState, useEffect, useRef } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { exportStudentsToCSV } from '../utils/storage';
import { StudentDetailModal } from './StudentDetailModal';
import {
  subscribeToStudents,
  subscribeToLiveActivities,
  LiveActivityItem,
  saveStudentToFirestore,
} from '../lib/firestoreService';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Users,
  Search,
  Filter,
  Download,
  Settings,
  ArrowUpDown,
  Home,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Eye,
  Play,
  TrendingUp,
  Cloud,
  RefreshCw,
  Activity,
  LogIn,
  LogOut,
  Radio,
  Zap,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface TeacherDashboardLiveProps {
  initialStudents: Record<string, StudentRecord>;
  onSelectStudent: (studentId: string) => void;
  onNavigate: (page: NavigationPage) => void;
  currentUser: FirebaseUser | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
}

export const TeacherDashboardLive: React.FC<TeacherDashboardLiveProps> = ({
  initialStudents,
  onSelectStudent,
  onNavigate,
  currentUser,
  onSignInGoogle,
  onSignOut,
}) => {
  const [students, setStudents] = useState<Record<string, StudentRecord>>(initialStudents);
  const [liveActivities, setLiveActivities] = useState<LiveActivityItem[]>([]);
  const [isListenerActive, setIsListenerActive] = useState<boolean>(true);
  const [lastEventTime, setLastEventTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active_now' | 'sedang_bermain' | 'selesai'>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'name' | 'id'>('recent');
  const [sortAsc, setSortAsc] = useState(false);
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);
  const [showLiveStream, setShowLiveStream] = useState(true);
  const [recentlyUpdatedStudentId, setRecentlyUpdatedStudentId] = useState<string | null>(null);

  // Sound effect when new activity arrives
  const isFirstLoad = useRef(true);

  // Setup Firestore onSnapshot listener for students & activities
  useEffect(() => {
    // Sync browser URL to /dashboard-guru
    if (window.location.pathname !== '/dashboard-guru') {
      window.history.pushState(null, '', '/dashboard-guru');
    }

    setIsListenerActive(true);

    // 1. Live onSnapshot Listener for /students collection
    const unsubStudents = subscribeToStudents((cloudStudents) => {
      setStudents((prev) => {
        // Find which student changed to highlight row
        Object.keys(cloudStudents).forEach((sId) => {
          if (
            prev[sId] &&
            (prev[sId].progress.score !== cloudStudents[sId].progress.score ||
              prev[sId].progress.completedQuestions.length !== cloudStudents[sId].progress.completedQuestions.length)
          ) {
            setRecentlyUpdatedStudentId(sId);
            setTimeout(() => setRecentlyUpdatedStudentId(null), 3000);
          }
        });
        return { ...prev, ...cloudStudents };
      });
      setLastEventTime(new Date());
    });

    // 2. Live onSnapshot Listener for /activities collection
    const unsubActivities = subscribeToLiveActivities(30, (activities) => {
      setLiveActivities(activities);
      setLastEventTime(new Date());
      if (!isFirstLoad.current && activities.length > 0) {
        // Friendly subtle chime when live event arrives
        audioManager.playClickSound();
      }
      isFirstLoad.current = false;
    });

    return () => {
      if (unsubStudents) unsubStudents();
      if (unsubActivities) unsubActivities();
      setIsListenerActive(false);
    };
  }, []);

  const studentList = Object.values(students);

  // Map each student to their latest activity from the live stream
  const studentLatestActivityMap: Record<string, LiveActivityItem> = {};
  liveActivities.forEach((act) => {
    if (!studentLatestActivityMap[act.studentId]) {
      studentLatestActivityMap[act.studentId] = act;
    }
  });

  // Calculate live metrics
  const totalStudents = studentList.length;
  const completedCount = studentList.filter((s) => s.progress.status === 'selesai').length;
  const inProgressCount = studentList.filter((s) => s.progress.status === 'sedang_bermain').length;

  // Active in last 15 minutes
  const activeNowThreshold = Date.now() - 15 * 60 * 1000;
  const activeNowCount = studentList.filter((s) => {
    const actTime = studentLatestActivityMap[s.profile.id]?.timestamp;
    const lastUpd = s.progress.lastUpdated ? new Date(s.progress.lastUpdated).getTime() : 0;
    const actTimestamp = actTime ? new Date(actTime).getTime() : 0;
    return Math.max(lastUpd, actTimestamp) >= activeNowThreshold;
  }).length;

  const totalScores = studentList.reduce((acc, s) => acc + s.progress.score, 0);
  const averageScore = totalStudents > 0 ? (totalScores / totalStudents).toFixed(1) : '0';

  // Filter & Search
  let filtered = studentList.filter((s) => {
    const matchName = s.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchName) return false;

    if (statusFilter === 'active_now') {
      const actTime = studentLatestActivityMap[s.profile.id]?.timestamp;
      const lastUpd = s.progress.lastUpdated ? new Date(s.progress.lastUpdated).getTime() : 0;
      const actTimestamp = actTime ? new Date(actTime).getTime() : 0;
      return Math.max(lastUpd, actTimestamp) >= activeNowThreshold || s.progress.status === 'sedang_bermain';
    }
    if (statusFilter === 'sedang_bermain') return s.progress.status === 'sedang_bermain';
    if (statusFilter === 'selesai') return s.progress.status === 'selesai';

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'recent') {
      const timeA = studentLatestActivityMap[a.profile.id]?.timestamp
        ? new Date(studentLatestActivityMap[a.profile.id].timestamp).getTime()
        : new Date(a.progress.lastUpdated || 0).getTime();
      const timeB = studentLatestActivityMap[b.profile.id]?.timestamp
        ? new Date(studentLatestActivityMap[b.profile.id].timestamp).getTime()
        : new Date(b.progress.lastUpdated || 0).getTime();
      cmp = timeB - timeA;
    } else if (sortBy === 'score') {
      cmp = b.progress.score - a.progress.score;
    } else if (sortBy === 'name') {
      cmp = a.profile.name.localeCompare(b.profile.name);
    } else if (sortBy === 'id') {
      cmp = a.profile.id.localeCompare(b.profile.id);
    }
    return sortAsc ? -cmp : cmp;
  });

  const handleExportCSV = () => {
    audioManager.playClickSound();
    exportStudentsToCSV(students);
  };

  const handlePlayAsStudent = (id: string) => {
    audioManager.playClickSound();
    onSelectStudent(id);
    window.history.pushState(null, '', '/');
    onNavigate('board');
  };

  const formatTimeAgo = (isoDate?: string) => {
    if (!isoDate) return '—';
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 30) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} dtk lalu`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} jam lalu`;
    return new Date(isoDate).toLocaleDateString('id-ID');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-3 sm:px-6 bg-slate-50 text-[#123D68]">
      <div className="max-w-7xl mx-auto">
        {/* Top Header with Live Real-time Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>LIVE onSnapshot Listener Aktif</span>
              </span>
              <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-sky-300">
                URL: /dashboard-guru
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Pembaruan Terakhir: {lastEventTime.toLocaleTimeString('id-ID')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-fredoka text-[#123D68]">
              Dashboard Guru Live — Pemantauan Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tabel otomatis terbarui secara langsung dari Firebase Cloud Firestore setiap ada aktivitas baru masuk tanpa perlu refresh halaman.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Google Authentication status button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white border-2 border-emerald-300 rounded-xl px-3 py-1.5 shadow-xs">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full border" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName?.[0] || 'G'}
                  </div>
                )}
                <div className="text-left text-xs leading-tight">
                  <span className="font-bold text-[#123D68] block">
                    {currentUser.displayName?.split(' ')[0] || 'Guru'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-extrabold block">Terautentikasi</span>
                </div>
                <button
                  onClick={onSignOut}
                  title="Keluar Google"
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInGoogle}
                className="bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-sky-600" />
                <span>Masuk dengan Google</span>
              </button>
            )}

            <button
              onClick={() => {
                audioManager.playClickSound();
                window.history.pushState(null, '', '/');
                onNavigate('board');
              }}
              className="bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Ke Halaman Game</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-[#21A447] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Unduh file CSV untuk Excel / Google Sheets"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClickSound();
                onNavigate('teacher_settings');
              }}
              className="bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>
          </div>
        </div>

        {/* 4 Real-time Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Siswa Aktif Sekarang</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#21A447] mt-1">
              {activeNowCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ {totalStudents} Siswa</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {inProgressCount} sedang dalam permainan
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
            <div className="text-xs font-bold text-amber-800 uppercase">Rata-rata Skor Kelas</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#FF9F1C] mt-1">
              {averageScore}{' '}
              <span className="text-xs font-normal text-slate-400">/ 250 Poin</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Diperbarui otomatis tiap jawaban benar (+10)
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 shadow-xs">
            <div className="text-xs font-bold text-sky-800 uppercase">Ketuntasan Tantangan</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#55C7F2] mt-1">
              {((completedCount / (totalStudents || 1)) * 100).toFixed(0)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {completedCount} siswa telah menuntaskan 25 soal
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs">
            <div className="text-xs font-bold text-purple-800 uppercase">Aktivitas Live Masuk</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-purple-900 mt-1">
              {liveActivities.length}{' '}
              <span className="text-xs font-normal text-slate-400">event</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Real-time Firestore stream
            </div>
          </div>
        </div>

        {/* Real-time Streaming Activity Ticker */}
        {liveActivities.length > 0 && (
          <div className="bg-white border-2 border-sky-300 rounded-3xl p-4 sm:p-5 mb-6 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold font-fredoka text-[#123D68] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Streaming Log Aktivitas Live (Firestore Collection: /activities)</span>
                </h3>
              </div>
              <button
                onClick={() => setShowLiveStream(!showLiveStream)}
                className="text-xs text-sky-700 font-bold hover:underline"
              >
                {showLiveStream ? 'Sembunyikan' : 'Tampilkan Ticker'} ({liveActivities.length})
              </button>
            </div>

            {showLiveStream && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1">
                {liveActivities.slice(0, 9).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-50 to-white border border-sky-100 flex items-start gap-2.5 text-xs shadow-xs animate-pop"
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
                      <div className="font-extrabold text-[#123D68] truncate flex items-center justify-between">
                        <span>{act.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTimeAgo(act.timestamp)}
                        </span>
                      </div>
                      <div className="text-slate-600 truncate text-[11px] font-medium">
                        {act.description}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        Skor: {act.scoreAtTime} Poin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filter & Search Controls */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#123D68] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({totalStudents})
            </button>
            <button
              onClick={() => setStatusFilter('active_now')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'active_now'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aktif Sekarang ({activeNowCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('sedang_bermain')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'sedang_bermain'
                  ? 'bg-[#FF9F1C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sedang Bermain ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('selesai')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'selesai'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Selesai ({completedCount})
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="recent">Aktivitas Terkini</option>
              <option value="score">Skor Tertinggi</option>
              <option value="name">Nama Siswa</option>
              <option value="id">Nomor Urut</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              title="Balik Urutan"
            >
              {sortAsc ? '⬆️' : '⬇️'}
            </button>
          </div>
        </div>

        {/* Live-Updating Students Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/90 border-b text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-3 text-center">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-3 text-center">Status Live</th>
                  <th className="py-3 px-4">Aktivitas Terakhir</th>
                  <th className="py-3 px-3 text-center">Waktu</th>
                  <th className="py-3 px-3 text-center">Skor Live</th>
                  <th className="py-3 px-3 text-center">Soal Tuntas</th>
                  <th className="py-3 px-3 text-center">Ketuntasan</th>
                  <th className="py-3 px-3 text-center">Percobaan</th>
                  <th className="py-3 px-3 text-center">Puzzle</th>
                  <th className="py-3 px-4 text-center">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((st, index) => {
                  const prog = st.progress;
                  const correct = prog.completedQuestions.length;
                  const pct = ((correct / 25) * 100).toFixed(0);
                  const attempts = Object.values(prog.attempts).reduce((a, b) => a + b, 0);
                  const latestAct = studentLatestActivityMap[st.profile.id];
                  const isRecentlyUpdated = recentlyUpdatedStudentId === st.profile.id;

                  // Check if active recently
                  const actTime = latestAct?.timestamp || prog.lastUpdated;
                  const isRecentlyActive = actTime
                    ? Date.now() - new Date(actTime).getTime() <= 15 * 60 * 1000
                    : false;

                  return (
                    <tr
                      key={st.profile.id}
                      className={`transition-colors duration-500 ${
                        isRecentlyUpdated
                          ? 'bg-amber-100/90'
                          : isRecentlyActive
                          ? 'bg-emerald-50/40 hover:bg-emerald-50'
                          : 'hover:bg-sky-50/40'
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#123D68] flex items-center gap-2">
                          <span className="text-base">
                            {st.profile.avatar.startsWith('girl') ? '👧' : '👦'}
                          </span>
                          <span className="font-extrabold">{st.profile.name}</span>
                          {isRecentlyUpdated && (
                            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                              Baru!
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.profile.grade} • ID: {st.profile.id}
                        </div>
                      </td>

                      {/* Live Status indicator */}
                      <td className="py-3 px-3 text-center">
                        {isRecentlyActive ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Aktif</span>
                          </span>
                        ) : prog.status === 'selesai' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                            Selesai
                          </span>
                        ) : prog.status === 'sedang_bermain' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Bermain
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Latest Activity */}
                      <td className="py-3 px-4 max-w-xs truncate">
                        {latestAct ? (
                          <div className="text-xs">
                            <span className="font-bold text-[#123D68] block truncate">
                              {latestAct.description}
                            </span>
                          </div>
                        ) : prog.completedQuestions.length > 0 ? (
                          <span className="text-xs text-slate-600">
                            Menyelesaikan {prog.completedQuestions.length} tantangan
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum ada aktivitas</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-3 text-center text-xs text-slate-500 whitespace-nowrap">
                        {formatTimeAgo(latestAct?.timestamp || prog.lastUpdated)}
                      </td>

                      {/* Live Score */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-[#21A447] text-sm sm:text-base">
                          {prog.score}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">/ 250</span>
                      </td>

                      {/* Questions Solved */}
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {correct} / 25
                      </td>

                      {/* Progress bar */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-xs">{pct}%</span>
                          <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-[#21A447] h-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Attempts count */}
                      <td className="py-3 px-3 text-center text-slate-600 font-bold">
                        {attempts > 0 ? `${attempts}x` : '—'}
                      </td>

                      {/* Puzzle count */}
                      <td className="py-3 px-3 text-center font-bold text-purple-700">
                        {prog.unlockedPuzzlePieces.length} / 6
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setInspectStudent(st)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                            title="Lihat Detail Rapor Siswa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handlePlayAsStudent(st.profile.id)}
                            className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition-all cursor-pointer"
                            title="Masuk Sebagai Siswa Ini"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Inspector Detail */}
      <StudentDetailModal
        studentRecord={inspectStudent}
        onClose={() => setInspectStudent(null)}
        onPlayAsStudent={handlePlayAsStudent}
      />
    </div>
  );
};
