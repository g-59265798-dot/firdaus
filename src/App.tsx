import React, { useState, useEffect } from 'react';
import {
  SchoolClass,
  SCHOOL_CLASSES,
  Student,
  TeacherUser,
  PanitiaSubjectRecord,
  AppStateData,
} from './types/uasa';
import {
  subscribeToDatabase,
  saveCentralData,
  getCachedData,
} from './services/centralDatabase';
import { TeacherLogin } from './components/TeacherLogin';
import { Navbar } from './components/Navbar';
import { ScoreEntry } from './components/ScoreEntry';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PanitiaAnalysisView } from './components/PanitiaAnalysisView';
import { StudentResultSlips } from './components/StudentResultSlips';
import { AdminDashboard } from './components/AdminDashboard';
import { AddStudentModal } from './components/AddStudentModal';

const USER_SESSION_KEY = 'sk_batandok_logged_teacher';

export default function App() {
  const [appState, setAppState] = useState<AppStateData>(getCachedData());
  const [currentClass, setCurrentClass] = useState<SchoolClass>('1 BERUSAHA');
  const [activeTab, setActiveTab] = useState<'scores' | 'analytics' | 'panitia' | 'slips' | 'admin'>('scores');
  const [currentUser, setCurrentUser] = useState<TeacherUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Subscribe to real-time central database updates
  useEffect(() => {
    const unsubscribe = subscribeToDatabase((latestData) => {
      setAppState(latestData);
    });
    return () => unsubscribe();
  }, []);

  // Handle Login
  const handleLogin = (teacher: TeacherUser) => {
    setCurrentUser(teacher);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(teacher));
    if (teacher.mainClass) {
      setCurrentClass(teacher.mainClass);
    }

    // Record login into central database logs if not already recorded recently
    const updatedLogs = [teacher, ...appState.teacherLogs.slice(0, 49)];
    const updatedState = {
      ...appState,
      teacherLogs: updatedLogs,
    };
    saveCentralData(updatedState);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  // Toggle Exam Type (UASA <-> UPSA)
  const handleToggleExamType = () => {
    const nextType: 'UASA' | 'UPSA' = appState.examType === 'UASA' ? 'UPSA' : 'UASA';
    const updated: AppStateData = { ...appState, examType: nextType };
    setAppState(updated);
    saveCentralData(updated);
  };

  // Current class students
  const students = appState.classesData[currentClass] || [];

  // Update a student score
  const handleUpdateScore = (studentId: string, subjectCode: string, value: number | 'TH' | null) => {
    const updatedStudents = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          scores: {
            ...s.scores,
            [subjectCode]: value,
          },
        };
      }
      return s;
    });

    const updatedState = {
      ...appState,
      classesData: {
        ...appState.classesData,
        [currentClass]: updatedStudents,
      },
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Add new student
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const newId = `${currentClass.toLowerCase().replace(/\s+/g, '')}-${Date.now().toString(36)}`;
    const studentWithId: Student = {
      ...newStudent,
      id: newId,
    };

    // Keep alphabetical order
    const updatedList = [...students, studentWithId].sort((a, b) =>
      a.name.localeCompare(b.name, 'ms-MY')
    );

    const updatedState = {
      ...appState,
      classesData: {
        ...appState.classesData,
        [currentClass]: updatedList,
      },
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    const updatedList = students.filter((s) => s.id !== studentId);
    const updatedState = {
      ...appState,
      classesData: {
        ...appState.classesData,
        [currentClass]: updatedList,
      },
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Sort students A-Z
  const handleSortStudentsAZ = () => {
    const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name, 'ms-MY'));
    const updatedState = {
      ...appState,
      classesData: {
        ...appState.classesData,
        [currentClass]: sorted,
      },
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Clear all scores of current class (keeps student names)
  const handleClearAllScores = () => {
    const cleared = students.map((s) => ({
      ...s,
      scores: {},
      tpScores: {},
    }));
    const updatedState = {
      ...appState,
      classesData: {
        ...appState.classesData,
        [currentClass]: cleared,
      },
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Update Panitia Record
  const handleUpdatePanitiaRecord = (subjectCode: string, record: PanitiaSubjectRecord) => {
    const updatedPanitia = {
      ...appState.panitiaData,
      [subjectCode]: record,
    };
    const updatedState = {
      ...appState,
      panitiaData: updatedPanitia,
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // Clear Teacher Logs (Admin)
  const handleClearLogs = () => {
    const updatedState = {
      ...appState,
      teacherLogs: currentUser ? [currentUser] : [],
    };
    setAppState(updatedState);
    saveCentralData(updatedState);
  };

  // If user not logged in, show TeacherLogin
  if (!currentUser) {
    return <TeacherLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentClass={currentClass}
        onSelectClass={(c) => setCurrentClass(c)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        onLogout={handleLogout}
        year={appState.year || 2026}
        examType={appState.examType || 'UASA'}
        onToggleExamType={handleToggleExamType}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'scores' && (
          <ScoreEntry
            currentClass={currentClass}
            students={students}
            onUpdateScore={handleUpdateScore}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSortStudentsAZ={handleSortStudentsAZ}
            onClearAllScores={handleClearAllScores}
            examType={appState.examType}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            currentClass={currentClass}
            students={students}
            examType={appState.examType}
            year={appState.year}
          />
        )}

        {activeTab === 'panitia' && (
          <PanitiaAnalysisView
            panitiaData={appState.panitiaData}
            classesData={appState.classesData}
            onUpdatePanitiaRecord={handleUpdatePanitiaRecord}
            year={appState.year}
          />
        )}

        {activeTab === 'slips' && (
          <StudentResultSlips
            currentClass={currentClass}
            students={students}
            examType={appState.examType}
            year={appState.year}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <AdminDashboard
            classesData={appState.classesData}
            teacherLogs={appState.teacherLogs}
            onClearLogs={handleClearLogs}
            year={appState.year}
            examType={appState.examType}
          />
        )}
      </main>

      {/* Add / Delete Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className={currentClass}
        students={students}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  );
}
