import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledPageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

export const StyledControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
