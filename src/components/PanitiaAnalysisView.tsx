import React, { useState } from 'react';
import {
  ALL_SUBJECTS,
  SCHOOL_CLASSES,
  PanitiaSubjectRecord,
  Student,
  SubjectInfo,
} from '../types/uasa';
import { SpiderWebChart, RadarDataPoint } from './SpiderWebChart';
import { SKBatandokLogo } from './SKBatandokLogo';
import {
  Sparkles,
  Printer,
  Edit3,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

interface PanitiaAnalysisViewProps {
  panitiaData: Record<string, PanitiaSubjectRecord>;
  classesData: Record<string, Student[]>;
  onUpdatePanitiaRecord: (subjectCode: string, record: PanitiaSubjectRecord) => void;
  year: number;
}

export const PanitiaAnalysisView: React.FC<PanitiaAnalysisViewProps> = ({
  panitiaData,
  classesData,
  onUpdatePanitiaRecord,
  year,
}) => {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('BM');
  const [editingNotesClass, setEditingNotesClass] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const currentSubject: SubjectInfo =
    ALL_SUBJECTS.find((s) => s.code === selectedSubjectCode) || ALL_SUBJECTS[0];

  const currentRecord: PanitiaSubjectRecord = panitiaData[selectedSubjectCode] || {
    classes: {},
    reviewChallenges: '',
    reviewInterventions: '',
  };

  const getRecordForClass = (cls: string) => {
    return (
      currentRecord.classes[cls] || {
        tp1: 0,
        tp2: 0,
        tp3: 0,
        tp4: 0,
        tp5: 0,
        tp6: 0,
        customNotes: '',
      }
    );
  };

  const handleUpdateClassTP = (
    cls: string,
    tpKey: 'tp1' | 'tp2' | 'tp3' | 'tp4' | 'tp5' | 'tp6',
    deltaOrVal: number,
    isDelta = false
  ) => {
    const existing = getRecordForClass(cls);
    const currentVal = existing[tpKey] || 0;
    const newVal = isDelta ? Math.max(0, currentVal + deltaOrVal) : Math.max(0, deltaOrVal);

    const updatedClasses = {
      ...currentRecord.classes,
      [cls]: {
        ...existing,
        [tpKey]: newVal,
      },
    };

    onUpdatePanitiaRecord(selectedSubjectCode, {
      ...currentRecord,
      classes: updatedClasses,
    });
  };

  const handleSaveNotes = (cls: string) => {
    const existing = getRecordForClass(cls);
    const updatedClasses = {
      ...currentRecord.classes,
      [cls]: {
        ...existing,
        customNotes: notesInput,
      },
    };

    onUpdatePanitiaRecord(selectedSubjectCode, {
      ...currentRecord,
      classes: updatedClasses,
    });
    setEditingNotesClass(null);
  };

  const handleUpdateReview = (field: 'challenges' | 'interventions', value: string) => {
    onUpdatePanitiaRecord(selectedSubjectCode, {
      ...currentRecord,
      reviewChallenges: field === 'challenges' ? value : currentRecord.reviewChallenges,
      reviewInterventions:
        field === 'interventions' ? value : currentRecord.reviewInterventions,
    });
  };

  // Quick helper: Set all to TP3 for current subject
  const handleSetAllTP3 = () => {
    const updatedClasses: Record<string, any> = { ...currentRecord.classes };
    SCHOOL_CLASSES.forEach((cls) => {
      const studentCount = (classesData[cls] || []).length;
      updatedClasses[cls] = {
        tp1: 0,
        tp2: 0,
        tp3: studentCount,
        tp4: 0,
        tp5: 0,
        tp6: 0,
        customNotes: '',
      };
    });

    onUpdatePanitiaRecord(selectedSubjectCode, {
      ...currentRecord,
      classes: updatedClasses,
    });
  };

  // Quick helper: Clear TP for current subject
  const handleClearSubject = () => {
    if (confirm(`Kosongkan semua data TP bagi subjek ${currentSubject.name}?`)) {
      const updatedClasses: Record<string, any> = {};
      SCHOOL_CLASSES.forEach((cls) => {
        updatedClasses[cls] = {
          tp1: 0,
          tp2: 0,
          tp3: 0,
          tp4: 0,
          tp5: 0,
          tp6: 0,
          customNotes: '',
        };
      });

      onUpdatePanitiaRecord(selectedSubjectCode, {
        ...currentRecord,
        classes: updatedClasses,
      });
    }
  };

  // Quick helper: Auto estimate TP from exam marks
  const handleAutoSuggestFromExam = () => {
    const updatedClasses: Record<string, any> = { ...currentRecord.classes };

    SCHOOL_CLASSES.forEach((cls) => {
      const students = classesData[cls] || [];
      const counts = { tp1: 0, tp2: 0, tp3: 0, tp4: 0, tp5: 0, tp6: 0 };

      students.forEach((s) => {
        const score = s.scores[selectedSubjectCode];
        if (typeof score === 'number') {
          if (score >= 85) counts.tp6++;
          else if (score >= 70) counts.tp5++;
          else if (score >= 55) counts.tp4++;
          else if (score >= 40) counts.tp3++;
          else if (score >= 20) counts.tp2++;
          else counts.tp1++;
        } else {
          // default TP3 if unentered
          counts.tp3++;
        }
      });

      updatedClasses[cls] = {
        ...counts,
        customNotes: '',
      };
    });

    onUpdatePanitiaRecord(selectedSubjectCode, {
      ...currentRecord,
      classes: updatedClasses,
    });
  };

  // Totals calculations across the school for this subject
  let totalSchoolAssessed = 0;
  let totalTp1 = 0;
  let totalTp2 = 0;
  let totalTp3 = 0;
  let totalTp4 = 0;
  let totalTp5 = 0;
  let totalTp6 = 0;

  SCHOOL_CLASSES.forEach((cls) => {
    const data = getRecordForClass(cls);
    const count = (classesData[cls] || []).length;
    totalSchoolAssessed += count;
    totalTp1 += data.tp1;
    totalTp2 += data.tp2;
    totalTp3 += data.tp3;
    totalTp4 += data.tp4;
    totalTp5 += data.tp5;
    totalTp6 += data.tp6;
  });

  const totalFilled =
    totalTp1 + totalTp2 + totalTp3 + totalTp4 + totalTp5 + totalTp6;
  const totalSchoolMtm = totalTp3 + totalTp4 + totalTp5 + totalTp6;
  const schoolMtmPercent =
    totalFilled > 0 ? parseFloat(((totalSchoolMtm / totalFilled) * 100).toFixed(1)) : 0;

  // Radar Data for Spider Web
  const radarData: RadarDataPoint[] = [
    {
      label: 'TP 1 (Asas)',
      value: totalFilled > 0 ? Math.round((totalTp1 / totalFilled) * 100) : 0,
      rawCount: totalTp1,
    },
    {
      label: 'TP 2 (Faham)',
      value: totalFilled > 0 ? Math.round((totalTp2 / totalFilled) * 100) : 0,
      rawCount: totalTp2,
    },
    {
      label: 'TP 3 (Tahap Min)',
      value: totalFilled > 0 ? Math.round((totalTp3 / totalFilled) * 100) : 0,
      rawCount: totalTp3,
    },
    {
      label: 'TP 4 (Beradab)',
      value: totalFilled > 0 ? Math.round((totalTp4 / totalFilled) * 100) : 0,
      rawCount: totalTp4,
    },
    {
      label: 'TP 5 (Terpuji)',
      value: totalFilled > 0 ? Math.round((totalTp5 / totalFilled) * 100) : 0,
      rawCount: totalTp5,
    },
    {
      label: 'TP 6 (Mithali)',
      value: totalFilled > 0 ? Math.round((totalTp6 / totalFilled) * 100) : 0,
      rawCount: totalTp6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subject Pills Selection */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              PILIHAN SUBJEK PANITIA:
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentSubject.name} ({currentSubject.code})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoSuggestFromExam}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-300 flex items-center gap-1 transition cursor-pointer"
              title="Cadang agihan TP berasaskan markah peperiksaan bertulis"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cadang TP (UASA)</span>
            </button>

            <button
              onClick={handleSetAllTP3}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition cursor-pointer"
            >
              Set Semua TP 3
            </button>

            <button
              onClick={handleClearSubject}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Kosongkan</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Horizontal buttons for all subjects */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_SUBJECTS.map((sub) => {
            const isSelected = sub.code === selectedSubjectCode;
            const isT2Only = sub.tahap === 'tahap2';

            return (
              <button
                key={sub.code}
                onClick={() => setSelectedSubjectCode(sub.code)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title={sub.name}
              >
                <span>{sub.code}</span>
                {isT2Only && (
                  <span className="text-[9px] px-1 py-0.2 bg-purple-200 text-purple-900 rounded font-normal">
                    Tahap 2
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spider Web Radar Chart & KPI Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="text-center mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            Analisis Spider Web Penguasaan PBD • {currentSubject.name}
          </h3>
          <p className="text-xs text-slate-500">
            Taburan Sebaran Tahap Penguasaan 1 hingga 6 Merentas Seluruh Sekolah (Sesi {year})
          </p>
        </div>

        <div className="flex justify-center py-2">
          <SpiderWebChart
            data={radarData}
            size={340}
            color="#059669"
            benchmarkValue={80}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 mt-4">
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 text-center">
            <span className="text-[11px] font-semibold text-emerald-800">
              Melepasi Tahap Min. (MTM)
            </span>
            <div className="text-xl font-black text-emerald-700 mt-1">{schoolMtmPercent}%</div>
            <p className="text-[10px] text-emerald-600 mt-0.5">
              {totalSchoolMtm} murid (TP 3 - 6)
            </p>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-lg border border-rose-200 text-center">
            <span className="text-[11px] font-semibold text-rose-800">
              Belum Menguasai (BTM)
            </span>
            <div className="text-xl font-black text-rose-700 mt-1">{totalTp1 + totalTp2}</div>
            <p className="text-[10px] text-rose-600 mt-0.5">
              TP 1: {totalTp1} | TP 2: {totalTp2}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-200 text-center">
            <span className="text-[11px] font-semibold text-indigo-800">
              Tahap Tinggi (TP 5 - 6)
            </span>
            <div className="text-xl font-black text-indigo-700 mt-1">{totalTp5 + totalTp6}</div>
            <p className="text-[10px] text-indigo-600 mt-0.5">
              {totalFilled > 0
                ? Math.round(((totalTp5 + totalTp6) / totalFilled) * 100)
                : 0}
              % murid terpuji & mithali
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-700">Jumlah Ditaksir</span>
            <div className="text-xl font-black text-slate-800 mt-1">{totalSchoolAssessed}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Diisi: {totalFilled} murid</p>
          </div>
        </div>
      </div>

      {/* Modern Table: Mengisi TP Mengikut Kelas (Tahun 1 hingga Tahun 6) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Borang Pengisian & Analisis TP Mengikut Kelas • {currentSubject.name}
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan butang + / - atau taip nombor terus untuk mengagihkan jumlah murid bagi setiap TP
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            SK BATANDOK (XBA6003)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                <th className="py-3 px-3 min-w-[130px]">Tahun / Kelas</th>
                <th className="py-3 px-2 text-center w-20">Bil. Ditaksir</th>

                {/* TP Badges Columns */}
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-rose-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                    TP 1
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-orange-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-bold">
                    TP 2
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-amber-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                    TP 3
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-emerald-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    TP 4
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-teal-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 font-bold">
                    TP 5
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[85px] bg-indigo-50/60">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">
                    TP 6
                  </span>
                </th>

                <th className="py-3 px-3 text-center min-w-[120px] bg-slate-50">
                  Murid Menguasai (MTM)
                </th>
                <th className="py-3 px-3 min-w-[200px] bg-slate-50">Catatan / BTM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SCHOOL_CLASSES.map((cls) => {
                const classData = getRecordForClass(cls);
                const students = classesData[cls] || [];
                const studentCount = students.length;

                const classTotalFilled =
                  classData.tp1 +
                  classData.tp2 +
                  classData.tp3 +
                  classData.tp4 +
                  classData.tp5 +
                  classData.tp6;
                const classMtmCount =
                  classData.tp3 + classData.tp4 + classData.tp5 + classData.tp6;
                const classMtmPercent =
                  classTotalFilled > 0
                    ? parseFloat(((classMtmCount / classTotalFilled) * 100).toFixed(1))
                    : 0;

                const hasBTM = classData.tp1 + classData.tp2 > 0;

                return (
                  <tr
                    key={cls}
                    className="hover:bg-slate-50/80 transition divide-x divide-slate-200 group"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{cls}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-700 bg-slate-50/40">
                      {studentCount}
                    </td>

                    {/* TP 1 to 6 Steppers */}
                    {(['tp1', 'tp2', 'tp3', 'tp4', 'tp5', 'tp6'] as const).map((tpKey) => {
                      const val = classData[tpKey] || 0;
                      return (
                        <td key={tpKey} className="py-2 px-1 text-center">
                          <div className="inline-flex items-center justify-center border border-slate-300 rounded-lg bg-white shadow-2xs overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleUpdateClassTP(cls, tpKey, -1, true)}
                              className="px-1.5 py-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer select-none font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={val}
                              onChange={(e) =>
                                handleUpdateClassTP(
                                  cls,
                                  tpKey,
                                  parseInt(e.target.value) || 0,
                                  false
                                )
                              }
                              className="w-9 text-center font-bold text-slate-800 text-xs py-1 border-x border-slate-200 focus:outline-none focus:bg-emerald-50"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateClassTP(cls, tpKey, 1, true)}
                              className="px-1.5 py-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer select-none font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    {/* MTM % and Progress Bar */}
                    <td className="py-2.5 px-3 text-center bg-slate-50/40">
                      <div className="font-bold text-slate-900">
                        {classMtmCount}/{classTotalFilled || studentCount}{' '}
                        <span className="text-emerald-700">({classMtmPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 max-w-[100px] mx-auto">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${classMtmPercent}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Catatan / BTM column */}
                    <td className="py-2 px-3">
                      {editingNotesClass === cls ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Catatan..."
                            className="w-full text-xs px-2 py-1 border border-emerald-500 rounded focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNotes(cls)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] truncate max-w-[180px]">
                            {classData.customNotes ? (
                              <span className="text-slate-700 font-medium">
                                {classData.customNotes}
                              </span>
                            ) : hasBTM ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-rose-500" />
                                {classData.tp1 + classData.tp2} Murid BTM (Perlu Intervensi)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                100% Menguasai
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingNotesClass(cls);
                              setNotesInput(classData.customNotes || '');
                            }}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Catatan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Total School Summary Row */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300 divide-x divide-slate-200">
                <td className="py-3 px-3 uppercase tracking-wide">JUMLAH KESELURUHAN</td>
                <td className="py-3 px-2 text-center font-mono">{totalSchoolAssessed}</td>
                <td className="py-3 px-2 text-center text-rose-700 bg-rose-50/40">{totalTp1}</td>
                <td className="py-3 px-2 text-center text-orange-700 bg-orange-50/40">{totalTp2}</td>
                <td className="py-3 px-2 text-center text-amber-700 bg-amber-50/40">{totalTp3}</td>
                <td className="py-3 px-2 text-center text-emerald-700 bg-emerald-50/40">{totalTp4}</td>
                <td className="py-3 px-2 text-center text-teal-700 bg-teal-50/40">{totalTp5}</td>
                <td className="py-3 px-2 text-center text-indigo-700 bg-indigo-50/40">{totalTp6}</td>
                <td className="py-3 px-3 text-center text-emerald-800">
                  {totalSchoolMtm}/{totalFilled || totalSchoolAssessed} ({schoolMtmPercent}%)
                </td>
                <td className="py-3 px-3 text-slate-600 font-normal text-[11px]">
                  BTM: {totalTp1 + totalTp2} orang • MTM: {totalSchoolMtm} orang
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Ulasan Guru: 2 Bahagian (Cabaran Kekuatan / Kelemahan & Cadangan Penambahbaikan / Intervensi) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Ulasan Guru: Cabaran Kekuatan / Kelemahan & Cadangan Penambahbaikan / Intervensi
          </h3>
          <p className="text-xs text-slate-500">
            Disediakan untuk laporan dialog prestasi kurikulum panitia {currentSubject.name} Sesi {year}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part 1: Cabaran Kekuatan / Kelemahan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              1. Cabaran Kekuatan / Kelemahan
            </label>
            <textarea
              rows={4}
              value={currentRecord.reviewChallenges}
              onChange={(e) => handleUpdateReview('challenges', e.target.value)}
              placeholder="Contoh: Kekuatan: Kebanyakan murid menguasai kosa kata asas dan membina ayat mudah (TP 3 & 4). Cabaran: Murid masih lemah dalam tatabahasa imbuhan apitan dan penulisan ulasan perenggan (TP 1 & 2)..."
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>

          {/* Part 2: Cadangan Penambahbaikan / Intervensi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              2. Cadangan Penambahbaikan / Intervensi
            </label>
            <textarea
              rows={4}
              value={currentRecord.reviewInterventions}
              onChange={(e) => handleUpdateReview('interventions', e.target.value)}
              placeholder="Contoh: Intervensi: 1) Program Bimbingan Rakan Sebaya (Mentor-Mentee). 2) Modul Latih Tubi Berfokus BTM pada waktu bimbingan petang. 3) Penggunaan kad imbasan interaktif dalam aktiviti PAK-21..."
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
