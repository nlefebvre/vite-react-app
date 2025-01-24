import { useEffect, useState } from "react";
import { formatTime, getTimeInSeconds } from "../utils/TimeFormatter";

interface ModifyScoreProps {
  timeInSeconds?: number;
  updateScore: (value: number) => void;
}

function ModifyScore(props: ModifyScoreProps) {
  const { timeInSeconds, updateScore } = props;
  const [displayVal, setDisplayVal] = useState(timeInSeconds?.toString() ?? '');

  useEffect(() => {
    setDisplayVal(formatTime(timeInSeconds?.toString() ?? ''));
    console.log('update', timeInSeconds)
  }, [timeInSeconds])

  const formatDisplayVal = () => {
    setDisplayVal(formatTime(displayVal));
  }

  return (
    <>
      <input
        className="bp3-input bp3-fill"
        type="text"
        placeholder="mm:ss"
        value={displayVal}
        onChange={(event) => setDisplayVal(event.target.value)}
        onBlur={formatDisplayVal}
      />

      <button onClick={() => updateScore(getTimeInSeconds(displayVal))}>submit</button>
    </>);
}

export default ModifyScore;
