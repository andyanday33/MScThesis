import React from 'react';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

/**
 * A simple navigation bar that exists on every route of the site.
 *
 * @return {JSX.Element} a JSX containing
 * a Navbar bootstrap component and its children
 * such as Navbar.Link and Navbar.Brand.
 */
export default function Navigationbar() {
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
              <LinkContainer to="game">
                <Nav.Link active={false}>Game</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
