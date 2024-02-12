import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsByAccountId } from '../../store/transactions';
import './AccountCards.css';
import TransactionCards from '../TransactionCards';
import Spinner from '../Spinner';

function AccountCards({ account }) {

    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions.accountTransactions[account.id] || []);
    const sortedTransactions = transactions.sort((a, b) => b.id - a.id);
    const limitedTransactions = sortedTransactions.slice(0, 5);
    const accounts = useSelector(state => state.accounts.accounts);
    const userId = useSelector(state => state.session.user.id);
    const [ hidden, setHidden ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);

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
                        ${account.accountBalance}
                    </div>

                    {!hidden && (
                        <>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            transactions.length === 0 ? (
                                <div className='account-transaction__empty'>No transaction history available</div>
                            ) : (
                                <div className='account-transaction__list'>
                                    {limitedTransactions.map(transaction => (
                                        <TransactionCards 
                                        key={transaction.id} 
                                        transaction={transaction} 
                                        accounts={accounts}
                                        userId={userId}
                                        />
                                    ))}
                                    {transactions.length > 5 && (
                                        <a href="/accounts/transactions">View all transactions</a>
                                    )}
                                </div>
                            )
                        )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountCards;
