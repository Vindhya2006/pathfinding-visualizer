import Navbar from "./components/Navbar";
import Grid from "./components/Grid";

function App() {
  return (
    <>
      <Navbar />
      <div style={{display:"flex",gap:"20px",justifyContent:"center",marginTop:"10px"}}>
  <span>🟩 Start</span>
  <span>🟥 End</span>
  <span>⬛ Wall</span>
  <span>🟣 Weight</span>
  <span>🟦 Visited</span>
  <span>🟨 Path</span>
</div>
      <Grid />
    </>
  );
}

export default App;
