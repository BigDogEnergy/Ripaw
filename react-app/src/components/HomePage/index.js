import React from "react";
import { Link } from "react-router-dom"; 
import './HomePage.css';
import accountDetails from "../../images/accountDetails.png";
import messaging from "../../images/messaging.png";
import transactions from "../../images/transactions.png";

function HomePage() {
    return ( 
        <div className="home__container">
            <Link to="/accounts" className="home__box home__box--accounts">
                <h2>Accounts</h2>
                <img src={accountDetails} alt='Account Details' />
            </Link>
            <Link to="/accounts/transactions" className="home__box home__box--transactions">
                <h2>Transactions</h2>
                <img src={transactions} alt='Transactions' />
            </Link>
            <div className="home__box home__box--sms">
                <h2>SMS</h2>
                <img src={messaging} alt='Messaging' />
            </div>
        </div>
    );
}

export default HomePage;
