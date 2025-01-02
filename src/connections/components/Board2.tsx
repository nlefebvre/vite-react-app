import { categoryColor, selectedColor } from "./colors";
import { category, CategoryPosition } from "./Game";

interface BoardProps {
  completed: Array<[category, CategoryPosition]>;
  deck: Array<card>;
  toggleCard: (card: card) => void
}

export interface card {
  content: string;
  selected: 0 | 1 | 2 | 3 | 4;
  position: number;
  category: string;
}


const Board = (props: BoardProps) => {
  const { completed, deck, toggleCard } = props;
  console.log(deck.length)

  return (
    <div style={{
      display: "grid",
      minWidth: "20em",
      gridTemplateRows: 'auto auto auto auto',
      gridTemplateColumns: 'auto auto auto auto',

    }}>
      {completed.map((cat) => {
        return <div key={cat[0].title} style={{
          borderRadius: '8px',
          padding: '10px',
          margin: '3px',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: `#${categoryColor[cat[1]]}`,
          gridColumn: '1 / 5'
        }}>
          <div>{cat[0].title}</div>
          <div style={{ fontSize: "smaller", opacity: "75%" }}>{cat[0].cards.map((c) => c.content).join(", ")}</div>
        </div>
      })}

      {
        deck.map((card) => {
          return <button
            onClick={() => toggleCard(card)}
            key={card.content}
            style={{
              background: `${selectedColor[card.selected] ?? ''}`,
              textAlign: 'center',
              minHeight: '80px',
              minWidth: '150px',
              flex: 1,
              padding: '10px',
              margin: '3px'
            }
            }>
            {/* {card.category.substring(0, 10)} */}
            {card.content}
          </button>
        })
      }
    </div >
  );
};

export default Board;