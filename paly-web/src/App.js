import './App.css';
import { Anchor } from "phosphor-react"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Anchor color="#1c8000" size={128} />
        <p className='bigText'>OneShip</p>
        <p style={{ margin: 0 }}>Coming soon!</p>
        <div style={{ margin: 8 }} />
        <p className='btn'>
          Interested? Join our Discord!
        </p>
      </header>
    </div>
  );
}

export default App;
