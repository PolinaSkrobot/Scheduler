import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace) {
    if (replace) {
      console.log("HHH", history);
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = mode;
        return newHistory;
      });
    } else {
      setHistory((prev) => {
        const newHistory = [...prev, mode];
        return newHistory;
      });
    }
  }

  function back() {
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }
  const mode = history[history.length - 1];
  return { mode, transition, back };
}
