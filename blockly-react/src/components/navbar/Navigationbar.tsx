import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

/**
 * A simple navigation bar that exists on every route of the site.
 *
 * @return {JSX.Element} a JSX containing
 * a Navbar bootstrap component and its children
 * such as Navbar.Link and Navbar.Brand.
 */
export default function Navigationbar(): JSX.Element {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Puzzlaffic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link active={false}>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="get-started">
                <Nav.Link active={false}>Get Started</Nav.Link>
              </LinkContainer>
              <LinkContainer to="game">
                <Nav.Link active={false}>Game</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
