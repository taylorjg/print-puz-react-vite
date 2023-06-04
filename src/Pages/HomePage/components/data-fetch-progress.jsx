import { CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import PropTypes from "prop-types";

export const DataFetchProgress = ({ loading, errorMessage }) => {
  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (errorMessage) {
    return <ErrorIcon color="error" titleAccess={errorMessage} />;
  }

  return null;
};

DataFetchProgress.propTypes = {
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
