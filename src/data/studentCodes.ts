export interface StudentCodeEntry {
  id: string;
  name: string;
  grade: string;
  code: string;
  avatar: 'boy1' | 'girl1' | 'boy2' | 'girl2';
  aliases?: string[];
  isCustom?: boolean;
}

/**
 * Daftar Resmi 37 Siswa Kelas IV B Beserta Kode Unik Login Petualang
 */
export const DEFAULT_STUDENT_CODES: StudentCodeEntry[] = [
  { id: 'siswa_01', name: 'AILA MAULIDIA', grade: 'IV B', code: 'AM01', avatar: 'girl1', aliases: ['AILA4B', 'AILA', 'AM11'] },
  { id: 'siswa_02', name: 'AINUN AULIA RAHMA', grade: 'IV B', code: 'AR02', avatar: 'girl2', aliases: ['AINUN4B', 'AINUN', 'AR22'] },
  { id: 'siswa_03', name: 'AL ARKA RAFASYA AGUSTIAN', grade: 'IV B', code: 'AA03', avatar: 'boy1', aliases: ['ARKA4B', 'ARKA', 'AA33'] },
  { id: 'siswa_04', name: 'ALBARA PUTRA ANGGARA', grade: 'IV B', code: 'AP04', avatar: 'boy2', aliases: ['ALBARA4B', 'ALBARA', 'AP44'] },
  { id: 'siswa_05', name: 'ALBY LUTHFI RABBANI', grade: 'IV B', code: 'AL05', avatar: 'boy1', aliases: ['ALBY4B', 'ALBY', 'AL55'] },
  // Siswa 06: Alesha Zahra - memiliki kode 'AZ77' sesuai ketentuan eksplisit
  { id: 'siswa_06', name: 'ALESHA ZAHRA', grade: 'IV B', code: 'AZ77', avatar: 'girl1', aliases: ['ALESHA4B', 'ALESHA', 'AZ4B', 'AZ06'] },
  { id: 'siswa_07', name: 'ALIFIANDRA NAUFAL ALVARO', grade: 'IV B', code: 'AN07', avatar: 'boy2', aliases: ['ALIF4B', 'ALIFIANDRA4B', 'AN71'] },
  { id: 'siswa_08', name: 'ALMEERA JASMINE ALEXANDRA', grade: 'IV B', code: 'AJ08', avatar: 'girl2', aliases: ['ALMEERA4B', 'ALMEERA', 'AJ88'] },
  { id: 'siswa_09', name: 'ARKANA SANDI WIYANTARA', grade: 'IV B', code: 'AS09', avatar: 'boy1', aliases: ['ARKANA4B', 'ARKANA', 'AS99'] },
  { id: 'siswa_10', name: 'ATHIFA FAKHRA IZZATUNNISA', grade: 'IV B', code: 'AF10', avatar: 'girl1', aliases: ['ATHIFA4B', 'ATHIFA'] },
  { id: 'siswa_11', name: 'DARADIVA DINDADARI', grade: 'IV B', code: 'DD11', avatar: 'girl2', aliases: ['DARADIVA4B', 'DARA4B', 'DARA'] },
  { id: 'siswa_12', name: 'DEA WIDYA', grade: 'IV B', code: 'DW12', avatar: 'girl1', aliases: ['DEA4B', 'DEA'] },
  { id: 'siswa_13', name: 'DEVANDRA BARNES BAYANAKA', grade: 'IV B', code: 'DB13', avatar: 'boy2', aliases: ['DEVANDRA4B', 'DEVAN4B', 'DEVAN'] },
  { id: 'siswa_14', name: 'EL KIANO ZAYAN MUSYAFFA', grade: 'IV B', code: 'EK14', avatar: 'boy1', aliases: ['KIANO4B', 'ELKIANO4B', 'KIANO'] },
  { id: 'siswa_15', name: 'FITRIYANINGRUM RAHARJO', grade: 'IV B', code: 'FR15', avatar: 'girl2', aliases: ['FITRI4B', 'FITRI'] },
  { id: 'siswa_16', name: 'FRISKA AMALIA', grade: 'IV B', code: 'FA16', avatar: 'girl1', aliases: ['FRISKA4B', 'FRISKA'] },
  { id: 'siswa_17', name: 'FRISKA NUR FADILLAH', grade: 'IV B', code: 'FF17', avatar: 'girl2', aliases: ['FRISKANUR4B', 'FADILLAH4B'] },
  { id: 'siswa_18', name: 'GATHFAN KHAIZAN HAQIQI', grade: 'IV B', code: 'GH18', avatar: 'boy1', aliases: ['GATHFAN4B', 'GATHFAN'] },
  { id: 'siswa_19', name: 'ILHAM MULTAZAM', grade: 'IV B', code: 'IM19', avatar: 'boy2', aliases: ['ILHAM4B', 'ILHAM'] },
  { id: 'siswa_20', name: 'IREN NAFEEZA PRASETYA', grade: 'IV B', code: 'IP20', avatar: 'girl1', aliases: ['IREN4B', 'IREN'] },
  { id: 'siswa_21', name: 'JIHAN THALITA SETYAWAN', grade: 'IV B', code: 'JS21', avatar: 'girl2', aliases: ['JIHAN4B', 'JIHAN'] },
  { id: 'siswa_22', name: 'JIZA OKTAVIANI', grade: 'IV B', code: 'JO22', avatar: 'girl1', aliases: ['JIZA4B', 'JIZA'] },
  { id: 'siswa_23', name: 'KAVIN ALFARIZQI', grade: 'IV B', code: 'KA23', avatar: 'boy1', aliases: ['KAVIN4B', 'KAVIN'] },
  { id: 'siswa_24', name: 'KAYSHA PUTRI NUR MAULIDIA', grade: 'IV B', code: 'KP24', avatar: 'girl2', aliases: ['KAYSHA4B', 'KAYSHA'] },
  { id: 'siswa_25', name: 'MIKAYLA VEANOVE DISURYO', grade: 'IV B', code: 'MD25', avatar: 'girl1', aliases: ['MIKAYLA4B', 'MIKAYLA'] },
  { id: 'siswa_26', name: 'MISHA AQILLAA NAHFI', grade: 'IV B', code: 'MN26', avatar: 'girl2', aliases: ['MISHA4B', 'MISHA'] },
  { id: 'siswa_27', name: 'NALADIPHA FATHUL', grade: 'IV B', code: 'NF27', avatar: 'boy2', aliases: ['NALADIPHA4B', 'DIPHA4B'] },
  { id: 'siswa_28', name: 'NALENDRA RUMINGKANG', grade: 'IV B', code: 'NR28', avatar: 'boy1', aliases: ['NALENDRA4B', 'NALEN4B'] },
  { id: 'siswa_29', name: 'NAQEYLA SHAQUEENA NUGRAHA', grade: 'IV B', code: 'NN29', avatar: 'girl2', aliases: ['NAQEYLA4B', 'KEYLA4B'] },
  { id: 'siswa_30', name: 'RAFFASYA MUHAMMAD ALFARIZQI', grade: 'IV B', code: 'RM30', avatar: 'boy2', aliases: ['RAFFASYA4B', 'RAFFA4B'] },
  { id: 'siswa_31', name: 'RAHMAT PEBRIANSYAH', grade: 'IV B', code: 'RP31', avatar: 'boy1', aliases: ['RAHMAT4B', 'RAHMAT'] },
  { id: 'siswa_32', name: 'SHAREEFA HASYA WIRATARA', grade: 'IV B', code: 'SW32', avatar: 'girl1', aliases: ['SHAREEFA4B', 'HASYA4B'] },
  { id: 'siswa_33', name: 'SHAVIRA SHALIHAH ANWAR', grade: 'IV B', code: 'SA33', avatar: 'girl2', aliases: ['SHAVIRA4B', 'SHAVIRA'] },
  { id: 'siswa_34', name: 'TALITHA ALYA ARDINDA', grade: 'IV B', code: 'TA34', avatar: 'girl1', aliases: ['TALITHA4B', 'TALITHA'] },
  { id: 'siswa_35', name: 'WILLONA RAFANDA TRIAS', grade: 'IV B', code: 'WT35', avatar: 'girl2', aliases: ['WILLONA4B', 'WILLONA'] },
  { id: 'siswa_36', name: 'ZASKIYA ASIPATUL HAIFA', grade: 'IV B', code: 'ZH36', avatar: 'girl1', aliases: ['ZASKIYA4B', 'ZASKIYA'] },
  { id: 'siswa_37', name: 'BILQIS FAIHA RIFDA', grade: 'IV B', code: 'BR37', avatar: 'girl2', aliases: ['BILQIS4B', 'BILQIS'] },
];

