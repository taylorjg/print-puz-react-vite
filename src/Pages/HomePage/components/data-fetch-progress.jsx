import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import PropTypes from "prop-types";

export const DataFetchProgress = ({ fetchData, onSuccess }) => {
  const mountedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const fetchDataAsync = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        onSuccess(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [fetchData, onSuccess]);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (errorMessage) {
    return <ErrorIcon color="error" titleAccess={errorMessage} />;
  }

  return null;
};

DataFetchProgress.propTypes = {
  fetchData: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
