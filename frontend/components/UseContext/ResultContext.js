import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [winningProposalNum, setWinningProposalNum] = useState("");

  const setNum = (num) => {
    setWinningProposalNum(num);
  };

  return (
    <ResultContext.Provider value={{ winningProposalNum, setNum }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  return useContext(ResultContext);
};
