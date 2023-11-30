import React from 'react';
import './TransactionCards.css';

function TransactionCards({ transaction }) {
    return (
            <div className='transaction-card__container'>
                <div className='transaction-card__details'>
                    <div className='transaction-card__top'>
                        <div className='transaction-card__sender'>
                            From: {transaction.senderId}
                        </div>
    
                        <div className='transaction-card__receiver'>
                            To: {transaction.receiverId}
                        </div>
    
                        <div className='transaction-card__amount'>
                            Amount: {transaction.amount}
                        </div>
                        {transaction.message && (
                            <div className='transaction-card__message'>
                                Memo: {transaction.message}
                            </div>
                            )}
    
                        <div>
                            Transaction Date: {transaction.createdAt}
                        </div>
    
                        {transaction.completedAt && (
                            <div>
                                Transaction Completion Date: {transaction.completedAt}
                            </div>

                        )}
    
                        <div className='transaction-card__status'>
                            Status: {transaction.status}
                        </div>
    
                    </div>
                </div>
            </div>
    );
};

export default TransactionCards;