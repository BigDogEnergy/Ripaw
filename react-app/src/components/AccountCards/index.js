import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsByAccountId } from '../../store/transactions';
import './AccountCards.css';
import TransactionCards from '../TransactionCards';

function AccountCards({ account }) {

    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions.accountTransactions[account.id] || []);
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
                            {account.accountName}
                        </div>

                        <div className='account-card__balance'>
                            {account.accountBalance}
                        </div>

                        {!hidden && (
                            <>
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <div className='account-transaction__list'>
                                    {transactions.map(transaction => (
                                        <TransactionCards key={transaction.id} transaction={transaction} />
                                    ))}
                                </div>
                                )}
                            </>
                           
                        )}
                    </div>
                </div>
            </div>
    );
};

export default AccountCards;
