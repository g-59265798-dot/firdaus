import React, { useState } from 'react';
import { SchoolClass, Student, TeacherUser, getSubjectsForClass, isTahap1 } from '../types/uasa';
import { calculateStudentSummary, getGradeFromScore } from '../utils/gradeCalculator';
import { SKBatandokLogo } from './SKBatandokLogo';
import { Printer, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface StudentResultSlipsProps {
  currentClass: SchoolClass;
  students: Student[];
  examType: 'UASA' | 'UPSA';
  year: number;
  currentUser: TeacherUser | null;
}

export const StudentResultSlips: React.FC<StudentResultSlipsProps> = ({
  currentClass,
  students,
  examType,
  year,
  currentUser,
}) => {
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [printMode, setPrintMode] = useState<'single' | 'all'>('single');

  const subjects = getSubjectsForClass(currentClass);
  const tahap1 = isTahap1(currentClass);

  if (students.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-xs border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Tiada murid dalam kelas {currentClass}.</p>
      </div>
    );
  }

  const currentStudent = students[selectedStudentIndex] || students[0];

  const renderSingleSlip = (student: Student, index: number) => {
    const summary = calculateStudentSummary(student, subjects);

    return (
      <div
        key={student.id}
        className="bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-slate-300 print:border-none print:shadow-none print:p-0 max-w-3xl mx-auto print:max-w-none print:page-break-after-always"
      >
        {/* Letterhead */}
        <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-800">
          <SKBatandokLogo size="lg" className="border border-slate-200" />
          <div className="flex-1 text-center pr-12">
            <h2 className="text-lg font-black text-slate-900 tracking-wide uppercase">
              SEKOLAH KEBANGSAAN BATANDOK
            </h2>
            <p className="text-xs text-slate-600 font-semibold">
              PETI SURAT 123, 89807 BEAUFORT, SABAH • KOD SEKOLAH: XBA6003
            </p>
            <p className="text-[11px] text-slate-500 font-medium italic mt-0.5">
              &quot;BERUSAHA BERILMU JAYA&quot;
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-xs uppercase tracking-wider border border-slate-300">
              SLIP KEPUTUSAN PENTAKSIRAN {examType} & PBD • SESI {year}
            </div>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200 bg-slate-50/60 px-4 mt-3 rounded-lg print:bg-transparent print:px-0">
          <div>
            <div className="flex">
              <span className="w-24 font-bold text-slate-600">Nama Murid:</span>
              <span className="font-black text-slate-900 uppercase">{student.name}</span>
            </div>
            <div className="flex mt-1">
              <span className="w-24 font-bold text-slate-600">Jantina:</span>
              <span className="font-semibold text-slate-800">
                {student.gender === 'L' ? 'LELAKI' : 'PEREMPUAN'}
              </span>
            </div>
          </div>
          <div>
            <div className="flex">
              <span className="w-24 font-bold text-slate-600">Kelas:</span>
              <span className="font-black text-slate-900">{currentClass}</span>
            </div>
            <div className="flex mt-1">
              <span className="w-24 font-bold text-slate-600">Tahap:</span>
              <span className="font-semibold text-slate-800">
                {tahap1 ? 'Tahap 1 (Tahun 1-3)' : 'Tahap 2 (Tahun 4-6)'}
              </span>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-5">
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 divide-x divide-slate-300">
                <th className="py-2 px-2 text-center w-10">Bil</th>
                <th className="py-2 px-3">Mata Pelajaran</th>
                <th className="py-2 px-2 text-center w-16">Markah</th>
                <th className="py-2 px-2 text-center w-14">Gred</th>
                <th className="py-2 px-3 text-center min-w-[120px]">Keterangan Gred</th>
                <th className="py-2 px-2 text-center w-16">Tahap (TP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {subjects.map((sub, i) => {
                const score = student.scores[sub.code];
                const gradeInfo = getGradeFromScore(score);
                const isEntered = score !== null && score !== undefined;

                // Estimate TP or read student's tp
                let tpDisplay = '-';
                if (student.tpScores && student.tpScores[sub.code]) {
                  tpDisplay = `TP ${student.tpScores[sub.code]}`;
                } else if (typeof score === 'number') {
                  if (score >= 80) tpDisplay = 'TP 6';
                  else if (score >= 65) tpDisplay = 'TP 5';
                  else if (score >= 50) tpDisplay = 'TP 4';
                  else if (score >= 40) tpDisplay = 'TP 3';
                  else tpDisplay = 'TP 2';
                }

                return (
                  <tr key={sub.code} className="divide-x divide-slate-300">
                    <td className="py-2 px-2 text-center font-mono">{i + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {sub.name} ({sub.code})
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold">
                      {isEntered ? (score === 'TH' ? 'TH' : score) : '-'}
                    </td>
                    <td className="py-2 px-2 text-center font-bold">
                      {isEntered ? gradeInfo.grade : '-'}
                    </td>
                    <td className="py-2 px-3 text-center text-[11px] text-slate-700">
                      {isEntered ? gradeInfo.label : '-'}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-slate-800">
                      {tpDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        <div className="mt-4 p-4 border border-slate-300 rounded-lg bg-slate-50/50 print:bg-transparent">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">Jumlah Markah</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {summary.subjectsEntered > 0 ? summary.totalScore : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">Markah Purata</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {summary.subjectsEntered > 0 ? `${summary.averageScore}%` : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">Gred Purata (GPI)</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {summary.subjectsEntered > 0 ? summary.gpa : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">Keputusan Rasmi</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                  summary.status === 'Cemerlang'
                    ? 'bg-emerald-100 text-emerald-800'
                    : summary.status === 'Lulus'
                    ? 'bg-blue-100 text-blue-800'
                    : summary.status === 'Perlu Bimbingan'
                    ? 'bg-rose-100 text-rose-800'
                    : 'text-slate-400'
                }`}
              >
                {summary.status}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-12 mt-6 border-t border-slate-200 text-center text-xs">
          <div>
            <div className="border-b border-slate-400 pb-1 h-12 flex items-end justify-center font-semibold text-slate-800">
              {currentUser?.name || 'GURU KELAS'}
            </div>
            <p className="font-bold text-slate-800 mt-1">Guru Kelas</p>
            <p className="text-[10px] text-slate-500">{currentClass}</p>
          </div>

          <div>
            <div className="border-b border-slate-400 pb-1 h-12"></div>
            <p className="font-bold text-slate-800 mt-1">Guru Besar</p>
            <p className="text-[10px] text-slate-500">SK Batandok Beaufort</p>
          </div>

          <div>
            <div className="border-b border-slate-400 pb-1 h-12"></div>
            <p className="font-bold text-slate-800 mt-1">Tandatangan Penjaga</p>
            <p className="text-[10px] text-slate-500">Ibu / Bapa / Penjaga</p>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-400 print:text-slate-500">
          Dokumen ini dijana secara digital oleh SPAM-Batandok (Sistem Pengurusan & Analisis Markah SK Batandok) • Sesi {year}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Selector & Print Controls */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Pilih Murid:</label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedStudentIndex(Math.max(0, selectedStudentIndex - 1))}
              disabled={selectedStudentIndex === 0}
              className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={selectedStudentIndex}
              onChange={(e) => setSelectedStudentIndex(parseInt(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[280px]"
            >
              {students.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {idx + 1}. {s.name} ({s.gender})
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setSelectedStudentIndex(
                  Math.min(students.length - 1, selectedStudentIndex + 1)
                )
              }
              disabled={selectedStudentIndex === students.length - 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPrintMode('single');
              setTimeout(() => window.print(), 100);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Slip Murid Ini</span>
          </button>

          <button
            onClick={() => {
              setPrintMode('all');
              setTimeout(() => window.print(), 100);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Semua Murid ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Slip Display */}
      {printMode === 'all' ? (
        <div className="space-y-8">
          {students.map((student, idx) => renderSingleSlip(student, idx))}
        </div>
      ) : (
        renderSingleSlip(currentStudent, selectedStudentIndex)
      )}
    </div>
  );
};
