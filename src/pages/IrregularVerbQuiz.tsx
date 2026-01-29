import { useEffect, useState } from "react";
import { getDailyVerbs, getTodayKey } from "../utils/dailyQuiz";
import type { IrregularVerb } from "../data/irregularVerbs";

interface Answer {
  past: string;
  pastParticiple: string;
}

export default function IrregularVerbQuiz() {
  const [verbs, setVerbs] = useState<IrregularVerb[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setVerbs(getDailyVerbs(5));
  }, []);

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
    localStorage.setItem(`quiz-result-${today}`, JSON.stringify(answers));
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Daily Irregular Verbs Quiz</h1>

      {verbs.map((v) => {
        const userAnswer = answers[v.base] || {};
        const isCorrect =
          submitted &&
          userAnswer.past === v.past &&
          userAnswer.pastParticiple === v.pastParticiple;

        return (
          <div key={v.base} className="border rounded-xl p-4 space-y-2">
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

            {submitted && (
              <div className={isCorrect ? "text-green-600" : "text-red-600"}>
                {isCorrect
                  ? "✅ Correct"
                  : `❌ Correct answer: ${v.past} / ${v.pastParticiple}`}
              </div>
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
    </div>
  );
}
