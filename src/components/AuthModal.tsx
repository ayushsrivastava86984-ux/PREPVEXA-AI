import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { UserProfile } from '../types';
import { StorageManager, DEFAULT_STUDENT } from '../services/storage';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset' | 'verify';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { addToast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signup') {
        // Enforce: Every normal signup automatically creates a Student profile (no role selection)
        const newStudent: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: email || 'student@vivora.ai',
          fullName: fullName || 'New Student',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'student', // Automatically Student
          educationLevel: 'Undergraduate',
          preferredSubjects: ['Computer Science', 'Mathematics'],
          learningGoals: 'Master exam preparation with AI',
          studyStreakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          totalStudyMinutes: 0,
          createdAt: new Date().toISOString(),
        };

        StorageManager.saveUser(newStudent);
        setVerificationSent(true);
        setMode('verify');
        addToast({
          type: 'success',
          title: 'Account Created',
          message: 'Student profile created! Please verify your email to unlock all features.',
        });
      } else if (mode === 'login') {
        const student = StorageManager.getUser() || DEFAULT_STUDENT;
        if (email) {
          student.email = email;
        }
        StorageManager.saveUser(student);
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${student.fullName}. Your study streak is active.`,
        });
        onLoginSuccess(student);
        onClose();
      } else if (mode === 'forgot') {
        addToast({
          type: 'info',
          title: 'Password Reset Sent',
          message: `If an account exists for ${email}, a secure reset link has been dispatched.`,
        });
        setMode('reset');
      } else if (mode === 'reset') {
        addToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your password has been securely reset. Please log in with your new credentials.',
        });
        setMode('login');
      }
    }, 600);
  };

  const handleDemoStudentLogin = () => {
    const student = StorageManager.getUser() || DEFAULT_STUDENT;
    onLoginSuccess(student);
    addToast({
      type: 'success',
      title: 'Demo Student Session Initialized',
      message: `Logged in as ${student.fullName} (Undergraduate CS).`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 mb-3 shadow-lg shadow-pink-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' && 'Sign in to VIVORA AI'}
            {mode === 'signup' && 'Create Student Account'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Set New Password'}
            {mode === 'verify' && 'Verify Your Email'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Enter your student credentials to continue your study streak.'}
            {mode === 'signup' && 'Automatic Student access with personalized AI tutoring.'}
            {mode === 'forgot' && 'We will send a secure recovery link to your inbox.'}
            {mode === 'reset' && 'Create a strong new password for your account.'}
            {mode === 'verify' && 'Check your inbox for a verification code.'}
          </p>
        </div>

        {mode === 'verify' ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have dispatched a verification link to <span className="font-semibold text-white">{email || 'your email'}</span>.
            </p>
            <button
              onClick={() => {
                const student = StorageManager.getUser();
                onLoginSuccess(student);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 transition-all"
            >
              Continue to Student Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Sign In to VIVORA'}
                  {mode === 'signup' && 'Create Student Account'}
                  {mode === 'forgot' && 'Send Recovery Instructions'}
                  {mode === 'reset' && 'Update Password'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick Demo Student Access Button */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Instant Student Demo (Alex Chen)
              </button>
            )}

            {/* Switch Mode Links */}
            <div className="text-center pt-2 text-xs text-slate-400">
              {mode === 'login' ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-pink-400 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-pink-400 font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
