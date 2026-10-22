import React, { useState } from 'react';
import { NavigationPage, StudentRecord } from '../types';
import { exportStudentsToCSV } from '../utils/storage';
import { StudentDetailModal } from './StudentDetailModal';
import { LiveActivityItem } from '../lib/firestoreService';
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
  KeyRound,
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { ManageStudentCodesTab } from './ManageStudentCodesTab';
import { getAllStudentCodes } from '../data/studentCodes';

interface TeacherDashboardProps {
  students: Record<string, StudentRecord>;
  onSelectStudent: (studentId: string) => void;
  onNavigate: (page: NavigationPage) => void;
  liveActivities?: LiveActivityItem[];
  isCloudConnected?: boolean;
  onManualSync?: () => void;
  currentUser?: FirebaseUser | null;
  onSignInGoogle?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  onSelectStudent,
  onNavigate,
  liveActivities = [],
  isCloudConnected = false,
  onManualSync,
  currentUser,
  onSignInGoogle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'belum_mulai' | 'sedang_bermain' | 'selesai'>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'score' | 'progress'>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);
  const [showLiveStream, setShowLiveStream] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [teacherMainTab, setTeacherMainTab] = useState<'recap' | 'codes'>('recap');

  const studentList = Object.values(students);

  // Class statistics
  const totalStudents = studentList.length;
  const completedCount = studentList.filter((s) => s.progress.status === 'selesai').length;
  const inProgressCount = studentList.filter((s) => s.progress.status === 'sedang_bermain').length;
  const notStartedCount = studentList.filter((s) => s.progress.status === 'belum_mulai').length;

  const totalScores = studentList.reduce((acc, s) => acc + s.progress.score, 0);
  const averageScore = totalStudents > 0 ? (totalScores / totalStudents).toFixed(1) : '0';

  const totalAttempts = studentList.reduce(
    (acc, s) => acc + Object.values(s.progress.attempts).reduce((a, b) => a + b, 0),
    0
  );
  const averageAttempts = totalStudents > 0 ? (totalAttempts / totalStudents).toFixed(1) : '0';

  // Filter & Search
  let filtered = studentList.filter((s) => {
    const matchName = s.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.progress.status === statusFilter;
    return matchName && matchStatus;
  });

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'id') cmp = a.profile.id.localeCompare(b.profile.id);
    else if (sortBy === 'name') cmp = a.profile.name.localeCompare(b.profile.name);
    else if (sortBy === 'score') cmp = a.progress.score - b.progress.score;
    else if (sortBy === 'progress')
      cmp = a.progress.completedQuestions.length - b.progress.completedQuestions.length;

    return sortAsc ? cmp : -cmp;
  });

  const handleExportCSV = () => {
    audioManager.playClickSound();
    exportStudentsToCSV(students);
  };

  const handlePlayAsStudent = (id: string) => {
    audioManager.playClickSound();
    onSelectStudent(id);
    onNavigate('board');
  };

  const handleSyncClick = async () => {
    if (onManualSync) {
      setSyncing(true);
      audioManager.playClickSound();
      await onManualSync();
      setTimeout(() => setSyncing(false), 800);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] py-6 sm:py-8 px-3 sm:px-6 bg-slate-50 text-[#123D68]">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Ruang Pengelolaan & Pemantauan Guru</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68]">
              Dashboard Guru — Rekap Kelas IV
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Memantau perkembangan 37 siswa, perolehan skor, puzzle, badge, dan hasil refleksi GROW MAP secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Cloud Firestore Status button */}
            <button
              onClick={handleSyncClick}
              disabled={syncing}
              className={`border-2 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isCloudConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
              title="Sinkronkan data dengan Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Menyinkronkan...' : isCloudConnected ? 'Cloud Firestore Aktif' : 'Sinkronkan Cloud'}</span>
            </button>

            <button
              onClick={() => {
                audioManager.playClickSound();
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
              <span>Ekspor Data CSV</span>
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

        {/* Main Tab Switcher in Mode Guru */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border-2 border-slate-200 mb-6 shadow-xs">
          <button
            onClick={() => {
              audioManager.playClickSound();
              setTeacherMainTab('recap');
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              teacherMainTab === 'recap'
                ? 'bg-[#123D68] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Rekap & Pemantauan Progres</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              setTeacherMainTab('codes');
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              teacherMainTab === 'codes'
                ? 'bg-[#123D68] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Kelola Kode Siswa</span>
            <span className="bg-amber-100 text-amber-900 font-mono text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-300">
              {getAllStudentCodes().length} Siswa
            </span>
          </button>
        </div>

        {teacherMainTab === 'codes' ? (
          <ManageStudentCodesTab onPlayAsStudent={handlePlayAsStudent} />
        ) : (
          <>
            {/* Live Activity Stream & Google Auth Alert */}
            {!currentUser && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center font-bold text-lg shrink-0">
                ☁️
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-[#123D68] block">
                  Aktifkan Google Authentication untuk Sinkronisasi Live Firestore
                </span>
                <span className="text-slate-600">
                  Masuk dengan akun Google agar setiap klik jawaban dan nilai siswa otomatis terkirim langsung ke database Cloud Firestore.
                </span>
              </div>
            </div>
            {onSignInGoogle && (
              <button
                onClick={onSignInGoogle}
                className="bg-[#21A447] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Google Sekarang</span>
              </button>
            )}
          </div>
        )}

        {/* Real-time Activity Ticker */}
        {liveActivities.length > 0 && (
          <div className="bg-white border-2 border-sky-200 rounded-3xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold font-fredoka text-[#123D68] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Aktivitas Live Siswa (Cloud Firestore Stream)</span>
                </h3>
              </div>
              <button
                onClick={() => setShowLiveStream(!showLiveStream)}
                className="text-xs text-sky-700 font-bold hover:underline"
              >
                {showLiveStream ? 'Sembunyikan' : 'Tampilkan'} ({liveActivities.length})
              </button>
            </div>

            {showLiveStream && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {liveActivities.slice(0, 9).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2 text-xs"
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {act.activityType === 'question_correct'
                        ? '⭐'
                        : act.activityType === 'puzzle_unlocked'
                        ? '🧩'
                        : act.activityType === 'badge_earned'
                        ? '🏅'
                        : act.activityType === 'game_completed'
                        ? '🏆'
                        : '🧭'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-[#123D68] truncate">
                        {act.studentName}
                      </div>
                      <div className="text-slate-600 truncate">{act.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Siswa Terdaftar</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#123D68] mt-1">
              {totalStudents} <span className="text-xs font-normal text-slate-400">Siswa</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {completedCount} Selesai • {inProgressCount} Sedang Main
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
            <div className="text-xs font-bold text-amber-800 uppercase">Rata-rata Skor Kelas</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#FF9F1C] mt-1">
              {averageScore}{' '}
              <span className="text-xs font-normal text-slate-400">/ 250 Poin</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Skor Maksimum: 250 (10 Poin / Soal)
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs">
            <div className="text-xs font-bold text-emerald-800 uppercase">Ketuntasan Tantangan</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-[#21A447] mt-1">
              {((completedCount / totalStudents) * 100).toFixed(0)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {completedCount} dari {totalStudents} menyelesaikan 25 soal
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs">
            <div className="text-xs font-bold text-purple-800 uppercase">Rata-rata Percobaan</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-fredoka text-purple-900 mt-1">
              {averageAttempts}{' '}
              <span className="text-xs font-normal text-slate-400">kali</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Mencerminkan semangat pantang menyerah
            </div>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
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

          {/* Status filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['ALL', 'belum_mulai', 'sedang_bermain', 'selesai'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#123D68] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? `Semua (${totalStudents})`
                  : st === 'selesai'
                  ? `Selesai (${completedCount})`
                  : st === 'sedang_bermain'
                  ? `Sedang Bermain (${inProgressCount})`
                  : `Belum Mulai (${notStartedCount})`}
              </button>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="id">Nomor Urut</option>
              <option value="name">Nama Siswa</option>
              <option value="score">Skor Tertinggi</option>
              <option value="progress">Progres Soal</option>
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

        {/* 37 Students Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/80 border-b text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-3 text-center">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Soal Tuntas</th>
                  <th className="py-3 px-3 text-center">Skor</th>
                  <th className="py-3 px-3 text-center">Ketuntasan</th>
                  <th className="py-3 px-3 text-center">Percobaan</th>
                  <th className="py-3 px-3 text-center">Puzzle</th>
                  <th className="py-3 px-3 text-center">GROW MAP</th>
                  <th className="py-3 px-4 text-center">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((st, index) => {
                  const prog = st.progress;
                  const correct = prog.completedQuestions.length;
                  const pct = ((correct / 25) * 100).toFixed(0);
                  const attempts = Object.values(prog.attempts).reduce((a, b) => a + b, 0);

                  return (
                    <tr
                      key={st.profile.id}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#123D68] flex items-center gap-2">
                          <span>{st.profile.avatar.startsWith('girl') ? '👧' : '👦'}</span>
                          <span>{st.profile.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.profile.grade} • ID: {st.profile.id}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            prog.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prog.status === 'sedang_bermain'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {prog.status === 'selesai'
                            ? 'Selesai'
                            : prog.status === 'sedang_bermain'
                            ? 'Bermain'
                            : 'Belum'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {correct} / 25
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-[#21A447]">{prog.score}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-xs">{pct}%</span>
                          <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-[#21A447] h-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-bold">
                        {attempts > 0 ? `${attempts}x` : '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-purple-700">
                        {prog.unlockedPuzzlePieces.length} / 6
                      </td>
                      <td className="py-3 px-3 text-center text-[11px]">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              prog.initialGrowMapCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                            title="GROW MAP Awal"
                          >
                            Awal: {prog.initialGrowMapCompleted ? '✅' : '⏳'}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              prog.finalGrowMapCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                            title="GROW MAP Akhir"
                          >
                            Akhir: {prog.finalGrowMapCompleted ? '✅' : '⏳'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail button */}
                          <button
                            onClick={() => setInspectStudent(st)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                            title="Lihat Detail Rapor Siswa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Play as student */}
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
        </>
      )}
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
