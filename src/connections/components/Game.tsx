import { useCallback, useEffect, useMemo, useState } from "react";
import { board } from "./exampleBoard";
import Board, { card } from "./Board2";
import { buildEmojiResponse, copyToClipboard, loadHistory, storeHistory } from "../results";
import { alreadyBeenGuessed, isOneAway } from "../gameTools/guesses";


export type category = typeof board['categories'][0]
export type CategoryPosition = 0 | 1 | 2 | 3;
export type GuessHistoryEntry = {
  guessGroup: Array<card>;
  correct: boolean;
};

interface GameProps {
  gameId: number
  date: string
  categories: typeof board['categories']
}





// const getInitialRows = (categories: cats[]): Array<Array<card>> => {
//   const rows: Array<Array<cards>> = [[], [], [], []];
//   categories.forEach((category) => {
//     category.cards.forEach((card) => {
//       rows[Math.floor(card.position / 4)][card.position % 4] = card;
//     })
//   });
//   return rows;
// }

// const getOrdered = (categories: cats[]): Array<cards> => {
//   const rows: Array<cards> = [];
//   categories.forEach((category) => {
//     category.cards.forEach((card) => {
//       rows[card.position] = card;
//     })
//   });
//   return rows;
// }

// const shuffle = (cards: cards[]): Array<cards> => {
//   let result: Array<cards> = cards.slice();
//   cards.forEach((_, i) => {
//     let shuffle = Math.floor(Math.random() * (cards.length));
//     [result[i], result[shuffle]] = [result[shuffle], result[i]];
//   });
//   console.log(result)
//   return result;
// }

// const getCategory = (categories: cats[], card: cards): cats => {
//   const category = categories.find((cat) => {
//     const findCard = cat.cards.find((single) => {
//       return single.content === card.content;
//     })
//     console.log(card.content, 'card in', cat.title, '?', findCard)
//     return !!findCard;
//   });
//   return category!;
// }

// const isCorrect = (categories: cats[], cards: cards[]): boolean => {
//   let category = getCategory(categories, cards[0]);
//   console.log("category:", category, 'cards', cards)
//   return cards.every((card) => {
//     console.log("category to check", getCategory(categories, card));
//     return category.title === getCategory(categories, card).title;
//   })
// }

const getCategoryPosition = (categories: category[], title: string): CategoryPosition => {
  console.log(categories, title)
  return categories.findIndex((cat) => cat.title === title) as CategoryPosition;
}

const getCategory = (categories: category[], title: string): category => {
  console.log(categories, title)
  return categories.find((cat) => cat.title === title)!;
};


const MAX_GROUPS = 4; // or 4

const generateDeck = (categories: category[]): Array<card> => {
  const deck: Array<card> = [];
  categories.forEach((category) => {
    category.cards.forEach((card) => {
      deck[card.position] = {
        category: category.title,
        selected: 0,
        position: card.position,
        content: card.content
      }
    });
  });
  return deck;
}

const shuffle = (deck: card[]): Array<card> => {
  const result: Array<card> = deck.slice();
  deck.forEach((_, i) => {
    const shuffle = Math.floor(Math.random() * (deck.length));

    [result[i], result[shuffle]] = [result[shuffle], result[i]];
    result[i].position = i;
    result[shuffle].position = shuffle;
  });
  return result;
}

const removeCategoryFromDeck = (deck: card[], categories: string[], deselect: boolean): Array<card> => {
  const result: Array<card> = [];
  deck.forEach((card) => {
    if (!categories.includes(card.category)) {
      card.position = result.length;
      card.selected = deselect ? 0 : card.selected;
      result.push(card)
    }
  });
  return result;
}

// const validateGuesses = () => { }
// const handleCardSelect = () => { }



