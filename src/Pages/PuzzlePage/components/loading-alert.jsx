import { Alert } from "@mui/material";
import { StyledAlertWrapper } from "./common.styles";

export const LoadingAlert = () => {
  return (
    <StyledAlertWrapper>
      <Alert severity="info" variant="filled">
        Loading puzzle...
      </Alert>
    </StyledAlertWrapper>
  );
};
