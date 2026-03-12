import { useEffect, useState, useRef } from "react";
import { usePath } from "../context/PathContext";
import { bfs, dijkstra, astar } from "../utils/algorithms";

const ROWS = 25;
const COLS = 50;

function createNode(row: number, col: number) {
  return {
    row,
    col,
    isWall: false,
    weight: 1,
    isStart: row === 12 && col === 10,
    isEnd: row === 12 && col === 40,
  };
}

function getInitialGrid() {
  const grid: any[] = [];

  for (let r = 0; r < ROWS; r++) {
    const row: any[] = [];

    for (let c = 0; c < COLS; c++) {
      row.push(createNode(r, c));
    }

    grid.push(row);
  }

  return grid;
}

export default function Grid() {
  const { state, dispatch } = usePath();
  const [mouseDown, setMouseDown] = useState(false);

  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // create grid initially
  useEffect(() => {
    if (state.grid.length === 0) {
      const grid = getInitialGrid();
      dispatch({ type: "SET_GRID", payload: grid });
    }
  }, [state.grid]);

  // run algorithm animation
  useEffect(() => {
    if (!state.running) return;

    const start = state.grid.flat().find((n: any) => n.isStart);
    const end = state.grid.flat().find((n: any) => n.isEnd);

    let result: any;

    if (state.algo === "dijkstra") {
      result = dijkstra(state.grid, start, end);
    } else if (state.algo === "astar") {
      result = astar(state.grid, start, end);
    } else {
      result = bfs(state.grid, start, end);
    }

    // animate visited nodes
    result.visited.forEach((node: any, i: number) => {
      if (node.isStart || node.isEnd) return;
      setTimeout(() => {
        const index = node.row * COLS + node.col;
        nodeRefs.current[index]?.classList.add("visited");
      }, i * state.speed*2);
    });

    // animate shortest path
    setTimeout(() => {
      result.path.forEach((node: any, i: number) => {
        if (node.isStart || node.isEnd) return;
        setTimeout(() => {
          const index = node.row * COLS + node.col;
          nodeRefs.current[index]?.classList.add("path");
        }, i * state.speed * 2);
      });
    }, result.visited.length * state.speed*2);

  }, [state.running]);

  // remove animation when stopped
  useEffect(() => {
    if (state.running) return;

    nodeRefs.current.forEach((cell) => {
      cell?.classList.remove("visited");
      cell?.classList.remove("path");
    });

  }, [state.running]);
  useEffect(() => {
  const stopDrawing = () => setMouseDown(false);

  window.addEventListener("mouseup", stopDrawing);

  return () => {
    window.removeEventListener("mouseup", stopDrawing);
  };
}, []);

  function handleCell(row: number, col: number) {
    if (state.running) return;

    const newGrid = state.grid.map((r: any) =>
      r.map((n: any) => ({ ...n }))
    );

    const node = newGrid[row][col];

    // move start
    if (state.mode === "start") {
      newGrid.flat().forEach((n: any) => (n.isStart = false));
      node.isStart = true;
    }

    // move end
    if (state.mode === "end") {
      newGrid.flat().forEach((n: any) => (n.isEnd = false));
      node.isEnd = true;
    }

    // toggle walls
    if (state.mode === "walls") {
      if (!node.isStart && !node.isEnd) {
        node.isWall = !node.isWall;
      }
    }

    // toggle weights
    if (state.mode === "weights") {
      if (!node.isStart && !node.isEnd) {
        node.weight = node.weight === 5 ? 1 : 5;
      }
    }

    dispatch({ type: "SET_GRID", payload: newGrid });
  }

  return (
    <div
      onMouseUp={() => setMouseDown(false)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 25px)`,
       
        marginTop: "20px auto",
        width: "100%",
        padding:"10px 20px",
        userSelect: "none"
        
      }}
    >
      {state.grid.flat().map((node: any, i: number) => (
        <div
          key={i}
          className="cell"
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          onMouseDown={() => {
            setMouseDown(true);
            handleCell(node.row, node.col);
          }}
          onMouseEnter={() => {
            if (mouseDown) handleCell(node.row, node.col);
          }}
          style={{
            width: "25px",
            height: "25px",
            border: "1px solid #ddd",
            background: node.isStart
              ? "green"
              : node.isEnd
              ? "red"
              : node.isWall
              ? "black"
              : node.weight === 5
              ? "purple"
              : "white",
          }}
        />
      ))}
    </div>
  );
}