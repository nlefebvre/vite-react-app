import { card } from "../components/Board2"
import { GuessHistoryEntry } from "../components/Game"

export const alreadyBeenGuessed = (history: Array<GuessHistoryEntry>, guess: Array<card>): boolean => {
  // const sortedGuesses = guess.sort((a,b) => a.content.localeCompare(b.content));
  return !!history.find((entry) => {
    // does every card in the guess exist in the hisory?
    // if so, it has already been guessed. if not, continue
    return guess.every((card) => entry.guessGroup.find((histEntryCard) => card.content === histEntryCard.content));
  })
}

export const isOneAway = (guess: Array<card>): boolean => {
  let oneAway = false;

  const catGrouping: Record<typeof guess[0]['category'], number> = {};
  guess.forEach(({ category }) => {
    const currentCount = catGrouping[category] ?? 0;
    catGrouping[category] = currentCount + 1;

    if (catGrouping[category] === 3) {
      oneAway = true;
    } else if (catGrouping[category] === 4) {
      oneAway = false;
    }
  });
  return oneAway;
}