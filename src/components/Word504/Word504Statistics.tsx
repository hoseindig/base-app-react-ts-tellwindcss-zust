import { useMemo } from "react";
import { useWord504Store } from "../../store/useWord504Store";

export default function Word504Statistics() {
  // Select raw state slices only — avoid calling store methods in selector
  const dailyTests = useWord504Store((state) => state.dailyTests);
  const progress = useWord504Store((state) => state.progress);

  // Derive statistics from selected slices and memoize to keep stable reference
  const stats = useMemo(() => {
    const learnedWords = Object.values(progress).filter(
      (p) => p.learned,
    ).length;
    const reviewedWords = Object.values(progress).filter(
      (p) => p.reviewCount > 0,
    ).length;

    const totalCorrect = dailyTests.reduce(
      (sum, test) => sum + test.correctAnswers,
      0,
    );
    const totalQuestions = dailyTests.reduce(
      (sum, test) => sum + test.totalQuestions,
      0,
    );
    const averageScore =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // currentStreak is stored in the persistent store; read directly if present
    // Fallback to 0 when not available
    const currentStreak = useWord504Store.getState
      ? (useWord504Store.getState().currentStreak ?? 0)
      : 0;

    return {
      totalLearned: learnedWords,
      totalReviewed: reviewedWords,
      averageScore: Math.round(averageScore * 10) / 10,
      currentStreak,
    };
  }, [progress, dailyTests]);

  const wordsByProficiency = Object.values(progress).reduce(
    (acc, word) => {
      const level = word.proficiencyLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const recentTests = dailyTests.slice(-7).reverse();

  const getProgressColor = (level: string) => {
    switch (level) {
      case "mastered":
        return "text-green-600";
      case "review":
        return "text-blue-600";
      case "learning":
        return "text-yellow-600";
      case "new":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getProgressBgColor = (level: string) => {
    switch (level) {
      case "mastered":
        return "bg-green-100";
      case "review":
        return "bg-blue-100";
      case "learning":
        return "bg-yellow-100";
      case "new":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalLearned}
          </div>
          <p className="text-sm text-gray-600 mt-2">Words Learned</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {stats.totalReviewed}
          </div>
          <p className="text-sm text-gray-600 mt-2">Words Reviewed</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {stats.averageScore.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Average Score</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">
            {stats.currentStreak}
          </div>
          <p className="text-sm text-gray-600 mt-2">Day Streak</p>
        </div>
      </div>

      {/* Proficiency Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Words by Proficiency Level
        </h3>

        <div className="space-y-3">
          {[
            { level: "mastered", label: "Mastered", icon: "🏆" },
            { level: "review", label: "In Review", icon: "📖" },
            { level: "learning", label: "Learning", icon: "📚" },
            { level: "new", label: "New", icon: "✨" },
          ].map(({ level, label, icon }) => {
            const count = wordsByProficiency[level] || 0;
            const percentage =
              Object.values(wordsByProficiency).length > 0
                ? (count /
                    Object.values(wordsByProficiency).reduce(
                      (a, b) => a + b,
                      0,
                    )) *
                  100
                : 0;

            return (
              <div key={level}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700">
                    {icon} {label}
                  </span>
                  <span className={`font-bold ${getProgressColor(level)}`}>
                    {count}
                  </span>
                </div>
                <div
                  className={`w-full h-3 rounded-full overflow-hidden ${getProgressBgColor(level)}`}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      level === "mastered"
                        ? "bg-green-600"
                        : level === "review"
                          ? "bg-blue-600"
                          : level === "learning"
                            ? "bg-yellow-600"
                            : "bg-gray-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tests */}
      {recentTests.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Test Results (Last 7 Days)
          </h3>

          <div className="space-y-2">
            {recentTests.map((test) => {
              const percentage = Math.round(
                (test.correctAnswers / test.totalQuestions) * 100,
              );
              const statusColor =
                percentage >= 80
                  ? "text-green-600"
                  : percentage >= 60
                    ? "text-yellow-600"
                    : "text-red-600";

              return (
                <div
                  key={test.date}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                >
                  <span className="font-semibold text-gray-700">
                    {test.date}
                  </span>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${statusColor}`}>
                      {test.correctAnswers}/{test.totalQuestions} ({percentage}
                      %)
                    </div>
                    <div className="text-xs text-gray-600">
                      {test.wordIds.length} words
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentTests.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Start taking quizzes to see your statistics here!
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 Tips for Success
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Practice daily for consistent learning</li>
          <li>✓ Review words regularly to maintain proficiency</li>
          <li>✓ Aim for 80%+ on daily quizzes</li>
          <li>✓ Focus on words in "Learning" stage</li>
          <li>✓ Use example sentences to understand context</li>
        </ul>
      </div>
    </div>
  );
}
