import React, { useState, useEffect } from "react";
// import { io } from 'socket.io-client';
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import HomePage from "./components/HomePage"
import AccountsPage from "./components/AccountsPage"
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import TransactionsPage from "./components/TransactionsPage";
import MessagingPage from "./components/MessagingPage";

function App() {
  const dispatch = useDispatch();
  // const currentUser = useSelector(state => state.session.user);
  // const [socket, setSocket] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));

  }, [dispatch]);





  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <div className="app-main__content">
            <Switch>
              <Route exact path='/accounts/transactions'>
                <TransactionsPage />
              </Route>
              <Route path='/accounts'>
                <AccountsPage />
              </Route>
              <Route path="/login" >
                <LoginFormPage />
              </Route>
              <Route path="/signup">
                <SignupFormPage />
              </Route>
              <Route path="/messages">
                <MessagingPage />
              </Route>
            </Switch>
          </div>
          <HomePage/>
        </>
      )}
    </>
  );
}

export default App;
