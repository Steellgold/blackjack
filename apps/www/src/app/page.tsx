"use client";

import { ReactElement } from "react";
import { BlackjackBoard } from "./blackjack/_components/blackjack-board";

const Home = (): ReactElement => {
  return (
    <div className="text-white">
      <BlackjackBoard />
    </div>
  );
}

export default Home;