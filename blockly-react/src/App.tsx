import { useState } from 'react'
import './App.css'
import BlocklyComponent from './components/blockly'
import Canvas from './components/canvas'

function App() {
  

  return (
    <div className="App">
     <Canvas width="800" height="800"/>
     <BlocklyComponent />
    </div>
  )
}

export default App
