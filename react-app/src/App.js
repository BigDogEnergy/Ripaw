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
import WelcomeMessage from "./components/WelcomeMessage"
import PrivateRoute from './utils/routeUtils'
import RouteChangeTracker from "./components/RouteChangeTracker";
import ReactGA from 'react-ga';



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  //Google Analytics Related
  const TRACKING_ID = "G-6KS8P37NGV";
  ReactGA.initialize(TRACKING_ID);

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
          
          <div className="GA-related">
            <RouteChangeTracker />
          </div>
        </>
      )}
    </>
  );
}

export default App;
