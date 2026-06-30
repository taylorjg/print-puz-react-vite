import { useLocation } from "react-router-dom";

export const RouterTestComponent = () => {
  const { pathname, state } = useLocation();

  return (
    <>
      <div>RouterTestComponent</div>
      <div>pathname: {pathname}</div>
      <div>state: {JSON.stringify(state)}</div>
    </>
  );
};
