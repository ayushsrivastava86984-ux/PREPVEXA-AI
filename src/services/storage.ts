import {
  UserProfile,
  Subject,
  StudyMaterial,
  Conversation,
  Quiz,
  QuizAttempt,
  Exam,
  ExamAttempt,
  StudyPlan,
  Achievement,
  NotificationItem,
} from '../types';

const STORAGE_KEYS = {
  USER: 'vivora_user_profile',
  SUBJECTS: 'vivora_subjects',
  MATERIALS: 'vivora_materials',
  CONVERSATIONS: 'vivora_conversations',
  QUIZZES: 'vivora_quizzes',
  QUIZ_ATTEMPTS: 'vivora_quiz_attempts',
  EXAMS: 'vivora_exams',
  EXAM_ATTEMPTS: 'vivora_exam_attempts',
  STUDY_PLAN: 'vivora_study_plan',
  ACHIEVEMENTS: 'vivora_achievements',
  NOTIFICATIONS: 'vivora_notifications',
  REDUCED_MOTION: 'vivora_reduced_motion',
};

// Initial Student Profile
export const DEFAULT_STUDENT: UserProfile = {
  id: 'usr_vivora_student_1',
  email: 'alex.chen@vivora.edu',
  fullName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  educationLevel: 'Undergraduate Computer Science',
  preferredSubjects: ['Computer Science', 'Data Structures & Algorithms', 'Mathematics'],
  learningGoals: 'Master system design, algorithms, and ace upcoming semester competitive finals',
  studyStreakDays: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 480,
  createdAt: '2026-09-01T08:00:00Z',
};

// Initial Subjects
export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub_cs',
    code: 'CS-301',
    name: 'Data Structures & Algorithms',
    description: 'Tree traversals, dynamic programming, graph theory, algorithmic complexity',
    icon: 'Binary',
    color: '#ec4899',
    topics: ['Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Hash Maps', 'Time Complexity'],
  },
  {
    id: 'sub_os',
    code: 'CS-402',
    name: 'Operating Systems',
    description: 'Concurrency, virtual memory, scheduling algorithms, thread synchronization',
    icon: 'Cpu',
    color: '#8b5cf6',
    topics: ['Process Scheduling', 'Virtual Memory & Paging', 'Deadlocks & Semaphores', 'File Systems'],
  },
  {
    id: 'sub_math',
    code: 'MATH-201',
    name: 'Discrete Mathematics',
    description: 'Combinatorics, probability, graph theory, propositional logic, and proofs',
    icon: 'Compass',
    color: '#3b82f6',
    topics: ['Probability & Bayes', 'Combinatorics', 'Set Theory', 'Recurrence Relations'],
  },
  {
    id: 'sub_ai',
    code: 'AI-505',
    name: 'Artificial Intelligence & ML',
    description: 'Neural networks, optimization, gradient descent, NLP, reinforcement learning',
    icon: 'Sparkles',
    color: '#f43f5e',
    topics: ['Neural Architectures', 'Backpropagation', 'Loss Functions', 'Attention Mechanisms'],
  },
];

