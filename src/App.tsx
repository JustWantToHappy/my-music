import React from 'react';
import Header from "./layout/Header"
import Container from "./layout/Container"
import { useLocation } from "react-router-dom"
function App() {
  //防止滚动条扩容
  const { pathname } = useLocation();
  if (pathname.includes("/mysonglist")) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'visible';
  }
  return (
    <div className="app">
      <Header />
        <Container />
    </div>
  );
}

export default App;