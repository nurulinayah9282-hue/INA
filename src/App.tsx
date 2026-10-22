import React, { useState, useEffect, useRef } from 'react';
import { NavigationPage, StudentRecord } from './types';
import {
  getStoredStudents,
  saveStoredStudents,
  getActiveStudentId,
  setActiveStudentId,
  getStoredSettings,
  saveStoredSettings,
  AppSettings,
  recordQuestionAttempt,
  resetStudentProgress,
} from './utils/storage';
import { audioManager } from './utils/audio';

// Firebase Auth & Firestore Services
import { auth, signInWithGoogle, signOutUser, testFirestoreConnection } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  logActivityLive,
  saveStudentToFirestore,
  bootstrapStudentsInFirestore,
  subscribeToStudents,
  subscribeToLiveActivities,
  syncUserProfile,
  saveSettingsToFirestore,
  LiveActivityItem,
} from './lib/firestoreService';

// Components
import { Header } from './components/Header';
import { CoverPage } from './components/CoverPage';
import { InstructionsPage } from './components/InstructionsPage';
import { ProfilePage } from './components/ProfilePage';
import { GrowMapPage } from './components/GrowMapPage';
import { GameBoard } from './components/GameBoard';
import { DiceRoller } from './components/DiceRoller';
import { MaterialPage } from './components/MaterialPage';
import { ChallengeCard } from './components/ChallengeCard';
import { PuzzleCollection } from './components/PuzzleCollection';
import { BadgesPage } from './components/BadgesPage';
import { ReflectionPage } from './components/ReflectionPage';
import { FinalResultPage } from './components/FinalResultPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherSettings } from './components/TeacherSettings';
import { DashboardGuruLivePage } from './components/DashboardGuruLivePage';
import { CodeLoginPage } from './components/CodeLoginPage';
import { BattleExplorersPage } from './components/battle/BattleExplorersPage';
import { StudentCodeEntry } from './data/studentCodes';
import { createDefaultProgress } from './data/defaultStudents';
import { Users } from 'lucide-react';

const FALLBACK_STUDENT_RECORD: StudentRecord = {
  profile: {
    id: 'siswa_tamu',
    name: 'Petualang Cilik',
    grade: 'IV B',
    avatar: 'boy1',
  },
  progress: createDefaultProgress(),
};

