import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [count, setCount] = useState(0);
  console.log('render val:', count);

  useEffect(() => {
    let id = setInterval(() => {
      console.log('interval val:', count);
      setCount(val => val + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); //eslint-disable-line

  return <h1>{count}</h1>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);
