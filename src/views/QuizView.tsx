import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, Quiz, QuizAttempt } from '../types';
import { ApiService } from '../services/api';
import { StorageManager } from '../services/storage';
import { useToast } from '../context/ToastContext';

interface QuizViewProps {
  subjects: Subject[];
  onQuizCompleted: (attempt: QuizAttempt) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ subjects, onQuizCompleted }) => {
  const { addToast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => StorageManager.getQuizzes());

  // Generator form states
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Data Structures & Algorithms');
  const [topic, setTopic] = useState('Dynamic Programming & Memoization');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz Playing State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);

  // Generate a new quiz with Gemini
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const generated = await ApiService.generateQuiz({
        subject: selectedSubject,
        topic,
        difficulty,
        questionCount,
      });

      const newQuiz: Quiz = {
        id: 'quiz_' + Date.now(),
        creatorId: 'usr_vivora_student_1',
        subject: selectedSubject,
        title: generated.title || `${topic} Assessment`,
        topic: generated.topic || topic,
        difficulty,
        questionCount: generated.questions?.length || questionCount,
        questions: generated.questions || [],
        createdAt: new Date().toISOString(),
      };

      const updated = StorageManager.saveQuiz(newQuiz);
      setQuizzes(updated);
      startQuiz(newQuiz);

      addToast({
        type: 'ai',
        title: 'Quiz Ready',
        message: `Generated ${newQuiz.questions.length} questions on ${topic}`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: err.message || 'Could not generate quiz. Please retry.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setUserAnswers({});
    setCompletedAttempt(null);
    setQuizStartTime(Date.now());
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    const timeSpentSeconds = Math.max(10, Math.round((Date.now() - quizStartTime) / 1000));
    let score = 0;
    const weakTopicsSet = new Set<string>();

    activeQuiz.questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === q.correctOptionIndex) {
        score++;
      } else {
        if (q.topicTag) weakTopicsSet.add(q.topicTag);
      }
    });

    const maxScore = activeQuiz.questions.length;
    const accuracyPercentage = Math.round((score / maxScore) * 100);
    const weakTopics = Array.from(weakTopicsSet);

    let aiFeedback = '';
    if (accuracyPercentage === 100) {
      aiFeedback = 'Flawless execution! You showed total conceptual precision across every question.';
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } else if (accuracyPercentage >= 75) {
      aiFeedback = `Great grasp of the material! Review ${weakTopics.join(', ') || 'the explanations'} to close the final gaps.`;
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else {
      aiFeedback = `Challenging run. Focus your upcoming study plan on ${weakTopics.join(', ') || 'core principles'}. Ask the AI Tutor for clarification on missed concepts.`;
    }

    const attempt: QuizAttempt = {
      id: 'att_' + Date.now(),
      userId: 'usr_vivora_student_1',
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      subject: activeQuiz.subject,
      topic: activeQuiz.topic,
      score,
      maxScore,
      accuracyPercentage,
      timeSpentSeconds,
      weakTopics,
      aiFeedback,
      userResponses: userAnswers,
      completedAt: new Date().toISOString(),
    };

    StorageManager.saveQuizAttempt(attempt);
    onQuizCompleted(attempt);
    setCompletedAttempt(attempt);

    addToast({
      type: accuracyPercentage >= 70 ? 'success' : 'info',
      title: 'Quiz Completed',
      message: `Score: ${score}/${maxScore} (${accuracyPercentage}%)`,
    });
  };

  // Render Completed Attempt Results
  if (completedAttempt && activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
        {/* Results Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-pink-500/15 via-emerald-500/10 to-transparent border border-pink-500/30 glass-glow-pink">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Quiz Evaluation Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {activeQuiz.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Subject: {activeQuiz.subject} · Topic: {activeQuiz.topic}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setCompletedAttempt(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 transition-all"
              >
                Create New Quiz
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Score</p>
              <p className="text-2xl font-extrabold text-white">
                {completedAttempt.score} / {completedAttempt.maxScore}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Accuracy</p>
              <p className={`text-2xl font-extrabold ${completedAttempt.accuracyPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {completedAttempt.accuracyPercentage}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Time Taken</p>
              <p className="text-2xl font-extrabold text-white">
                {Math.floor(completedAttempt.timeSpentSeconds / 60)}m {completedAttempt.timeSpentSeconds % 60}s
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <p className="text-[11px] text-slate-400">Identified Gaps</p>
              <p className="text-2xl font-extrabold text-pink-400">
                {completedAttempt.weakTopics.length}
              </p>
            </div>
          </div>

          {/* AI Feedback Banner */}
          <div className="mt-6 p-4 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-pink-300">AI Diagnostic Feedback</p>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                {completedAttempt.aiFeedback}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Comprehensive Question Review & Explanations</span>
          </h3>

          {activeQuiz.questions.map((q, idx) => {
            const userAnswer = completedAttempt.userResponses[idx];
            const isCorrect = userAnswer === q.correctOptionIndex;
            return (
              <div
                key={q.id || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900/60 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/[0.08] text-slate-200">
                      Q{idx + 1}
                    </span>
                    {q.topicTag && (
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        {q.topicTag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-100 mb-4">{q.questionText}</p>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isRightOption = optIdx === q.correctOptionIndex;
                    let optStyle = 'bg-slate-950/40 border-white/[0.06] text-slate-300';
                    if (isRightOption) {
                      optStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold';
                    } else if (isSelected && !isRightOption) {
                      optStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-200';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isRightOption && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {isSelected && !isRightOption && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-pink-400">Explanation: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Active Quiz Playing Interface
  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQIndex];
    const totalQ = activeQuiz.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isAnswered = userAnswers[currentQIndex] !== undefined;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
        {/* Quiz Runner Header */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              {activeQuiz.subject}
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md">
              {activeQuiz.title}
            </h2>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit this quiz session?')) {
                setActiveQuiz(null);
              }
            }}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10"
          >
            Exit
          </button>
        </div>

        {/* Progress & Question Navigator Bar */}
        <div className="p-4 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Question <span className="text-white font-bold">{currentQIndex + 1}</span> of {totalQ}
            </span>
            <span className="text-emerald-400 font-semibold">{answeredCount} of {totalQ} Answered</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Question number pills */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto">
            {activeQuiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  currentQIndex === i
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25 ring-2 ring-pink-400'
                    : userAnswers[i] !== undefined
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                    : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Question Card */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300">
              {currentQ.topicTag || activeQuiz.topic}
            </span>
            <span className="capitalize">{currentQ.difficulty || activeQuiz.difficulty}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIndex) => {
              const isSelected = userAnswers[currentQIndex] === optIndex;
              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelectOption(optIndex)}
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

        {/* Bottom Navigation & Submit */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentQIndex < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQIndex((prev) => Math.min(totalQ - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/25"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={answeredCount === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Submit Assessment</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default: Generator Form & Saved Quizzes Library
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* AI Quiz Generator Hero Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-purple-500/10 to-transparent border border-emerald-500/30 glass-glow-green">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Practice Question Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generate Targeted Mastery Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Select your syllabus topic and difficulty. Gemini will construct tailored multiple-choice challenges with verified explanations.
          </p>
        </div>

        <form onSubmit={handleGenerateQuiz} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic / Sub-area</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Graph Cycle Detection"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="easy">Easy (Foundational)</option>
              <option value="medium">Medium (Standard Exam)</option>
              <option value="hard">Hard (Advanced Edge Cases)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value={3}>3 Questions (Micro-quiz)</option>
              <option value={5}>5 Questions (Standard)</option>
              <option value={8}>8 Questions (Deep Practice)</option>
              <option value={10}>10 Questions (Comprehensive)</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating AI Quiz with Gemini...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate AI Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Available Pre-Built & Generated Quizzes Library */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-pink-400" />
          <span>Practice Quizzes Library</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl glass-panel relative group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {quiz.difficulty}
                  </span>
                  <span className="text-slate-400">{quiz.questionCount} Questions</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {quiz.title}
                </h4>
                <p className="text-xs text-slate-400">{quiz.subject}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => startQuiz(quiz)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3 fill-emerald-300" />
                  <span>Start</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
