import React from 'react';
import Navigationbar from './components/navbar';
import {Routes, Route} from 'react-router-dom';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Game from './pages/game';
import Home from './pages/home';

/**
 * Main App component for the React application.
 *
 * @return {JSX.Element} A JSX template
 */
function App(): JSX.Element {
  return (
    <div className="App">
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
    </div>
  );
}

export default App;
