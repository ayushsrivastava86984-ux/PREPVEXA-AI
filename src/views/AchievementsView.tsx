import React from 'react';
import {
  Award,
  Flame,
  Crosshair,
  CheckCircle2,
  Zap,
  Crown,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement } from '../types';
import { StorageManager } from '../services/storage';
import { useToast } from '../context/ToastContext';

interface AchievementsViewProps {
  achievements: Achievement[];
  onAchievementsChange: (updated: Achievement[]) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  onAchievementsChange,
}) => {
  const { addToast } = useToast();

  const handleCelebrate = (ach: Achievement) => {
    if (ach.isUnlocked) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
      addToast({
        type: 'success',
        title: 'Achievement Celebrated! 🎉',
        message: `${ach.title}: ${ach.description}`,
      });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return Flame;
      case 'Crosshair':
        return Crosshair;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'Zap':
        return Zap;
      case 'Crown':
        return Crown;
      default:
        return Award;
    }
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 glass-glow-yellow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Milestones & Badges</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Achievements
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Earn distinctive badges by sustaining streaks, acing exams, and mastering core syllabus topics.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
            <span className="text-xs text-slate-400">Total Unlocked</span>
            <p className="text-2xl font-extrabold text-amber-300">
              {unlockedCount} / {achievements.length}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.badgeIcon);
          const percent = Math.min(100, Math.round((ach.currentProgress / ach.requiredValue) * 100));

          return (
            <div
              key={ach.id}
              onClick={() => handleCelebrate(ach)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-slate-900/80 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                  : 'bg-slate-950/60 border-white/[0.06] opacity-75 hover:opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      ach.isUnlocked
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border border-white/10 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {ach.isUnlocked ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ach.description}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Progress</span>
                  <span className={ach.isUnlocked ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {ach.currentProgress} / {ach.requiredValue}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.isUnlocked ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