// Pre-built Quizzes
export const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'quiz_dsa_1',
    creatorId: 'usr_vivora_student_1',
    subject: 'Data Structures & Algorithms',
    title: 'Trees & Graph Traversal Checkpoint',
    topic: 'Binary Search Trees & DFS',
    difficulty: 'medium',
    questionCount: 4,
    createdAt: '2026-10-01T10:00:00Z',
    questions: [
      {
        id: 'q1',
        questionText: 'What is the worst-case time complexity of searching in an unbalanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctOptionIndex: 2,
        explanation: 'In the worst case, an unbalanced BST degenerates into a linked list of height n, making search O(n). An AVL or Red-Black tree guarantees O(log n).',
        topicTag: 'Binary Search Trees',
        difficulty: 'medium',
      },
      {
        id: 'q2',
        questionText: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra with Priority Queue', 'Tarjan SCC'],
        correctOptionIndex: 1,
        explanation: 'BFS explores neighbor nodes level by level using a FIFO queue, ensuring shortest path discovery in unweighted graphs.',
        topicTag: 'Graph Traversal',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        questionText: 'When detecting cycles in a directed graph, which DFS vertex coloring state indicates a back-edge cycle?',
        options: ['White (Unvisited)', 'Gray (Currently visiting in recursion stack)', 'Black (Completed visitation)', 'Blue (Leaf node)'],
        correctOptionIndex: 1,
        explanation: 'In 3-color DFS cycle detection, encountering a Gray node means we have found a back-edge to an ancestor currently on the call stack, confirming a directed cycle.',
        topicTag: 'Cycle Detection',
        difficulty: 'hard',
      },
      {
        id: 'q4',
        questionText: 'What is the space complexity of an in-order traversal of a balanced binary tree with N nodes?',
        options: ['O(1)', 'O(log N) auxiliary recursion stack', 'O(N) heap space', 'O(N^2)'],
        correctOptionIndex: 1,
        explanation: 'A balanced binary tree has height log2(N). The recursion stack requires memory proportional to the height, which is O(log N).',
        topicTag: 'Tree Traversal',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'quiz_os_1',
    creatorId: 'usr_vivora_student_1',
    subject: 'Operating Systems',
    title: 'Virtual Memory & Page Replacement',
    topic: 'Paging & TLB',
    difficulty: 'medium',
    questionCount: 3,
    createdAt: '2026-10-02T14:30:00Z',
    questions: [
      {
        id: 'qos1',
        questionText: 'What condition does Belady\'s Anomaly describe in page replacement algorithms?',
        options: [
          'Increasing page frames results in more page faults (occurring in FIFO)',
          'TLB misses always cause operating system panic',
          'LRU algorithm consumes quadratic memory',
          'Virtual addresses cannot exceed physical memory limits',
        ],
        correctOptionIndex: 0,
        explanation: 'Belady\'s Anomaly occurs in FIFO replacement where allocating more physical page frames unexpectedly increases total page faults.',
        topicTag: 'Page Replacement',
        difficulty: 'medium',
      },
      {
        id: 'qos2',
        questionText: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
        options: [
          'To store process control blocks in cache',
          'High-speed associative hardware cache for virtual-to-physical address translations',
          'To swap dirty memory pages to secondary disk',
          'To resolve deadlock race conditions',
        ],
        correctOptionIndex: 1,
        explanation: 'The TLB is a dedicated hardware cache that keeps recent virtual-to-physical page mappings to avoid costly page table walks.',
        topicTag: 'Memory Management',
        difficulty: 'easy',
      },
      {
        id: 'qos3',
        questionText: 'Which of the following is NOT one of the Coffman conditions required for Deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOptionIndex: 2,
        explanation: 'The condition is "No Preemption" (resources cannot be forcibly taken away). If preemption is allowed, deadlock cannot occur.',
        topicTag: 'Deadlocks',
        difficulty: 'medium',
      },
    ],
  },
];

