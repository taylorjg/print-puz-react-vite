import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledDiv = styled.div`
  background-color: red;
`;

export const StyledSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  border: 1px solid black;
  border-radius: 0.25rem;
  padding: 0.5rem;
`;
