export interface Word504 {
    id: string;
    word: string;
    pronunciation?: string;
    definition?: string;
    partOfSpeech?: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | string;
    example?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    category?: string;
    translation?: string; // Persian translation
}
