import React, { useState } from 'react';
import {
  History,
  HelpCircle,
  Timer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import { QuizAttempt, ExamAttempt, Conversation, StudyPlan, Subject } from '../types';

interface HistoryViewProps {
  quizAttempts: QuizAttempt[];
  examAttempts: ExamAttempt[];
  conversations: Conversation[];
  studyPlan: StudyPlan;
  subjects: Subject[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  quizAttempts,
  examAttempts,
  conversations,
  studyPlan,
  subjects,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Unified items
  const items: Array<{
    id: string;
    type: 'quiz' | 'exam' | 'chat' | 'task';
    title: string;
    subtitle: string;
    subject: string;
    date: string;
    badge: string;
    badgeColor: string;
  }> = [];

  quizAttempts.forEach((q) => {
    items.push({
      id: q.id,
      type: 'quiz',
      title: q.quizTitle,
      subtitle: `Score: ${q.score}/${q.maxScore} (${q.accuracyPercentage}%) · ${Math.round(
        q.timeSpentSeconds / 60
      )} mins`,
      subject: q.subject,
      date: q.completedAt,
      badge: `${q.accuracyPercentage}% Accuracy`,
      badgeColor: q.accuracyPercentage >= 75 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    });
  });

  examAttempts.forEach((e) => {
    items.push({
      id: e.id,
      type: 'exam',
      title: e.examTitle,
      subtitle: `Score: ${e.score}/${e.totalMarks} (${e.percentage}%) · Time: ${Math.round(
        e.timeUsedSeconds / 60
      )} mins`,
      subject: e.subject,
      date: e.submittedAt,
      badge: `${e.percentage}% (${e.percentage >= 65 ? 'Passed' : 'Retest'})`,
      badgeColor: e.percentage >= 65 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    });
  });

  conversations.forEach((c) => {
    items.push({
      id: c.id,
      type: 'chat',
      title: c.title,
      subtitle: `${c.messages.length} messages exchanged with Socratic Tutor`,
      subject: c.subject,
      date: c.updatedAt,
      badge: 'AI Tutor',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    });
  });

  studyPlan.tasks
    .filter((t) => t.isCompleted && t.completedAt)
    .forEach((t) => {
      items.push({
        id: t.id,
        type: 'task',
        title: t.topic,
        subtitle: `Completed daily scheduled task · ${t.durationMinutes} mins`,
        subject: t.subject,
        date: t.completedAt || new Date().toISOString(),
        badge: 'Task Done',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      });
    });

  // Sort descending by date
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = items.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    return matchesType && matchesSubject;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-800/80 via-purple-900/20 to-transparent border border-white/10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <History className="w-4 h-4 text-pink-400" />
            <span>Activity Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Learning History & Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Audit trail of every quiz, timed exam session, tutor conversation, and completed task.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'exam', label: 'Exams' },
            { id: 'chat', label: 'AI Sessions' },
            { id: 'task', label: 'Tasks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === tab.id
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl glass-panel text-center text-slate-400">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">No activity matches your filter criteria.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl glass-panel hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {item.type === 'quiz' && <HelpCircle className="w-4 h-4 text-emerald-400" />}
                  {item.type === 'exam' && <Timer className="w-4 h-4 text-amber-400" />}
                  {item.type === 'chat' && <Sparkles className="w-4 h-4 text-pink-400" />}
                  {item.type === 'task' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.subject}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.date).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <div className="self-end sm:self-auto shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
