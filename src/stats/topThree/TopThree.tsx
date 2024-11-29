import { formatTime } from "../../utils/timeFormatter";



const TopThree = () => {
  // fetch values
  const top = [{ name: "A", value: "20" }, { name: "B", value: "21" }, { name: "C", value: "62" }];

  return <>
    {top.map(({ name, value }) => {
      return (
        <div>{name}: {formatTime(value)}</div>
      )
    })}
  </>


}

export default TopThree;