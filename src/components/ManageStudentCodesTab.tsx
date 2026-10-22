import React, { useState } from 'react';
import {
  getAllStudentCodes,
  saveCustomStudent,
  updateStudentCodeEntry,
  StudentCodeEntry,
  DEFAULT_STUDENT_CODES,
} from '../data/studentCodes';
import { audioManager } from '../utils/audio';
import {
  KeyRound,
  UserPlus,
  Search,
  Copy,
  Check,
  Edit3,
  Play,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  FileText,
  Users,
} from 'lucide-react';

interface ManageStudentCodesTabProps {
  onPlayAsStudent: (studentId: string) => void;
  onStudentAddedOrUpdated?: (entry: StudentCodeEntry) => void;
}

export const ManageStudentCodesTab: React.FC<ManageStudentCodesTabProps> = ({
  onPlayAsStudent,
  onStudentAddedOrUpdated,
}) => {
  const [studentCodes, setStudentCodes] = useState<StudentCodeEntry[]>(() => getAllStudentCodes());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'custom'>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Modal Tambah Siswa Baru
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('IV B');
  const [newCode, setNewCode] = useState('');
  const [newAvatar, setNewAvatar] = useState<'boy1' | 'girl1' | 'boy2' | 'girl2'>('boy1');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Modal Edit Kode Siswa
  const [editingStudent, setEditingStudent] = useState<StudentCodeEntry | null>(null);
  const [editCodeValue, setEditCodeValue] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Helper untuk refresh list
  const refreshList = () => {
    setStudentCodes(getAllStudentCodes());
  };

  // Auto-generate suggested code when name changes
  const handleNameChange = (val: string) => {
    setNewName(val);
    setFormError(null);
    if (!newCode || newCode.length <= 4) {
      const words = val.trim().split(/\s+/).filter(Boolean);
      let initials = '';
      if (words.length >= 2) {
        initials = (words[0][0] + words[1][0]).toUpperCase();
      } else if (words.length === 1 && words[0].length >= 2) {
        initials = words[0].substring(0, 2).toUpperCase();
      }
      if (initials) {
        const rand = Math.floor(10 + Math.random() * 89);
        setNewCode(`${initials}${rand}`);
      }
    }
  };

  // Submit Tambah Siswa Baru
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = newName.trim();
    const cleanCode = newCode.trim().toUpperCase().replace(/\s+/g, '');
    const cleanGrade = (newGrade || 'IV B').trim();

    if (!cleanName) {
      setFormError('Nama siswa tidak boleh kosong.');
      return;
    }

    if (!cleanCode || cleanCode.length < 2) {
      setFormError('Kode login minimal 2 karakter (contoh: AZ77, MF38).');
      return;
    }

    // Check duplicate code
    const isCodeTaken = studentCodes.some(
      (s) => s.code.toUpperCase() === cleanCode
    );
    if (isCodeTaken) {
      setFormError(`Kode "${cleanCode}" sudah digunakan siswa lain. Silakan buat kode unik yang berbeda.`);
      return;
    }

    try {
      const created = saveCustomStudent({
        name: cleanName,
        grade: cleanGrade,
        code: cleanCode,
        avatar: newAvatar,
      });

      audioManager.playCorrectSound();
      refreshList();
      if (onStudentAddedOrUpdated) {
        onStudentAddedOrUpdated(created);
      }

      setFormSuccess(`Siswa ${created.name} berhasil didaftarkan dengan kode ${created.code}!`);
      setTimeout(() => {
        setIsAddModalOpen(false);
        setNewName('');
        setNewCode('');
        setFormSuccess(null);
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError('Gagal menambahkan siswa baru. Coba lagi.');
    }
  };

  // Submit Edit Kode
  const handleSaveEditCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError(null);

    const cleanCode = editCodeValue.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode || cleanCode.length < 2) {
      setEditError('Kode login minimal 2 karakter.');
      return;
    }

    // Check duplicate code with other students
    const isCodeTaken = studentCodes.some(
      (s) => s.id !== editingStudent.id && s.code.toUpperCase() === cleanCode
    );
    if (isCodeTaken) {
      setEditError(`Kode "${cleanCode}" sudah digunakan siswa lain.`);
      return;
    }

    const success = updateStudentCodeEntry(editingStudent.id, { code: cleanCode });
    if (success) {
      audioManager.playCorrectSound();
      refreshList();
      const updated = { ...editingStudent, code: cleanCode };
      if (onStudentAddedOrUpdated) {
        onStudentAddedOrUpdated(updated);
      }
      setEditingStudent(null);
    } else {
      setEditError('Gagal memperbarui kode siswa.');
    }
  };

  // Salin Kode ke Clipboard
  const handleCopyCode = (id: string, code: string) => {
    audioManager.playClickSound();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Salin Semua Kode Siswa dalam format teks tabel
  const handleCopyAllCodes = () => {
    audioManager.playClickSound();
    const rows = studentCodes.map(
      (s, idx) => `${idx + 1}. ${s.name} | Kelas ${s.grade} | Kode: ${s.code}`
    );
    const header = `=== DAFTAR KODE LOGIN SISWA KELAS IV B ===\nTotal: ${studentCodes.length} Siswa\n\n`;
    navigator.clipboard.writeText(header + rows.join('\n'));
    alert('Seluruh daftar nama dan kode siswa berhasil disalin ke clipboard!');
  };

  // Cetak Kartu Siswa (Window Print Preview)
  const handlePrintCards = () => {
    audioManager.playClickSound();
    window.print();
  };

  // Filter & Search
  const filteredCodes = studentCodes.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (filterType === 'official') return !s.isCustom;
    if (filterType === 'custom') return !!s.isCustom;
    return true;
  });

  const officialCount = DEFAULT_STUDENT_CODES.length;
  const customCount = studentCodes.filter((s) => s.isCustom).length;

  return (
    <div className="space-y-5">
      {/* Top Banner Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Manajemen Kode Petualang</span>
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Kelas IV B ({studentCodes.length} Siswa)
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-fredoka text-[#123D68]">
            Kelola Kode Login Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Siswa masuk ke game menggunakan kode unik (contoh: <strong>AZ77</strong> untuk <em>Alesha Zahra</em>). Guru dapat melihat seluruh kode, menyalin kartu, mengganti kode, atau menambah siswa baru secara langsung tanpa mengubah kode sumber.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              audioManager.playClickSound();
              setIsAddModalOpen(true);
            }}
            className="bg-[#21A447] hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border-b-2 border-emerald-800"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>

          <button
            onClick={handleCopyAllCodes}
            className="bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Salin seluruh daftar nama dan kode siswa untuk ditempel di dokumen"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Salin Daftar</span>
          </button>

          <button
            onClick={handlePrintCards}
            className="bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-900 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Cetak kartu kode petualang untuk dibagikan ke siswa di kelas"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>Cetak Kartu</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa atau kode login (misal: ALESHA, AZ77)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-[#123D68] focus:outline-none focus:ring-2 focus:ring-[#21A447]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#123D68] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Siswa ({studentCodes.length})
          </button>
          <button
            onClick={() => setFilterType('official')}
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'official'
                ? 'bg-[#21A447] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Resmi Kelas IV B ({officialCount})
          </button>
          {customCount > 0 && (
            <button
              onClick={() => setFilterType('custom')}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterType === 'custom'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Tambahan Guru ({customCount})
            </button>
          )}
        </div>
      </div>

      {/* Main Table: [No • Nama Siswa • Kelas • Kode Login • Aksi] */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-3 text-center w-28">Kelas</th>
                <th className="py-3.5 px-4 text-center w-48">Kode Login</th>
                <th className="py-3.5 px-4 text-center w-52">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    Tidak ada siswa yang sesuai dengan kata kunci pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredCodes.map((st, index) => {
                  const isCopied = copiedCodeId === st.id;
                  const isAlesha = st.code === 'AZ77' || st.name.includes('ALESHA');

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        isAlesha ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* 1. No */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* 2. Nama Siswa */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#123D68] flex items-center gap-2">
                          <span className="text-lg">
                            {st.avatar.startsWith('girl') ? '👧' : '👦'}
                          </span>
                          <span className="text-sm sm:text-base">{st.name}</span>
                          {st.isCustom && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              Tambahan Baru
                            </span>
                          )}
                          {isAlesha && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                              ⭐ Contoh AZ77
                            </span>
                          )}
                        </div>
                        {st.aliases && st.aliases.length > 0 && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Alias: {st.aliases.join(', ')}
                          </div>
                        )}
                      </td>

                      {/* 3. Kelas */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg text-xs">
                          {st.grade}
                        </span>
                      </td>

                      {/* 4. Kode Login */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-3 py-1.5 rounded-xl shadow-xs">
                          <span className="font-mono font-black text-sm sm:text-base tracking-wider text-amber-950">
                            {st.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(st.id, st.code)}
                            title="Salin Kode Siswa"
                            className="p-1 rounded-md hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 5. Aksi Guru */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Ubah Kode */}
                          <button
                            onClick={() => {
                              audioManager.playClickSound();
                              setEditingStudent(st);
                              setEditCodeValue(st.code);
                              setEditError(null);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 border border-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                            title="Ubah Kode Login Siswa"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                            <span className="hidden sm:inline">Ubah Kode</span>
                          </button>

                          {/* Masuk Sebagai Siswa */}
                          <button
                            onClick={() => {
                              audioManager.playClickSound();
                              onPlayAsStudent(st.id);
                            }}
                            className="p-2 rounded-xl bg-[#21A447] hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                            title={`Mulai bermain langsung sebagai ${st.name}`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span className="hidden sm:inline">Tes Masuk</span>
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

      {/* Info Box untuk Guru & Kode Khusus Guru */}
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-950 font-medium shadow-xs">
        <div className="flex items-start md:items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 md:mt-0" />
          <span>
            <strong>Petunjuk Guru:</strong> Bagikan kode login di atas kepada masing-masing siswa. Saat membuka game, siswa cukup mengetikkan kodenya untuk langsung bermain.
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shrink-0 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600">Kode Khusus Guru:</span>
          <span className="font-mono font-black text-xs sm:text-sm bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 tracking-wider">
            GURU4B
          </span>
        </div>
      </div>

      {/* Modal Tambah Siswa Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-emerald-300 shadow-2xl relative animate-pop">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xl shadow-xs">
                ➕
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-fredoka text-[#123D68]">
                  Tambah Siswa Baru
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tambahkan siswa dan tentukan kode login uniknya secara mandiri
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Nama Lengkap */}
              <div>
                <label className="block font-extrabold text-[#123D68] mb-1">
                  Nama Lengkap Siswa:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: MUHAMMAD FAIZ"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-[#123D68] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#21A447]"
                />
              </div>

              {/* Kelas */}
              <div>
                <label className="block font-extrabold text-[#123D68] mb-1">
                  Kelas:
                </label>
                <input
                  type="text"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  placeholder="IV B"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#123D68] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#21A447]"
                />
              </div>

              {/* Kode Login */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-extrabold text-[#123D68]">
                    Kode Login Unik:
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (Otomatis disarankan / ketik manual)
                  </span>
                </div>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: MF38 atau AZ77"
                  required
                  className="w-full px-3.5 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl font-mono font-black text-base text-amber-950 uppercase tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Avatar Siswa */}
              <div>
                <label className="block font-extrabold text-[#123D68] mb-1">
                  Pilih Karakter Avatar:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'boy1', label: '👦 Putra 1' },
                    { id: 'boy2', label: '👦 Putra 2' },
                    { id: 'girl1', label: '👧 Putri 1' },
                    { id: 'girl2', label: '👧 Putri 2' },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setNewAvatar(av.id as any)}
                      className={`p-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        newAvatar === av.id
                          ? 'border-[#21A447] bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {av.id.startsWith('girl') ? '👧' : '👦'}
                      </div>
                      <div className="text-[10px]">{av.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#21A447] hover:bg-emerald-600 text-white font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Buat Kode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kode Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-amber-300 shadow-2xl relative animate-pop">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-lg">
                ✏️
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-fredoka text-[#123D68]">
                  Ubah Kode Login Siswa
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingStudent.name} ({editingStudent.grade})
                </p>
              </div>
            </div>

            {editError && (
              <div className="mb-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl p-2.5 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditCode} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-extrabold text-[#123D68] mb-1">
                  Kode Login Baru:
                </label>
                <input
                  type="text"
                  value={editCodeValue}
                  onChange={(e) => setEditCodeValue(e.target.value.toUpperCase())}
                  placeholder="Contoh: AZ77"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl font-mono font-black text-lg text-amber-950 uppercase tracking-widest text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Pastikan kode unik dan mudah diingat oleh siswa.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#21A447] hover:bg-emerald-600 text-white font-extrabold shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
