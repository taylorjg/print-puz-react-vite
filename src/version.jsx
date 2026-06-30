import packageJson from "../package.json";

import { StyledVersion } from "./version.styles";

export const Version = () => {
  return <StyledVersion>version: {packageJson.version}</StyledVersion>;
};
