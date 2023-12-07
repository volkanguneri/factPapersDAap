"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StyledHeader, StyledLogo } from "./Header.styled";

// import Navbar from "../Navbar/Navbar";

const Header = () => {
  return (
    <>
      <StyledHeader>
        <StyledLogo>FACTPAPERS</StyledLogo>
        {/* <Navbar /> */}
        <ConnectButton />
      </StyledHeader>
    </>
  );
};

export default Header;
