export interface Word504 {
    id: string;
    word: string;
    pronunciation?: string;
    definition?: string;
    partOfSpeech?:
        | ""
        | "noun"
        | "verb"
        | "adjective"
        | "adverb"
        | "preposition"
        | "conjunction"
        | "pronoun"
        | "determiner"
        | "modal"
        | "article"
        | "interjection"
        | "number"
        | string;
    example?: string;
    difficulty?: "" | "A1" | "A2" | "B1" | "B2";
    category?: string;
    translation?: string; // Persian translation
}