// Pre-built Exam Simulator
export const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'exam_cs_midterm',
    subject: 'Data Structures & Algorithms',
    title: 'CS 301 Comprehensive Midterm Exam',
    instructions:
      'This timed exam consists of 6 multi-part conceptual questions. You have 20 minutes to complete. You may navigate freely between questions, mark questions for review, and submit when finished. Answers will autosave continuously. Avoid switching tabs during the session.',
    durationMinutes: 20,
    totalMarks: 60,
    passingPercentage: 65,
    totalQuestions: 6,
    createdAt: '2026-10-01T09:00:00Z',
    questions: [
      {
        id: 'eq1',
        questionText: 'Which data structure provides amortized O(1) insertion, deletion, and search on average, but worst-case O(N)?',
        options: ['Binary Heap', 'Hash Table with separate chaining', 'Red-Black Balanced Tree', 'Skip List'],
        correctOptionIndex: 1,
        explanation: 'A Hash Table achieves O(1) expected time for operations. Under severe hash collisions, it degrades to O(N).',
        topicTag: 'Hash Tables',
        difficulty: 'medium',
      },
      {
        id: 'eq2',
        questionText: 'What is the recurrence relation for the Merge Sort algorithm on an array of size N?',
        options: ['T(N) = T(N-1) + O(1)', 'T(N) = 2T(N/2) + O(N)', 'T(N) = 2T(N/2) + O(1)', 'T(N) = T(N/2) + O(N)'],
        correctOptionIndex: 1,
        explanation: 'Merge sort divides the problem into 2 subproblems of size N/2, then merges them in linear time O(N), yielding T(N) = 2T(N/2) + O(N). By Master Theorem, this is O(N log N).',
        topicTag: 'Divide and Conquer',
        difficulty: 'medium',
      },
      {
        id: 'eq3',
        questionText: 'In Dijkstra\'s shortest path algorithm with non-negative edge weights, what happens if an edge has a negative weight?',
        options: [
          'The algorithm terminates faster',
          'It correctly finds the shortest path regardless',
          'It may produce incorrect shortest distances because the greedy choice property is violated',
          'The graph automatically becomes bipartite',
        ],
        correctOptionIndex: 2,
        explanation: 'Dijkstra assumes that adding an edge never decreases the distance to an already settled vertex. Negative edge weights break this invariant; the Bellman-Ford algorithm should be used instead.',
        topicTag: 'Shortest Path Algorithms',
        difficulty: 'hard',
      },
      {
        id: 'eq4',
        questionText: 'What is the tight asymptotic bound for finding the median in an unsorted array of size N using Quickselect?',
        options: ['O(log N) worst case', 'O(N) average case, O(N^2) worst case', 'O(N log N) strictly', 'O(1) auxiliary'],
        correctOptionIndex: 1,
        explanation: 'Quickselect drops the partition not containing the target rank, yielding average case T(N) = T(N/2) + O(N) = O(N). Worst-case pivot choices yield O(N^2).',
        topicTag: 'Sorting & Selection',
        difficulty: 'medium',
      },
      {
        id: 'eq5',
        questionText: 'Which problem classification applies to the 0/1 Knapsack Problem?',
        options: ['P (Polynomial time deterministic)', 'NP-complete (solvable in pseudo-polynomial time via DP)', 'Undecidable', 'Logarithmic space'],
        correctOptionIndex: 1,
        explanation: '0/1 Knapsack is weakly NP-complete. Dynamic programming solves it in O(N * W), which is pseudo-polynomial because W depends on the numerical value of capacity.',
        topicTag: 'Dynamic Programming',
        difficulty: 'hard',
      },
      {
        id: 'eq6',
        questionText: 'Which property is guaranteed by a Min-Heap binary tree with height H?',
        options: [
          'In-order traversal outputs sorted keys',
          'The root node holds the minimum element of the entire collection',
          'Every node has strictly two children',
          'Search takes O(1) time',
        ],
        correctOptionIndex: 1,
        explanation: 'In a Min-Heap, the parent key is less than or equal to its children\'s keys, so the root element is guaranteed to be the minimum.',
        topicTag: 'Priority Queues & Heaps',
        difficulty: 'easy',
      },
    ],
  },
];

// Initial Quiz Attempts
export const DEFAULT_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att_q1',
    userId: 'usr_vivora_student_1',
    quizId: 'quiz_dsa_1',
    quizTitle: 'Trees & Graph Traversal Checkpoint',
    subject: 'Data Structures & Algorithms',
    topic: 'Binary Search Trees & DFS',
    score: 3,
    maxScore: 4,
    accuracyPercentage: 75,
    timeSpentSeconds: 140,
    weakTopics: ['Cycle Detection'],
    aiFeedback: 'Solid performance on BST and BFS fundamentals! Review 3-color DFS recursion stacks for directed graph cycle detection.',
    userResponses: { 0: 2, 1: 1, 2: 0, 3: 1 },
    completedAt: '2026-10-02T11:20:00Z',
  },
  {
    id: 'att_q2',
    userId: 'usr_vivora_student_1',
    quizId: 'quiz_os_1',
    quizTitle: 'Virtual Memory & Page Replacement',
    subject: 'Operating Systems',
    topic: 'Paging & TLB',
    score: 3,
    maxScore: 3,
    accuracyPercentage: 100,
    timeSpentSeconds: 95,
    weakTopics: [],
    aiFeedback: 'Exceptional mastery of virtual memory paging and Coffman deadlock conditions. Ready for advanced scheduling topics.',
    userResponses: { 0: 0, 1: 1, 2: 2 },
    completedAt: '2026-10-03T15:45:00Z',
  },
];

// Initial Exam Attempts
export const DEFAULT_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att_e1',
    userId: 'usr_vivora_student_1',
    examId: 'exam_cs_midterm',
    examTitle: 'CS 301 Comprehensive Midterm Exam',
    subject: 'Data Structures & Algorithms',
    score: 50,
    totalMarks: 60,
    percentage: 83.33,
    accuracyPercentage: 83.33,
    timeUsedSeconds: 840,
    status: 'completed',
    weakTopics: ['Shortest Path Algorithms'],
    strongTopics: ['Hash Tables', 'Divide and Conquer', 'Dynamic Programming', 'Heaps'],
    aiRecommendations:
      'Outstanding score of 83.3%. You demonstrated sharp intuition on DP and tree invariants. Practice Dijkstra vs Bellman-Ford edge case differences to achieve top percentiles.',
    userResponses: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
    markedForReview: [2],
    submittedAt: '2026-10-03T18:10:00Z',
  },
];

