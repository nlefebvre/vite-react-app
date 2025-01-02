
import "./style/LoadingStyle.css";
// const loaderStyle = {
//   width: "90px",
//   height: "14px",
//   background: "repeating - linear - gradient(90deg,#000 0 calc(25 % - 5px),#0000 0 25 %) left/ calc(4 * 100 %/3) 100 %",
//   animation: "l1 0.5s infinite linear",

// }

export const Loading = () => {/* HTML: <div class="loader"></div> */
  return (<div style={{
    display: "grid",
    minWidth: "20em",
    gridTemplateRows: 'auto auto auto auto',
    gridTemplateColumns: 'auto auto auto auto',

  }}>{[...Array(16).keys()].map((num) => (<div key={num} className="loader" ></div>))}
  </div>)
}

