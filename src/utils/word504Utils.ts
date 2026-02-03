import { WORDS_504 } from "../data/words504";

// Cached in-memory copy of public JSON (lazy-loaded)
let _publicWordsCache: Record<string, any> | null = null;

/**
 * Loads `public/data/words504.json` once and caches it in memory.
 */
export async function loadPublicWords(): Promise<Record<string, any>> {
    if (_publicWordsCache) return _publicWordsCache;

    try {
        const res = await fetch("/data/words504.json");
        if (!res.ok) throw new Error("Failed to fetch words504.json");
        const arr = await res.json();
        const map: Record<string, any> = {};
        arr.forEach((w: any) => {
            if (w && w.id) map[w.id] = w;
        });
        _publicWordsCache = map;
        return map;
    } catch (err) {
        console.error("loadPublicWords error:", err);
        _publicWordsCache = {};
        return _publicWordsCache;
    }
}

/**
 * Get Persian translation (or full public word object) by id from public JSON.
 */
export async function getPublicWordById(id: string) {
    const map = await loadPublicWords();
    return map[id];
}

export function getTodayKey(): string {
    return new Date().toISOString().slice(0, 10);
}

export interface DailyWords {
    wordIds: string[];
    generatedDate: string;
}

/**
 * Gets 5 random words for today's practice
 * Returns the same words throughout the day
 */
export function getDailyWords(count = 5): string[] {
    const today = getTodayKey();
    const storageKey = `daily-words-504-${today}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        const daily: DailyWords = JSON.parse(saved);
        return daily.wordIds;
    }

    // Generate new daily words
    const shuffled = [...WORDS_504].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, WORDS_504.length));
    const wordIds = selected.map((w) => w.id);

    localStorage.setItem(
        storageKey,
        JSON.stringify({
            wordIds,
            generatedDate: today,
        } as DailyWords),
    );

    return wordIds;
}

/**
 * Gets a word by its ID
 */
export function getWordById(id: string) {
    return WORDS_504.find((w) => w.id === id);
}

/**
 * Gets multiple words by their IDs
 */
export function getWordsByIds(ids: string[]) {
    return ids
        .map((id) => getWordById(id))
        .filter((word): word is typeof WORDS_504[0] => word !== undefined);
}

/**
 * Gets words by category
 */
export function getWordsByCategory(category: string) {
    return WORDS_504.filter((w) => w.category === category);
}

/**
 * Gets words by difficulty level
 */
export function getWordsByDifficulty(difficulty: "beginner" | "intermediate" | "advanced") {
    return WORDS_504.filter((w) => w.difficulty === difficulty);
}

/**
 * Checks if the current streak should reset
 * Streak resets if no test was done yesterday
 */
export function shouldResetStreak(lastTestDate: string): boolean {
    const today = getTodayKey();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .slice(0, 10);

    return lastTestDate !== today && lastTestDate !== yesterday;
}

/**
 * Generates a multiple choice question for a given word
 */
export function generateMultipleChoiceQuestion(
    correctWordId: string,
    wrongWordIds: string[],
) {
    const correctWord = getWordById(correctWordId);
    if (!correctWord) return null;

    const wrongWords = getWordsByIds(wrongWordIds);
    const options = [correctWord, ...wrongWords].sort(
        () => 0.5 - Math.random(),
    );

    return {
        question: `What is the definition of "${correctWord.word}"?`,
        correctWordId,
        options: options.map((w) => ({
            id: w.id,
            word: w.word,
            definition: w.definition,
        })),
        correctIndex: options.findIndex((w) => w.id === correctWordId),
    };
}

/**
 * Generates a matching question (word to definition)
 */
export function generateMatchingQuestion(wordIds: string[]) {
    const words = getWordsByIds(wordIds);
    if (words.length < 2) return null;

    return {
        pairs: words.map((w) => ({
            id: w.id,
            word: w.word,
            definition: w.definition,
        })),
    };
}

/**
 * Calculates proficiency level based on correctness
 */
export function calculateProficiencyLevel(
    correctCount: number,
    incorrectCount: number,
): "new" | "learning" | "review" | "mastered" {
    const total = correctCount + incorrectCount;
    if (total === 0) return "new";

    const correctPercentage = (correctCount / total) * 100;

    if (correctPercentage === 100) return "mastered";
    if (correctPercentage >= 80) return "review";
    if (correctPercentage >= 50) return "learning";
    return "new";
}
