import { AppStateData, Student, PanitiaSubjectRecord, ALL_SUBJECTS, SCHOOL_CLASSES } from '../types/uasa';

export const INITIAL_STUDENTS_1_BERUSAHA: Student[] = [
  { id: '1b-01', name: 'MUHAMAD HAZMIEZAFUAN ALIF BIN ROZMIH', gender: 'L', scores: {} },
  { id: '1b-02', name: 'MUHAMMAD DANISH EZHAM BIN MOHD AZHAR', gender: 'L', scores: {} },
  { id: '1b-03', name: 'MUHAMMAD NUR RAMADHANI BIN JASMIN', gender: 'L', scores: {} },
  { id: '1b-04', name: 'MUHAMMAD SHAKEEL ZIYAD BIN MOHD FADZI', gender: 'L', scores: {} },
  { id: '1b-05', name: 'NIA NAIRA BINTI ASHNEL', gender: 'P', scores: {} },
  { id: '1b-06', name: 'NOOR ELLESYAH BINTI JUALI', gender: 'P', scores: {} },
  { id: '1b-07', name: 'NUR ALYA HIDAYAH BINTI AZRUL', gender: 'P', scores: {} },
  { id: '1b-08', name: 'NUR DHIYA SOFIA BINTI MOHD SUFFIN', gender: 'P', scores: {} },
  { id: '1b-09', name: 'NUR ERNAH ZAFYRA EZZATY BINTI RAHJALI', gender: 'P', scores: {} },
  { id: '1b-10', name: 'NUR FARZANAH ELZIRA BINTI MOHD. DAUD', gender: 'P', scores: {} },
  { id: '1b-11', name: 'SYAHMI BIN MOHD SOFFY', gender: 'L', scores: {} },
];

export const INITIAL_STUDENTS_2_BERILMU: Student[] = [
  { id: '2b-01', name: 'AHMAD DABITH BIN ZULKIFLI', gender: 'L', scores: {} },
  { id: '2b-02', name: 'AHNAF QAIS BIN AZMI', gender: 'L', scores: {} },
  { id: '2b-03', name: 'AWANGKU MOHAMMAD DANIH BIN AK.MOKTANIH', gender: 'L', scores: {} },
  { id: '2b-04', name: 'FATHIYA SUMAYYAH BINTI SIMRIN', gender: 'P', scores: {} },
  { id: '2b-05', name: 'IZZ ZULFADLIE BIN MOHAMMAD ZULKHAIRI', gender: 'L', scores: {} },
  { id: '2b-06', name: 'KHAULAH ALAZWAR BINTI MOHD.REDZWAN', gender: 'P', scores: {} },
  { id: '2b-07', name: 'MOHAMAD ZULFAHMI BIN MAT RIJIM', gender: 'L', scores: {} },
  { id: '2b-08', name: 'MUHAMMAD ABID SOLEH BIN MOHD HAFIZI', gender: 'L', scores: {} },
  { id: '2b-09', name: 'MUHAMMAD AL FAYYADH BIN MOHD TAUFECK', gender: 'L', scores: {} },
  { id: '2b-10', name: 'MUHAMMAD SHAIFULLAH BIN ABDUL MALIK', gender: 'L', scores: {} },
  { id: '2b-11', name: 'NOR ARIANA BINTI SAMAH', gender: 'P', scores: {} },
  { id: '2b-12', name: 'NUR AYRA DHAFIYAH BINTI AL-ACRAM', gender: 'P', scores: {} },
];

