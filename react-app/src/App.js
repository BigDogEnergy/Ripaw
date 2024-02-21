import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormModal from "./components/LoginFormModal";
import FooterIcons from "./components/FooterIcons"
import AccountsPage from "./components/AccountsPage"
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import TransactionsPage from "./components/TransactionsPage";
import MessagingPage from "./components/MessagingPage";
// import TransactionCardSingle from "./components/TransactionCardSingle"
import WelcomeMessage from "./components/WelcomeMessage"
import PrivateRoute from './utils/routeUtils'

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
              
              {/* <PrivateRoute path='/accounts/transactions/:transactionId' component={TransactionCardSingle} /> */}

              <PrivateRoute path='/accounts/transactions' component={TransactionsPage} />

              <PrivateRoute path='/accounts' component={AccountsPage} />
              
              <PrivateRoute path='/messages' component={MessagingPage} />

              <Route path="/login" >
                <LoginFormModal />
              </Route>
              
              <Route path="/signup">
                <SignupFormPage />
              </Route>
          
              <Route path="/">
                <WelcomeMessage />
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
