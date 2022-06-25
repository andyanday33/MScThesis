import { useState } from 'react';
import './App.css';
import BlocklyComponent from './components/blockly';
import Canvas from './components/canvas';
import { store } from './components/redux/store';

/**
 * Main App component for the React application.
 * 
 * @returns A JSX template
 */
function App() {
  
  return (
    <div className="App">
     <Canvas width="800" height="800"/>
     <BlocklyComponent />
    </div>
  )
}

export default App
