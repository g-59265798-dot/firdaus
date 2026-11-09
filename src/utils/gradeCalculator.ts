import { Grade, Student, SubjectInfo } from '../types/uasa';

export interface GradeResult {
  grade: Grade;
  gpaPoint: number;
  label: string;
  isPass: boolean;
}

export function getGradeFromScore(score: number | 'TH' | null | undefined): GradeResult {
  if (score === null || score === undefined) {
    return { grade: 'TH', gpaPoint: 5, label: 'Tiada', isPass: false };
  }
  if (score === 'TH') {
    return { grade: 'TH', gpaPoint: 5, label: 'Tidak Hadir', isPass: false };
  }

  const num = typeof score === 'string' ? parseFloat(score) : score;
  if (isNaN(num)) {
    return { grade: 'TH', gpaPoint: 5, label: 'Tiada', isPass: false };
  }

  if (num >= 80) return { grade: 'A', gpaPoint: 1, label: 'Cemerlang', isPass: true };
  if (num >= 65) return { grade: 'B', gpaPoint: 2, label: 'Kepujian', isPass: true };
  if (num >= 50) return { grade: 'C', gpaPoint: 3, label: 'Baik', isPass: true };
  if (num >= 40) return { grade: 'D', gpaPoint: 4, label: 'Mencapai Tahap Minimum', isPass: true };
  return { grade: 'E', gpaPoint: 5, label: 'Belum Mencapai Tahap Minimum', isPass: false };
}

export function getGradeBadgeColor(grade: Grade): string {
  switch (grade) {
    case 'A':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'B':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'C':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    case 'D':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'E':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'TH':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

export function getTPColor(tp: number): string {
  switch (tp) {
    case 1:
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 2:
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 3:
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 4:
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 5:
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 6:
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
}

export interface StudentSummary {
  totalScore: number;
  averageScore: number;
  gradeCounts: Record<Grade, number>;
  isAllPassed: boolean;
  subjectsTaken: number;
  subjectsEntered: number;
  gpa: number;
  status: 'Cemerlang' | 'Lulus' | 'Perlu Bimbingan' | 'Belum Lengkap';
}

export function calculateStudentSummary(student: Student, subjects: SubjectInfo[]): StudentSummary {
  let totalScore = 0;
  let enteredCount = 0;
  let totalGpaPoints = 0;
  let failCount = 0;
  const gradeCounts: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, TH: 0 };

  subjects.forEach((sub) => {
    const raw = student.scores[sub.code];
    if (raw !== null && raw !== undefined) {
      enteredCount++;
      if (raw === 'TH') {
        gradeCounts.TH++;
        failCount++;
        totalGpaPoints += 5;
      } else {
        const val = typeof raw === 'number' ? raw : parseFloat(raw);
        if (!isNaN(val)) {
          totalScore += val;
          const { grade, gpaPoint, isPass } = getGradeFromScore(val);
          gradeCounts[grade]++;
          totalGpaPoints += gpaPoint;
          if (!isPass) failCount++;
        }
      }
    }
  });

  const averageScore = enteredCount > 0 ? parseFloat((totalScore / enteredCount).toFixed(1)) : 0;
  const gpa = enteredCount > 0 ? parseFloat((totalGpaPoints / enteredCount).toFixed(2)) : 0;
  const isAllPassed = enteredCount === subjects.length && failCount === 0;

  let status: 'Cemerlang' | 'Lulus' | 'Perlu Bimbingan' | 'Belum Lengkap' = 'Belum Lengkap';
  if (enteredCount === 0) {
    status = 'Belum Lengkap';
  } else if (failCount > 0) {
    status = 'Perlu Bimbingan';
  } else if (gradeCounts.A >= Math.ceil(subjects.length / 2)) {
    status = 'Cemerlang';
  } else {
    status = 'Lulus';
  }

  return {
    totalScore,
    averageScore,
    gradeCounts,
    isAllPassed,
    subjectsTaken: subjects.length,
    subjectsEntered: enteredCount,
    gpa,
    status,
  };
}

export interface SubjectAnalytics {
  subject: SubjectInfo;
  totalCandidates: number;
  presentCount: number;
  thCount: number;
  passCount: number;
  passPercent: number;
  averageScore: number;
  gpmp: number;
  gradeCounts: Record<Grade, number>;
  gradePercents: Record<Grade, number>;
  maxScore: number;
  minScore: number;
}

export function calculateSubjectAnalytics(
  students: Student[],
  subject: SubjectInfo
): SubjectAnalytics {
  const total = students.length;
  let presentCount = 0;
  let thCount = 0;
  let totalScore = 0;
  let totalGp = 0;
  let maxScore = 0;
  let minScore = 100;
  let hasValidScore = false;

  const gradeCounts: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, TH: 0 };

  students.forEach((s) => {
    const raw = s.scores[subject.code];
    if (raw === 'TH') {
      thCount++;
      gradeCounts.TH++;
      totalGp += 5;
    } else if (typeof raw === 'number') {
      presentCount++;
      totalScore += raw;
      hasValidScore = true;
      if (raw > maxScore) maxScore = raw;
      if (raw < minScore) minScore = raw;
      const { grade, gpaPoint } = getGradeFromScore(raw);
      gradeCounts[grade]++;
      totalGp += gpaPoint;
    }
  });

  const gradedTotal = presentCount + thCount;
  const passCount = gradeCounts.A + gradeCounts.B + gradeCounts.C + gradeCounts.D;
  const passPercent = gradedTotal > 0 ? parseFloat(((passCount / gradedTotal) * 100).toFixed(1)) : 0;
  const averageScore = presentCount > 0 ? parseFloat((totalScore / presentCount).toFixed(1)) : 0;
  const gpmp = gradedTotal > 0 ? parseFloat((totalGp / gradedTotal).toFixed(2)) : 0;

  const gradePercents: Record<Grade, number> = {
    A: gradedTotal > 0 ? parseFloat(((gradeCounts.A / gradedTotal) * 100).toFixed(1)) : 0,
    B: gradedTotal > 0 ? parseFloat(((gradeCounts.B / gradedTotal) * 100).toFixed(1)) : 0,
    C: gradedTotal > 0 ? parseFloat(((gradeCounts.C / gradedTotal) * 100).toFixed(1)) : 0,
    D: gradedTotal > 0 ? parseFloat(((gradeCounts.D / gradedTotal) * 100).toFixed(1)) : 0,
    E: gradedTotal > 0 ? parseFloat(((gradeCounts.E / gradedTotal) * 100).toFixed(1)) : 0,
    TH: gradedTotal > 0 ? parseFloat(((gradeCounts.TH / gradedTotal) * 100).toFixed(1)) : 0,
  };

  return {
    subject,
    totalCandidates: total,
    presentCount,
    thCount,
    passCount,
    passPercent,
    averageScore,
    gpmp,
    gradeCounts,
    gradePercents,
    maxScore: hasValidScore ? maxScore : 0,
    minScore: hasValidScore ? minScore : 0,
  };
}