// Initial Study Materials
export const DEFAULT_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_1',
    userId: 'usr_vivora_student_1',
    subjectName: 'Data Structures & Algorithms',
    title: 'Advanced Graph Algorithms Lecture Notes',
    description: 'Covers Dijkstra, Bellman-Ford, Floyd-Warshall, and topological sorting proofs.',
    fileName: 'lecture_07_graph_algorithms.pdf',
    fileSizeBytes: 2450000,
    fileType: 'pdf',
    storageBucket: 'study_materials',
    tags: ['Graphs', 'Shortest Path', 'Exam Prep'],
    isAnalyzedByAi: true,
    aiSummary:
      'High-yield synthesis: Focuses on shortest path invariants, negative cycle detection with Bellman-Ford, and DAG topological sorting for dynamic programming ordering.',
    createdAt: '2026-09-28T09:15:00Z',
  },
  {
    id: 'mat_2',
    userId: 'usr_vivora_student_1',
    subjectName: 'Operating Systems',
    title: 'Concurrency & Deadlock Cheatsheet',
    description: 'Summary of synchronization primitives, mutexes, semaphores, and reader-writer problems.',
    fileName: 'os_concurrency_summary.pdf',
    fileSizeBytes: 1820000,
    fileType: 'pdf',
    storageBucket: 'study_materials',
    tags: ['Paging', 'Deadlocks', 'Synchronization'],
    isAnalyzedByAi: true,
    aiSummary:
      'Quick reference guide: Details 4 Coffman conditions, Peterson algorithm invariants, and semaphore implementations with wait/signal semantics.',
    createdAt: '2026-10-01T14:00:00Z',
  },
  {
    id: 'mat_3',
    userId: 'usr_vivora_student_1',
    subjectName: 'Discrete Mathematics',
    title: 'Bayesian Probability & Recurrence Proofs',
    description: 'Worked examples of master theorem and Bayes theorem applications.',
    fileName: 'discrete_math_proofs.png',
    fileSizeBytes: 980000,
    fileType: 'image',
    storageBucket: 'study_materials',
    tags: ['Proofs', 'Bayes', 'Master Theorem'],
    isAnalyzedByAi: false,
    createdAt: '2026-10-02T16:20:00Z',
  },
];

// Initial Study Plan
export const DEFAULT_STUDY_PLAN: StudyPlan = {
  id: 'plan_active_1',
  userId: 'usr_vivora_student_1',
  goal: 'Master Core Computer Science & Finals Prep',
  subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Discrete Mathematics'],
  targetExamDate: '2026-11-15',
  dailyAvailableMinutes: 60,
  difficulty: 'medium',
  planTitle: 'Algorithmic Mastery & OS Systems Sprint',
  summary:
    'Targeted 4-week preparation plan emphasizing your active weak areas (Cycle Detection, Shortest Paths) while sustaining top exam speed.',
  tasks: [
    {
      id: 'task_1',
      planId: 'plan_active_1',
      day: 'Day 1',
      subject: 'Data Structures & Algorithms',
      topic: 'Dijkstra vs Bellman-Ford Shortest Paths',
      durationMinutes: 45,
      taskType: 'Targeted Practice',
      recommendedAction: 'Solve 3 practice problems and review negative cycle edge cases.',
      isCompleted: true,
      completedAt: '2026-10-03T10:00:00Z',
    },
    {
      id: 'task_2',
      planId: 'plan_active_1',
      day: 'Day 2',
      subject: 'Data Structures & Algorithms',
      topic: 'DFS 3-Coloring Cycle Detection in DAGs',
      durationMinutes: 30,
      taskType: 'Concept Deep Dive',
      recommendedAction: 'Ask AI Tutor to explain back-edges and recursive vertex states.',
      isCompleted: true,
      completedAt: '2026-10-03T16:30:00Z',
    },
    {
      id: 'task_3',
      planId: 'plan_active_1',
      day: 'Day 3 (Today)',
      subject: 'Operating Systems',
      topic: 'Virtual Memory Paging & Inverted Page Tables',
      durationMinutes: 45,
      taskType: 'Quiz Review',
      recommendedAction: 'Generate an AI Quiz on Virtual Memory with 5 questions.',
      isCompleted: false,
    },
    {
      id: 'task_4',
      planId: 'plan_active_1',
      day: 'Day 4',
      subject: 'Discrete Mathematics',
      topic: 'Recurrence Relations & Master Theorem',
      durationMinutes: 40,
      taskType: 'Problem Solving',
      recommendedAction: 'Work through 4 asymptotic expansion proofs.',
      isCompleted: false,
    },
    {
      id: 'task_5',
      planId: 'plan_active_1',
      day: 'Day 5',
      subject: 'Data Structures & Algorithms',
      topic: 'Dynamic Programming: Knapsack & Longest Subsequence',
      durationMinutes: 60,
      taskType: 'Assessment Simulator',
      recommendedAction: 'Attempt a 20-minute timed exam simulator.',
      isCompleted: false,
    },
  ],
  createdAt: '2026-10-01T08:00:00Z',
};

