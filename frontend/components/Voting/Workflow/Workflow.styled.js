import styled from "styled-components";

export const StyledWorkflow = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  margin-block: 2rem;
  padding: 1em;
  border: none;
  cursor: pointer;

  &:focus {
    background-color: blue;
    color: #fff;
  }
  //   &:first-child:focus {
  //     background-color: blue;
  //     color: #fff;
  //   }
`;

export const State = styled.h2`
  text-align: center;
  margin-bottom: 2em;
  color: red;
  background-color: #f9f9f9;
  padding: 1.5em;
  border-radius: 10px;
`;
