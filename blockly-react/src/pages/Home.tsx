import React from 'react';
import {Card, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

// styles
import './Home.css';

/**
 * This functional component consists of the components that are
 * special to "/" route.
 *
 * @return {JSX.Element} a JSX template containing Cards and Links.
 */
export default function Home(): JSX.Element {
  return (
    <>
      <Card className="text-center homepage-card">
        <Card.Header>Puzzlafic Puzzle Coding Game</Card.Header>
        <Card.Body>
          <Card.Title>Welcome Aboard!</Card.Title>
          <Card.Text>
            Puzzlaffic is a coding puzzle game that makes you think
             like a computer to solve a couple of puzzles. It provides
              a simple drag and drop interface to generate code that
                will help you solve the puzzle.
          </Card.Text>
          <LinkContainer to="game">
            <Button variant="primary">Play the game</Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </>
  );
}
