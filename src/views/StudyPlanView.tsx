import React, { useState } from 'react';
import {
  CalendarDays,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyPlan, StudyTask, Subject } from '../types';
import { StorageManager } from '../services/storage';
import { ApiService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface StudyPlanViewProps {
  subjects: Subject[];
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ subjects }) => {
  const { addToast } = useToast();
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => StorageManager.getStudyPlan());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Form states
  const [goal, setGoal] = useState(studyPlan.goal || 'Master Core Systems & Ace Midterm Finals');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(studyPlan.subjects || [subjects[0]?.name || 'Data Structures']);
  const [examDate, setExamDate] = useState(studyPlan.targetExamDate || '2026-11-20');
  const [dailyMinutes, setDailyMinutes] = useState(studyPlan.dailyAvailableMinutes || 60);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(studyPlan.difficulty || 'medium');

  // Compute progress
  const totalTasks = studyPlan.tasks.length;
  const completedTasks = studyPlan.tasks.filter((t) => t.isCompleted).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = studyPlan.tasks.map((task) => {
      if (task.id === taskId) {
        const nextState = !task.isCompleted;
        if (nextState) {
          try {
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
          } catch {}
          addToast({ type: 'success', title: 'Task Completed!', message: `Great job on ${task.topic}` });
        }
        return {
          ...task,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    const updatedPlan: StudyPlan = {
      ...studyPlan,
      tasks: updatedTasks,
    };

    setStudyPlan(StorageManager.saveStudyPlan(updatedPlan));
  };

  const handleRescheduleTask = (taskId: string) => {
    const updatedTasks = studyPlan.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          day: `${task.day} (Rescheduled)`,
        };
      }
      return task;
    });
    const updatedPlan = { ...studyPlan, tasks: updatedTasks };
    setStudyPlan(StorageManager.saveStudyPlan(updatedPlan));
    addToast({ type: 'info', title: 'Task Rescheduled' });
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await ApiService.generateStudyPlan({
        goal,
        subjects: selectedSubjects,
        examDate,
        dailyAvailableMinutes: dailyMinutes,
        difficulty,
      });

      const newTasks: StudyTask[] = (generated.weeklyTasks || []).map((t: any, idx: number) => ({
        id: 'task_' + Date.now() + '_' + idx,
        planId: 'plan_' + Date.now(),
        day: t.day || `Day ${idx + 1}`,
        subject: t.subject || selectedSubjects[0],
        topic: t.topic || 'Review core concepts',
        durationMinutes: t.durationMinutes || 45,
        taskType: t.taskType || 'Practice',
        recommendedAction: t.recommendedAction || 'Review practice problems and quiz yourself',
        isCompleted: false,
      }));

      const newPlan: StudyPlan = {
        id: 'plan_' + Date.now(),
        userId: 'usr_vivora_student_1',
        goal,
        subjects: selectedSubjects,
        targetExamDate: examDate,
        dailyAvailableMinutes: dailyMinutes,
        difficulty,
        planTitle: generated.planTitle || 'Targeted Exam Mastery Schedule',
        summary: generated.summary || 'Custom paced study tasks matching your goals.',
        tasks: newTasks,
        createdAt: new Date().toISOString(),
      };

      StorageManager.saveStudyPlan(newPlan);
      setStudyPlan(newPlan);
      setShowGeneratorModal(false);

      addToast({
        type: 'ai',
        title: 'Study Plan Generated',
        message: 'Personalized schedule created with Gemini AI',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to generate plan',
        message: err.message || 'Please check your inputs and retry',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSubjectSelect = (subName: string) => {
    if (selectedSubjects.includes(subName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subName]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header & Plan Summary */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-transparent border border-purple-500/30 glass-glow-pink">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Personalized Study Strategy
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-xs text-slate-300">Target: {studyPlan.targetExamDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {studyPlan.planTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {studyPlan.summary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGeneratorModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Regenerate with AI</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Metrics */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Overall Completion</span>
              <span className="text-purple-400 font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
            <p className="text-[11px] text-slate-400">Completed Tasks</p>
            <p className="text-xl font-bold text-white">
              {completedTasks} <span className="text-xs text-slate-400">/ {totalTasks} Tasks</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
            <p className="text-[11px] text-slate-400">Daily Study Allocation</p>
            <p className="text-xl font-bold text-amber-300">
              {studyPlan.dailyAvailableMinutes} mins / day
            </p>
          </div>
        </div>
      </div>

      {/* Daily Tasks Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span>Structured Daily Schedule</span>
          </h2>
          <span className="text-xs text-slate-400">{completedTasks} of {totalTasks} finished</span>
        </div>

        <div className="space-y-3">
          {studyPlan.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                task.isCompleted
                  ? 'bg-slate-900/30 border-white/[0.06] opacity-65'
                  : 'bg-slate-900/70 border-white/[0.08] hover:border-purple-500/35'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      task.isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-600 hover:border-purple-400'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-400">{task.day}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-300 font-medium">{task.subject}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-[10px] text-slate-400">{task.durationMinutes} min</span>
                    </div>

                    <h3 className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.topic}
                    </h3>

                    <p className="text-xs text-slate-400">{task.recommendedAction}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleRescheduleTask(task.id)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      task.isCompleted
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                    }`}
                  >
                    {task.isCompleted ? 'Mark Pending' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Generator Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowGeneratorModal(false)} />
          <div className="relative w-full max-w-lg bg-[#0e111a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Generate Study Plan with AI</h3>
                <p className="text-xs text-slate-400">Specify your academic constraints for an optimized schedule.</p>
              </div>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Goal</label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master algorithms and crack campus interviews"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Focus Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub.name);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => toggleSubjectSelect(sub.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-purple-500/25 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Daily Time</label>
                  <select
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pacing Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="easy">Relaxed (Gentle Pace)</option>
                  <option value="medium">Balanced (Recommended)</option>
                  <option value="hard">Intense (Bootcamp Sprint)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGeneratorModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate AI Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
