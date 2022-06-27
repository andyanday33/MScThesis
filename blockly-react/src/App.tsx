import { useState } from 'react';
import BlocklyComponent from './components/blockly';
import Canvas from './components/canvas';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';
import Navigationbar from './components/navbar';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//TODO: add routing
/**
 * Main App component for the React application.
 * 
 * @returns A JSX template
 */
function App() {
  
  return (
    <div className="App">
      <Navigationbar />
      <Provider store={store}>
        <Canvas width="800" height="800"/>
        <BlocklyComponent />
      </Provider>
    </div>
  )
}

export default App;
