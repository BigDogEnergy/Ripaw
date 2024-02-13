import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import FooterIcons from "./components/FooterIcons"
import AccountsPage from "./components/AccountsPage"
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import TransactionsPage from "./components/TransactionsPage";
import MessagingPage from "./components/MessagingPage";
import TransactionCardSingle from "./components/TransactionCardSingle"
import HomepageBoard from "/components/Homepage/index.js"

function App() {
  const dispatch = useDispatch();
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
              
              <Route exact path='/accounts/transactions/:transactionId'>
                <TransactionCardSingle />
              </Route>
              
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
          
              <Route path="/">
                <HomepageBoard />
              </Route>

            </Switch>
          </div>
          <FooterIcons/>
        </>
      )}
    </>
  );
}

export default App;
