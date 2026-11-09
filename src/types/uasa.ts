export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'TH';

export interface SubjectInfo {
  code: string;
  name: string;
  shortName: string;
  tahap: 'tahap1' | 'tahap2' | 'semua';
}

// 9 Subjek Tahap 1: BM, BI, MT, SN, PI, MZ, PSV, PJPK, BA
export const TAHAP_1_SUBJECTS: SubjectInfo[] = [
  { code: 'BM', name: 'Bahasa Melayu', shortName: 'BM', tahap: 'semua' },
  { code: 'BI', name: 'Bahasa Inggeris', shortName: 'BI', tahap: 'semua' },
  { code: 'MT', name: 'Matematik', shortName: 'MT', tahap: 'semua' },
  { code: 'SN', name: 'Sains', shortName: 'SN', tahap: 'semua' },
  { code: 'PI', name: 'Pendidikan Islam', shortName: 'PI', tahap: 'semua' },
  { code: 'MZ', name: 'Pendidikan Muzik', shortName: 'MZ', tahap: 'semua' },
  { code: 'PSV', name: 'Pendidikan Seni Visual', shortName: 'PSV', tahap: 'semua' },
  { code: 'PJPK', name: 'Pend. Jasmani & Kesihatan', shortName: 'PJPK', tahap: 'semua' },
  { code: 'BA', name: 'Bahasa Arab', shortName: 'BA', tahap: 'semua' },
];

// Tahap 2 Tambah Sejarah dan RBT (Jumlah 11 Subjek)
export const TAHAP_2_SUBJECTS: SubjectInfo[] = [
  ...TAHAP_1_SUBJECTS,
  { code: 'SEJ', name: 'Sejarah', shortName: 'SEJ', tahap: 'tahap2' },
  { code: 'RBT', name: 'Reka Bentuk & Teknologi', shortName: 'RBT', tahap: 'tahap2' },
];

export const ALL_SUBJECTS: SubjectInfo[] = TAHAP_2_SUBJECTS;

export const SCHOOL_CLASSES = [
  '1 BERUSAHA',
  '2 BERILMU',
  '3 BERJAYA',
  '4 BESTARI',
  '5 BIJAK',
  '6 BITARA',
] as const;

export type SchoolClass = typeof SCHOOL_CLASSES[number];

export function isTahap1(className: string): boolean {
  return className.startsWith('1 ') || className.startsWith('2 ') || className.startsWith('3 ');
}

export function getSubjectsForClass(className: string): SubjectInfo[] {
  return isTahap1(className) ? TAHAP_1_SUBJECTS : TAHAP_2_SUBJECTS;
}

export interface Student {
  id: string;
  name: string;
  gender: 'L' | 'P';
  scores: Record<string, number | 'TH' | null>;
  tpScores?: Record<string, number | null>; // TP 1 - 6
  pbdNotes?: Record<string, string>;
}

export interface ClassSubjectTPData {
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  tp5: number;
  tp6: number;
  customNotes?: string;
}

export interface PanitiaSubjectRecord {
  classes: Record<string, ClassSubjectTPData>;
  reviewChallenges: string; // 1. Cabaran Kekuatan / Kelemahan
  reviewInterventions: string; // 2. Cadangan Penambahbaikan / Intervensi
}

export interface TeacherUser {
  name: string;
  ic: string;
  role: 'admin' | 'guru';
  mainClass: SchoolClass;
  loginTime: string;
}

export interface AppStateData {
  year: number;
  examType: 'UASA' | 'UPSA';
  classesData: Record<string, Student[]>;
  panitiaData: Record<string, PanitiaSubjectRecord>;
  teacherLogs: TeacherUser[];
  lastUpdated: string;
}
