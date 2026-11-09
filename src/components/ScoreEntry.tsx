import React, { useState, useRef, useEffect } from 'react';
import { SchoolClass, Student, SubjectInfo, getSubjectsForClass, isTahap1 } from '../types/uasa';
import { getGradeFromScore, getGradeBadgeColor, calculateStudentSummary } from '../utils/gradeCalculator';
import { UserPlus, ArrowUpDown, Trash2, Search, CheckCircle2, AlertTriangle, Sparkles, Keyboard } from 'lucide-react';

interface ScoreEntryProps {
  currentClass: SchoolClass;
  students: Student[];
  onUpdateScore: (studentId: string, subjectCode: string, value: number | 'TH' | null) => void;
  onOpenAddModal: () => void;
  onSortStudentsAZ: () => void;
  onClearAllScores: () => void;
  examType: 'UASA' | 'UPSA';
}

interface ScoreCellProps {
  studentId: string;
  studentIndex: number;
  subjectCode: string;
  subjectIndex: number;
  totalStudents: number;
  totalSubjects: number;
  value: number | 'TH' | null | undefined;
  onCommit: (studentId: string, subjectCode: string, val: number | 'TH' | null) => void;
}

const ScoreCell: React.FC<ScoreCellProps> = ({
  studentId,
  studentIndex,
  subjectCode,
  subjectIndex,
  totalStudents,
  totalSubjects,
  value,
  onCommit,
}) => {
  const [localText, setLocalText] = useState<string>(
    value === null || value === undefined ? '' : String(value)
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from props only when not currently focused by user
  useEffect(() => {
    if (!isFocused) {
      setLocalText(value === null || value === undefined ? '' : String(value));
    }
  }, [value, isFocused]);

  const parseAndCommit = (rawText: string) => {
    const trimmed = rawText.trim().toUpperCase();

    if (trimmed === '') {
      onCommit(studentId, subjectCode, null);
      return null;
    }

    if (trimmed === 'TH') {
      onCommit(studentId, subjectCode, 'TH');
      return 'TH';
    }

    // If only 'T', wait for blur or 'H', don't commit yet
    if (trimmed === 'T') {
      return 'T';
    }

    const num = parseFloat(trimmed);
    if (!isNaN(num)) {
      const clamped = Math.max(0, Math.min(100, Math.round(num)));
      onCommit(studentId, subjectCode, clamped);
      return clamped;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalText(text);

    // If empty or full number or full TH, commit immediately for real-time responsiveness
    const trimmed = text.trim().toUpperCase();
    if (trimmed === '') {
      onCommit(studentId, subjectCode, null);
    } else if (trimmed === 'TH') {
      onCommit(studentId, subjectCode, 'TH');
    } else {
      const num = parseFloat(trimmed);
      if (!isNaN(num)) {
        if (num > 100) {
          setLocalText('100');
          onCommit(studentId, subjectCode, 100);
        } else if (num >= 0) {
          onCommit(studentId, subjectCode, Math.round(num));
        }
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const trimmed = localText.trim().toUpperCase();
    if (trimmed === 'T' || trimmed === 'TH') {
      setLocalText('TH');
      onCommit(studentId, subjectCode, 'TH');
    } else if (trimmed === '') {
      setLocalText('');
      onCommit(studentId, subjectCode, null);
    } else {
      const num = parseFloat(trimmed);
      if (!isNaN(num)) {
        const clamped = Math.max(0, Math.min(100, Math.round(num)));
        setLocalText(String(clamped));
        onCommit(studentId, subjectCode, clamped);
      } else {
        // invalid input -> revert
        setLocalText(value === null || value === undefined ? '' : String(value));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      // Move to next student, same subject
      const nextRow = studentIndex + 1 < totalStudents ? studentIndex + 1 : 0;
      const targetId = `score-cell-${nextRow}-${subjectIndex}`;
      document.getElementById(targetId)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = studentIndex - 1 >= 0 ? studentIndex - 1 : totalStudents - 1;
      const targetId = `score-cell-${prevRow}-${subjectIndex}`;
      document.getElementById(targetId)?.focus();
    } else if (e.key === 'ArrowRight' && (inputRef.current?.selectionStart === localText.length || localText === '')) {
      // Move to next subject, same student
      if (subjectIndex + 1 < totalSubjects) {
        e.preventDefault();
        const targetId = `score-cell-${studentIndex}-${subjectIndex + 1}`;
        document.getElementById(targetId)?.focus();
      }
    } else if (e.key === 'ArrowLeft' && (inputRef.current?.selectionStart === 0 || localText === '')) {
      // Move to prev subject, same student
      if (subjectIndex - 1 >= 0) {
        e.preventDefault();
        const targetId = `score-cell-${studentIndex}-${subjectIndex - 1}`;
        document.getElementById(targetId)?.focus();
      }
    } else if (e.key === 'Escape') {
      setLocalText(value === null || value === undefined ? '' : String(value));
      inputRef.current?.blur();
    }
  };

  // Grade calculation for badge preview
  const currentGrade = (() => {
    const trimmed = localText.trim().toUpperCase();
    if (trimmed === 'TH') return getGradeFromScore('TH');
    const num = parseFloat(trimmed);
    if (!isNaN(num)) return getGradeFromScore(num);
    return null;
  })();

  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <input
        ref={inputRef}
        id={`score-cell-${studentIndex}-${subjectIndex}`}
        type="text"
        inputMode="text"
        autoComplete="off"
        value={localText}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.select();
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="-"
        className={`w-14 text-center py-1.5 px-1 text-xs font-bold rounded-md border transition-all duration-150 outline-none select-all ${
          isFocused
            ? 'bg-white border-emerald-500 ring-2 ring-emerald-400 text-emerald-950 shadow-sm'
            : localText !== ''
            ? 'bg-slate-50 border-slate-300 text-slate-900 hover:border-slate-400'
            : 'bg-white/60 border-slate-200 text-slate-400 hover:border-slate-300'
        }`}
      />

      {/* Grade badge */}
      <div className="h-4 flex items-center justify-center">
        {currentGrade ? (
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${getGradeBadgeColor(
              currentGrade.grade
            )}`}
          >
            {currentGrade.grade}
          </span>
        ) : (
          <span className="text-[9px] text-transparent select-none">-</span>
        )}
      </div>
    </div>
  );
};

export const ScoreEntry: React.FC<ScoreEntryProps> = ({
  currentClass,
  students,
  onUpdateScore,
  onOpenAddModal,
  onSortStudentsAZ,
  onClearAllScores,
  examType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const subjects = getSubjectsForClass(currentClass);
  const tahap1 = isTahap1(currentClass);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Lembaran Markah {examType} • {currentClass}</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  tahap1
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {tahap1 ? 'Tahap 1 (9 Subjek)' : 'Tahap 2 (11 Subjek)'}
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Kemasukan pantas 0–100 atau taip &apos;TH&apos;.</span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                <Keyboard className="w-3 h-3" />
                Tekan <strong>Enter</strong> atau <strong>↓</strong> untuk murid seterusnya
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama murid..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36 sm:w-44"
            />
          </div>

          {/* Sort A-Z button */}
          <button
            onClick={() => {
              setSortAsc(!sortAsc);
              onSortStudentsAZ();
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 transition cursor-pointer"
            title="Susun Mengikut Alfabet A-Z"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Susun A-Z</span>
          </button>

          {/* Clear scores button */}
          <button
            onClick={() => {
              if (
                confirm(
                  `Adakah anda pasti mahu mengosongkan semua markah bagi kelas ${currentClass}? Nama murid TIDAK akan dipadam.`
                )
              ) {
                onClearAllScores();
              }
            }}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 flex items-center gap-1 transition cursor-pointer"
            title="Kosongkan Markah Kelas Ini"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Kosongkan Markah</span>
          </button>

          {/* Add Student button */}
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Murid</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                <th className="py-3 px-2 text-center w-10">Bil</th>
                <th
                  onClick={() => {
                    setSortAsc(!sortAsc);
                    onSortStudentsAZ();
                  }}
                  className="py-3 px-3 min-w-[200px] cursor-pointer hover:bg-slate-200/70 transition select-none"
                >
                  <div className="flex items-center justify-between">
                    <span>Nama Murid</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                      A → Z
                    </span>
                  </div>
                </th>
                <th className="py-3 px-2 text-center w-12">J</th>

                {/* Subject Columns */}
                {subjects.map((sub) => (
                  <th
                    key={sub.code}
                    className="py-3 px-2 text-center min-w-[65px] bg-slate-50/70"
                    title={sub.name}
                  >
                    <span className="font-extrabold text-slate-800 text-xs">{sub.code}</span>
                  </th>
                ))}

                <th className="py-3 px-2 text-center w-16 bg-slate-100">Jumlah</th>
                <th className="py-3 px-2 text-center w-16 bg-slate-100">Purata</th>
                <th className="py-3 px-3 text-center min-w-[110px] bg-slate-100">Keputusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={subjects.length + 6}
                    className="text-center py-10 text-slate-400 text-xs"
                  >
                    Tiada murid ditemui. Klik &quot;+ Tambah Murid&quot; untuk mendaftar murid.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, studentIdx) => {
                  const summary = calculateStudentSummary(student, subjects);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-emerald-50/40 transition divide-x divide-slate-200 group"
                    >
                      <td className="py-2 px-2 text-center font-mono text-slate-500 font-semibold">
                        {studentIdx + 1}
                      </td>

                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {student.name}
                      </td>

                      <td className="py-2 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            student.gender === 'L'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>

                      {/* Subject Cells */}
                      {subjects.map((sub, subjectIdx) => (
                        <td key={sub.code} className="px-1 text-center align-top">
                          <ScoreCell
                            studentId={student.id}
                            studentIndex={studentIdx}
                            subjectCode={sub.code}
                            subjectIndex={subjectIdx}
                            totalStudents={filteredStudents.length}
                            totalSubjects={subjects.length}
                            value={student.scores[sub.code]}
                            onCommit={onUpdateScore}
                          />
                        </td>
                      ))}

                      {/* Summary Columns */}
                      <td className="py-2 px-2 text-center font-bold font-mono text-slate-800 bg-slate-50/50 align-middle">
                        {summary.subjectsEntered > 0 ? summary.totalScore : '-'}
                      </td>

                      <td className="py-2 px-2 text-center font-bold font-mono text-slate-800 bg-slate-50/50 align-middle">
                        {summary.subjectsEntered > 0 ? `${summary.averageScore}%` : '-'}
                      </td>

                      <td className="py-2 px-3 text-center bg-slate-50/50 align-middle">
                        {summary.subjectsEntered === 0 ? (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Belum Diisi
                          </span>
                        ) : summary.status === 'Cemerlang' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Cemerlang
                          </span>
                        ) : summary.status === 'Lulus' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Lulus (MTM)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Perlu Bimbingan
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            Jumlah Murid: <span className="font-bold text-slate-800">{students.length}</span> orang
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Gred A: 80-100
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> B: 65-79
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> C: 50-64
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> D: 40-49
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> E: 0-39
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> TH: Tidak Hadir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
