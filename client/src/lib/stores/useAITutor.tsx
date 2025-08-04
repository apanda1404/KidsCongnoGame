import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameType } from "./useGameProgress";

interface PlayerSession {
  gameType: GameType;
  attempts: number;
  correctAnswers: number;
  timeSpent: number;
  mistakePatterns: string[];
  timestamp: number;
}

interface KnowledgeGap {
  skill: string;
  difficulty: 'low' | 'medium' | 'high';
  gameType: GameType;
  description: string;
}

interface AITutorState {
  sessions: PlayerSession[];
  currentSession: PlayerSession | null;
  knowledgeGaps: KnowledgeGap[];
  
  // Actions
  startSession: (gameType: GameType) => void;
  recordAttempt: (correct: boolean, mistakeType?: string) => void;
  endSession: () => void;
  getPersonalizedHint: (gameType: GameType, context: any) => string;
  getCelebrationMessage: (gameType: GameType, performance: any) => string;
  analyzeKnowledgeGaps: () => KnowledgeGap[];
  getNextGameSuggestion: () => GameType | null;
  generateProgressReport: () => any;
}

const hints = {
  shapes: [
    "Look at the shape carefully - is it round like a ball?",
    "Count the sides! A triangle has 3, a square has 4!",
    "Try touching the shape first, then find its home!",
    "Look for the same shape in the bottom row!"
  ],
  counting: [
    "Point to each animal as you count: 1, 2, 3...",
    "Start from the left and count slowly!",
    "Use your fingers to help count!",
    "Count out loud - it helps you remember!"
  ],
  colors: [
    "Look at the color name at the top!",
    "Red is like an apple, blue is like the sky!",
    "Take your time to look at each color!",
    "Say the color name out loud!"
  ],
  patterns: [
    "Look at what comes first, then what comes next!",
    "Patterns repeat - find what's missing!",
    "Try saying the pattern out loud!",
    "Look for the shape that comes next in order!"
  ],
  memory: [
    "Try to remember where you saw each picture!",
    "Make up a story about what you see!",
    "Focus on one area at a time!",
    "Take a deep breath and think carefully!"
  ],
  matching: [
    "Think about what goes together!",
    "A cat and dog are both animals!",
    "Look for things that are similar!",
    "What do these items have in common?"
  ]
};

const celebrations = {
  perfect: [
    "🌟 WOW! You're a superstar! Every answer was perfect!",
    "🎉 AMAZING! You got them all right! You're so smart!",
    "✨ INCREDIBLE! Perfect score! You're a learning champion!"
  ],
  good: [
    "🎈 Great job! You're getting really good at this!",
    "👏 Well done! You're learning so fast!",
    "🌈 Fantastic! Keep up the awesome work!"
  ],
  improving: [
    "🌱 You're getting better! Keep trying!",
    "💪 Good effort! Practice makes perfect!",
    "🎯 Nice try! You're learning something new!"
  ]
};

