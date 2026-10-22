import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { StudentRecord } from '../types';
import { AppSettings } from '../utils/storage';

export interface LiveActivityItem {
  id: string;
  studentId: string;
  studentName: string;
  activityType:
    | 'app_opened'
    | 'question_correct'
    | 'question_retry'
    | 'puzzle_unlocked'
    | 'badge_earned'
    | 'grow_map_saved'
    | 'game_completed';
  description: string;
  scoreAtTime: number;
  timestamp: string;
}

// Log a live activity event to Firestore collection /activities/{activityId}
export async function logActivityLive(
  studentId: string,
  studentName: string,
  activityType: LiveActivityItem['activityType'],
  description: string,
  scoreAtTime: number
): Promise<void> {
  const path = 'activities';
  try {
    const activityId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, path, activityId);
    const data: LiveActivityItem = {
      id: activityId,
      studentId: studentId.slice(0, 64),
      studentName: studentName.slice(0, 100),
      activityType,
      description: description.slice(0, 255),
      scoreAtTime: Number(scoreAtTime) || 0,
      timestamp: new Date().toISOString(),
    };
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error logging live activity:', error);
  }
}

// Save or sync student record to Firestore /students/{studentId}
export async function saveStudentToFirestore(record: StudentRecord): Promise<void> {
  const path = 'students';
  try {
    const docRef = doc(db, path, record.profile.id);
    const payload = {
      id: record.profile.id,
      name: record.profile.name,
      grade: record.profile.grade,
      avatar: record.profile.avatar,
      status: record.progress.status,
      score: record.progress.score,
      completedQuestions: record.progress.completedQuestions,
      attempts: record.progress.attempts,
      answers: record.progress.answers,
      currentPosition: record.progress.currentPosition,
      unlockedPuzzlePieces: record.progress.unlockedPuzzlePieces,
      unlockedBadges: record.progress.unlockedBadges,
      initialGrowMapCompleted: Boolean(record.progress.initialGrowMapCompleted),
      finalGrowMapCompleted: Boolean(record.progress.finalGrowMapCompleted),
      growMapInitial: record.progress.growMapInitial,
      growMapFinal: record.progress.growMapFinal,
      reflectionAnswers: record.progress.reflectionAnswers,
      supportChallengeDone: Boolean(record.progress.supportChallengeDone),
      lastUpdated: record.progress.lastUpdated,
      userId: auth.currentUser?.uid || '',
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving student to Firestore:', error);
  }
}

// Bulk sync initial 37 students if cloud collection is empty
export async function bootstrapStudentsInFirestore(
  students: Record<string, StudentRecord>
): Promise<void> {
  const path = 'students';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      console.log('Seeding initial 37 students to Firestore...');
      for (const student of Object.values(students)) {
        await saveStudentToFirestore(student);
      }
    }
  } catch (error) {
    console.error('Error bootstrapping students:', error);
  }
}

// Listen to real-time updates for students from Firestore (onSnapshot)
export function subscribeToStudents(
  onUpdate: (students: Record<string, StudentRecord>) => void,
  onError?: (error: unknown) => void
): Unsubscribe | null {
  const path = 'students';
  try {
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudStudents: Record<string, StudentRecord> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudStudents[data.id] = {
              profile: {
                id: data.id,
                name: data.name,
                grade: data.grade,
                avatar: data.avatar,
              },
              progress: {
                status: data.status,
                score: data.score,
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
          onUpdate(cloudStudents);
        }
      },
      (error) => {
        console.error('Error on students snapshot:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsub;
  } catch (error) {
    console.error('Error setting up students listener:', error);
    return null;
  }
}

// Listen to live activities for teacher real-time monitoring feed (onSnapshot)
export function subscribeToLiveActivities(
  limitCount: number = 30,
  onUpdate: (activities: LiveActivityItem[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe | null {
  const path = 'activities';
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(limitCount));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: LiveActivityItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as LiveActivityItem);
        });
        onUpdate(list);
      },
      (error) => {
        console.error('Error on activities snapshot:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsub;
  } catch (error) {
    console.error('Error setting up activities listener:', error);
    return null;
  }
}

// Save user profile upon Google Sign-In
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<void> {
  const path = 'users';
  try {
    const docRef = doc(db, path, user.uid);
    const isTeacher = user.email === 'nurulinayah9282@gmail.com';
    const payload = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Pengguna',
      photoURL: user.photoURL || '',
      role: isTeacher ? 'teacher' : 'student',
      lastLogin: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error syncing user profile:', error);
  }
}

// Save classroom settings to Firestore
export async function saveSettingsToFirestore(settings: AppSettings): Promise<void> {
  const path = 'settings';
  try {
    const docRef = doc(db, path, 'class_settings');
    const payload = {
      className: settings.className,
      soundEnabled: settings.soundEnabled,
      autoNarrate: settings.autoNarrate,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving settings to Firestore:', error);
  }
}
