import { useEffect, useState } from "react";
import type { Word504 } from "../../data/words504";
import { getPublicWordById } from "../../utils/word504Utils";

interface Word504QuizModeProps {
  words: Word504[];
  onComplete: (correctAnswers: number, totalQuestions: number) => void;
}

interface QuizQuestion {
  wordId: string;
  type: "definition" | "example" | "partOfSpeech";
  correctWord: Word504;
  options: Word504[];
}

export default function Word504QuizMode({
  words,
  onComplete,
}: Word504QuizModeProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [words]);

  const generateQuestions = () => {
    const quizQuestions: QuizQuestion[] = [];
    const questionTypes: ("definition" | "example" | "partOfSpeech")[] = [
      "definition",
      "example",
      "partOfSpeech",
    ];

    words.forEach((word, index) => {
      const type = questionTypes[index % questionTypes.length];
      const otherWords = words.filter((w) => w.id !== word.id);
      const shuffledOptions = [word, ...otherWords.slice(0, 3)].sort(
        () => 0.5 - Math.random(),
      );

      quizQuestions.push({
        wordId: word.id,
        type,
        correctWord: word,
        options: shuffledOptions,
      });
    });

    setQuestions(quizQuestions);
    setLoading(false);
  };

  const handleAnswer = (selectedWordId: string) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: selectedWordId,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleFinish = () => {
    const correctCount = Object.entries(answers).reduce(
      (count, [qIndex, selectedId]) => {
        const question = questions[parseInt(qIndex)];
        return question.correctWord.id === selectedId ? count + 1 : count;
      },
      0,
    );

    onComplete(correctCount, questions.length);
  };

  const showTranslation = async (wordId: string) => {
    if (translations[wordId]) return;
    setLoadingTranslation(true);
    try {
      const pub = await getPublicWordById(wordId);
      if (pub && pub.translation) {
        setTranslations((s) => ({ ...s, [wordId]: pub.translation }));
      } else {
        setTranslations((s) => ({ ...s, [wordId]: "(translation not found)" }));
      }
    } catch (e) {
      setTranslations((s) => ({ ...s, [wordId]: "(error)" }));
    } finally {
      setLoadingTranslation(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== undefined;

  const getQuestionText = () => {
    switch (currentQuestion.type) {
      case "definition":
        return `What word means: "${currentQuestion.correctWord.definition}"?`;
      case "example":
        return `Which word fits this sentence: "${currentQuestion.correctWord.example}"?`;
      case "partOfSpeech":
        return `Which is a "${currentQuestion.correctWord.partOfSpeech}"?`;
    }
  };

  const isCorrect =
    submitted && selectedAnswer === currentQuestion.correctWord.id;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-gray-600">
            Answered: {Object.keys(answers).length}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {getQuestionText()}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const showFeedback = submitted && isAnswered;
            const isCorrectOption =
              option.id === currentQuestion.correctWord.id;

            let buttonClasses =
              "p-4 rounded-lg text-left border-2 transition-all font-semibold";

            if (!showFeedback) {
              buttonClasses += isSelected
                ? " border-blue-600 bg-blue-50 text-blue-900"
                : " border-gray-200 hover:border-blue-400";
            } else {
              if (isCorrectOption) {
                buttonClasses += " border-green-500 bg-green-50 text-green-900";
              } else if (isSelected && !isCorrect) {
                buttonClasses += " border-red-500 bg-red-50 text-red-900";
              } else {
                buttonClasses += " border-gray-200 bg-gray-50 text-gray-600";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={submitted}
                className={buttonClasses}
              >
                <div className="font-semibold">{option.word}</div>
                <div className="text-sm opacity-75">{option.definition}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {submitted && isAnswered && (
        <div
          className={`rounded-lg p-4 ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p className="font-semibold mb-2">
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p className="text-sm">
            The correct answer is:{" "}
            <strong>{currentQuestion.correctWord.word}</strong>
          </p>
          <p className="text-sm mt-2 opacity-75">
            {currentQuestion.correctWord.definition}
          </p>
          <div className="mt-3">
            <button
              onClick={() => showTranslation(currentQuestion.correctWord.id)}
              disabled={loadingTranslation}
              className="mt-2 px-3 py-1 bg-white text-red-700 rounded-lg font-semibold"
            >
              {translations[currentQuestion.correctWord.id]
                ? "نمایش ترجمه"
                : "نمایش ترجمه (فارسی)"}
            </button>
            {translations[currentQuestion.correctWord.id] && (
              <p className="text-sm mt-2">
                {translations[currentQuestion.correctWord.id]}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between pt-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || submitted}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className="px-8 py-2 bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-orange-700 transition-colors"
          >
            Submit Quiz
          </button>
        ) : currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleFinish}
            className="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            See Results
          </button>
        ) : null}

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1 || !submitted}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Answer Summary */}
      {submitted && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            You've answered {Object.keys(answers).length} out of{" "}
            {questions.length} questions.
          </p>
        </div>
      )}
    </div>
  );
}
