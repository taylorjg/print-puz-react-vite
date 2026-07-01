import { useLocation } from "react-router-dom";

export const RouterTestComponent = () => {
  const { pathname, search } = useLocation();

  return (
    <>
      <div>RouterTestComponent</div>
      <div>pathname: {pathname}</div>
      <div>search: {search}</div>
    </>
  );
};
