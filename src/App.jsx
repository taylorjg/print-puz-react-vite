import { Link } from "react-router-dom";
import { StyledDiv } from "./App.styles";
import myImage from "./assets/10_number4.gif";

export const App = () => {
  const url = "https://news.bbc.co.uk";

  return (
    <div>
      <StyledDiv>Hello from App</StyledDiv>
      <Link to={"/page2"} state={{ url }}>
        Page 2
      </Link>
      <img src={myImage} alt="Number 10" />
    </div>
  );
};
