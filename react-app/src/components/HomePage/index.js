import React from "react";
import './HomePage.css';
import accountDetails from "../../images/accountDetails.png"
import messaging from "../../images/messaging.png"
import transactions from "../../images/transactions.png"

function HomePage() {

    
    return ( 
        <div className="home-container">
        <div className="box accounts">
            <h2>Accounts</h2>
            <img src={accountDetails} alt='Account Details' />
        </div>
        <div className="box transactions">
            <h2>Transactions</h2>
            <img src={transactions} alt='Transactions' />
        </div>
        <div className="box sms">
            <h2>SMS</h2>
            <img src={messaging} alt='Messaging' />
        </div>
</div>
)
}

export default HomePage