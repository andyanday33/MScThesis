import Navigationbar from './components/navbar';
import { Routes, Route, Link } from 'react-router-dom';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Game from './pages/game';
import Home from './pages/home';

/**
 * Main App component for the React application.
 * 
 * @returns A JSX template
 */
function App() {
  
  return (
    <div className="App">
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
      
    </div>
  )
}

export default App;
