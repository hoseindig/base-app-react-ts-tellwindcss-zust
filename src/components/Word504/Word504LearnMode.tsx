import { useState } from "react";
import type { Word504 } from "../../data/words504";
import { getPublicWordById } from "../../utils/word504Utils";

interface Word504LearnModeProps {
  words: Word504[];
  onWordLearned: (wordId: string) => void;
}

export default function Word504LearnMode({
  words,
  onWordLearned,
}: Word504LearnModeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedWordIds, setLearnedWordIds] = useState<Set<string>>(new Set());

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No words available for today.</p>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  const isLearned = learnedWordIds.has(currentWord.id);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const handleMarkAsLearned = () => {
    const newLearned = new Set(learnedWordIds);
    newLearned.add(currentWord.id);
    setLearnedWordIds(newLearned);
    onWordLearned(currentWord.id);
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

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setFlipped(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "A1":
        return "bg-green-100 text-green-800";
      case "A2":
        return "bg-teal-100 text-teal-800";
      case "B1":
        return "bg-yellow-100 text-yellow-800";
      case "B2":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">
            Word {currentWordIndex + 1} of {words.length}
          </span>
          <span className="text-gray-600">
            Learned: {learnedWordIds.size}/{words.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentWordIndex + 1) / words.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Flash Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="perspective h-64 cursor-pointer"
      >
        <div
          className="relative w-full h-full transition-transform duration-500 transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 flex flex-col justify-center items-center text-white shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center space-y-4">
              <p className="text-sm opacity-75">Click to reveal definition</p>
              <h2 className="text-4xl font-bold">{currentWord.word}</h2>
              <p className="text-sm italic opacity-75">
                {currentWord.pronunciation}
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(currentWord.difficulty)}`}
              >
                {currentWord.difficulty}
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 flex flex-col justify-center items-center text-white shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center space-y-4">
              <p className="text-sm opacity-75">Definition</p>
              <p className="text-lg font-semibold">{currentWord.definition}</p>
              <div className="border-t border-white pt-4 mt-4">
                {currentWord.example && (
                  <>
                    <p className="text-sm mb-2 opacity-75">Example:</p>
                    <p className="text-base italic">
                      "{currentWord.example}"
                    </p>
                  </>
                )}
                {/* <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showTranslation(currentWord.id);
                    }}
                    className="mt-2 px-3 py-1 bg-white text-teal-700 rounded-lg font-semibold"
                    disabled={loadingTranslation}
                  >
                    {translations[currentWord.id]
                      ? "نمایش ترجمه"
                      : "نمایش ترجمه (فارسی)"}
                  </button>
                  {translations[currentWord.id] && (
                    <p className="text-sm mt-2 text-white/90">
                      {translations[currentWord.id]}
                    </p>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Word Info */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Part of Speech</p>
          <p className="font-semibold text-gray-800">
            {currentWord.partOfSpeech}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Category</p>
          <p className="font-semibold text-gray-800">{currentWord.category}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-between pt-4">
        <button
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>

        <button
          onClick={handleMarkAsLearned}
          className={`px-8 py-2 rounded-lg font-semibold transition-all ${
            isLearned
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLearned ? "✓ Learned" : "Mark as Learned"}
        </button>

        <button
          onClick={handleNext}
          disabled={currentWordIndex === words.length - 1}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Learned Words Display */}
      {learnedWordIds.size > 0 && (
        <div className="bg-green-50 rounded-lg p-4 mt-6">
          <p className="text-sm font-semibold text-green-900 mb-2">
            Words Learned Today:
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(learnedWordIds).map((wordId) => {
              const word = words.find((w) => w.id === wordId);
              return (
                <span
                  key={wordId}
                  className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {word?.word}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
