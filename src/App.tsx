import './App.css';
import LedMapperParent from './components/LedMapperParent';
import githubMarker from "./svg/github-mark-white.svg";
import heartSVG from "./svg/heart.svg"

function App() {
  return (
    <div className="App">
        <div className="Header">
            <div className="toolName">WLEDMapper</div>
            <a href="https://github.com/Mattstir/WLEDMapper">
                <img className="githubMarker" src={githubMarker} alt="Go to repository" />
            </a>
        </div>
        <LedMapperParent/>
        <div className="Footer">
            <div>
                Made with
                <img className="heartSvg" src={heartSVG} alt="heart"/>
                for WLED by
                <a className="FooterLineLink" href="https://github.com/Mattstir">Mattstir</a>
            </div>
            <div className="FooterLineSpacer"/>
            <div>
                Icons by
                <a className="FooterLineLink" href="https://fonts.google.com/icons">Google Fonts</a>
            </div>
        </div>
    </div>
  );
}

export default App;
