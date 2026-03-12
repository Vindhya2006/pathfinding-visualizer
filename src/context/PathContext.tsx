import { createContext, useContext, useReducer } from "react";

const PathContext = createContext<any>(null);

export const usePath = () => useContext(PathContext);

const initialState = {
  grid: [],
  mode: "none",
  algo: "bfs",
  running: false,
  speed:20
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_ALGO":
      return { ...state, algo: action.payload };

    case "SET_GRID":
      return { ...state, grid: action.payload };

    case "RUN":
      return { ...state, running: true };

    case "CLEAR":
        return {
           ...state,
           running: false,
           grid: [],
        };
    case "SET_SPEED":
        return { ...state, speed: action.payload };

    default:
      return state;
  }
}

export const PathProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PathContext.Provider value={{ state, dispatch }}>
      {children}
    </PathContext.Provider>
  );
};