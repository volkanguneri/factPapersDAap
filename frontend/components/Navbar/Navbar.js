"use client";

import { StyledNavbar, StyledLinks } from "./Navbar.styled";

const Menu = () => {
  return (
    <StyledNavbar role="navigation">
      <ul>
        <li>
          <StyledLinks href="#">Articles</StyledLinks>
        </li>
        <li>
          <StyledLinks href="#">Verifications</StyledLinks>
        </li>
        <li>
          <StyledLinks href="#">Rapports</StyledLinks>
        </li>
        <li>
          <StyledLinks href="#">Objection</StyledLinks>
        </li>
      </ul>
    </StyledNavbar>
  );
};

export default Menu;
