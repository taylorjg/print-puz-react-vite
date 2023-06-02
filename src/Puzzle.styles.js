import styled from "@emotion/styled";

export const StyledTable = styled.table`
  border-collapse: collapse;
  & td {
    padding: 0;
  }
`;

export const StyledClueType = styled.span`
  font-family: arial, helvetica;
  font-size: 10pt;
  font-weight: bold;
`;

export const StyledClueNumber = styled.span`
  font-family: arial, helvetica;
  font-size: 10pt;
  font-weight: bold;
`;

export const StyledClue = styled.span`
  font-family: arial, helvetica;
  font-size: 10pt;
`;

export const StyledMessageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
