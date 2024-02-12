import React, { useState } from 'react';
import { splitDateTime, convertToAMPM } from '../../utils/dateUtils';
import { getAccountName } from '../../utils/accountUtils';
import './TransactionCards.css';

function TransactionCards({ transaction, userId, accounts }) {

    const [ showDetails, setShowDetails ] = useState(false);
    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';
    const isWithdrawal = transaction.senderId === userId;
    const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';
    const cardClass = `transaction-card__container ${isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit'}`;

    //HELPER FUNCTIONS
    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    const { date, time } = splitDateTime(transaction.completed_at)
    const { date: createdDate, time: createdTime } = splitDateTime(transaction.created_at)
    const formattedTime = convertToAMPM(time)
    const senderAccount = getAccountName(transaction.senderd, accounts, userId);
    const receiverAccount = getAccountName(transaction.receiverId, accounts, userId)

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
                        <div className='transaction-card__completed_at'>
                            Processing Date: {date}, {formattedTime}
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
                                From: #{transaction.senderId}, {senderAccount}
                            </div>
        
                            <div className='transaction-card__receiver'>
                                To: #{transaction.receiverId}, {receiverAccount}
                            </div>
                            
                            <div className='transaction-card__date'>
                                Processing Started: {createdDate}, {createdTime}
                            </div>
                        </div>
                        )}
                </div>
            </div>
    );
};

export default TransactionCards;