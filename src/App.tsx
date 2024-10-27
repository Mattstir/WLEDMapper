import './App.css';
import LedMapper from './components/LedMapper';
import githubMarker from "./svg/github-mark-white.svg";

function App() {
  return (
    <div className="App">
        <div className="Header">
            <div className="toolName">WLEDMapper</div>
            <a href="https://github.com/Mattstir/WLEDMapper">
                <img className="githubMarker" src={githubMarker} alt="Go to repository" />
            </a>
        </div>
        <LedMapper/>
        <div className="Footer">
            Made with Love for WLED by
            <a href="https://github.com/Mattstir">Mattstir</a>
        </div>
    </div>
  );
}

export default App;