export const App: React.FC = () => {
  const [students, setStudents] = useState<Record<string, StudentRecord>>(() => getStoredStudents());
  const [activeStudentIdState, setActiveStudentIdState] = useState<string>(() => getActiveStudentId());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [currentPage, setCurrentPage] = useState<NavigationPage>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/dashboard-guru' || path === '/dashboard_guru') {
        return 'dashboard_guru';
      }
      const savedLogin = localStorage.getItem('grow_puzzle_code_logged_in');
      if (savedLogin === 'true') {
        return 'board';
      }
    }
    return 'login';
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);

  // Teacher Authentication (Unlocked exclusively by GURU4B secret code)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('grow_puzzle_teacher_auth_code') === 'GURU4B';
  });

  // Firebase state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [liveActivities, setLiveActivities] = useState<LiveActivityItem[]>([]);
  const hasLoggedBootActivity = useRef(false);

  // Sync audioManager with sound setting on mount
  useEffect(() => {
    audioManager.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Current active student with guaranteed safe fallback
  const activeRecord: StudentRecord =
    students[activeStudentIdState] ||
    Object.values(students)[0] ||
    FALLBACK_STUDENT_RECORD;

  // Test Firestore Connection and listen to Auth state changes
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsCloudConnected(connected);
      if (connected) {
        bootstrapStudentsInFirestore(students);
      }
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsCloudConnected(true);
        try {
          await syncUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          await bootstrapStudentsInFirestore(students);

          if (!hasLoggedBootActivity.current) {
            hasLoggedBootActivity.current = true;
            if (activeRecord && activeRecord.profile && activeRecord.profile.id !== 'siswa_tamu') {
              await logActivityLive(
                activeRecord.profile.id,
                activeRecord.profile.name,
                'app_opened',
                `Siswa ${activeRecord.profile.name} membuka aplikasi petualangan peta`,
                activeRecord.progress.score
              );
            }
          }
        } catch (e) {
          console.error('Error during initial user sync:', e);
        }
      }
    });

    // Handle browser popstate (back/forward button)
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/dashboard-guru' || path === '/dashboard_guru') {
        setCurrentPage('dashboard_guru');
      } else {
        setCurrentPage('board');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Listen to real-time Firestore synchronization when user is signed in
  useEffect(() => {
    if (!currentUser) return;

    const unsubStudents = subscribeToStudents((cloudStudents) => {
      setStudents((prev) => {
        const merged = { ...prev, ...cloudStudents };
        saveStoredStudents(merged);
        return merged;
      });
    });

    const unsubActivities = subscribeToLiveActivities(25, (activities) => {
      setLiveActivities(activities);
    });

    return () => {
      if (unsubStudents) unsubStudents();
      if (unsubActivities) unsubActivities();
    };
  }, [currentUser]);

  const handleNavigate = (page: NavigationPage) => {
    audioManager.stopSpeech();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync URL with browser location
    if (page === 'dashboard_guru' || page === 'teacher_dashboard') {
      if (window.location.pathname !== '/dashboard-guru') {
        window.history.pushState(null, '', '/dashboard-guru');
      }
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    const newSettings = { ...settings, soundEnabled: nextSound };
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    audioManager.setMuted(!nextSound);
    if (currentUser) {
      saveSettingsToFirestore(newSettings);
    }
  };

  const handleSelectStudent = (id: string) => {
    setActiveStudentIdState(id);
    setActiveStudentId(id);
    const chosen = students[id];
    if (chosen) {
      logActivityLive(
        chosen.profile.id,
        chosen.profile.name,
        'app_opened',
        `Beralih ke siswa: ${chosen.profile.name}`,
        chosen.progress.score
      );
    }
  };

  const handleUpdateProfile = (id: string, name: string, grade: string, avatar: string) => {
    setStudents((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated: StudentRecord = {
        ...current,
        profile: {
          ...current.profile,
          name,
          grade,
          avatar,
        },
      };
      const updatedList = {
        ...prev,
        [id]: updated,
      };
      saveStoredStudents(updatedList);
      if (currentUser) {
        saveStudentToFirestore(updated);
      }
      return updatedList;
    });
  };

  const handleAnswerQuestion = (questionId: number, answerIndex: number, isCorrect: boolean) => {
    const { updatedStudents, newlyCompleted } = recordQuestionAttempt(
      students,
      activeStudentIdState,
      questionId,
      answerIndex,
      isCorrect
    );
    setStudents(updatedStudents);

    const updatedRecord = updatedStudents[activeStudentIdState];
    if (updatedRecord) {
      // Save directly to Firestore cloud database
      saveStudentToFirestore(updatedRecord);

      // Record live activity to Firestore
      if (isCorrect) {
        logActivityLive(
          updatedRecord.profile.id,
          updatedRecord.profile.name,
          'question_correct',
          `Menjawab BENAR Tantangan #${questionId} (+10 Poin)`,
          updatedRecord.progress.score
        );

        if (newlyCompleted) {
          const oldRecord = students[activeStudentIdState];
          const oldPieces = oldRecord?.progress.unlockedPuzzlePieces.length || 0;
          const newPieces = updatedRecord.progress.unlockedPuzzlePieces.length;
          if (newPieces > oldPieces) {
            logActivityLive(
              updatedRecord.profile.id,
              updatedRecord.profile.name,
              'puzzle_unlocked',
              `Membuka Keping Puzzle #${newPieces} dari 6!`,
              updatedRecord.progress.score
            );
          }

          const oldBadges = oldRecord?.progress.unlockedBadges.length || 0;
          const newBadges = updatedRecord.progress.unlockedBadges.length;
          if (newBadges > oldBadges) {
            logActivityLive(
              updatedRecord.profile.id,
              updatedRecord.profile.name,
              'badge_earned',
              `Memperoleh Lencana Prestasi Baru!`,
              updatedRecord.progress.score
            );
          }

          if (updatedRecord.progress.completedQuestions.length >= 25) {
            logActivityLive(
              updatedRecord.profile.id,
              updatedRecord.profile.name,
              'game_completed',
              `Menuntaskan seluruh 25 tantangan petualangan peta! Skor: ${updatedRecord.progress.score}`,
              updatedRecord.progress.score
            );
          }
        }
      } else {
        logActivityLive(
          updatedRecord.profile.id,
          updatedRecord.profile.name,
          'question_retry',
          `Mencoba kembali Tantangan #${questionId}`,
          updatedRecord.progress.score
        );
      }
    }

    return { newlyCompleted };
  };

  const handleSaveGrowMapRecord = (updatedRecord: StudentRecord) => {
    setStudents((prev) => {
      const updated = {
        ...prev,
        [updatedRecord.profile.id]: updatedRecord,
      };
      saveStoredStudents(updated);
      saveStudentToFirestore(updatedRecord);
      return updated;
    });

    logActivityLive(
      updatedRecord.profile.id,
      updatedRecord.profile.name,
      'grow_map_saved',
      `Menyimpan respon instrumen GROW MAP`,
      updatedRecord.progress.score
    );
  };

  const handleSaveReflection = (answers: StudentRecord['progress']['reflectionAnswers']) => {
    setStudents((prev) => {
      const current = prev[activeStudentIdState];
      if (!current) return prev;
      const updated: StudentRecord = {
        ...current,
        progress: {
          ...current.progress,
          reflectionAnswers: answers,
          lastUpdated: new Date().toISOString(),
        },
      };
      const updatedMap = {
        ...prev,
        [activeStudentIdState]: updated,
      };
      saveStoredStudents(updatedMap);
      saveStudentToFirestore(updated);
      return updatedMap;
    });

    logActivityLive(
      activeRecord.profile.id,
      activeRecord.profile.name,
      'grow_map_saved',
      `Menyimpan refleksi belajar My Growth Reflection`,
      activeRecord.progress.score
    );
  };

  const handleResetStudent = (id: string) => {
    const updated = resetStudentProgress(students, id);
    setStudents(updated);
    if (updated[id]) {
      saveStudentToFirestore(updated[id]);
    }
  };

  const handleUpdatePosition = (newPos: number) => {
    setStudents((prev) => {
      const current = prev[activeStudentIdState];
      if (!current) return prev;
      const updated: StudentRecord = {
        ...current,
        progress: {
          ...current.progress,
          currentPosition: newPos,
          lastUpdated: new Date().toISOString(),
        },
      };
      const updatedMap = {
        ...prev,
        [activeStudentIdState]: updated,
      };
      saveStoredStudents(updatedMap);
      saveStudentToFirestore(updated);
      return updatedMap;
    });
  };

  // Google Authentication handlers
  const handleSignInGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        audioManager.playCorrectSound();
      }
    } catch (error) {
      console.error('Login gagal:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      audioManager.playClickSound();
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  // Manual full cloud sync handler
  const handleManualSync = async () => {
    if (!currentUser) {
      await handleSignInGoogle();
      return;
    }
    for (const st of Object.values(students)) {
      await saveStudentToFirestore(st);
    }
  };

  // Adventure Code Login Handler
  const handleSuccessCodeLogin = (studentEntry: StudentCodeEntry) => {
    setActiveStudentIdState(studentEntry.id);
    setActiveStudentId(studentEntry.id);
    localStorage.setItem('grow_puzzle_code_logged_in', 'true');
    localStorage.removeItem('grow_puzzle_teacher_auth_code');
    localStorage.removeItem('grow_puzzle_teacher_mode');
    setIsTeacherAuthenticated(false);

    // Update students state with the confirmed student profile
    setStudents((prev) => {
      const existing = prev[studentEntry.id];
      const updated: StudentRecord = existing
        ? {
            ...existing,
            profile: {
              ...existing.profile,
              name: studentEntry.name,
              grade: studentEntry.grade,
              avatar: studentEntry.avatar,
            },
            progress: {
              ...existing.progress,
              status:
                existing.progress.status === 'belum_mulai' ? 'sedang_bermain' : existing.progress.status,
              lastUpdated: new Date().toISOString(),
            },
          }
        : {
            profile: {
              id: studentEntry.id,
              name: studentEntry.name,
              grade: studentEntry.grade,
              avatar: studentEntry.avatar,
            },
            progress: {
              status: 'sedang_bermain',
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

      const updatedMap = { ...prev, [studentEntry.id]: updated };
      saveStoredStudents(updatedMap);
      saveStudentToFirestore(updated);
      return updatedMap;
    });

    // 4. Hubungkan dengan Fitur Live: Pastikan setelah kode berhasil divalidasi, sistem langsung mencatat aktivitas siswa tersebut menggunakan nama asli mereka ke database pemantauan live guru.
    const currentScore = students[studentEntry.id]?.progress.score || 0;
    logActivityLive(
      studentEntry.id,
      studentEntry.name,
      'app_opened',
      `Siswa ${studentEntry.name} (Kelas ${studentEntry.grade}) berhasil masuk dengan kode petualangan [${studentEntry.code}] dan membuka peta petualangan!`,
      currentScore
    );

    // Lalu mengarahkan mereka masuk ke peta petualangan
    handleNavigate('board');
  };

  // Special Teacher Code Login Handler (GURU4B)
  const handleSuccessTeacherLogin = () => {
    localStorage.setItem('grow_puzzle_teacher_auth_code', 'GURU4B');
    localStorage.setItem('grow_puzzle_teacher_mode', 'true');
    setIsTeacherAuthenticated(true);
    logActivityLive(
      'guru_kelas_4b',
      'Guru Kelas IV B',
      'app_opened',
      'Guru berhasil masuk menggunakan Kode Khusus Guru [GURU4B] dan langsung membuka Dashboard Guru',
      0
    );
    // Lewati halaman petualangan siswa, dan langsung arahkan pengguna ke Dashboard Guru
    handleNavigate('dashboard_guru');
  };

  return (
    <div className="min-h-screen text-[#123D68] flex flex-col font-nunito selection:bg-amber-200 relative">
      {/* Global Fixed Adventure Landscape Background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background-petualangan.png')",
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      />
      {/* Subtle atmospheric tint to ensure crystal-clear text contrast */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-sky-900/10"
        aria-hidden="true"
      />

      {/* Top Header Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        activeStudent={activeRecord?.profile || FALLBACK_STUDENT_RECORD.profile}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        score={activeRecord?.progress?.score ?? 0}
        currentUser={currentUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
        isCloudConnected={isCloudConnected}
      />

      {/* Main Pages Router */}
      <main className="flex-1">
        {currentPage === 'login' && (
          <CodeLoginPage
            onSuccessLogin={handleSuccessCodeLogin}
            onTeacherLogin={handleSuccessTeacherLogin}
            onNavigate={handleNavigate}
            activeStudentName={activeRecord?.profile?.name || 'Petualang'}
          />
        )}

        {currentPage === 'cover' && (
          <CoverPage
            onNavigate={handleNavigate}
            activeStudentName={activeRecord?.profile?.name || 'Petualang'}
          />
        )}

        {currentPage === 'instructions' && (
          <InstructionsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            students={students}
            activeStudentId={activeStudentIdState}
            onSelectStudent={handleSelectStudent}
            onUpdateProfile={handleUpdateProfile}
            onResetStudentProgress={handleResetStudent}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'grow_map_initial' && (
          <GrowMapPage
            mode="initial"
            studentRecord={activeRecord}
            onSave={handleSaveGrowMapRecord}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'board' && (
          <GameBoard
            studentRecord={activeRecord}
            onSelectQuestion={(qId) => setSelectedQuestionId(qId)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dice' && (
          <DiceRoller
            studentRecord={activeRecord}
            onUpdatePosition={handleUpdatePosition}
            onSelectQuestion={(qId) => setSelectedQuestionId(qId)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'material' && (
          <MaterialPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'challenge' && (
          <ChallengeCard
            questionId={selectedQuestionId}
            studentRecord={activeRecord}
            onAnswerQuestion={handleAnswerQuestion}
            onNavigate={handleNavigate}
            onSelectNextQuestion={(nextId) => setSelectedQuestionId(nextId)}
          />
        )}

        {currentPage === 'puzzle' && (
          <PuzzleCollection
            studentRecord={activeRecord}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'badges' && (
          <BadgesPage
            studentRecord={activeRecord}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'reflection' && (
          <ReflectionPage
            studentRecord={activeRecord}
            onSaveReflection={handleSaveReflection}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'grow_map_final' && (
          <GrowMapPage
            mode="final"
            studentRecord={activeRecord}
            onSave={handleSaveGrowMapRecord}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'final_result' && (
          <FinalResultPage
            studentRecord={activeRecord}
            onResetStudentProgress={handleResetStudent}
            onNavigate={handleNavigate}
          />
        )}

        {(currentPage === 'dashboard_guru' || currentPage === 'teacher_dashboard') && (
          <DashboardGuruLivePage
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
            currentUser={currentUser}
            onSignInGoogle={handleSignInGoogle}
            initialStudents={students}
            isTeacherAuthenticated={isTeacherAuthenticated}
            onClearAllStudents={() => setStudents({})}
          />
        )}

        {currentPage === 'teacher_settings' && (
          <TeacherSettings
            students={students}
            settings={settings}
            onUpdateStudents={(upd) => {
              setStudents(upd);
              saveStoredStudents(upd);
              if (currentUser) {
                Object.values(upd).forEach((st) => saveStudentToFirestore(st));
              }
            }}
            onUpdateSettings={(newSet) => {
              setSettings(newSet);
              saveStoredSettings(newSet);
              if (currentUser) {
                saveSettingsToFirestore(newSet);
              }
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'battle_explorers' && (
          <BattleExplorersPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Tombol Akses Cepat Mode Guru di Pojok Kanan Bawah */}
      {currentPage !== 'dashboard_guru' &&
        currentPage !== 'teacher_dashboard' &&
        currentPage !== 'teacher_settings' &&
        currentPage !== 'battle_explorers' && (
          <aside className="fixed bottom-4 right-4 z-40">
            <button
              onClick={() => {
                audioManager.playClickSound();
                handleNavigate('dashboard_guru');
              }}
              className="group flex items-center gap-2 bg-[#123D68] hover:bg-[#1b4b7c] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl border-2 border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer font-extrabold text-xs sm:text-sm"
              title="Buka Mode Guru & Pemantauan Live"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <Users className="w-4 h-4 text-amber-300" />
              <span>Mode Guru</span>
            </button>
          </aside>
        )}
    </div>
  );
};

export default App;
