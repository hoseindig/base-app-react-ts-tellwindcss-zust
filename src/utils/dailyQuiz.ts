import { IRREGULAR_VERBS } from '../data/irregularVerbs'

export function getTodayKey() {
    return new Date().toISOString().slice(0, 10)
}

export function getDailyVerbs(count = 5) {
    const today = getTodayKey()
    const saved = localStorage.getItem(`daily-verbs-${today}`)

    if (saved) {
        return JSON.parse(saved)
    }

    const shuffled = [...IRREGULAR_VERBS].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    localStorage.setItem(`daily-verbs-${today}`, JSON.stringify(selected))
    return selected
}
