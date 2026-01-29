import { useEffect, useState } from "react";
import { getDailyVerbs, getTodayKey } from "../utils/dailyQuiz";
import { IRREGULAR_VERBS } from "../data/irregularVerbs";
import type { IrregularVerb } from "../data/irregularVerbs";

interface Answer {
  past: string;
  pastParticiple: string;
}

const VERBS_PER_GROUP = 5;

export default function IrregularVerbQuiz() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [verbs, setVerbs] = useState<IrregularVerb[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const totalGroups = Math.ceil(IRREGULAR_VERBS.length / VERBS_PER_GROUP);

  useEffect(() => {
    const startIdx = currentGroup * VERBS_PER_GROUP;
    const endIdx = startIdx + VERBS_PER_GROUP;
    setVerbs(IRREGULAR_VERBS.slice(startIdx, endIdx));
    setSubmitted(false);
  }, [currentGroup]);

  function handleChange(base: string, field: keyof Answer, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [base]: {
        ...prev[base],
        [field]: value,
      },
    }));
  }

  function submitQuiz() {
    const today = getTodayKey();
    localStorage.setItem(
      `quiz-result-${today}-group-${currentGroup}`,
      JSON.stringify(answers),
    );
    setSubmitted(true);
  }

  function editAnswers() {
    setSubmitted(false);
  }

  function goToPreviousGroup() {
    setCurrentGroup((prev) => Math.max(0, prev - 1));
    setAnswers({});
  }

  function goToNextGroup() {
    setCurrentGroup((prev) => Math.min(totalGroups - 1, prev + 1));
    setAnswers({});
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daily Irregular Verbs Quiz</h1>
        <div className="text-sm text-gray-600">
          گروه {currentGroup + 1} از {totalGroups}
        </div>
      </div>

      {verbs.map((v) => {
        const userAnswer = answers[v.base] || {};
        const isAnswered = userAnswer.past || userAnswer.pastParticiple;
        const isCorrect =
          submitted &&
          userAnswer.past === v.past &&
          userAnswer.pastParticiple === v.pastParticiple;

        return (
          <div
            key={v.base}
            className={`border-2 rounded-xl p-4 space-y-2 transition-colors ${
              isAnswered ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            <div className="font-semibold">
              Base verb: <span className="text-blue-600">{v.base}</span>
            </div>

            <input
              className="input"
              placeholder="Past"
              value={userAnswer.past || ""}
              onChange={(e) =>
                handleChange(v.base, "past", e.target.value.trim())
              }
            />

            <input
              className="input"
              placeholder="Past participle"
              value={userAnswer.pastParticiple || ""}
              onChange={(e) =>
                handleChange(v.base, "pastParticiple", e.target.value.trim())
              }
            />

            {submitted && !isCorrect && (
              <div className="text-red-600">
                ❌ Correct answer: {v.past} / {v.pastParticiple}
              </div>
            )}

            {submitted && isCorrect && (
              <div className="text-green-600">✅ Correct</div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button
          onClick={submitQuiz}
          className="px-6 py-2 rounded-xl bg-black text-white"
        >
          Submit
        </button>
      )}

      {submitted && (
        <button
          onClick={editAnswers}
          className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          ویرایش پاسخ‌ها
        </button>
      )}

      <div className="flex justify-between items-center gap-4 border-t pt-6">
        <button
          onClick={goToPreviousGroup}
          disabled={currentGroup === 0}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← قبلی
        </button>

        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((currentGroup + 1) / totalGroups) * 100}%` }}
          />
        </div>

        <button
          onClick={goToNextGroup}
          disabled={currentGroup === totalGroups - 1}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          بعدی →
        </button>
      </div>
    </div>
  );
}
