"use client";

import styled from "styled-components";

export const StyledMain = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 5rem;
  width: 100%;

  strong {
    width: 9em;
  }
`;

export const StyledButton = styled.button`
  margin-left: 3em;
  margin-right: 5em;
  border-radius: 10%;
  padding: 0.3rem;
  // background: blue;
  color: blue;
  cursor: pointer;
  outline: 0;
  border: none;
`;

export const H1Styled = styled.h1`
  color: blue;
  font-weight: 400;
  margin-bottom: 5em;
`;

export const H2Styled = styled.h3`
  color: blue;
  margin-bottom: 2em;
`;

export const UlStyled = styled.ul`
  list-style: none;
  margin-bottom: 5em;
`;

export const LiStyled = styled.li`
  display: flex;
  color: darkblue;
  margin-bottom: 0.3em;
`;

export const PSTyled = styled.p`
  width: 30rem;
`;
