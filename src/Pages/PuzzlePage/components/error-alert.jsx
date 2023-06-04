import PropTypes from "prop-types";
import { Alert, Button } from "@mui/material";
import { StyledAlertWrapper } from "./common.styles";

export const ErrorAlert = ({ message, onReturnHome }) => {
  return (
    <StyledAlertWrapper>
      <Alert
        sx={{ width: "33%" }}
        severity="error"
        variant="filled"
        action={
          <Button color="inherit" onClick={onReturnHome}>
            Return Home
          </Button>
        }
      >
        {message}
      </Alert>
    </StyledAlertWrapper>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onReturnHome: PropTypes.func.isRequired,
};
