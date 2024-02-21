import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsByAccountId } from '../../store/transactions';
import './AccountCards.css';
import TransactionCards from '../TransactionCards';
import Spinner from '../Spinner';
import { Link, useLocation } from 'react-router-dom';

function AccountCards({ account }) {

    const location = useLocation();
    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions.accountTransactions[account.id] || []);
    const sortedTransactions = transactions.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });
    const limitedTransactions = sortedTransactions.slice(0, 3);
    const accounts = useSelector(state => state.accounts.accounts);
    const userId = useSelector(state => state.session.user.id);
    const [ hidden, setHidden ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);

    // Determining Transactions based on current URL
    const isAccountDetailPage = location.pathname.includes(`/accounts/${account.id}/transactions`);
    const transactionsToShow = isAccountDetailPage ? sortedTransactions : limitedTransactions;

    const toggleDisplay = () => {
        setHidden(!hidden);
        if (hidden) {
            setIsLoading(true);
            dispatch (fetchTransactionsByAccountId(account.id))
                .then(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className='account-card__container' onClick={toggleDisplay}>
            <div className='account-card__details'>
                <div className='account-card__top'>

                    <div className='account-card__name'>
                        #{account.id} - {account.accountName}
                    </div>

                    <div className={`account-card__balance ${account.accountBalance < 0 ? 'account-card__balance--negative' : ''}`}>
                        
                        {account.accountBalance != null ? `$${parseFloat(account.accountBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` : null}

                    </div>

                    {!hidden && (
                        <>
                            {isLoading ? (
                                <Spinner />
                            ) : transactions.length === 0 ? (
                                <div className='account-transaction__empty'>No transaction history available</div>
                            ) : (
                                <>
                                    <div className='account-transaction__list'>
                                        {transactionsToShow.map(transaction => (
                                            <TransactionCards 
                                                key={transaction.id} 
                                                transaction={transaction} 
                                                accounts={accounts}
                                                userId={userId}
                                            />
                                        ))}
                                        {!isAccountDetailPage && <Link to={`/accounts/transactions`}>View transaction history</Link>}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountCards;
