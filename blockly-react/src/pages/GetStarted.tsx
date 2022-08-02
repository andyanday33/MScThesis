import React from 'react';
import AlertDismissible from '../components/alerts/AlertDismissable';
import {Accordion} from 'react-bootstrap';
/**
 * The functional component corresponding to
 * Get Started page.
 *
 * @return {JSX.Element}
 */
export default function GetStarted(): JSX.Element {
  return (
    <>
      <AlertDismissible>
      Welcome to Puzzlaffic guides page! You could find any knowledge
       you need to play the game in this guide.
      </AlertDismissible>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Getting Started</Accordion.Header>
          <Accordion.Body>
            Welcome to Puzzlaffic! This is a guide to get
             you started with the game.<br />
            To begin with, let us explain the rules of the game,
             it is fairly simple; you have to solve the puzzle
              on the right side on the screen by using the code
               pieces on the left side.<br />
            You could drag and drop blocks from toolbox to
             generate a piece of code that is going to move the actors.<br />
            Every puzzle could have more than one solution,
             and there would be at least one solution.
            All of the puzzles have the same components:
            <ul>
              <li><strong>Actors:</strong><br />
                The actors are the pieces of the puzzle that
                 could move around and turn right or left.
                  They could crash into the walls or other actors.
              </li>
              <li><strong>Walls:</strong><br />
                The walls are the pieces of the puzzle that
                 act as a barrier for actors to restrict
                  their movements.
              </li>
              <li><strong>Goals:</strong><br />
                Goals are the pieces of the puzzle that
                 act as a finish line for the actors.
                  Unless a level specifies you otherwise,
                   all the actors should finish the level on
                    a distinct goal to complete that level.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Generating Code</Accordion.Header>
          <Accordion.Body>
            In the Game page, you are going to see a workspace on the left
            that contains a toolbox on the left
             with different sections each including some blocks,
              next to the playground.<br />
             You can drag and drop the blocks to the workspace on
            the right to generate some code to move actors around.<br />
            The actors could move forward, backwards or turn left or right,
             using the blocks in the move section of the toolbox.<br />
            You can also drag and drop unused blocks to the trashcan.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Moving Actors Forward or Backward</Accordion.Header>
          <Accordion.Body>
            Inside move section of the toolbox, you are going to
              see a block called moveForward. This block will move
                all the actors forward by square. moveBackards block
                 has the same logic but instead of moving forward,
                  it moves actors backwards.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Loops</Accordion.Header>
          <Accordion.Body>
            After reaching level 5, you will see a new section on the toolbox
             called loops. This section contains a for loop block that
              can be used to execute a series of blocks attached next to it
               more than once.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>Scoring</Accordion.Header>
          <Accordion.Body>
            At the end of each level, you are going to see a score with a
             retry button and next level button. Keep in mind that 100 is not
              the highest score for each level and every level has a distinct
               maximum score. You can get higher scores by reducing the number
                of moves you are making and making use of the loops block.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
