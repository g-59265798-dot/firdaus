import React, { useState } from 'react';
import { TeacherUser } from '../types/uasa';
import { SKBatandokLogo } from './SKBatandokLogo';
import { ShieldCheck, UserCheck, ArrowRight, Lock, User } from 'lucide-react';

interface TeacherLoginProps {
  onLogin: (teacher: TeacherUser) => void;
}

export const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [ic, setIc] = useState('');
  const [error, setError] = useState('');

  const formatIcNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    if (cleaned.length > 8) {
      return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    } else if (cleaned.length > 6) {
      return `${cleaned.slice(0, 6)}-${cleaned.slice(6)}`;
    }
    return cleaned;
  };

  const handleIcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIc(formatIcNumber(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sila masukkan nama guru');
      return;
    }
    const cleanIc = ic.replace(/\D/g, '');
    if (cleanIc.length < 12) {
      setError('Sila masukkan No. Kad Pengenalan (12 digit)');
      return;
    }

    const isAdmin =
      name.toUpperCase().includes('FIRDAUS') ||
      cleanIc === '840314125159';

    const teacher: TeacherUser = {
      name: name.trim().toUpperCase(),
      ic: ic.trim(),
      role: isAdmin ? 'admin' : 'guru',
      mainClass: '1 BERUSAHA',
      loginTime: new Date().toLocaleTimeString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onLogin(teacher);
  };

  const handleFastLoginAdmin = () => {
    const adminTeacher: TeacherUser = {
      name: 'FIRDAUS',
      ic: '840314-12-5159',
      role: 'admin',
      mainClass: '1 BERUSAHA',
      loginTime: new Date().toLocaleTimeString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onLogin(adminTeacher);
  };

  const handleFastLoginTeacher = () => {
    const regularTeacher: TeacherUser = {
      name: 'NORAZLINA BINTI MAHMUD',
      ic: '890512-12-5524',
      role: 'guru',
      mainClass: '1 BERUSAHA',
      loginTime: new Date().toLocaleTimeString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onLogin(regularTeacher);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-8 text-center text-white relative">
          <div className="flex justify-center mb-3">
            <SKBatandokLogo size="lg" className="border-2 border-amber-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-amber-300">SPAM-Batandok</h1>
          <p className="text-white text-sm font-semibold tracking-wide mt-0.5">
            SK BATANDOK, BEAUFORT
          </p>
          <p className="text-emerald-200 text-xs mt-0.5 font-medium tracking-wider">
            KOD SEKOLAH: XBA6003 • SABAH
          </p>
          <div className="inline-block mt-2.5 px-3 py-1 bg-emerald-900/60 rounded-full border border-emerald-500/40 text-xs text-amber-300 font-semibold">
            Sistem Pengurusan & Analisis Markah (Sesi 2026)
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Penuh Guru
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: Cikgu Firdaus"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. Kad Pengenalan (IC)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={ic}
                onChange={handleIcChange}
                placeholder="XXXXXX-XX-XXXX"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Digunakan untuk pengesahan & tandatangan slip keputusan rasmi.
            </p>
          </div>


          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Log Masuk Sistem</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Login Section */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-center text-xs text-slate-500 font-medium mb-2.5">
              Akses Pantas Satu Klik:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFastLoginAdmin}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>🛡️ Admin (Firdaus)</span>
              </button>
              <button
                type="button"
                onClick={handleFastLoginTeacher}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Guru (Norazlina)</span>
              </button>
            </div>
          </div>
        </form>

        <div className="px-6 py-3 bg-slate-50 text-center border-t border-slate-100 text-[11px] text-slate-500">
          Pangkalan Data Berpusat Masa Nyata (Sesi 2026)
        </div>
      </div>
    </div>
  );
};
