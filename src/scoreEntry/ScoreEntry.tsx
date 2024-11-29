import { useEffect, useMemo, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import ModifyScore from "./ModifyScore";
import { getCurrentUser } from 'aws-amplify/auth';
import { formatTime } from "../utils/timeFormatter";

const client = generateClient<Schema>();

function ScoreEntry() {
  const [time, setTime] = useState<Schema["CrosswordTime"]["type"]>();
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>()

  getCurrentUser().then((ass) => {
    ass.userId
  })

  const currentDay = new Date().toLocaleDateString(undefined,
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })



  useEffect(() => {
    const getUserId = async () => {
      const user = await getCurrentUser();
      setUserId(user.userId);
    }
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      client.models.CrosswordTime.observeQuery({
        filter: {
          user: { eq: userId },
          day: {
            eq: currentDay
          }
        }
      }).subscribe({
        next: (data) => {
          console.log('return val', data.items)
          setTime(data.items[0]);
          // setNewTime(Number(data.items[0].time));
          if (data.items[0]) {
            setTimeInSeconds(Number(data.items[0]?.time));
          }
        }
      });
    }
  }, [userId]);

  const updateEntry = (val: number) => {
    if (val) {
      console.log('sending:', val);
      if (time?.id) {
        client.models.CrosswordTime.update({ id: time?.id, user: userId, day: currentDay, time: val });
      } else {
        client.models.CrosswordTime.create({ user: userId, day: currentDay, time: val });
      }
    }
    setEdit(false);

  }

  const updateTime = (time: string) => {
    console.log('time to edit', time)
    const [mm, ss] = time.split(':');
    if (!ss) {
      setTimeInSeconds(Number(mm));
      console.log('time is secs', mm, `(no min)`)

    } else {
      const minsInSec = 60 * (Number(mm) ?? 0)
      const tis = Number(ss) + minsInSec;
      console.log('time is secs', tis, `(${minsInSec} + ${ss})`)
      setTimeInSeconds(tis)
    }
  }
  const timeString = useMemo(() => {
    console.log('display to update', timeInSeconds,)
    if (timeInSeconds) {
      const seconds = timeInSeconds % 60;
      const mins = Math.floor(timeInSeconds / 60)
      return `${mins}:${seconds < 10 ? 0 : ''}${seconds}`;
    }
    return '';
  }, [timeInSeconds]);

  // const readtime = (;

  // const edittime = (<>
  //   );


  // const setTimeThing = (time: s) => {
  // }const value = date instanceof Date && !isNaN(date)
  //   ? // Getting time from Date beacuse `value` comes here without seconds
  //   date.toLocaleTimeString('it-IT')
  //   : '';


  return (
    <>Date {currentDay}
      <ModifyScore timeInSeconds={time?.time ?? undefined} updateScore={updateEntry} />


      {time && !edit ? (
        <>
          <div> Your time for today: {formatTime(time.time?.toString() ?? '')}</div>
          <button onClick={() => setEdit(true)}>edit</button>
        </>
      ) : (
        <>
          <div>enter time</div>
          {/* <input onChange={(val) => {
            console.log(val.target.value);
            // setNewTime(Number(val.target.valueAsNumber))
          }} value={newTime} step="1" type="time"></input> */}
          <input
            className="bp3-input bp3-fill"
            type="text"
            placeholder="mm:ss"
            value={timeString}
            onChange={(event) => updateTime(event.target.value)}
          />

          <button onClick={updateEntry}>submit</button>
        </>)
      }
    </>);
}

export default ScoreEntry;
