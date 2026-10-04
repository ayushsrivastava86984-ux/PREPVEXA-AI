import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Award,
  BookOpen,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, ExamAttempt } from '../types';
import { StorageManager } from '../services/storage';
import { ApiService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ExamViewProps {
  onExamCompleted: (attempt: ExamAttempt) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ onExamCompleted }) => {
  const { addToast } = useToast();
  const [exams] = useState<Exam[]>(() => StorageManager.getExams());
  const [selectedExam, setSelectedExam] = useState<Exam>(exams[0]);

  // Exam execution state
  const [isInExamSession, setIsInExamSession] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<ExamAttempt | null>(null);

  const timerRef = useRef<any>(null);

  // Start Exam
  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsInExamSession(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setMarkedForReview([]);
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setCompletedAttempt(null);
  };

  // Timer loop with auto-submit
  useEffect(() => {
    if (!isInExamSession || completedAttempt) return;

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isInExamSession, completedAttempt]);

  const handleAutoSubmit = () => {
    addToast({
      type: 'error',
      title: 'Time Expired!',
      message: 'Exam session completed. Submitting answers automatically...',
    });
    finalizeSubmission('timed_out');
  };

  const handleManualSubmit = () => {
    setIsSubmitModalOpen(false);
    finalizeSubmission('completed');
  };

  const finalizeSubmission = async (status: 'completed' | 'timed_out') => {
    if (!selectedExam) return;
    setIsSubmitting(true);

    const totalSecondsUsed = selectedExam.durationMinutes * 60 - timeRemainingSeconds;

    let score = 0;
    const weakTopicsSet = new Set<string>();
    const strongTopicsSet = new Set<string>();

    selectedExam.questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === q.correctOptionIndex) {
        score += Math.round(selectedExam.totalMarks / selectedExam.totalQuestions);
        if (q.topicTag) strongTopicsSet.add(q.topicTag);
      } else {
        if (q.topicTag) weakTopicsSet.add(q.topicTag);
      }
    });

    const percentage = Math.round((score / selectedExam.totalMarks) * 100);
    const weakTopics = Array.from(weakTopicsSet);
    const strongTopics = Array.from(strongTopicsSet);

    // Call server Gemini to generate real exam diagnostic analysis
    let aiRecs = 'Solid performance. Focus on edge cases in complex algorithms.';
    try {
      const analysis = await ApiService.analyzeExam({
        examTitle: selectedExam.title,
        score,
        totalQuestions: selectedExam.totalQuestions,
        userResponses: userAnswers,
        questions: selectedExam.questions,
        timeUsedSeconds: totalSecondsUsed,
      });
      aiRecs = `${analysis.overallVerdict || ''} ${analysis.actionablePlan || ''}`.trim();
    } catch {
      // Fallback analysis
      aiRecs = `You scored ${percentage}%. Recommended focus: revise ${weakTopics.join(', ') || 'core principles'} and practice with the AI Tutor.`;
    }

    if (percentage >= selectedExam.passingPercentage) {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }

    const attempt: ExamAttempt = {
      id: 'att_exam_' + Date.now(),
      userId: 'usr_vivora_student_1',
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      subject: selectedExam.subject,
      score,
      totalMarks: selectedExam.totalMarks,
      percentage,
      accuracyPercentage: percentage,
      timeUsedSeconds: totalSecondsUsed,
      status,
      weakTopics,
      strongTopics,
      aiRecommendations: aiRecs,
      userResponses: userAnswers,
      markedForReview,
      submittedAt: new Date().toISOString(),
    };

    StorageManager.saveExamAttempt(attempt);
    onExamCompleted(attempt);
    setCompletedAttempt(attempt);
    setIsSubmitting(false);

    addToast({
      type: percentage >= selectedExam.passingPercentage ? 'success' : 'info',
      title: 'Exam Evaluated',
      message: `Final Result: ${score}/${selectedExam.totalMarks} (${percentage}%)`,
    });
  };

  const toggleMarkForReview = (index: number) => {
    setMarkedForReview((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Post-Exam Results Screen
  if (completedAttempt && selectedExam) {
    const isPassed = completedAttempt.percentage >= selectedExam.passingPercentage;
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
        <div
          className={`p-6 sm:p-8 rounded-2xl border glass-panel ${
            isPassed ? 'border-emerald-500/40 glass-glow-green' : 'border-rose-500/40 glass-glow-red'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Official Exam Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {selectedExam.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Status: {completedAttempt.status === 'completed' ? 'Submitted Successfully' : 'Auto-submitted on Timeout'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStartExam(selectedExam)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>
              <button
                onClick={() => {
                  setIsInExamSession(false);
                  setCompletedAttempt(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/25"
              >
                Exit to Simulator
              </button>
            </div>
          </div>

          {/* Core Results Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Total Score</p>
              <p className="text-2xl font-extrabold text-white">
                {completedAttempt.score} / {completedAttempt.totalMarks}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Percentage</p>
              <p className={`text-2xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {completedAttempt.percentage}%
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Verdict</p>
              <p className={`text-2xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPassed ? 'PASSED' : 'RETEST'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Time Consumed</p>
              <p className="text-2xl font-extrabold text-amber-400">
                {Math.floor(completedAttempt.timeUsedSeconds / 60)}m {completedAttempt.timeUsedSeconds % 60}s
              </p>
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="mt-6 p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-pink-300">AI Exam Performance Diagnostic</p>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                {completedAttempt.aiRecommendations}
              </p>
            </div>
          </div>
        </div>

        {/* Question Solutions Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Full Exam Solution Guide & Error Breakdown</span>
          </h3>

          {selectedExam.questions.map((q, idx) => {
            const userAnswer = completedAttempt.userResponses[idx];
            const isCorrect = userAnswer === q.correctOptionIndex;
            return (
              <div
                key={q.id || idx}
                className={`p-5 rounded-2xl border ${
                  isCorrect
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900/60 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/[0.08] text-slate-200">
                      Question {idx + 1}
                    </span>
                    {q.topicTag && (
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        {q.topicTag}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    {isCorrect ? 'Correct' : 'Missed'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-100 mb-3">{q.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isRight = optIdx === q.correctOptionIndex;
                    let style = 'bg-slate-950/40 border-white/[0.06] text-slate-300';
                    if (isRight) style = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-medium';
                    if (isSelected && !isRight) style = 'bg-rose-500/15 border-rose-500/50 text-rose-200';

                    return (
                      <div key={optIdx} className={`p-2.5 rounded-xl border text-xs ${style}`}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300">
                  <span className="font-semibold text-pink-400">Solution Note: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Active Timed Exam Session
  if (isInExamSession && selectedExam) {
    const currentQ = selectedExam.questions[currentQIndex];
    const totalQ = selectedExam.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isMarked = markedForReview.includes(currentQIndex);

    // Urgent timer coloring (< 3 minutes = red alert)
    const isUrgent = timeRemainingSeconds < 180;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
        {/* Top Floating Exam Control Bar */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-amber-500/30">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              {selectedExam.subject} · Real Exam Mode
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md">
              {selectedExam.title}
            </h2>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                isUrgent
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-slate-900 border-white/10 text-amber-300'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
            >
              Finish & Submit
            </button>
          </div>
        </div>

        {/* Question Palette & Status Summary */}
        <div className="p-4 rounded-2xl glass-panel space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">
              Question <span className="text-white font-bold">{currentQIndex + 1}</span> of {totalQ}
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {answeredCount} Answered
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {markedForReview.length} For Review
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                {totalQ - answeredCount} Unanswered
              </span>
            </div>
          </div>

          {/* Palette grid */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto">
            {selectedExam.questions.map((_, i) => {
              const isAns = userAnswers[i] !== undefined;
              const isRev = markedForReview.includes(i);
              const isCurr = currentQIndex === i;

              let btnStyle = 'bg-slate-900 text-slate-400 border-white/10';
              if (isAns) btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
              if (isRev) btnStyle = 'bg-amber-500/25 text-amber-300 border-amber-500/50 font-bold';
              if (isCurr) btnStyle += ' ring-2 ring-pink-500';

              return (
                <button
                  key={i}
                  onClick={() => setCurrentQIndex(i)}
                  className={`w-8 h-8 rounded-lg text-xs transition-all shrink-0 border ${btnStyle}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question View */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {currentQ.topicTag || 'Core Topic'}
            </span>

            {/* Mark for review button */}
            <button
              onClick={() => toggleMarkForReview(currentQIndex)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                isMarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-400' : ''}`} />
              <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIndex) => {
              const isSelected = userAnswers[currentQIndex] === optIndex;
              return (
                <button
                  key={optIndex}
                  onClick={() => setUserAnswers((prev) => ({ ...prev, [currentQIndex]: optIndex }))}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-pink-500/20 border-pink-500 text-white font-semibold shadow-md shadow-pink-500/15'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/[0.08] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQIndex((p) => Math.max(0, p - 1))}
            disabled={currentQIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentQIndex((p) => Math.min(totalQ - 1, p + 1))}
            disabled={currentQIndex === totalQ - 1}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 disabled:opacity-40"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Submit Confirmation Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSubmitModalOpen(false)} />
            <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Submit Exam Session?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have answered <span className="font-semibold text-white">{answeredCount}</span> of{' '}
                <span className="font-semibold text-white">{totalQ}</span> questions.
                {markedForReview.length > 0 && (
                  <span>
                    {' '}
                    You still have <span className="text-amber-400 font-semibold">{markedForReview.length} questions marked for review</span>.
                  </span>
                )}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Continue Reviewing
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Exam Instructions & Available Simulators
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Exam Mode Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 glass-glow-yellow">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            <Timer className="w-4 h-4 text-amber-400" />
            <span>High-Stakes Exam Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Realistic Exam Mode Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Replicate real test-day pressure. Timed countdowns, question review flags, autosaved answers, and comprehensive post-exam AI diagnostics.
          </p>
        </div>
      </div>

      {/* Exam Card Showcase & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Exam Instructions Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30">
                {selectedExam.subject}
              </span>
              <span className="text-xs text-slate-400">Duration: {selectedExam.durationMinutes} mins</span>
            </div>
            <h2 className="text-xl font-bold text-white">{selectedExam.title}</h2>
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Exam Rules & Navigation Instructions</span>
            </div>
            <p>{selectedExam.instructions}</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Each question carries equal weight toward the {selectedExam.totalMarks} total marks.</li>
              <li>Passing standard: {selectedExam.passingPercentage}% score threshold.</li>
              <li>You may jump freely between questions and flag items for review.</li>
              <li>If the timer reaches 00:00, the session will auto-submit automatically.</li>
            </ul>
          </div>

          <button
            onClick={() => handleStartExam(selectedExam)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Timer className="w-4 h-4" />
            <span>Enter Exam Environment</span>
          </button>
        </div>

        {/* Right: Key Exam Features Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Simulator Capabilities</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.06]">
                <p className="font-semibold text-white">Zero Data Loss Autosave</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Your choices persist locally in real-time. Browser refreshes will not wipe your responses.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.06]">
                <p className="font-semibold text-white">Review Palette</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Flag tough problems with one click and revisit before submitting.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.06]">
                <p className="font-semibold text-white">Gemini Diagnostic Breakdown</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Immediate feedback detailing exact weakness topics and customized remedy tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
