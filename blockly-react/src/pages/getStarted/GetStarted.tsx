import React from 'react';
import AlertDismissible from '../../components/alerts/AlertDismissable';
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
          <Accordion.Header>Generating Code</Accordion.Header>
          <Accordion.Body>
            Hello there!
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Moving Actors Forward</Accordion.Header>
          <Accordion.Body>
            General Kenobi!
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
