# Security Specification: GROW PUZZLE DIGITAL

## 1. Data Invariants

1. **Identity & Ownership Integrity**:
   - A user profile `/users/{userId}` can only be created or modified by the user with matching `request.auth.uid`.
   - Role escalation is strictly prohibited: users cannot set themselves as `teacher` or `admin` unless matching the predefined teacher email (`nurulinayah9282@gmail.com`).
2. **Student Record Bounds**:
   - Scores on `/students/{studentId}` must be numeric and bounded between 0 and 250 points.
   - Status must belong to allowed enum: `['belum_mulai', 'sedang_bermain', 'selesai']`.
   - String fields must have bounded size (names <= 100 chars, ids <= 64 chars).
3. **Live Activity Logging**:
   - Every `/activities/{activityId}` must contain valid activity types: `app_opened`, `question_correct`, `question_retry`, `puzzle_unlocked`, `badge_earned`, `grow_map_saved`, `game_completed`.
   - Timestamps must not exceed 50 chars.
4. **Settings Modification**:
   - `/settings/{settingId}` can only be written by authenticated users (teachers / admins).
5. **No Blind Blanket Reads**:
   - Students and activity logs can be read by authenticated users for classroom progress monitoring.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Identity Spoofing on User Profile)**:
   Attempting to create `/users/victim_user` when authenticated as `attacker_user`.
2. **Payload 2 (Privilege Escalation on User Profile)**:
   Attempting to set `role: 'teacher'` on `/users/{uid}` when email is not teacher email.
3. **Payload 3 (Score Overflow Attack)**:
   Attempting to write `score: 99999` to `/students/siswa_01` (exceeding 250 max).
4. **Payload 4 (Negative Score Attack)**:
   Attempting to write `score: -50` to `/students/siswa_01`.
5. **Payload 5 (Ghost Field Injection on Student)**:
   Injecting `{ isHacked: true, score: 200, ... }` into `/students/siswa_01`.
6. **Payload 6 (String Denial-of-Wallet Attack)**:
   Injecting a 2MB string into `name` or `id` fields of student or activity log.
7. **Payload 7 (Invalid Enum State on Student)**:
   Setting `status: 'super_admin_unlocked'` instead of valid enum states.
8. **Payload 8 (Illegal Activity Type Injection)**:
   Injecting `activityType: 'delete_database'` into `/activities/act_01`.
9. **Payload 9 (Unauthenticated Write to Student)**:
   Attempting to write `/students/siswa_01` without authentication.
10. **Payload 10 (Settings Override by Unauthenticated User)**:
    Attempting to update `/settings/class_settings` as unauthenticated user.
11. **Payload 11 (ID Poisoning Attack)**:
    Creating document with invalid ID characters `/students/../../../etc/passwd`.
12. **Payload 12 (Blanket Overwrite of Unrelated User Data)**:
    Attempting to delete or overwrite all users in `/users`.

---

## 3. Test Runner Design

All 12 malicious payloads must be rejected by Firestore Security Rules with `PERMISSION_DENIED`.
Rules enforce validation helpers `isValidStudent()`, `isValidActivity()`, `isValidUser()`, `isValidSettings()`, and `isValidId()`.
