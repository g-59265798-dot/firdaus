import React from 'react';
import { SchoolClass, Student, getSubjectsForClass, isTahap1 } from '../types/uasa';
import { calculateStudentSummary, calculateSubjectAnalytics } from '../utils/gradeCalculator';
import { exportClassToExcel } from '../utils/exportUtils';
import { FileSpreadsheet, Award, AlertTriangle, Printer, TrendingUp, Users } from 'lucide-react';

interface AnalyticsDashboardProps {
  currentClass: SchoolClass;
  students: Student[];
  examType: 'UASA' | 'UPSA';
  year: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentClass,
  students,
  examType,
  year,
}) => {
  const subjects = getSubjectsForClass(currentClass);
  const tahap1 = isTahap1(currentClass);

  // Overall student summaries
  const studentSummaries = students.map((s) => ({
    student: s,
    summary: calculateStudentSummary(s, subjects),
  }));

  const totalStudents = students.length;
  const gradedStudents = studentSummaries.filter((s) => s.summary.subjectsEntered > 0);
  const passedStudents = studentSummaries.filter((s) => s.summary.isAllPassed);
  const excellentStudents = studentSummaries.filter((s) => s.summary.status === 'Cemerlang');
  const interventionStudents = studentSummaries.filter((s) => s.summary.status === 'Perlu Bimbingan');

  const overallPassPercent =
    gradedStudents.length > 0
      ? parseFloat(((passedStudents.length / gradedStudents.length) * 100).toFixed(1))
      : 0;

  // Calculate subject analytics
  const subjectStats = subjects.map((sub) => calculateSubjectAnalytics(students, sub));

  const totalGpmpSum = subjectStats.reduce((acc, curr) => acc + curr.gpmp, 0);
  const classGpmp =
    subjectStats.length > 0 ? parseFloat((totalGpmpSum / subjectStats.length).toFixed(2)) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pass % */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Peratus Lulus (MTM)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{overallPassPercent}%</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {passedStudents.length} daripada {gradedStudents.length} murid dinilai
          </p>
        </div>

        {/* GPMP */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">GPMP Purata Kelas</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{classGpmp}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gred Purata Mata Pelajaran ({subjects.length} subjek)
          </p>
        </div>

        {/* Cemerlang */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Kelompok Cemerlang</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{excellentStudents.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Murid cemerlang dominan Gred A</p>
        </div>

        {/* Intervensi */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Perlu Bimbingan</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{interventionStudents.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Murid perlukan program galus</p>
        </div>
      </div>

      {/* Subject Analysis Table with Excel Export Button */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Analisis Gred & GPMP Setiap Mata Pelajaran • {currentClass}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  tahap1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {tahap1 ? 'Tahap 1 (9 Subjek)' : 'Tahap 2 (11 Subjek)'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Jadual statistik rasmi peperiksaan {examType} Sesi {year}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Excel Export Button ONLY HERE */}
            <button
              onClick={() => exportClassToExcel(currentClass, students, examType, year)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Eksport Fail Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Analisis</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                <th className="py-2.5 px-3">Mata Pelajaran</th>
                <th className="py-2.5 px-2 text-center w-14">Calon</th>
                <th className="py-2.5 px-2 text-center w-14">Hadir</th>
                <th className="py-2.5 px-2 text-center w-14">TH</th>
                <th className="py-2.5 px-2 text-center w-12 bg-emerald-50 text-emerald-800">A</th>
                <th className="py-2.5 px-2 text-center w-12 bg-blue-50 text-blue-800">B</th>
                <th className="py-2.5 px-2 text-center w-12 bg-cyan-50 text-cyan-800">C</th>
                <th className="py-2.5 px-2 text-center w-12 bg-amber-50 text-amber-800">D</th>
                <th className="py-2.5 px-2 text-center w-12 bg-rose-50 text-rose-800">E</th>
                <th className="py-2.5 px-3 text-center min-w-[90px]">% Lulus (MTM)</th>
                <th className="py-2.5 px-2 text-center w-16">GPMP</th>
                <th className="py-2.5 px-2 text-center w-16">Purata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjectStats.map((stat) => (
                <tr key={stat.subject.code} className="hover:bg-slate-50 transition divide-x divide-slate-200">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div>{stat.subject.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {stat.subject.code}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono">{stat.totalCandidates}</td>
                  <td className="py-2 px-2 text-center font-mono">{stat.presentCount}</td>
                  <td className="py-2 px-2 text-center font-mono text-slate-400">{stat.thCount}</td>
                  <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50/30">
                    {stat.gradeCounts.A}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-blue-700 bg-blue-50/30">
                    {stat.gradeCounts.B}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-cyan-700 bg-cyan-50/30">
                    {stat.gradeCounts.C}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-amber-700 bg-amber-50/30">
                    {stat.gradeCounts.D}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-rose-700 bg-rose-50/30">
                    {stat.gradeCounts.E}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-slate-800">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        stat.passPercent >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : stat.passPercent >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {stat.passPercent}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-black font-mono text-slate-900">
                    {stat.gpmp}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-slate-600">
                    {stat.averageScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Grouping: Cemerlang vs Perlu Intervensi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cemerlang */}
        <div className="bg-white rounded-xl shadow-xs border border-emerald-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Senarai Murid Cemerlang ({excellentStudents.length})</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              Potensi Straight A / B
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-56 overflow-y-auto">
            {excellentStudents.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                Belum ada murid kelompok cemerlang atau markah belum diisi.
              </p>
            ) : (
              excellentStudents.map(({ student, summary }, i) => (
                <div key={student.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono w-4">{i + 1}.</span>
                    <span className="font-bold text-slate-800">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className="text-emerald-700">{summary.gradeCounts.A}A</span>
                    <span className="text-slate-500 text-[11px]">Purata: {summary.averageScore}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Perlu Bimbingan */}
        <div className="bg-white rounded-xl shadow-xs border border-rose-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h4 className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Senarai Murid Perlu Bimbingan ({interventionStudents.length})</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">
              Program Galus & Pemulihan
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-56 overflow-y-auto">
            {interventionStudents.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                Tiada murid yang gagal atau memerlukan bimbingan khusus.
              </p>
            ) : (
              interventionStudents.map(({ student, summary }, i) => (
                <div key={student.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono w-4">{i + 1}.</span>
                    <span className="font-bold text-slate-800">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className="text-rose-700">{summary.gradeCounts.E} Gred E</span>
                    <span className="text-slate-500 text-[11px]">Purata: {summary.averageScore}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
