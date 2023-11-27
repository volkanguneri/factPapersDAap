"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StyledHeader, StyledLogo } from "./Header.styled";

const Header = () => {
  return (
    <>
      <StyledHeader>
        <StyledLogo>FACTPAPERS</StyledLogo>
        <ConnectButton />
      </StyledHeader>
    </>
  );
};

export default Header;
