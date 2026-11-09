import React, { useState } from 'react';
import { Student } from '../types/uasa';
import { X, UserPlus, Trash2, Search, AlertCircle, Check } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  className,
  students,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const upper = val.toUpperCase();
    if (upper.includes(' BINTI ') || upper.endsWith(' BINTI')) {
      setGender('P');
    } else if (upper.includes(' BIN ') || upper.endsWith(' BIN')) {
      setGender('L');
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStudent({
      name: name.trim().toUpperCase(),
      gender,
      scores: {},
    });

    setSuccessMsg(`Murid ${name.trim().toUpperCase()} berjaya didaftarkan.`);
    setName('');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Pengurusan Murid • {className}</h3>
            <p className="text-xs text-emerald-200">
              Tambah murid baharu atau padam rekod sedia ada
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-750 text-emerald-100 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('add')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'add'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Tambah Murid Baru
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Senarai & Padam Murid</span>
            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded-full">
              {students.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'add' ? (
            <form onSubmit={handleAdd} className="space-y-4">
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Murid (Huruf Besar)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: MUHAMMAD ALI BIN AHMAD"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Jantina dikesan secara automatik (BIN = Lelaki, BINTI = Perempuan).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jantina
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'L'}
                      onChange={() => setGender('L')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Lelaki (L)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'P'}
                      onChange={() => setGender('P')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Perempuan (P)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Murid</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama murid..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Student List */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-slate-100 pr-1">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">
                    Tiada murid dijumpai.
                  </p>
                ) : (
                  filteredStudents.map((s, index) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 w-5">
                          {index + 1}.
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{s.name}</p>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                              s.gender === 'L'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-pink-50 text-pink-700'
                            }`}
                          >
                            {s.gender === 'L' ? 'Lelaki' : 'Perempuan'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Adakah anda pasti mahu memadamkan murid ${s.name}?`)) {
                            onDeleteStudent(s.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer"
                        title="Padam Murid"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Jumlah: {students.length} orang murid
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
