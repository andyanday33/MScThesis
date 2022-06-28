import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../components/redux/store';
import {Container, Row, Col} from 'react-bootstrap';
import BlocklyComponent from '../components/blockly/BlocklyComponent';
import Canvas from '../components/canvas/Canvas';

/**
 * This functional component consists of the elements that are special to
 * "/game" route.
 *
 * @return {JSX.Element} a JSX template
 * containing BlocklyComponent workspace component
 * and Canvas component wrapped inside a Redux Provider.
 */
export default function Game(): JSX.Element {
  return (
    <>
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
    </>
  );
}
