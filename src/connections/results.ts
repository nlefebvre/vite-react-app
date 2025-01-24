import { category, GuessHistoryEntry } from "./components/Game"

const emojiMap: Record<string, string> = {
  1: "🟨",
  2: "🟩",
  3: "🟦",
  4: "🟪"
}


export const buildEmojiResponse = (categories: category[], history: Array<GuessHistoryEntry>) => {
  const catPositionMap: Record<string, string> = categories.reduce<Record<string, string>>((catMap, cat, i) => {
    catMap[cat.title] = emojiMap[i + 1];
    return catMap
  }, {});

  return history.map((histEntry) => {
    return histEntry.guessGroup.map((entry) => catPositionMap[entry.category])
  })
}

export const copyToClipboard = (title: string, his: Array<Array<string>>) => {

  const game = his.flatMap((el) => {
    return el.join("")
  }).join("\n")
  const toCopy = title + "\n" + game;

  // Copy the text inside the text field
  navigator.clipboard.writeText(toCopy);
}


export const loadHistory = (date: string): Array<GuessHistoryEntry> => {
  return JSON.parse(localStorage.getItem(`connictions-${date}`) ?? '[]');

}

export const storeHistory = (date: string, history: Array<GuessHistoryEntry>) => {
  return localStorage.setItem(`connictions-${date}`, JSON.stringify(history));
}