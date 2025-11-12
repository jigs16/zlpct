// src/Header.js
import React, { useState } from "react";
import { Navbar, Nav, Dropdown, Container, NavDropdown } from "react-bootstrap";
import { IMAGES } from "../context/theme";

const Header = ({ title = "ZLPCT", logoUrl }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  const handleMenuClick = (action) => {
    console.log(`${action} clicked!`); // Replace with actual logic (e.g., navigate, logout)
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={IMAGES.logo}
            alt="Logo"
            style={{ height: "56px", marginRight: "10px" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="navbar__items--right">
          <Nav className="ms-auto">
            <Nav.Link href="./home">HOME</Nav.Link>

            <NavDropdown
              title="ABOUT"
              id="about-dropdown"
              show={isAboutOpen}
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <NavDropdown.Item href="#">કમિટી મેમ્બર્સ</NavDropdown.Item>
              <NavDropdown.Item href="#">ટ્રસ્ટીશ્રી</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="ACTIVITIES"
              id="activities-dropdown"
              show={isActivitiesOpen}
              onMouseEnter={() => setIsActivitiesOpen(true)}
              onMouseLeave={() => setIsActivitiesOpen(false)}
            >
              <NavDropdown.Item href="#">નિત્યદાન</NavDropdown.Item>
              <NavDropdown.Item href="#">રક્તદાન શિબિર</NavDropdown.Item>
              <NavDropdown.Item href="#">નોટબુક વિતરણ</NavDropdown.Item>
              <NavDropdown.Item href="#">મોટિવેશનલ સેમિનાર</NavDropdown.Item>
              <NavDropdown.Item href="#">મેડિકલ ચેકઅપ કેમ્પ</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#">GALLERY</Nav.Link>

            <Nav.Link href="#">EVENTS</Nav.Link>

            <Nav.Link href="#">DICTIONARY</Nav.Link>

            <Nav.Link href="#">YUVA SANGATHAN</Nav.Link>

            <Nav.Link href="YearlyLifetimeMembershipForm">CONTACT US</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;