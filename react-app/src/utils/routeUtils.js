import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userExists = useSelector((state) => state.session.user && state.session.user.id);

  return (
    <Route
      {...rest}
      render={(props) =>
        userExists ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
