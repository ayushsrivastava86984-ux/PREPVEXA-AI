import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Timer,
  BarChart3,
  ArrowRight,
  Target,
  Clock,
  HelpCircle,
  TrendingUp,
  Brain,
  Lightbulb,
} from 'lucide-react';
import { UserProfile, QuizAttempt, ExamAttempt, StudyPlan } from '../types';
import { ApiService } from '../services/api';

interface DashboardViewProps {
  user: UserProfile;
  quizAttempts: QuizAttempt[];
  examAttempts: ExamAttempt[];
  studyPlan: StudyPlan;
  onNavigate: (view: string) => void;
  onOpenQuizWithTopic?: (topic: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  quizAttempts,
  examAttempts,
  studyPlan,
  onNavigate,
}) => {
  const [aiInsight, setAiInsight] = useState<string>(
    'You are performing strongly in Core Data Structures but need more practice with graph cycle detection and shortest path edge cases.'
  );
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Compute live stats
  const totalQuizzes = quizAttempts.length;
  const totalExams = examAttempts.length;
  const avgQuizAccuracy = totalQuizzes > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.accuracyPercentage, 0) / totalQuizzes)
    : 85;

  // Extract weak topics from recent attempts
  const allWeakTopics = Array.from(
    new Set([
      ...quizAttempts.flatMap((q) => q.weakTopics || []),
      ...examAttempts.flatMap((e) => e.weakTopics || []),
    ])
  );

  const primaryFocusTopic = allWeakTopics[0] || 'Virtual Memory Paging';

  // Request fresh AI insight on load if attempts exist
  useEffect(() => {
    let isMounted = true;
    async function fetchDiagnostic() {
      setIsLoadingInsight(true);
      try {
        const res = await ApiService.generateInsights({
          quizAttemptsCount: totalQuizzes,
          avgAccuracy: avgQuizAccuracy,
          weakTopics: allWeakTopics,
          recentScore: quizAttempts[0]?.score || 3,
        });
        if (isMounted && res.insight) {
          setAiInsight(res.insight);
        }
      } catch {
        // Fallback already set
      } finally {
        if (isMounted) setIsLoadingInsight(false);
      }
    }
    fetchDiagnostic();
    return () => {
      isMounted = false;
    };
  }, [totalQuizzes]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Welcome & Motivational Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent border border-pink-500/25 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Student Command Center
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              <span className="text-xs text-slate-400">{user.educationLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are on a <span className="font-semibold text-amber-300">{user.studyStreakDays}-day study streak</span>.
              Ready to turn today&apos;s weak points into exam strengths?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => onNavigate('exam')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-100 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Simulate Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Study Streak */}
        <div className="p-5 rounded-2xl glass-panel relative group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Study Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{user.studyStreakDays}</span>
            <span className="text-xs font-semibold text-amber-400">Days Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active daily habit loop</p>
        </div>

        {/* KPI 2: Quiz Accuracy */}
        <div className="p-5 rounded-2xl glass-panel relative group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Quiz Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{avgQuizAccuracy}%</span>
            <span className="text-xs font-semibold text-emerald-400">+4.2% this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across {totalQuizzes} practice attempts</p>
        </div>

        {/* KPI 3: Completed Exams */}
        <div className="p-5 rounded-2xl glass-panel relative group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Completed Exams</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Timer className="w-4 h-4 text-pink-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalExams}</span>
            <span className="text-xs font-semibold text-pink-400">Full Simulators</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Average score: 83.3%</p>
        </div>

        {/* KPI 4: Total Study Time */}
        <div className="p-5 rounded-2xl glass-panel relative group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Study Time</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {Math.floor(user.totalStudyMinutes / 60)}h {user.totalStudyMinutes % 60}m
            </span>
            <span className="text-xs font-semibold text-purple-400">Productive</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Focused AI retrieval time</p>
        </div>
      </div>

      {/* Personalized Section: Your Focus Today */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121624] via-[#0d101a] to-[#121624] border border-pink-500/30 glass-glow-pink">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
              <Brain className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Your Focus Today
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  AI Diagnostic
                </span>
              </h2>
              <p className="text-xs text-slate-400">Dynamic recommendation from your recent quiz error logs</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('quiz')}
            className="px-4 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/35 text-pink-300 text-xs font-semibold transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <span>Practice {primaryFocusTopic}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {isLoadingInsight ? 'Analyzing your recent error signatures...' : aiInsight}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Today's Study Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Action Hub & Recent Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions Grid */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Quick Action Hub</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('ai-tutor')}
                className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-pink-500/15 border border-white/[0.08] hover:border-pink-500/35 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center mb-2 text-pink-400 group-hover:scale-110 transition-transform">
                  <Brain className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Ask AI</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Tutor Session</p>
              </button>

              <button
                onClick={() => onNavigate('quiz')}
                className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-emerald-500/15 border border-white/[0.08] hover:border-emerald-500/35 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2 text-emerald-400 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Generate Quiz</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Custom MCQs</p>
              </button>

              <button
                onClick={() => onNavigate('exam')}
                className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/35 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2 text-amber-400 group-hover:scale-110 transition-transform">
                  <Timer className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Start Exam</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Timed Mode</p>
              </button>

              <button
                onClick={() => onNavigate('study-plan')}
                className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-purple-500/15 border border-white/[0.08] hover:border-purple-500/35 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2 text-purple-400 group-hover:scale-110 transition-transform">
                  <Target className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Study Plan</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pacing & Goals</p>
              </button>
            </div>
          </div>

          {/* Recent Performance Activity */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Recent Practice Activity</span>
              </h3>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-pink-400 hover:text-pink-300 font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {quizAttempts.slice(0, 3).map((att) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.06] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{att.quizTitle}</p>
                    <p className="text-[11px] text-slate-400">{att.subject} · {att.topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold ${att.accuracyPercentage >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {att.score}/{att.maxScore} ({att.accuracyPercentage}%)
                    </span>
                    <p className="text-[10px] text-slate-500">{new Date(att.completedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Tasks from Study Plan */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Upcoming Study Tasks</span>
              </h3>
              <button
                onClick={() => onNavigate('study-plan')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Manage plan
              </button>
            </div>

            <div className="space-y-3">
              {studyPlan.tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    task.isCompleted
                      ? 'bg-slate-900/30 border-white/[0.04] opacity-60'
                      : 'bg-slate-900/70 border-white/[0.08] hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-400">{task.day}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[10px] text-slate-400">{task.durationMinutes} min</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-100">{task.topic}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{task.recommendedAction}</p>
                    </div>

                    <div className="shrink-0 mt-1">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <button
                          onClick={() => onNavigate('study-plan')}
                          className="text-[10px] font-semibold px-2 py-1 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
