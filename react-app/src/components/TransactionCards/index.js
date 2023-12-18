import React, { useState } from 'react';
import './TransactionCards.css';

function TransactionCards({ transaction, getAccountName, accounts, userId }) {

    const [ showDetails, setShowDetails ] = useState(false);
    
    
    // const accountName = getAccountName(transaction.senderId, accounts, userId);
    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';

    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    const isWithdrawal = transaction.senderId === userId;
    const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';
    const cardClass = `transaction-card__container ${isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit'}`;

    return (
            <div className={cardClass} onClick={toggleDetails}>
                <div className='transaction-card__details'>
                    <div className='transaction-card__visible'>
                        
                        <div>
                            Transaction #: {transaction.id}
                        </div>
                        
                        <div className='transaction-card__amount'>
                            Amount: ${transaction.amount}
                        </div>

                        <div className='transaction-card__type'>
                         Type: {transactionType}
                        </div>

                        {isCompleted && (
                        <div className='transaction-card__completedAt'>
                            Transaction Completion Date: {transaction.completedAt}
                        </div>
                    )}

                    <div className='transaction-card__status'>
                        Status: {transaction.status}
                    </div>

                    </div>

                        {showDetails && (
                        <div className='transaction-card__details-container'>
                            <div className='transaction-card__message'>
                                Memo: {transaction.message}
                            </div>
                            <div className='transaction-card__sender'>
                                From #: {transaction.senderId}
                            </div>
        
                            <div className='transaction-card__receiver'>
                                To #: {transaction.receiverId}
                            </div>
                            
                            <div className='transaction-card__date'>
                                Transaction Date: {transaction.created_at}
                            </div>
                        </div>
                        )}
                </div>
            </div>
    );
};

export default TransactionCards;