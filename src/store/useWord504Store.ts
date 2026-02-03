import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WordProgress {
    wordId: string;
    learned: boolean;
    lastReviewDate: string;
    reviewCount: number;
    correctCount: number;
    incorrectCount: number;
    proficiencyLevel: "new" | "learning" | "review" | "mastered";
}

export interface DailyTestResult {
    date: string;
    totalQuestions: number;
    correctAnswers: number;
    wordIds: string[];
}

interface Word504Store {
    progress: Record<string, WordProgress>;
    dailyTests: DailyTestResult[];
    currentStreak: number;
    totalWordsLearned: number;

    // Actions
    updateWordProgress: (wordId: string, updates: Partial<WordProgress>) => void;
    markWordAsLearned: (wordId: string) => void;
    recordDailyTest: (result: DailyTestResult) => void;
    getProgressForWord: (wordId: string) => WordProgress | undefined;
    getDailyTestResult: (date: string) => DailyTestResult | undefined;
    getStudyStatistics: () => {
        totalLearned: number;
        totalReviewed: number;
        averageScore: number;
        currentStreak: number;
    };
}

const initialWordProgress: WordProgress = {
    wordId: "",
    learned: false,
    lastReviewDate: new Date().toISOString().split("T")[0],
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    proficiencyLevel: "new",
};

export const useWord504Store = create<Word504Store>()(
    persist(
        (set, get) => ({
            progress: {},
            dailyTests: [],
            currentStreak: 0,
            totalWordsLearned: 0,

            updateWordProgress: (wordId: string, updates: Partial<WordProgress>) => {
                set((state) => ({
                    progress: {
                        ...state.progress,
                        [wordId]: {
                            ...initialWordProgress,
                            ...state.progress[wordId],
                            wordId,
                            ...updates,
                        },
                    },
                }));
            },

            markWordAsLearned: (wordId: string) => {
                set((state) => {
                    const currentProgress = state.progress[wordId];
                    const isNewlyLearned =
                        !currentProgress || !currentProgress.learned;

                    return {
                        progress: {
                            ...state.progress,
                            [wordId]: {
                                ...initialWordProgress,
                                ...currentProgress,
                                wordId,
                                learned: true,
                                proficiencyLevel: "learning",
                                lastReviewDate: new Date().toISOString().split("T")[0],
                            },
                        },
                        totalWordsLearned: isNewlyLearned
                            ? state.totalWordsLearned + 1
                            : state.totalWordsLearned,
                    };
                });
            },

            recordDailyTest: (result: DailyTestResult) => {
                set((state) => {
                    const today = new Date().toISOString().split("T")[0];
                    const isToday = result.date === today;
                    const previousTest = state.dailyTests.find(
                        (t) => t.date === result.date,
                    );

                    // Calculate streak
                    let newStreak = state.currentStreak;
                    if (isToday && !previousTest) {
                        // First test of the day - increment streak if passed
                        if (result.correctAnswers / result.totalQuestions >= 0.7) {
                            newStreak = state.currentStreak + 1;
                        }
                    }

                    return {
                        dailyTests: [
                            ...state.dailyTests.filter((t) => t.date !== result.date),
                            result,
                        ],
                        currentStreak: newStreak,
                    };
                });
            },

            getProgressForWord: (wordId: string) => {
                return get().progress[wordId];
            },

            getDailyTestResult: (date: string) => {
                return get().dailyTests.find((t) => t.date === date);
            },

            getStudyStatistics: () => {
                const state = get();
                const learnedWords = Object.values(state.progress).filter(
                    (p) => p.learned,
                ).length;
                const reviewedWords = Object.values(state.progress).filter(
                    (p) => p.reviewCount > 0,
                ).length;

                const totalCorrect = state.dailyTests.reduce(
                    (sum, test) => sum + test.correctAnswers,
                    0,
                );
                const totalQuestions = state.dailyTests.reduce(
                    (sum, test) => sum + test.totalQuestions,
                    0,
                );
                const averageScore =
                    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

                return {
                    totalLearned: learnedWords,
                    totalReviewed: reviewedWords,
                    averageScore: Math.round(averageScore * 10) / 10,
                    currentStreak: state.currentStreak,
                };
            },
        }),
        {
            name: "word-504-store",
        },
    ),
);