export const useAITutor = create<AITutorState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      knowledgeGaps: [],

      startSession: (gameType) => {
        const session: PlayerSession = {
          gameType,
          attempts: 0,
          correctAnswers: 0,
          timeSpent: 0,
          mistakePatterns: [],
          timestamp: Date.now()
        };
        set({ currentSession: session });
      },

      recordAttempt: (correct, mistakeType) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const updatedSession = {
          ...currentSession,
          attempts: currentSession.attempts + 1,
          correctAnswers: correct ? currentSession.correctAnswers + 1 : currentSession.correctAnswers,
          mistakePatterns: mistakeType ? [...currentSession.mistakePatterns, mistakeType] : currentSession.mistakePatterns
        };

        set({ currentSession: updatedSession });
      },

      endSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        const finalSession = {
          ...currentSession,
          timeSpent: Date.now() - currentSession.timestamp
        };

        set({ 
          sessions: [...sessions, finalSession],
          currentSession: null
        });

        // Analyze knowledge gaps after session
        get().analyzeKnowledgeGaps();
      },

      getPersonalizedHint: (gameType, context) => {
        const { sessions } = get();
        const gameHints = hints[gameType] || [];
        
        // Get recent performance for this game
        const recentSessions = sessions
          .filter(s => s.gameType === gameType)
          .slice(-3);

        // If struggling, give more basic hints
        const avgAccuracy = recentSessions.length > 0 
          ? recentSessions.reduce((acc, s) => acc + (s.correctAnswers / s.attempts), 0) / recentSessions.length
          : 1;

        if (avgAccuracy < 0.5) {
          return gameHints[0] || "Take your time and try again!";
        } else if (avgAccuracy < 0.8) {
          return gameHints[1] || "You're doing great! Keep going!";
        } else {
          return gameHints[Math.floor(Math.random() * gameHints.length)] || "You've got this!";
        }
      },

      getCelebrationMessage: (gameType, performance) => {
        const accuracy = performance.correct / performance.total;
        
        if (accuracy === 1) {
          return celebrations.perfect[Math.floor(Math.random() * celebrations.perfect.length)];
        } else if (accuracy >= 0.8) {
          return celebrations.good[Math.floor(Math.random() * celebrations.good.length)];
        } else {
          return celebrations.improving[Math.floor(Math.random() * celebrations.improving.length)];
        }
      },

      analyzeKnowledgeGaps: () => {
        const { sessions } = get();
        const gaps: KnowledgeGap[] = [];

        // Analyze each game type
        const gameTypes: GameType[] = ['shapes', 'counting', 'colors', 'patterns', 'memory', 'matching'];
        
        gameTypes.forEach(gameType => {
          const gameSessions = sessions.filter(s => s.gameType === gameType).slice(-5);
          
          if (gameSessions.length >= 2) {
            const avgAccuracy = gameSessions.reduce((acc, s) => acc + (s.correctAnswers / s.attempts), 0) / gameSessions.length;
            
            if (avgAccuracy < 0.6) {
              gaps.push({
                skill: gameType,
                difficulty: 'high',
                gameType,
                description: `Needs more practice with ${gameType}`
              });
            } else if (avgAccuracy < 0.8) {
              gaps.push({
                skill: gameType,
                difficulty: 'medium',
                gameType,
                description: `Improving at ${gameType}`
              });
            }
          }
        });

        set({ knowledgeGaps: gaps });
        return gaps;
      },

      getNextGameSuggestion: () => {
        const { knowledgeGaps, sessions } = get();
        
        // Suggest game with highest difficulty gap first
        const highPriorityGap = knowledgeGaps.find(gap => gap.difficulty === 'high');
        if (highPriorityGap) {
          return highPriorityGap.gameType;
        }

        // Otherwise suggest least played game
        const gameTypes: GameType[] = ['shapes', 'counting', 'colors', 'patterns', 'memory', 'matching'];
        const gameCounts = gameTypes.map(type => ({
          type,
          count: sessions.filter(s => s.gameType === type).length
        }));

        const leastPlayed = gameCounts.sort((a, b) => a.count - b.count)[0];
        return leastPlayed.type;
      },

      generateProgressReport: () => {
        const { sessions } = get();
        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        
        const recentSessions = sessions.filter(s => s.timestamp > weekAgo);
        
        const report = {
          totalSessions: recentSessions.length,
          totalTimeSpent: recentSessions.reduce((acc, s) => acc + s.timeSpent, 0),
          averageAccuracy: recentSessions.length > 0 
            ? recentSessions.reduce((acc, s) => acc + (s.correctAnswers / s.attempts), 0) / recentSessions.length
            : 0,
          gameBreakdown: {} as Record<GameType, any>,
          strengths: [] as string[],
          improvements: [] as string[]
        };

        // Game breakdown
        const gameTypes: GameType[] = ['shapes', 'counting', 'colors', 'patterns', 'memory', 'matching'];
        gameTypes.forEach(type => {
          const gameSessions = recentSessions.filter(s => s.gameType === type);
          if (gameSessions.length > 0) {
            report.gameBreakdown[type] = {
              sessions: gameSessions.length,
              accuracy: gameSessions.reduce((acc, s) => acc + (s.correctAnswers / s.attempts), 0) / gameSessions.length,
              timeSpent: gameSessions.reduce((acc, s) => acc + s.timeSpent, 0)
            };
          }
        });

        // Identify strengths and improvements
        Object.entries(report.gameBreakdown).forEach(([game, data]: [string, any]) => {
          if (data.accuracy >= 0.8) {
            report.strengths.push(game);
          } else if (data.accuracy < 0.6) {
            report.improvements.push(game);
          }
        });

        return report;
      }
    }),
    {
      name: 'ai-tutor-data'
    }
  )
);