// Initial Achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_quiz',
    slug: 'first-quiz',
    title: 'First Step',
    description: 'Complete your first practice quiz on VIVORA AI.',
    badgeIcon: 'Award',
    category: 'quiz',
    requiredValue: 1,
    currentProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-15T12:00:00Z',
  },
  {
    id: 'ach_streak_7',
    slug: '7-day-streak',
    title: 'Consistency King',
    description: 'Maintain an active study streak for 7 consecutive days.',
    badgeIcon: 'Flame',
    category: 'streak',
    requiredValue: 7,
    currentProgress: 7,
    isUnlocked: true,
    unlockedAt: '2026-10-03T18:00:00Z',
  },
  {
    id: 'ach_accuracy_90',
    slug: 'high-accuracy',
    title: 'Precision Master',
    description: 'Achieve 90% or higher accuracy on a challenging assessment.',
    badgeIcon: 'Crosshair',
    category: 'mastery',
    requiredValue: 90,
    currentProgress: 100,
    isUnlocked: true,
    unlockedAt: '2026-10-03T15:45:00Z',
  },
  {
    id: 'ach_first_exam',
    slug: 'first-exam',
    title: 'Exam Veteran',
    description: 'Complete a full timed exam simulator session.',
    badgeIcon: 'CheckCircle2',
    category: 'exam',
    requiredValue: 1,
    currentProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-10-03T18:10:00Z',
  },
  {
    id: 'ach_quizzes_10',
    slug: '10-quizzes',
    title: 'Tenacious Learner',
    description: 'Complete 10 knowledge check quizzes.',
    badgeIcon: 'Zap',
    category: 'quiz',
    requiredValue: 10,
    currentProgress: 7,
    isUnlocked: false,
  },
  {
    id: 'ach_study_master',
    slug: 'study-master',
    title: 'Study Master',
    description: 'Log over 600 total minutes of focused AI study sessions.',
    badgeIcon: 'Crown',
    category: 'mastery',
    requiredValue: 600,
    currentProgress: 480,
    isUnlocked: false,
  },
];

// Initial Notifications
export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_vivora_student_1',
    title: 'Streak Fire Active! 🔥',
    message: 'You have hit a 7-day study streak. Complete today’s task to keep it burning.',
    type: 'streak' as any,
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: 'study-plan',
  },
  {
    id: 'notif_2',
    userId: 'usr_vivora_student_1',
    title: 'AI Diagnostic Generated',
    message: 'Your exam results are analyzed. Recommended focus: Shortest Path edge cases.',
    type: 'insight',
    isRead: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    actionUrl: 'analytics',
  },
  {
    id: 'notif_3',
    userId: 'usr_vivora_student_1',
    title: 'Task Scheduled for Today',
    message: 'Virtual Memory Paging & Inverted Page Tables is due today.',
    type: 'task',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    actionUrl: 'study-plan',
  },
];

