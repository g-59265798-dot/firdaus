import React, { useState } from 'react';
import {
  ALL_SUBJECTS,
  SCHOOL_CLASSES,
  Student,
  TeacherUser,
  getSubjectsForClass,
} from '../types/uasa';
import { calculateStudentSummary, calculateSubjectAnalytics } from '../utils/gradeCalculator';
import {
  ShieldCheck,
  Users,
  BarChart3,
  TrendingUp,
  Award,
  Search,
  Trash2,
  Printer,
  School,
} from 'lucide-react';

interface AdminDashboardProps {
  classesData: Record<string, Student[]>;
  teacherLogs: TeacherUser[];
  onClearLogs: () => void;
  year: number;
  examType: 'UASA' | 'UPSA';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  classesData,
  teacherLogs,
  onClearLogs,
  year,
  examType,
}) => {
  const [logSearch, setLogSearch] = useState('');

  // Class analytics
  const classStats = SCHOOL_CLASSES.map((cls) => {
    const students = classesData[cls] || [];
    const subjects = getSubjectsForClass(cls);
    const summaries = students.map((s) => calculateStudentSummary(s, subjects));
    const graded = summaries.filter((s) => s.subjectsEntered > 0);
    const passed = summaries.filter((s) => s.isAllPassed);
    const cemerlang = summaries.filter((s) => s.status === 'Cemerlang');
    const galus = summaries.filter((s) => s.status === 'Perlu Bimbingan');

    const passPercent =
      graded.length > 0 ? parseFloat(((passed.length / graded.length) * 100).toFixed(1)) : 0;

    // Calculate GPMP for class
    const subStats = subjects.map((sub) => calculateSubjectAnalytics(students, sub));
    const gpmpSum = subStats.reduce((a, b) => a + b.gpmp, 0);
    const avgGpmp = subStats.length > 0 ? parseFloat((gpmpSum / subStats.length).toFixed(2)) : 0;

    return {
      className: cls,
      studentCount: students.length,
      gradedCount: graded.length,
      passedCount: passed.length,
      passPercent,
      avgGpmp,
      cemerlangCount: cemerlang.length,
      galusCount: galus.length,
    };
  });

  const totalSchoolStudents = classStats.reduce((a, b) => a + b.studentCount, 0);
  const totalSchoolPassed = classStats.reduce((a, b) => a + b.passedCount, 0);
  const totalSchoolGraded = classStats.reduce((a, b) => a + b.gradedCount, 0);
  const schoolPassPercent =
    totalSchoolGraded > 0
      ? parseFloat(((totalSchoolPassed / totalSchoolGraded) * 100).toFixed(1))
      : 0;

  // Filter teacher logs
  const filteredLogs = teacherLogs.filter(
    (l) =>
      l.name.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.ic.includes(logSearch) ||
      l.mainClass.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Welcome Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-900/50 rounded-xl border border-amber-400/40">
            <ShieldCheck className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-900/70 text-amber-200 text-[10px] font-bold rounded uppercase">
                Panel Kawalan Pentadbir
              </span>
              <span className="text-xs text-amber-100 font-semibold">SK BATANDOK (XBA6003)</span>
            </div>
            <h2 className="text-xl font-black tracking-tight mt-0.5">
              Papan Pemuka Eksekutif • Cikgu Firdaus
            </h2>
            <p className="text-xs text-amber-100 mt-1">
              Pemantauan berpusat kemasukan markah {examType}, kehadiran guru, dan headcount sekolah sesi {year}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-700" />
          <span>Cetak Laporan Pentadbir</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Jumlah Murid Sekolah</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalSchoolStudents}</div>
          <p className="text-[11px] text-slate-500 mt-1">6 Kelas (1 Berusaha - 6 Bitara)</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">% Kelulusan Sekolah</span>
          <div className="text-2xl font-black text-emerald-600 mt-2">{schoolPassPercent}%</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalSchoolPassed} daripada {totalSchoolGraded} calon dinilai
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Guru Pernah Akses</span>
          <div className="text-2xl font-black text-blue-600 mt-2">{teacherLogs.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Log sistem terkini</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Pangkalan Data Awan</span>
          <div className="text-base font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Bersepadu Masa Nyata</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sesi Persekolahan 2026</p>
        </div>
      </div>

      {/* Class Comparison Chart and Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Analisis Perbandingan Setiap Kelas (1 Berusaha hingga 6 Bitara)
            </h3>
            <p className="text-xs text-slate-500">
              Peratus Lulus (MTM) & GPMP bagi setiap kelas
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">Peperiksaan: {examType}</span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-3 mb-6">
          {classStats.map((c) => (
            <div key={c.className} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{c.className}</span>
                <span className="text-slate-600 font-mono">
                  Lulus: <strong className="text-emerald-700">{c.passPercent}%</strong> • GPMP:{' '}
                  <strong className="text-blue-700">{c.avgGpmp}</strong> ({c.studentCount} murid)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${c.passPercent}%` }}
                  title={`% Lulus: ${c.passPercent}%`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Headcount Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-2 text-center w-20">Enrolmen</th>
                <th className="py-2.5 px-2 text-center w-20">Dinilai</th>
                <th className="py-2.5 px-2 text-center w-20">Lulus</th>
                <th className="py-2.5 px-2 text-center w-20">% Lulus</th>
                <th className="py-2.5 px-2 text-center w-20">GPMP</th>
                <th className="py-2.5 px-2 text-center w-24 text-emerald-800 bg-emerald-50/50">
                  Cemerlang
                </th>
                <th className="py-2.5 px-2 text-center w-24 text-rose-800 bg-rose-50/50">
                  Perlu Bimbingan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStats.map((c) => (
                <tr key={c.className} className="hover:bg-slate-50 transition divide-x divide-slate-200">
                  <td className="py-2 px-3 font-bold text-slate-900">{c.className}</td>
                  <td className="py-2 px-2 text-center font-mono">{c.studentCount}</td>
                  <td className="py-2 px-2 text-center font-mono">{c.gradedCount}</td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-emerald-700">
                    {c.passedCount}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        c.passPercent >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.passPercent >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.passPercent}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-black">{c.avgGpmp}</td>
                  <td className="py-2 px-2 text-center font-mono text-emerald-700 bg-emerald-50/20 font-bold">
                    {c.cemerlangCount}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-rose-700 bg-rose-50/20 font-bold">
                    {c.galusCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Logins Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Senarai Rekod Guru Yang Telah Log Masuk
            </h3>
            <p className="text-xs text-slate-500">
              Jejak keselamatan & pemantauan capaian sistem pengurusan markah
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Cari guru / IC..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-44"
              />
            </div>

            <button
              onClick={() => {
                if (confirm('Kosongkan semua log rekod log masuk guru?')) {
                  onClearLogs();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              title="Kosongkan Log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                <th className="py-2.5 px-2 text-center w-10">Bil</th>
                <th className="py-2.5 px-3">Nama Guru</th>
                <th className="py-2.5 px-3 w-36">No. Kad Pengenalan</th>
                <th className="py-2.5 px-3 w-32">Kelas Utama</th>
                <th className="py-2.5 px-2 text-center w-24">Peranan</th>
                <th className="py-2.5 px-3 w-40">Waktu Log Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                    Tiada rekod log masuk ditemui.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition divide-x divide-slate-200">
                    <td className="py-2 px-2 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{log.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{log.ic}</td>
                    <td className="py-2 px-3 text-slate-800">{log.mainClass}</td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.role === 'admin' ? 'Pentadbir' : 'Guru'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                      {log.loginTime}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