// Alias for backwards-compatibility
export const STUDENT_CODES = DEFAULT_STUDENT_CODES;

const STORAGE_CUSTOM_STUDENTS_KEY = 'grow_puzzle_custom_student_codes_v1';

/**
 * Mendapatkan seluruh daftar kode siswa (default + siswa baru tambahan dari guru)
 */
export function getAllStudentCodes(): StudentCodeEntry[] {
  if (typeof window === 'undefined') {
    return DEFAULT_STUDENT_CODES;
  }

  try {
    const customJson = localStorage.getItem(STORAGE_CUSTOM_STUDENTS_KEY);
    if (!customJson) {
      return DEFAULT_STUDENT_CODES;
    }
    const customList: StudentCodeEntry[] = JSON.parse(customJson);
    if (!Array.isArray(customList) || customList.length === 0) {
      return DEFAULT_STUDENT_CODES;
    }

    // Merge default codes with custom/modified ones
    const codeMap = new Map<string, StudentCodeEntry>();
    DEFAULT_STUDENT_CODES.forEach((entry) => codeMap.set(entry.id, entry));
    customList.forEach((entry) => codeMap.set(entry.id, entry));

    return Array.from(codeMap.values());
  } catch (e) {
    console.error('Gagal membaca custom student codes:', e);
    return DEFAULT_STUDENT_CODES;
  }
}