export const INITIAL_STUDENTS_3_BERJAYA: Student[] = [
  { id: '3b-01', name: 'AFRINA DELISHA BINTI ABDUL HAFIZ', gender: 'P', scores: {} },
  { id: '3b-02', name: 'AULIA FARWIZAH HUSNA BINTI MOHD. FAIZAN', gender: 'P', scores: {} },
  { id: '3b-03', name: 'AWANGKU RAZIN AMZAR BIN AGKU SYAHRIL', gender: 'L', scores: {} },
  { id: '3b-04', name: 'HANNAH BINTI MOHD SOFFY', gender: 'P', scores: {} },
  { id: '3b-05', name: 'HANNAH HAFIZAH BINTI MAT LIADIN', gender: 'P', scores: {} },
  { id: '3b-06', name: 'HARRAZ HAKIEM BIN BORHAN', gender: 'L', scores: {} },
  { id: '3b-07', name: 'MOHAMAD RIZHAN BIN MOHD ROZIEDY', gender: 'L', scores: {} },
  { id: '3b-08', name: 'MUHAMAD AIMAN BIN MOHAMAD SHANI', gender: 'L', scores: {} },
  { id: '3b-09', name: 'MUHAMMAD AIDIL ZAFWAN BIN ABDULLAH', gender: 'L', scores: {} },
  { id: '3b-10', name: 'MUHAMMAD AL FATEH BIN MOHD TAUFECK', gender: 'L', scores: {} },
  { id: '3b-11', name: 'MUHAMMAD RASYA NAUFAL BIN RIZMAELEY', gender: 'L', scores: {} },
  { id: '3b-12', name: 'MUHAMMAD SHAFIQ HAIKAL BIN AG NAZRI', gender: 'L', scores: {} },
  { id: '3b-13', name: 'NAWAL HUSNA BINTI ABD. RASHID', gender: 'P', scores: {} },
  { id: '3b-14', name: 'NOORLIYANA FARZANA BINTI ZULKIAH', gender: 'P', scores: {} },
  { id: '3b-15', name: 'NUR ALHA SUHARAH BINTI CHAN VOI LIONG @ ALI', gender: 'P', scores: {} },
  { id: '3b-16', name: 'NUR ZARAH AILANA BINTI JOSLEE', gender: 'P', scores: {} },
  { id: '3b-17', name: 'NURSYAKILA BINTI MATSANIH', gender: 'P', scores: {} },
  { id: '3b-18', name: 'NURSYUHADAH BINTI TIASIN', gender: 'P', scores: {} },
  { id: '3b-19', name: 'NURUL IMAN FITRIAH BINTI ALIDIN', gender: 'P', scores: {} },
];

export const INITIAL_STUDENTS_4_BESTARI: Student[] = [
  { id: '4b-01', name: 'ABDUL FATTAHUL HAIY BIN MOHD HAFIZI', gender: 'L', scores: {} },
  { id: '4b-02', name: 'AINUL MARDHIYAH BINTI ABDULLAH', gender: 'P', scores: {} },
  { id: '4b-03', name: 'IZZ ZULKIFLIE BIN ABDULLAH', gender: 'L', scores: {} },
  { id: '4b-04', name: 'MOHAMAD HAIZAM BIN JAPAR', gender: 'L', scores: {} },
  { id: '4b-05', name: 'MUHAMMAD AFIF UZAIR BIN MOHD FADZI', gender: 'L', scores: {} },
  { id: '4b-06', name: 'NUR ABIBIE ADAWIYAH BINTI AZRUL', gender: 'P', scores: {} },
  { id: '4b-07', name: 'NUR ARDA ARISSA BINTI A.SAMBLIN', gender: 'P', scores: {} },
  { id: '4b-08', name: 'NUR DIANA SUFFIYANA BINTI MOHD SUFFIN', gender: 'P', scores: {} },
  { id: '4b-09', name: 'NURALEYA AISYAH FAZRI BINTI ABDULLAH', gender: 'P', scores: {} },
  { id: '4b-10', name: 'NURSYUHADAH BINTI SHAHRUNIZAN', gender: 'P', scores: {} },
  { id: '4b-11', name: 'NURUL FARHANA BINTI JASMIN', gender: 'P', scores: {} },
];

