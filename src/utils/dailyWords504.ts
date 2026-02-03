import { WORDS_504 } from "../data/words504";

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyWords(count = 5) {
  const today = getTodayKey();
  const saved = localStorage.getItem(`daily-504-words-${today}`);

  if (saved) {
    return JSON.parse(saved);
  }

  const shuffled = [...WORDS_504].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  localStorage.setItem(`daily-504-words-${today}`, JSON.stringify(selected));
  return selected;
}
