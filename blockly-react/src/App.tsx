import { useState } from 'react';
import BlocklyComponent from './components/blockly';
import Canvas from './components/canvas';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';
import Navigationbar from './components/navbar';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; 

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
        <Route path="/" element={<div>Home</div>}/>
        <Route path="/game" element={
          <Provider store={store}>
            <Container fluid>
              <Row>
                <Col>
                  <BlocklyComponent />
                </Col>
                <Col>
                  <Canvas width="800" height="600"/>
                </Col>
              </Row>
            </Container>
          </Provider>
        }/>
      </Routes>
      
    </div>
  )
}

export default App;