export const INITIAL_STUDENTS_5_BIJAK: Student[] = [
  { id: '5b-01', name: 'AHMAD AIRIL BIN SAPIRIN', gender: 'L', scores: {} },
  { id: '5b-02', name: 'ALMAHFUDZZULISLAM BIN ALZOHARI', gender: 'L', scores: {} },
  { id: '5b-03', name: 'DZULRAIQAL BIN ZAUNADDIN', gender: 'L', scores: {} },
  { id: '5b-04', name: 'FIRASH AQIL BIN MD HIRWAN', gender: 'L', scores: {} },
  { id: '5b-05', name: 'IMAN DZUL HAKIM BIN ALIDIN', gender: 'L', scores: {} },
  { id: '5b-06', name: 'MOHAMMAD HANIF BIN MAT LIADIN', gender: 'L', scores: {} },
  { id: '5b-07', name: 'MUHAMMAD RAFA ADAM BIN RIZMAELEY', gender: 'L', scores: {} },
  { id: '5b-08', name: 'MUHAMMAD SYARNAZ AIRIEL BIN ALI', gender: 'L', scores: {} },
  { id: '5b-09', name: 'NIA RIANA BINTI ASHNEL', gender: 'P', scores: {} },
  { id: '5b-10', name: 'NOR EMELDA BINTI OSMAN', gender: 'P', scores: {} },
  { id: '5b-11', name: 'NORHAIZA NATAHSA BINTI JAPAR', gender: 'P', scores: {} },
  { id: '5b-12', name: 'NUR ANNA DIANA BINTI YASMIH', gender: 'P', scores: {} },
  { id: '5b-13', name: 'NUR DANIAH RANIYAH LAW BINTI KANNY LAW', gender: 'P', scores: {} },
  { id: '5b-14', name: 'NUR ELMIEYRA QISTINA BALQIS BINTI RAHJALI', gender: 'P', scores: {} },
  { id: '5b-15', name: 'NURALISAH HAIRAH BINTI MAT KILLEH', gender: 'P', scores: {} },
  { id: '5b-16', name: 'QISYA SYAFFIZAH BINTI MAT SAID', gender: 'P', scores: {} },
  { id: '5b-17', name: 'SITI AFIQAH AMANI BINTI MOHD ZAINI', gender: 'P', scores: {} },
];

export const INITIAL_STUDENTS_6_BITARA: Student[] = [
  { id: '6b-01', name: 'AQIL FAKHRUDDIN BIN ABDULLAH', gender: 'L', scores: {} },
  { id: '6b-02', name: 'BALQIS NADIA BINTI ANIZAN', gender: 'P', scores: {} },
  { id: '6b-03', name: 'MOHAMAD FAZRIL FIRDAUS BIN SANAWIN', gender: 'L', scores: {} },
  { id: '6b-04', name: 'MUHAMMAD ADAM AFIQ BIN MOHD ZAINI', gender: 'L', scores: {} },
  { id: '6b-05', name: 'MUHAMMAD SYARAWI BIN MOHD.REDZWAN', gender: 'L', scores: {} },
  { id: '6b-06', name: 'NORHAWA UMAIRA BINTI MAT RIJIM', gender: 'P', scores: {} },
  { id: '6b-07', name: 'SITI FARISHA BINTI JAMALEH', gender: 'P', scores: {} },
];

export function buildInitialPanitiaData(): Record<string, PanitiaSubjectRecord> {
  const panitiaData: Record<string, PanitiaSubjectRecord> = {};

  ALL_SUBJECTS.forEach((sub) => {
    const classesObj: Record<string, any> = {};
    SCHOOL_CLASSES.forEach((cls) => {
      classesObj[cls] = {
        tp1: 0,
        tp2: 0,
        tp3: 0,
        tp4: 0,
        tp5: 0,
        tp6: 0,
        customNotes: '',
      };
    });

    panitiaData[sub.code] = {
      classes: classesObj,
      reviewChallenges: '',
      reviewInterventions: '',
    };
  });

  return panitiaData;
}

export function buildInitialState(): AppStateData {
  return {
    year: 2026,
    examType: 'UASA',
    classesData: {
      '1 BERUSAHA': [...INITIAL_STUDENTS_1_BERUSAHA],
      '2 BERILMU': [...INITIAL_STUDENTS_2_BERILMU],
      '3 BERJAYA': [...INITIAL_STUDENTS_3_BERJAYA],
      '4 BESTARI': [...INITIAL_STUDENTS_4_BESTARI],
      '5 BIJAK': [...INITIAL_STUDENTS_5_BIJAK],
      '6 BITARA': [...INITIAL_STUDENTS_6_BITARA],
    },
    panitiaData: buildInitialPanitiaData(),
    teacherLogs: [
      {
        name: 'FIRDAUS',
        ic: '840314-12-5159',
        role: 'admin',
        mainClass: '1 BERUSAHA',
        loginTime: '2026-11-09 08:30',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
