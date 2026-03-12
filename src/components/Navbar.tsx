import { usePath } from "../context/PathContext";
import { generateMaze } from "../utils/algorithms";

export default function Navbar() {
  const { state, dispatch } = usePath();

  return (<nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">

  <span className="navbar-brand">Maze Visualizer</span>

  <div className="d-flex gap-2 align-items-center">

    {/* Node tools */}
    <button
      className={`btn btn-sm btn-outline-light ${state.mode === "start" ? "active" : ""}`}
      onClick={() => dispatch({ type: "SET_MODE", payload: "start" })}
    >
      Start
    </button>

    <button
      className={`btn btn-sm btn-outline-light ${state.mode === "end" ? "active" : ""}`}
      onClick={() => dispatch({ type: "SET_MODE", payload: "end" })}
    >
      End
    </button>

    <button
      className={`btn btn-sm btn-outline-light ${state.mode === "walls" ? "active" : ""}`}
      onClick={() => dispatch({ type: "SET_MODE", payload: "walls" })}
    >
      Walls
    </button>

    <button
      className={`btn btn-sm btn-outline-light ${state.mode === "weights" ? "active" : ""}`}
      onClick={() => dispatch({ type: "SET_MODE", payload: "weights" })}
    >
      Weights
    </button>

    {/* Maze generator */}
    <button
      className="btn btn-warning btn-sm"
      onClick={() => {
        const newGrid = generateMaze(state.grid);
        dispatch({ type: "SET_GRID", payload: newGrid });
      }}
    >
      Maze
    </button>

    {/* Speed slider */}
    <label className="text-light small">Speed</label>
    <input
      type="range"
      min="5"
      max="100"
      value={state.speed}
      onChange={(e) =>
        dispatch({ type: "SET_SPEED", payload: Number(e.target.value) })
      }
    />

    {/* Algorithm selector */}
    <select
      className="form-select form-select-sm"
      style={{ width: "120px" }}
      value={state.algo}
      onChange={(e) =>
        dispatch({ type: "SET_ALGO", payload: e.target.value })
      }
    >
      <option value="bfs">BFS</option>
      <option value="dijkstra">Dijkstra</option>
      <option value="astar">A*</option>
    </select>

    {/* Actions */}
    <button
      className="btn btn-success btn-sm"
      onClick={() => dispatch({ type: "RUN" })}
    >
      Visualize
    </button>

    <button
      className="btn btn-danger btn-sm"
      onClick={() => dispatch({ type: "CLEAR" })}
    >
      Clear
    </button>

  </div>

</nav>
    
  );
}