import styled from "styled-components";

export const BodyLayout = styled.div`
  display: grid;
  row-gap: 24px;
  padding-left: 24px;
  background: ${Date.now() % 2 == 0 ? "pink" : "white"};
`;
