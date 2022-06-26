import { useState } from 'react';
import './App.css';
import BlocklyComponent from './components/blockly';
import Canvas from './components/canvas';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';

/**
 * Main App component for the React application.
 * 
 * @returns A JSX template
 */
function App() {
  
  return (
    <div className="App">
      <Provider store={store}>
        <Canvas width="800" height="800"/>
        <BlocklyComponent />
      </Provider>
    </div>
  )
}

export default App;
