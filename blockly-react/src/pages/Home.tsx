import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// styles
import './home.css';

/**
 * This functional component consists of the components that are
 * special to "/" route.
 * 
 * @returns a JSX template containing Cards and Links.
 */
export default function Home() {
  return (
    <>
        <Card className="text-center homepage-card">
        <Card.Header>Puzzlafic Puzzle Coding Game</Card.Header>
        <Card.Body>
            <Card.Title>Welcome Aboard!</Card.Title>
            <Card.Text>
            We are glad to see new challengers approaching to solve these puzzles.
            </Card.Text>
            <LinkContainer to="game">
                <Button variant="primary">Play the game</Button>
            </LinkContainer>
        </Card.Body>
        </Card>
    </>
  )
}
