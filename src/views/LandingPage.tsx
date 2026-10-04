import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Timer,
  Target,
  BarChart3,
  Award,
  Zap,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { AIOrb } from '../components/AIOrb';

interface LandingPageProps {
  onStartLearning: () => void;
  onExploreFeatures: () => void;
  reducedMotion: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onExploreFeatures,
  reducedMotion,
}) => {
  const learningLoop = [
    { step: '01', title: 'Define Goal', desc: 'Set target exams, dates, and subjects', icon: Target, color: 'text-amber-400' },
    { step: '02', title: 'Interactive Learn', desc: 'Engage with the Socratic AI Tutor on hard concepts', icon: Brain, color: 'text-pink-400' },
    { step: '03', title: 'Targeted Practice', desc: 'Generate dynamic multi-difficulty AI quizzes', icon: HelpCircle, color: 'text-emerald-400' },
    { step: '04', title: 'Simulated Exam', desc: 'Face realistic timed exam conditions with autosave', icon: Timer, color: 'text-rose-400' },
    { step: '05', title: 'Diagnostic Feedback', desc: 'Identify precision knowledge gaps & weak topics', icon: Zap, color: 'text-yellow-400' },
    { step: '06', title: 'Personalized Plan', desc: 'Update daily actionable tasks to close weaknesses', icon: TrendingUp, color: 'text-purple-400' },
  ];

  const features = [
    {
      title: 'Real-Time AI Study Assistant',
      description: 'Ask deep conceptual questions, request intuitive step-by-step proofs, or get high-yield summaries tailored to your syllabus.',
      icon: Sparkles,
      tag: 'Tutor',
      accent: 'border-pink-500/30 bg-pink-500/5',
      iconColor: 'text-pink-400',
    },
    {
      title: 'Dynamic AI Quiz Generator',
      description: 'Generate customizable MCQs on any subject, topic, and difficulty level with comprehensive answer explanations.',
      icon: HelpCircle,
      tag: 'Practice',
      accent: 'border-emerald-500/30 bg-emerald-500/5',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Full-Length Exam Mode Simulator',
      description: 'Replicate high-stakes test day conditions with strict timers, question review pallets, and automatic submission safeguards.',
      icon: Timer,
      tag: 'Assess',
      accent: 'border-amber-500/30 bg-amber-500/5',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Personalized Study Plans',
      description: 'Input your available hours and target deadlines to receive structured daily schedules that automatically adapt to your performance.',
      icon: Target,
      tag: 'Planning',
      accent: 'border-purple-500/30 bg-purple-500/5',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Performance Analytics & Insights',
      description: 'Understand subject mastery, accuracy trends, and pinpoint precise topic weaknesses before they cost you exam marks.',
      icon: BarChart3,
      tag: 'Analytics',
      accent: 'border-cyan-500/30 bg-cyan-500/5',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Dopamine-Rich Achievement System',
      description: 'Build an unstoppable study habit with visual streaks, milestone badges, and performance-based reward tiers.',
      icon: Award,
      tag: 'Motivation',
      accent: 'border-yellow-500/30 bg-yellow-500/5',
      iconColor: 'text-yellow-400',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-pink-600/15 via-purple-600/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Next-Gen AI Learning Companion</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                VIVORA <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-pink-300/90 font-mono">
                Practice. Perform. Progress.
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Your intelligent AI learning companion for studying smarter, practicing better, and understanding your performance. Turn complex syllabi into mastery through structured AI feedback loops.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-sm shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Quick Proof points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/[0.08] max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400">Adaptive AI Feedback</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-pink-400">Instant</p>
                <p className="text-xs text-slate-400">Weakness Detection</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-400">O(1)</p>
                <p className="text-xs text-slate-400">Exam Preparation Speed</p>
              </div>
            </div>
          </div>

          {/* Hero 3D Orb Visual */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative">
              <AIOrb size={440} reducedMotion={reducedMotion} className="mx-auto" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-[11px] text-slate-300 backdrop-blur-md shadow-xl flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <span>Interactive Neural Particle Sphere · Drag or hover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core VIVORA Learning Loop */}
      <section id="loop" className="py-20 border-y border-white/[0.08] bg-[#0c0e16]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">The VIVORA Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Scientific AI Learning Loop
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Traditional study creates an illusion of competence. VIVORA turns passive reading into an active, iterative engine of mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningLoop.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl glass-panel relative group hover:border-pink-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white/[0.06] text-slate-300">
                      {item.step}
                    </span>
                    <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Feature Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Serious Academic Performance
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From quick conceptual triage to rigorous timed exam dress rehearsals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${feat.accent}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${feat.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-black/40">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why VIVORA Comparison */}
      <section id="how-it-works" className="py-20 border-t border-white/[0.08] bg-[#0c0e16]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Why VIVORA</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Not another generic flashcard app.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Generic chatbots hallucinate and give surface answers. Standard quiz apps test random trivia without tracking root weaknesses.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                VIVORA pairs server-side Gemini intelligence with an exam simulation engine that diagnoses the exact theorems, concepts, and time crunches holding your score back.
              </p>
              <div className="pt-2">
                <button
                  onClick={onStartLearning}
                  className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2"
                >
                  Experience the Difference
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-rose-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Traditional Preparation</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Passive rereading of textbook chapters without retrieval practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Unrealistic question banks with no time pressure simulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>No structured root-cause analysis when you get questions wrong</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/35 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">VIVORA AI System</h4>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI-generated high-yield question sets tailored to your weakness topics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Realistic countdown simulator with autosave and review markers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dynamic study plan rescheduling based on real exam mistakes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-purple-500/15 border border-pink-500/30 glass-glow-pink">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ready to Upgrade Your Exam Score?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-6">
              Join thousands of students turning stressful study sessions into confident, methodical exam mastery.
            </p>
            <button
              onClick={onStartLearning}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-sm shadow-xl shadow-pink-500/30 hover:brightness-110 active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <span>Launch VIVORA 1.0</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-10 bg-[#07080c] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="font-bold text-white">VIVORA AI 1.0</span>
            <span className="text-slate-500">·</span>
            <span>Practice. Perform. Progress.</span>
          </div>
          <p className="text-slate-500">
            © {new Date().getFullYear()} VIVORA AI. High-Performance Learning Infrastructure.
          </p>
        </div>
      </footer>
    </div>
  );
};