const Game = (props: GameProps) => {
  const [deck, setDeck] = useState(generateDeck(props.categories));
  // console.log('deck is', deck.length, deck)
  const [completed, setCompleted] = useState<Array<[category, CategoryPosition]>>([])
  // const [selected, setSelected] = useState<Record<string, boolean>>({});

  const [count, setCount] = useState<number>(0);
  // const [mistakes, setMistakes] = useState<number>(4);
  const activeGroup: 0 | 1 | 2 | 3 | 4 = useMemo(() => Math.floor(count / 4) + 1, [count]);
  const cardsInActiveGroup = useMemo(() => count % 4, [count]);

  const [guessHistory, setGuessHistory] = useState<Array<GuessHistoryEntry>>([])


  const removeCategory = useCallback((categories: string[], deselect: boolean) => {
    const newD = removeCategoryFromDeck(deck, categories, deselect);
    setDeck(newD);
    setCount(0);
  }, [deck]);


  useEffect(() => {
    const hist: Array<GuessHistoryEntry> = loadHistory(props.date);
    if (hist) {
      setGuessHistory(hist);
      const catHold: Array<string> = [];
      const completedHold: Array<[category, CategoryPosition]> = [];
      hist.forEach((histelement) => {
        if (histelement.correct) {
          catHold.push(histelement.guessGroup[0].category);
          completedHold.push([getCategory(props.categories, histelement.guessGroup[0].category), getCategoryPosition(props.categories, histelement.guessGroup[0].category)]);
        } else {
          // deduct life
        }
      });
      removeCategory(catHold, true);
      setCompleted(completedHold)
    }
  }, [props.categories, props.date])



  const handleClick = (card: card) => {
    // you can only deselect the active group
    // if selected, deselect
    if (card.selected > 0) {
      if (activeGroup === card.selected || (cardsInActiveGroup == 0 && activeGroup === card.selected + 1)) {
        card.selected = 0;
        setCount(count - 1);
      }
    }
    // select up to max group guess
    else if (count < 4 * MAX_GROUPS) {
      // guessGroups
      // card.selected = 1; // use current guess count
      card.selected = activeGroup;

      setCount(count + 1);
    }
    const newDeck = deck.slice();
    newDeck[card.position] = card;
    setDeck(newDeck);
  };

  const handleShuffle = () => {
    setDeck(shuffle(deck));
  };

  const handleDeselectAll = () => {
    setDeck(deck.map((card) => {
      return {
        ...card,
        selected: 0
      }
    }));
    setCount(0);
  };

  const submitGuess = () => {
    const guesses: Array<Array<card>> = deck.reduce<Array<Array<card>>>((guessGroups, card) => {
      if (card.selected > 0) {
        guessGroups[card.selected - 1] = guessGroups[card.selected - 1] ?? []
        // const guessGroup = guessGroups[card.selected - 1] ?? [];

        guessGroups[card.selected - 1].push(card);
      }
      return guessGroups;
    }, []);
    console.log('hi', guesses);
    const catsToRemove: Array<string> = [];
    const newGuessHist = [...guessHistory];
    const completeds: Array<[category, CategoryPosition]> = []
    guesses.forEach((guessGroup) => {
      if (guessGroup.length === 4) {
        const category = guessGroup[0].category;
        const correct = guessGroup.every((card) => card.category === category);
        const alreadyGuessed = alreadyBeenGuessed(guessHistory, guessGroup);
        const oneAway = isOneAway(guessGroup);
        console.log("one away", oneAway)
        console.log("alreadgGuessed", alreadyGuessed)
        if (!alreadyGuessed) {
          newGuessHist.push({ guessGroup, correct });
          if (correct) {
            completeds.push([getCategory(props.categories, category), getCategoryPosition(props.categories, category)]);
            catsToRemove.push(category);
          }
        }
      }
      storeHistory(props.date, newGuessHist);
      setGuessHistory(newGuessHist)
      setCompleted([...completed, ...completeds])
      removeCategory(catsToRemove, false);

    });

    // const cardsToCheck = row.reduce<cards[]>((prev, content) => {
    //   if (names.includes(content.content)) {
    //     categories.push(getCategory(props.categories, content));
    //     prev.push(content);
    //   }
    //   return prev;
    // }, []);
    // // push history
    // // if correct, update board

    // setGuessHistory([...guessHistory, cardsToCheck])
    // if (isCorrect(props.categories, cardsToCheck)) {
    //   setCompleted([...completed, categories[0]])
    //   handleDeselectAll();
    // }
    // deselect
    // if commplete, show results

  };


  return (
    <>
      <Board
        completed={completed}
        deck={[...deck]}
        toggleCard={handleClick} />
      {completed.length === 4 ? (<div >
        <div>You win!</div>
        <div>{buildEmojiResponse(props.categories, guessHistory).map((guess) => {
          return (<div>
            {...guess}
          </div>);
        })}</div>
        <div style={{ alignContent: 'center' }}><button onClick={() => copyToClipboard(`Connectons\nPuzzle #${props.gameId - 32}`, buildEmojiResponse(props.categories, guessHistory))}>copy</button>
          <button onClick={() => {
            storeHistory(props.date, []);
            location.reload()
          }
          }>reset</button></div>
      </div>) :

        (<div style={{ margin: '20px', alignSelf: 'center', display: 'flex', gap: "5px", }}>
          <button onClick={handleShuffle}>shuffle</button>
          <button onClick={handleDeselectAll}>Deselect All</button>
          <button disabled={count < 4} onClick={submitGuess}>Submit</button>
        </div >)
      }
    </>
  );
}

export default Game;
