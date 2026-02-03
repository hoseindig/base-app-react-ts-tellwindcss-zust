import { useEffect, useMemo, useState } from "react";
import { getDailyWords, getTodayKey } from "../utils/dailyWords504";
import type { WordEntry } from "../data/words504";

type AnswerMap = Record<string, string>;
type DailyResult = {
  date: string;
  score: number;
  total: number;
};

const DAILY_ROUTINE = [
  "Warm-up: review yesterday's mistakes for 5 minutes.",
  "Learn 5 new words from the 504 list.",
  "Write one simple sentence for each word.",
  "Take the daily test and record your score.",
  "Quick review at night: read the words again.",
];

const STANDARD_TEST_ROUTINE = [
  "Read the word aloud two times.",
  "Write the meaning in your own words.",
  "Create one short sentence.",
  "Check the correct meaning and fix mistakes.",
  "Repeat the word after 2 hours and again tomorrow.",
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isCorrectAnswer(answer: string, meanings: string[]) {
  const cleaned = normalize(answer);
  return meanings.some((meaning) => normalize(meaning) === cleaned);
}

function readResult(dateKey: string) {
  const stored = localStorage.getItem(`words504-result-${dateKey}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as DailyResult;
  } catch {
    return null;
  }
}

function getRecentResults(days: number) {
  const results: DailyResult[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const result = readResult(key);
    if (result) results.push(result);
  }
  return results;
}

function getStreak(daysToCheck = 30) {
  let streak = 0;
  for (let i = 0; i < daysToCheck; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const result = readResult(key);
    if (!result) break;
    streak += 1;
  }
  return streak;
}

export default function Words504() {
  const [dailyWords] = useState<WordEntry[]>(() => getDailyWords(5));
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [recentResults, setRecentResults] = useState<DailyResult[]>([]);

  const todayKey = useMemo(() => getTodayKey(), []);

  useEffect(() => {
    setRecentResults(getRecentResults(7));
  }, [submitted]);

  function handleChange(word: string, value: string) {
    setAnswers((prev) => ({ ...prev, [word]: value }));
  }

  function submitTest() {
    let correct = 0;
    dailyWords.forEach((entry) => {
      const userAnswer = answers[entry.word] || "";
      if (isCorrectAnswer(userAnswer, entry.meanings)) {
        correct += 1;
      }
    });

    setScore(correct);
    setSubmitted(true);

    const result: DailyResult = {
      date: todayKey,
      score: correct,
      total: dailyWords.length,
    };
    localStorage.setItem(
      `words504-result-${todayKey}`,
      JSON.stringify(result),
    );
  }

  function resetTest() {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }

  const streak = useMemo(() => getStreak(), [submitted]);
  const successRate = score === null ? null : Math.round((score / dailyWords.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-lg">
            <p className="uppercase tracking-[0.3em] text-xs text-slate-300">
              504 Words English Trainer
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-3">
              Daily tests, success tracking, and a clear routine for English
            </h1>
            <p className="mt-4 text-slate-200 max-w-2xl">
              Practice the 504 Essential Words in small daily sets. Follow the
              routine, take a quick test, and record your results every day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold">Daily Routine</h2>
              <p className="text-slate-600 mt-2">
                Use this routine to remember words and build real test success.
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                {DAILY_ROUTINE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold">Standard Test Routine</h2>
              <p className="text-slate-600 mt-2">
                A simple, repeatable routine for every daily test.
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                {STANDARD_TEST_ROUTINE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Daily Test</h2>
              <span className="text-sm text-slate-500">
                Date: {todayKey}
              </span>
            </div>
            <p className="text-slate-600 mt-2">
              Write the meaning of each word. After you submit, review the
              correct answers.
            </p>

            <div className="mt-6 space-y-4">
              {dailyWords.map((entry) => {
                const userAnswer = answers[entry.word] || "";
                const isCorrect = submitted
                  ? isCorrectAnswer(userAnswer, entry.meanings)
                  : null;

                return (
                  <div
                    key={entry.word}
                    className="rounded-xl border border-slate-200 p-4 space-y-2"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-lg font-semibold text-slate-900">
                        {entry.word}
                      </div>
                      {submitted && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Review"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 italic">
                      Example: {entry.example}
                    </p>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => handleChange(entry.word, e.target.value)}
                      placeholder="Write the meaning"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    {submitted && (
                      <p className="text-sm text-slate-600">
                        Correct meaning: {entry.meanings[0]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!submitted && (
                <button
                  onClick={submitTest}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Submit Test
                </button>
              )}
              {submitted && (
                <button
                  onClick={resetTest}
                  className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:border-slate-400 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold">Success Tracker</h2>
              <p className="text-slate-600 mt-2">
                Remember your success. Keep a daily score and track your streak.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Today score</span>
                  <span className="font-semibold text-slate-900">
                    {score === null ? "Not submitted" : `${score}/${dailyWords.length}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success rate</span>
                  <span className="font-semibold text-slate-900">
                    {successRate === null ? "--" : `${successRate}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Current streak</span>
                  <span className="font-semibold text-slate-900">
                    {streak} day{streak === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold">Last 7 Days</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {recentResults.length === 0 && (
                  <div>No results yet. Take today’s test to start.</div>
                )}
                {recentResults.map((result) => (
                  <div key={result.date} className="flex justify-between">
                    <span>{result.date}</span>
                    <span className="font-semibold text-slate-900">
                      {result.score}/{result.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold">Success Reminder</h3>
              <p className="text-sm text-slate-600 mt-2">
                If you miss a word today, write it once, read it aloud, and test
                it again tomorrow. Small daily wins build strong results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
