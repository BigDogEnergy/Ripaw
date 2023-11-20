import React from 'react';
import { Link } from 'react-router-dom';
import './SingleAccountCard.css';

function SingleAccount({ account }) {
    return (
        <Link className="account-card__link-container" to={`/accounts/${account.id}/tranasctions`}>
            <div className='account-card__container'>
                <div className='account-card__details'>
                    <div className='account-card__top'>
                        <div className='account-card__name'>
                            {account.accountName}
                        </div>
                        <div className='account-card__balance'>
                            {account.accountBalance}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SingleAccount;
