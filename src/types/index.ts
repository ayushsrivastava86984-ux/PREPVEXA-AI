export type UserRole = 'student' | 'admin' | 'instructor';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  educationLevel: string;
  preferredSubjects: string[];
  learningGoals: string;
  studyStreakDays: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
}

export interface StudyMaterial {
  id: string;
  userId: string;
  subjectName: string;
  title: string;
  description: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: 'pdf' | 'document' | 'image';
  storageBucket: string;
  tags: string[];
  isAnalyzedByAi: boolean;
  aiSummary?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  subject: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topicTag: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  creatorId: string;
  subject: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  questions: Question[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  topic: string;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  weakTopics: string[];
  aiFeedback: string;
  userResponses: Record<number, number>; // questionIndex -> selectedOptionIndex
  completedAt: string;
}

export interface Exam {
  id: string;
  subject: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  totalQuestions: number;
  questions: Question[];
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  subject: string;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracyPercentage: number;
  timeUsedSeconds: number;
  status: 'completed' | 'timed_out';
  weakTopics: string[];
  strongTopics: string[];
  aiRecommendations: string;
  userResponses: Record<number, number>;
  markedForReview: number[];
  submittedAt: string;
}

export interface StudyTask {
  id: string;
  planId: string;
  day: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  taskType: string;
  recommendedAction: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  goal: string;
  subjects: string[];
  targetExamDate: string;
  dailyAvailableMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  planTitle: string;
  summary: string;
  tasks: StudyTask[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'quiz' | 'exam' | 'streak' | 'mastery';
  requiredValue: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'exam' | 'achievement' | 'task' | 'insight' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
