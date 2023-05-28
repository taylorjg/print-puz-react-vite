import { Link } from "react-router-dom";

export const App = () => {
  const url = "https://news.bbc.co.uk";

  return (
    <div>
      <div>Hello from App</div>
      <Link to={"/page2"} state={{ url }}>Page 2</Link>
    </div>
  );
};
