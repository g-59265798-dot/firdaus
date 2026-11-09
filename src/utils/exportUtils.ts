import * as XLSX from 'xlsx';
import { SchoolClass, Student, getSubjectsForClass } from '../types/uasa';
import { calculateStudentSummary, calculateSubjectAnalytics } from './gradeCalculator';

export function exportClassToExcel(
  className: SchoolClass,
  students: Student[],
  examType: 'UASA' | 'UPSA',
  year: number
) {
  const subjects = getSubjectsForClass(className);

  // Sheet 1: Markah Murid
  const markRows = students.map((s, idx) => {
    const summary = calculateStudentSummary(s, subjects);
    const row: Record<string, any> = {
      Bil: idx + 1,
      'Nama Murid': s.name,
      Jantina: s.gender,
    };

    subjects.forEach((sub) => {
      const score = s.scores[sub.code];
      row[sub.code] = score !== null && score !== undefined ? score : '-';
    });

    row['Jumlah'] = summary.subjectsEntered > 0 ? summary.totalScore : '-';
    row['Purata'] = summary.subjectsEntered > 0 ? summary.averageScore : '-';
    row['Keputusan'] = summary.status;

    return row;
  });

  const ws1 = XLSX.utils.json_to_sheet(markRows);

  // Sheet 2: Analisis GPMP Subjek
  const analysisRows = subjects.map((sub) => {
    const stat = calculateSubjectAnalytics(students, sub);
    return {
      Subjek: sub.name,
      Kod: sub.code,
      Calon: stat.totalCandidates,
      Hadir: stat.presentCount,
      TH: stat.thCount,
      'Gred A': stat.gradeCounts.A,
      'Gred B': stat.gradeCounts.B,
      'Gred C': stat.gradeCounts.C,
      'Gred D': stat.gradeCounts.D,
      'Gred E': stat.gradeCounts.E,
      '% Lulus (MTM)': `${stat.passPercent}%`,
      GPMP: stat.gpmp,
      'Markah Purata': stat.averageScore,
    };
  });

  const ws2 = XLSX.utils.json_to_sheet(analysisRows);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, `Markah ${className}`);
  XLSX.utils.book_append_sheet(wb, ws2, 'Analisis GPMP');

  const fileName = `Analisis_${examType}_${className.replace(/\s+/g, '_')}_${year}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
