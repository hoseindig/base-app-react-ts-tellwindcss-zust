import { describe, it, expect, beforeEach } from "vitest";
import {
    getTodayKey,
    getDailyWords,
    getWordById,
    getWordsByIds,
    getWordsByCategory,
    getWordsByDifficulty,
    calculateProficiencyLevel,
} from "./word504Utils";

describe("word504Utils", () => {
    describe("getTodayKey", () => {
        it("returns today's date in YYYY-MM-DD and is stable", () => {
            const key1 = getTodayKey();
            const key2 = getTodayKey();
            expect(key1).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(key1).toBe(key2);
        });
    });

    describe("getDailyWords", () => {
        beforeEach(() => localStorage.clear());

        it("returns 5 words by default", () => {
            const words = getDailyWords();
            expect(words).toHaveLength(5);
        });

        it("returns custom count when specified", () => {
            const words = getDailyWords(10);
            expect(words.length).toBeLessThanOrEqual(10);
        });

        it("returns the same words throughout the day", () => {
            const words1 = getDailyWords();
            const words2 = getDailyWords();
            expect(words1).toEqual(words2);
        });

        it("persists daily words in localStorage", () => {
            getDailyWords();
            const today = getTodayKey();
            const stored = localStorage.getItem(`daily-words-504-${today}`);
            expect(stored).toBeTruthy();
        });
    });

    describe("getWordById", () => {
        it("returns a word by id", () => {
            const word = getWordById("001");
            expect(word?.word).toBe("ability");
        });

        it("returns undefined for an invalid id", () => {
            const word = getWordById("999");
            expect(word).toBeUndefined();
        });
    });

    describe("getWordsByIds", () => {
        it("returns multiple words by ids", () => {
            const words = getWordsByIds(["001", "002", "003"]);
            expect(words).toHaveLength(3);
        });

        it("skips undefined words", () => {
            const words = getWordsByIds(["001", "999", "002"]);
            expect(words).toHaveLength(2);
        });

        it("maintains the order of provided ids", () => {
            const words = getWordsByIds(["003", "001"]);
            expect(words[0].id).toBe("003");
            expect(words[1].id).toBe("001");
        });
    });

    describe("getWordsByCategory", () => {
        it("filters words by category", () => {
            const words = getWordsByCategory("skills");
            expect(words.length).toBeGreaterThan(0);
            expect(words.every((w: any) => w.category === "skills")).toBe(true);
        });

        it("returns an empty array for a non-existent category", () => {
            const words = getWordsByCategory("nonexistent");
            expect(words).toHaveLength(0);
        });
    });

    describe("getWordsByDifficulty", () => {
        it("filters words by difficulty", () => {
            const words = getWordsByDifficulty("beginner");
            expect(words.length).toBeGreaterThan(0);
            expect(words.every((w: any) => w.difficulty === "beginner")).toBe(true);
        });

        it("returns words for each difficulty level", () => {
            const beginner = getWordsByDifficulty("beginner");
            const intermediate = getWordsByDifficulty("intermediate");
            const advanced = getWordsByDifficulty("advanced");

            expect(beginner.length).toBeGreaterThan(0);
            expect(intermediate.length).toBeGreaterThan(0);
            expect(advanced.length).toBeGreaterThan(0);
        });
    });

    describe("calculateProficiencyLevel", () => {
        it("returns 'new' when there are no attempts", () => {
            expect(calculateProficiencyLevel(0, 0)).toBe("new");
        });

        it("returns 'mastered' for 100% correct", () => {
            expect(calculateProficiencyLevel(5, 0)).toBe("mastered");
        });

        it("returns 'review' for 80-99% correct", () => {
            expect(calculateProficiencyLevel(4, 1)).toBe("review");
            expect(calculateProficiencyLevel(8, 2)).toBe("review");
        });

        it("returns 'learning' for 50-79% correct", () => {
            expect(calculateProficiencyLevel(3, 2)).toBe("learning");
            expect(calculateProficiencyLevel(2, 2)).toBe("learning");
        });

        it("returns 'new' for less than 50% correct", () => {
            expect(calculateProficiencyLevel(1, 4)).toBe("new");
        });
    });
});
