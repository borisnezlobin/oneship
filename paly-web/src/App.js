import './App.css';
import { Anchor } from "phosphor-react"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Anchor color="#1c8000" size={128} />
        <p className='bigText'>OneShip</p>
        <p style={{ margin: 0 }}>Coming soon!</p>
        <div style={{ margin: 8, height: 32 }} />
        <btn className='btn' onClick={() => {
          window.open("https://discord.gg/CVHr8mKJeC");
        }}>
          Interested? Join our Discord!
        </btn>
      </header>
    </div>
  );
}

export default App;