/**
 * Menyimpan siswa baru yang ditambahkan guru secara manual
 */
export function saveCustomStudent(newStudent: {
  name: string;
  grade?: string;
  code: string;
  avatar?: 'boy1' | 'girl1' | 'boy2' | 'girl2';
}): StudentCodeEntry {
  const allCurrent = getAllStudentCodes();
  const nextNum = allCurrent.length + 1;
  const numPad = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
  const id = `siswa_${numPad}_${Date.now().toString(36)}`;

  const cleanName = newStudent.name.trim().toUpperCase();
  const cleanCode = newStudent.code.trim().toUpperCase().replace(/\s+/g, '');
  const cleanGrade = (newStudent.grade || 'IV B').trim().toUpperCase();

  const entry: StudentCodeEntry = {
    id,
    name: cleanName,
    grade: cleanGrade,
    code: cleanCode,
    avatar: newStudent.avatar || (cleanName.includes('PUTRI') || cleanName.includes('SITI') ? 'girl1' : 'boy1'),
    aliases: [cleanCode, cleanName.split(' ')[0] + '4B', cleanName.split(' ')[0]],
    isCustom: true,
  };

  try {
    const customJson = localStorage.getItem(STORAGE_CUSTOM_STUDENTS_KEY);
    const existingCustom: StudentCodeEntry[] = customJson ? JSON.parse(customJson) : [];
    const updatedCustom = [...existingCustom.filter((s) => s.id !== id), entry];
    localStorage.setItem(STORAGE_CUSTOM_STUDENTS_KEY, JSON.stringify(updatedCustom));
  } catch (e) {
    console.error('Gagal menyimpan custom student:', e);
  }

  return entry;
}

/**
 * Memperbarui kode login atau data siswa oleh guru
 */
export function updateStudentCodeEntry(id: string, updates: Partial<StudentCodeEntry>): boolean {
  try {
    const all = getAllStudentCodes();
    const target = all.find((s) => s.id === id);
    if (!target) return false;

    const updatedEntry: StudentCodeEntry = {
      ...target,
      ...updates,
      code: updates.code ? updates.code.trim().toUpperCase().replace(/\s+/g, '') : target.code,
      name: updates.name ? updates.name.trim().toUpperCase() : target.name,
      grade: updates.grade ? updates.grade.trim().toUpperCase() : target.grade,
      isCustom: true,
    };

    const customJson = localStorage.getItem(STORAGE_CUSTOM_STUDENTS_KEY);
    const existingCustom: StudentCodeEntry[] = customJson ? JSON.parse(customJson) : [];
    const updatedCustom = [...existingCustom.filter((s) => s.id !== id), updatedEntry];
    localStorage.setItem(STORAGE_CUSTOM_STUDENTS_KEY, JSON.stringify(updatedCustom));
    return true;
  } catch (e) {
    console.error('Gagal memperbarui student code:', e);
    return false;
  }
}

/**
 * Validates an adventure code (case-insensitive, trims whitespace).
 * Returns the matching student profile if valid, or null if invalid.
 */
export function findStudentByAdventureCode(rawCode: string): StudentCodeEntry | null {
  if (!rawCode) return null;
  const clean = rawCode.trim().toUpperCase().replace(/\s+/g, '');
  const allCodes = getAllStudentCodes();

  for (const entry of allCodes) {
    // 1. Direct code match (e.g. AZ77, AM01)
    if (entry.code.toUpperCase() === clean) {
      return entry;
    }
    // 2. ID match (e.g. SISWA_06 -> SISWA06)
    if (entry.id.toUpperCase().replace('_', '') === clean) {
      return entry;
    }
    // 3. Aliases match (e.g. ALESHA, ALESHA4B, AZ4B)
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        if (alias.toUpperCase().replace(/\s+/g, '') === clean) {
          return entry;
        }
      }
    }
  }

  return null;
}
