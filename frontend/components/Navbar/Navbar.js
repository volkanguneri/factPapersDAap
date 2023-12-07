"use client";

import { StyledNavbar, StyledLinks } from "./Navbar.styled";

const Navbar = () => {
  return (
    <StyledNavbar role="navigation">
      <ul>
        <li>
          <StyledLinks href="#">Gouvernance</StyledLinks>
        </li>
        <li>
          <StyledLinks href="#">Voting</StyledLinks>
        </li>
      </ul>
    </StyledNavbar>
  );
};

export default Navbar;
