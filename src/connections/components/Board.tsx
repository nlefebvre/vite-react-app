import { useMemo, useState } from "react";
import { board } from "./exampleBoard";


interface GameProps {
  categories: typeof board['categories']
}

type cats = typeof board['categories'][0];
type cards = cats['cards'][0]




const getInitialRows = (categories: cats[]): Array<Array<cards>> => {
  const rows: Array<Array<cards>> = [[], [], [], []];
  categories.forEach((category) => {
    category.cards.forEach((card) => {
      rows[Math.floor(card.position / 4)][card.position % 4] = card;
    })
  });
  return rows;
}

const getOrdered = (categories: cats[]): Array<cards> => {
  const rows: Array<cards> = [];
  categories.forEach((category) => {
    category.cards.forEach((card) => {
      rows[card.position] = card;
    })
  });
  return rows;
}

const shuffle = (cards: cards[]): Array<cards> => {
  const result: Array<cards> = cards.slice();
  cards.forEach((_, i) => {
    const shuffle = Math.floor(Math.random() * (cards.length));
    [result[i], result[shuffle]] = [result[shuffle], result[i]];
  });
  console.log(result)
  return result;
}

const getCategory = (categories: cats[], card: cards): cats => {
  const category = categories.find((cat) => {
    const findCard = cat.cards.find((single) => {
      return single.content === card.content;
    })
    console.log(card.content, 'card in', cat.title, '?', findCard)
    return !!findCard;
  });
  return category!;
}

const isCorrect = (categories: cats[], cards: cards[]): boolean => {
  const category = getCategory(categories, cards[0]);
  console.log("category:", category, 'cards', cards)
  return cards.every((card) => {
    console.log("category to check", getCategory(categories, card));
    return category.title === getCategory(categories, card).title;
  })
}

const Board = (props: GameProps) => {
  const rows = useMemo(() => getInitialRows(props.categories), [props]);
  const [completed, setCompleted] = useState<Array<cats>>([])
  const [row, setRow] = useState(getOrdered(props.categories));
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [count, setCount] = useState<number>(0);
  const [guessHistory, setGuessHistory] = useState<Array<Array<cards>>>([])

  const handleClick = (cardId: string) => {
    const newValue = !selected[cardId];
    console.log(cardId, newValue, count)
    if (!newValue || count < 4) {
      setSelected({
        ...selected,
        [cardId]: newValue
      });
      setCount(newValue ? count + 1 : count - 1)
    }
  };

  const handleShuffle = () => {
    setRow(shuffle(row));
  };

  const handleDeselectAll = () => {
    setSelected({});
    setCount(0);
  };

  const submitGuess = () => {
    const names = Object.keys(selected).filter((cardContent) => selected[cardContent]);
    const categories: cats[] = [];
    const cardsToCheck = row.reduce<cards[]>((prev, content) => {
      if (names.includes(content.content)) {
        categories.push(getCategory(props.categories, content));
        prev.push(content);
      }
      return prev;
    }, []);
    // push history
    // if correct, update board

    setGuessHistory([...guessHistory, cardsToCheck])
    if (isCorrect(props.categories, cardsToCheck)) {
      setCompleted([...completed, categories[0]])
      handleDeselectAll();
    }
    // deselect
    // if commplete, show results

  };


  return (
    <><div>board</div>
      <div style={{
        display: "grid",
        gridTemplateRows: 'auto auto auto auto',
        gridTemplateColumns: 'auto auto auto auto',

      }}>
        {completed.map((cat) => {
          return <div style={{ gridColumn: '1 / 5' }}>{cat.title}</div>
        })}

        {/* // return <div style={{ display: "flex" }}> */
          row.filter((card) => !completed.find((cat) => cat.cards.includes(card))).map((card) => {
            return <button onClick={() => handleClick(card.content)} key={card.content} style={{ background: `${selected[card.content] ? 'red' : ''}`, textAlign: 'center', flex: 1, minWidth: 'fit-content', padding: '10px', margin: '3px' }}>{card.content}</button>
            // });
          })
        }
      </div>
      {completed.length === 4 ? (<>you win</>) :

        (<div style={{ alignSelf: 'center', display: 'flex', gap: "5px", margin: '20px' }}>
          <button onClick={handleShuffle}>shuffle</button>
          <button onClick={handleDeselectAll}>Deselect All</button>
          <button disabled={count < 4} onClick={submitGuess}>Submit</button>
        </div >)
      }
    </>
  );
}

export default Board;
