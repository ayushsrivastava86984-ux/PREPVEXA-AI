import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileDrawer } from './components/MobileDrawer';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { AITutorView } from './views/AITutorView';
import { QuizView } from './views/QuizView';
import { ExamView } from './views/ExamView';
import { StudyPlanView } from './views/StudyPlanView';
import { MaterialsView } from './views/MaterialsView';
import { AnalyticsView } from './views/AnalyticsView';
import { HistoryView } from './views/HistoryView';
import { AchievementsView } from './views/AchievementsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

import {
  UserProfile,
  Subject,
  QuizAttempt,
  ExamAttempt,
  StudyPlan,
  Achievement,
  NotificationItem,
} from './types';
import { StorageManager, DEFAULT_STUDENT } from './services/storage';

export default function App() {
  return (
    <ToastProvider>
      <MainApplication />
    </ToastProvider>
  );
}

function MainApplication() {
  const { addToast } = useToast();

  // Core state
  const [user, setUser] = useState<UserProfile>(() => StorageManager.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Persistent student session
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    StorageManager.getReducedMotion()
  );

  // Data states
  const [subjects] = useState<Subject[]>(() => StorageManager.getSubjects());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() =>
    StorageManager.getQuizAttempts()
  );
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() =>
    StorageManager.getExamAttempts()
  );
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() =>
    StorageManager.getStudyPlan()
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    StorageManager.getAchievements()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageManager.getNotifications()
  );

  // Sync scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out of your student session.',
    });
  };

  const handleQuizCompleted = (attempt: QuizAttempt) => {
    const updated = StorageManager.saveQuizAttempt(attempt);
    setQuizAttempts(updated);
    setUser(StorageManager.getUser());

    // Check achievement progress
    const updatedAch = achievements.map((ach) => {
      if (ach.slug === 'first-quiz' && !ach.isUnlocked) {
        ach.isUnlocked = true;
        ach.unlockedAt = new Date().toISOString();
        addToast({ type: 'ai', title: 'Achievement Unlocked! 🏆', message: 'First Step badge awarded' });
      }
      if (ach.slug === '10-quizzes') {
        ach.currentProgress = Math.min(10, updated.length);
        if (ach.currentProgress >= 10 && !ach.isUnlocked) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
          addToast({ type: 'ai', title: 'Achievement Unlocked! 🏆', message: 'Tenacious Learner badge awarded' });
        }
      }
      return ach;
    });
    StorageManager.saveAchievements(updatedAch);
    setAchievements(updatedAch);
  };

  const handleExamCompleted = (attempt: ExamAttempt) => {
    const updated = StorageManager.saveExamAttempt(attempt);
    setExamAttempts(updated);
    setUser(StorageManager.getUser());

    const updatedAch = achievements.map((ach) => {
      if (ach.slug === 'first-exam' && !ach.isUnlocked) {
        ach.isUnlocked = true;
        ach.unlockedAt = new Date().toISOString();
        addToast({ type: 'ai', title: 'Achievement Unlocked! 🏆', message: 'Exam Veteran badge awarded' });
      }
      return ach;
    });
    StorageManager.saveAchievements(updatedAch);
    setAchievements(updatedAch);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col antialiased selection:bg-pink-500/30 selection:text-pink-200">
      {/* Top Navigation */}
      <Navbar
        user={user}
        notifications={notifications}
        onNotificationsChange={setNotifications}
        onNavigate={setCurrentView}
        currentView={currentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full relative">
        {/* Collapsible Sidebar for Logged-In Student */}
        {isLoggedIn && currentView !== 'landing' && (
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            user={user}
          />
        )}

        {/* Mobile Navigation Drawer */}
        {isLoggedIn && (
          <MobileDrawer
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            currentView={currentView}
            onNavigate={setCurrentView}
            user={user}
          />
        )}

        {/* Dynamic View Container */}
        <main
          className={`flex-1 overflow-x-hidden ${
            currentView === 'landing' ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'
          }`}
        >
          {currentView === 'landing' && (
            <LandingPage
              onStartLearning={() => {
                if (isLoggedIn) {
                  setCurrentView('dashboard');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              onExploreFeatures={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              reducedMotion={reducedMotion}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              quizAttempts={quizAttempts}
              examAttempts={examAttempts}
              studyPlan={studyPlan}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'ai-tutor' && <AITutorView subjects={subjects} />}

          {currentView === 'quiz' && (
            <QuizView subjects={subjects} onQuizCompleted={handleQuizCompleted} />
          )}

          {currentView === 'exam' && <ExamView onExamCompleted={handleExamCompleted} />}

          {currentView === 'study-plan' && <StudyPlanView subjects={subjects} />}

          {currentView === 'materials' && <MaterialsView subjects={subjects} />}

          {currentView === 'analytics' && (
            <AnalyticsView
              user={user}
              quizAttempts={quizAttempts}
              examAttempts={examAttempts}
              subjects={subjects}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              quizAttempts={quizAttempts}
              examAttempts={examAttempts}
              conversations={StorageManager.getConversations()}
              studyPlan={studyPlan}
              subjects={subjects}
            />
          )}

          {currentView === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              onAchievementsChange={setAchievements}
            />
          )}

          {(currentView === 'settings' || currentView === 'profile') && (
            <SettingsView
              user={user}
              onUserUpdate={setUser}
              subjects={subjects}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={setReducedMotion}
            />
          )}

          {currentView === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
