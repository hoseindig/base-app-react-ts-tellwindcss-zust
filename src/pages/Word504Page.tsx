import { useEffect, useState } from "react";
import {
  useWord504Store,
  type DailyTestResult,
} from "../store/useWord504Store";
import {
  getDailyWords,
  getTodayKey,
  getWordsByIds,
  calculateProficiencyLevel,
} from "../utils/word504Utils";
import Word504QuizMode from "../components/Word504/Word504QuizMode";
import Word504LearnMode from "../components/Word504/Word504LearnMode";
import Word504Statistics from "../components/Word504/Word504Statistics";
import { WORD504_DAILY_WORD_COUNT } from "../config/word504Config";

type PageMode = "learn" | "quiz" | "statistics";

export default function Word504Page() {
  const [mode, setMode] = useState<PageMode>("learn");
  const [dailyWordIds, setDailyWordIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const updateWordProgress = useWord504Store(
    (state) => state.updateWordProgress,
  );
  const recordDailyTest = useWord504Store((state) => state.recordDailyTest);
  const getStudyStatistics = useWord504Store(
    (state) => state.getStudyStatistics,
  );

  useEffect(() => {
    // Load daily words on component mount
    const words = getDailyWords(WORD504_DAILY_WORD_COUNT);
    setDailyWordIds(words);
    setLoading(false);
  }, []);

  const handleWordLearned = (wordId: string) => {
    updateWordProgress(wordId, {
      learned: true,
      proficiencyLevel: "learning",
      lastReviewDate: getTodayKey(),
    });
  };

  const handleQuizComplete = (
    correctAnswers: number,
    totalQuestions: number,
  ) => {
    const result: DailyTestResult = {
      date: getTodayKey(),
      totalQuestions,
      correctAnswers,
      wordIds: dailyWordIds,
    };

    recordDailyTest(result);

    // Update proficiency for each word based on performance
    dailyWordIds.forEach((wordId) => {
      updateWordProgress(wordId, {
        reviewCount: (getStudyStatistics().totalReviewed || 0) + 1,
        lastReviewDate: getTodayKey(),
        proficiencyLevel: calculateProficiencyLevel(
          Math.round(correctAnswers),
          totalQuestions - Math.round(correctAnswers),
        ),
      });
    });

    setMode("statistics");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  const dailyWords = getWordsByIds(dailyWordIds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            504 Essential English Words
          </h1>
          <p className="text-gray-600">
            Master 504 high-frequency English words with daily practice
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("learn")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === "learn"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📚 Learn
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === "quiz"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            ✏️ Quiz
          </button>
          <button
            onClick={() => setMode("statistics")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === "statistics"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📊 Statistics
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {mode === "learn" && (
            <Word504LearnMode
              words={dailyWords}
              onWordLearned={handleWordLearned}
            />
          )}
          {mode === "quiz" && (
            <Word504QuizMode
              words={dailyWords}
              onComplete={handleQuizComplete}
            />
          )}
          {mode === "statistics" && <Word504Statistics />}
        </div>
      </div>
    </div>
  );
}
