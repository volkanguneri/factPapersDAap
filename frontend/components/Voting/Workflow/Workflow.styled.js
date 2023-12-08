import styled from "styled-components";

export const StyledWorkflow = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3em;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin-top: 2rem;
  margin-bottom: 3rem;
  padding: 1em;
  border: none;
  cursor: pointer;
  background-color: #d3d3d3;
  border-radius: 25px;

  &:focus {
    background-color: blue;
    color: #fff;
  }
  // &:first-child:focus {
  //   background-color: blue;
  //   color: #fff;
  // }
`;

export const State = styled.h2`
  text-align: center;
  margin-inline: 14em;
  margin-bottom: 2em;
  color: red;
  background-color: #f9f9f9;
  padding-block: 3em;
  border-radius: 10px;
  // width: 30em;
`;
