import { useLocation } from "react-router-dom";

export const Page2 = () => {
  const locationStuff = useLocation();
  console.log(locationStuff);

  return (<div>
    <div>Page 2</div>
    <pre>{JSON.stringify(locationStuff.state, null, 2)}</pre>
  </div>);
};
