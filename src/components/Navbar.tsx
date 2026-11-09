import React from 'react';
import { SchoolClass, SCHOOL_CLASSES, TeacherUser } from '../types/uasa';
import { SKBatandokLogo } from './SKBatandokLogo';
import { LogOut, Cloud, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentClass: SchoolClass;
  onSelectClass: (c: SchoolClass) => void;
  activeTab: 'scores' | 'analytics' | 'panitia' | 'slips' | 'admin';
  onSelectTab: (tab: 'scores' | 'analytics' | 'panitia' | 'slips' | 'admin') => void;
  currentUser: TeacherUser | null;
  onLogout: () => void;
  year: number;
  examType: 'UASA' | 'UPSA';
  onToggleExamType: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClass,
  onSelectClass,
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  year,
  examType,
  onToggleExamType,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <SKBatandokLogo size="md" className="border-2 border-amber-300" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight flex items-center gap-2">
                  <span className="text-amber-300">SPAM-Batandok</span>
                  <span className="text-white text-xs sm:text-sm font-semibold opacity-90">| SK Batandok</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-700 text-amber-300 font-semibold text-[10px] rounded-md tracking-wider">
                  XBA6003
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Sistem Pengurusan & Analisis Markah {examType} & PBD • Beaufort, Sabah
              </p>
            </div>
          </div>

          {/* Right Controls: Year, Exam toggle, Cloud Status, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Exam Toggle */}
            <button
              onClick={onToggleExamType}
              className="px-2.5 py-1 bg-emerald-900/80 hover:bg-emerald-950 border border-emerald-600 rounded-lg text-xs font-bold text-amber-300 transition cursor-pointer flex items-center gap-1 shadow-sm"
              title="Tukar jenis peperiksaan"
            >
              <span>{examType}</span>
              <span className="text-[10px] text-emerald-300 font-normal">↺</span>
            </button>

            {/* Sesi Year Badge */}
            <div className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-600/50 rounded-lg text-xs font-semibold text-emerald-100 flex items-center gap-1.5">
              <span>Sesi {year}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded">Semasa</span>
            </div>

            {/* Cloud Real-Time Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-900/60 border border-emerald-600/50 rounded-lg text-xs text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-[11px] font-medium">Pangkalan Data Berpusat: Aktif</span>
            </div>

            {/* Teacher Badge & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-emerald-700">
                {currentUser.role === 'admin' ? (
                  <span className="px-2 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-md flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-900" />
                    <span>ADMIN: {currentUser.name}</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-emerald-100 max-w-[130px] truncate" title={currentUser.name}>
                    {currentUser.name}
                  </span>
                )}

                <button
                  onClick={onLogout}
                  className="p-1.5 bg-emerald-700/60 hover:bg-rose-600 text-white rounded-md transition cursor-pointer"
                  title="Log Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Selector Bar: 1 BERUSAHA to 6 BITARA (No 'Tahun' word, highlighted green) */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            PILIHAN KELAS:
          </span>
          {SCHOOL_CLASSES.map((cls) => {
            const isActive = currentClass === cls;
            return (
              <button
                key={cls}
                onClick={() => onSelectClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-emerald-200 ring-2 ring-emerald-500'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {cls}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onSelectTab('scores')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition ${
              activeTab === 'scores'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            1. Isi Markah Murid
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            2. Analisis & Keputusan
          </button>

          <button
            onClick={() => onSelectTab('panitia')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition ${
              activeTab === 'panitia'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            3. Analisis Panitia
          </button>

          <button
            onClick={() => onSelectTab('slips')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition ${
              activeTab === 'slips'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            4. Slip Keputusan Murid
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-amber-800 hover:text-amber-900 hover:border-amber-300'
              }`}
            >
              <span>🛡️ 5. Panel Admin (Firdaus)</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
