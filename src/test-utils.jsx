import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";

import { homePageTheme } from "@app/pages/homepage/homepage.theme";

export const renderWithTheme = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={homePageTheme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
