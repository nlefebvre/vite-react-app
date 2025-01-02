import { useEffect, useState } from "react";
import Game from "./components/Game";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { Loading } from "./components/Loading";
import dayjs, { Dayjs } from "dayjs";
import { MyDatePicker } from "./components/DatePicker";



const client = generateClient<Schema>();

function ConnectionsApp() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchTodaysBoard = async () => {
      setLoading(true);
      const response = await client.queries.FetchConnectionsData({ name: "q", date: date.format("YYYY-MM-DD") });
      const { board } = JSON.parse(response.data);
      setData(board);
      setLoading(false);

    };
    fetchTodaysBoard();
  }, [date]);

  return (
    <main>
      <h1 style={{ textAlign: "center" }}>ConNICtions</h1>
      <div><MyDatePicker date={date} setDate={setDate} /></div>
      {!loading && data ? <Game
        categories={data.categories}
        date={data.print_date}
        gameId={data.id}
      /> :
        <Loading />
      }
    </main>
  );
}

export default ConnectionsApp;