// Initial Conversation
export const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    userId: 'usr_vivora_student_1',
    subject: 'Data Structures & Algorithms',
    title: 'Dijkstra vs Bellman-Ford Tradeoffs',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Why does Dijkstra fail when there are negative edge weights, but Bellman-Ford works?',
        timestamp: '2026-10-03T11:00:00Z',
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: `### Why Dijkstra Fails on Negative Edges

**Dijkstra's Algorithm** is fundamentally **greedy**:
1. Once a vertex $u$ is extracted from the priority queue with distance $d[u]$, the algorithm permanently considers $d[u]$ finalized (optimal).
2. It assumes that exploring further edges will **only increase** or preserve path weights.
3. If a subsequent edge has a **negative weight**, it could reduce the total distance to an already-settled vertex, but Dijkstra will never revisit it!

---

### Why Bellman-Ford Works
- **Dynamic Programming relaxation:** Bellman-Ford relaxes **all $|E|$ edges** up to $|V|-1$ times.
- It propagates negative reductions across the entire graph.
- On the $|V|$-th iteration, if any distance still decreases, it detects a **negative weight cycle**.

> **Key Rule of Thumb:** For non-negative edges, use **Dijkstra** ($O((V + E) \\log V)$). For general weights with potential negative edges, use **Bellman-Ford** ($O(V \\cdot E)$).`,
        timestamp: '2026-10-03T11:00:15Z',
        tokensUsed: 310,
      },
    ],
    updatedAt: '2026-10-03T11:00:15Z',
  },
];

// Helper Storage Manager
export const StorageManager = {
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  },
  saveUser: (user: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getSubjects: (): Subject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  },

  getQuizzes: (): Quiz[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return data ? JSON.parse(data) : DEFAULT_QUIZZES;
    } catch {
      return DEFAULT_QUIZZES;
    }
  },
  saveQuiz: (quiz: Quiz) => {
    const list = StorageManager.getQuizzes();
    const updated = [quiz, ...list.filter((q) => q.id !== quiz.id)];
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updated));
    return updated;
  },

  getQuizAttempts: (): QuizAttempt[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      return data ? JSON.parse(data) : DEFAULT_QUIZ_ATTEMPTS;
    } catch {
      return DEFAULT_QUIZ_ATTEMPTS;
    }
  },
  saveQuizAttempt: (attempt: QuizAttempt) => {
    const list = StorageManager.getQuizAttempts();
    const updated = [attempt, ...list];
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(updated));

    // Update student progress & achievements
    const user = StorageManager.getUser();
    user.totalStudyMinutes += Math.round(attempt.timeSpentSeconds / 60) || 5;
    StorageManager.saveUser(user);

    return updated;
  },

  getExams: (): Exam[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return data ? JSON.parse(data) : DEFAULT_EXAMS;
    } catch {
      return DEFAULT_EXAMS;
    }
  },

  getExamAttempts: (): ExamAttempt[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAM_ATTEMPTS);
      return data ? JSON.parse(data) : DEFAULT_EXAM_ATTEMPTS;
    } catch {
      return DEFAULT_EXAM_ATTEMPTS;
    }
  },
  saveExamAttempt: (attempt: ExamAttempt) => {
    const list = StorageManager.getExamAttempts();
    const updated = [attempt, ...list];
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify(updated));

    const user = StorageManager.getUser();
    user.totalStudyMinutes += Math.round(attempt.timeUsedSeconds / 60) || 15;
    StorageManager.saveUser(user);

    return updated;
  },

  getMaterials: (): StudyMaterial[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      return data ? JSON.parse(data) : DEFAULT_MATERIALS;
    } catch {
      return DEFAULT_MATERIALS;
    }
  },
  saveMaterial: (mat: StudyMaterial) => {
    const list = StorageManager.getMaterials();
    const updated = [mat, ...list];
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
    return updated;
  },
  deleteMaterial: (id: string) => {
    const list = StorageManager.getMaterials();
    const updated = list.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
    return updated;
  },

  getStudyPlan: (): StudyPlan => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      return data ? JSON.parse(data) : DEFAULT_STUDY_PLAN;
    } catch {
      return DEFAULT_STUDY_PLAN;
    }
  },
  saveStudyPlan: (plan: StudyPlan) => {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
    return plan;
  },

  getConversations: (): Conversation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : DEFAULT_CONVERSATIONS;
    } catch {
      return DEFAULT_CONVERSATIONS;
    }
  },
  saveConversation: (conv: Conversation) => {
    const list = StorageManager.getConversations();
    const filtered = list.filter((c) => c.id !== conv.id);
    const updated = [conv, ...filtered];
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    return updated;
  },
  deleteConversation: (id: string) => {
    const list = StorageManager.getConversations();
    const updated = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    return updated;
  },

  getAchievements: (): Achievement[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  },
  saveAchievements: (achievements: Achievement[]) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  getNotifications: (): NotificationItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },
  saveNotifications: (items: NotificationItem[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
  },

  getReducedMotion: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION) === 'true';
    } catch {
      return false;
    }
  },
  setReducedMotion: (val: boolean) => {
    localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, String(val));
  },
};
