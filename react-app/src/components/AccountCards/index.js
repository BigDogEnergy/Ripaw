import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsByAccountId } from '../../store/transactions';
import './AccountCards.css';
import TransactionCards from '../TransactionCards';

function AccountCards({ account }) {

    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions.accountTransactions[account.id] || []);
    const limitedTransactions = transactions.slice(0, 5);
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

    function getAccountName(accountId, accounts, userId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account || account.userId !== userId) {
            return 'External Account';
        }
        return account.accountName;
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
                                    {limitedTransactions.map(transaction => (
                                        <TransactionCards 
                                        key={transaction.id} 
                                        transaction={transaction} 
                                        getAccountName={getAccountName}
                                        accounts={accounts}
                                        userId={userId}
                                        />
                                    ))}
                                    {transactions.length > 5 && (
                                        <a href="/accounts/transactions">View all transactions</a>
                                    )}
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
