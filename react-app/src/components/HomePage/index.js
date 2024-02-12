import React from "react";
import { Link } from "react-router-dom"; 
import './FooterIcons.css';
import accountDetails from "../../images/accountDetails.png";
import messaging from "../../images/messaging.png";
import transactions from "../../images/transactions.png";
import { useSelector } from "react-redux";

function FooterIcons() {

    const sessionUser = useSelector(state => state.session.user)

    return ( 
        <>
        {sessionUser ? (
            <>
                <div className="home__container">
                    <div className='link-tile'>
                        <Link to="/accounts" className="home__box--accounts">
                            <div className="home__accounts">Accounts</div>
                            <img src={accountDetails} alt='Account Details' />
                        </Link>
                    </div>
                    <div className='link-tile'>
                        <Link to="/accounts/transactions" className="home__box--transactions">
                            <div className="home__transactions">Transactions</div>
                            <img src={transactions} alt='Transactions' />
                        </Link>
                    </div>
                    <div className='link-tile'>
                        <Link to="/messages" className="home__box--messaging">
                            <div className="home__messaging">Messaging</div>
                            <img src={messaging} alt='Messaging' />
                        </Link>
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className='home-welcome__container'>
                    <div className='home-welcome__text'>
                    Welcome, please sign in.
                    </div>
                </div>
            </>
        )}
            
        </>
        
    );
}

export default FooterIcons;
