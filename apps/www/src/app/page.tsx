"use client";

import { BlackjackBoard } from "@/lib/components/blackjack-board";
import type { ReactElement } from "react";

const Home = (): ReactElement => {
  return (
    <div className="text-white">
      <BlackjackBoard />
    </div>
  );
}

export default Home;