import logo from './logo.svg';
import './App.css';
import Homepage from './components/Homepage';
import SongComponent from './components/Player';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Homepage />
      <SongComponent/>
      </header>
    </div>
  );
}

export default App;
