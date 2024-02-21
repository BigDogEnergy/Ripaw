import React, { useState } from 'react';
import { splitDateTime, convertToAMPM } from '../../utils/dateUtils';
import { getAccountName } from '../../utils/accountUtils';
import './TransactionCards.css';

function TransactionCards({ transaction, userId, accounts, chosenId }) {

    const [ showDetails, setShowDetails ] = useState(false);

    // TRANSACTION DETAILS
    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';
    const isWithdrawal = chosenId ? parseInt(transaction.senderId) === parseInt(chosenId) : accounts.some(account => parseInt(account.id) === parseInt(transaction.senderId));
    const isDeposit = chosenId ? parseInt(transaction.receiverId) === parseInt(chosenId) : accounts.some(account => parseInt(account.id) === parseInt(transaction.receiverId));
    const isUserAccountTransfer = isWithdrawal && isDeposit;

    let transactionType;
    if (isUserAccountTransfer) {
        transactionType = 'User Account Transfer';
    } else if (isWithdrawal) {
        transactionType = 'Withdrawal';
    } else {
        transactionType = 'Deposit';
    }

    const cardClass = isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit';
    
    // DATE & TIME
    const { date, time } = splitDateTime(transaction.completed_at)
    const { date: createdDate, time: createdTime } = splitDateTime(transaction.created_at)
    const formattedTime = convertToAMPM(time)
    
    // ACCOUNT NAME
    const senderAccount = getAccountName(transaction.senderId, accounts, userId);
    const receiverAccount = getAccountName(transaction.receiverId, accounts, userId);

    //ETC HELPER FUNCTIONS
    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    return (
            <div className={cardClass} onClick={toggleDetails}>
                    <div className='transaction-card__visible'>
                        <div className='transaction-card__date'>
                            {createdDate}
                        </div>
                        
                        <div className='transaction-card__sections'>
                            <div className='trasaction-card__visible-left'>
                                <div>
                                    Transaction ID: {transaction.id}
                                </div>

                                {transaction.senderBalance ? 
                                    <div className='transaction-card__balance'>
                                        {isWithdrawal ? `$${parseFloat(transaction.senderBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` : `$${parseFloat(transaction.receiverBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
                                    </div> : null}

                            </div>

                            <div className='trasaction-card__visible-right'>
                                <div className='transaction-card__amount'>
                                    {isWithdrawal ? `-$` : `$`}{transaction.amount}
                                </div>
                            </div>
                        </div>
                        

                    </div>

                    {showDetails && (
                        <>
                            <div className='transaction-card__not-shown'>
                                
                                <div className='transaction-card__type'>
                                    Type: {transactionType}
                                </div>

                                <div className='transaction-card__sender'>
                                    From: #{transaction.senderId}, {senderAccount}
                                </div>
            
                                <div className='transaction-card__receiver'>
                                    To: #{transaction.receiverId}, {receiverAccount}
                                </div>

                                {isCompleted && (
                                    <div className='transaction-card__completed_at'>
                                        Processing Date: {date}, {formattedTime}
                                    </div>
                                )}
                                {/* <div className='transaction-card__created-at'>
                                    Request Received: {createdDate}, {createdTime}
                                </div> */}


                                <div className='transaction-card__status'>
                                    Status: {transaction.status}
                                </div>
                                
                                {transaction.message && (
                                    <div className='transaction-card__message'>
                                        Memo: {transaction.message}
                                    </div>
                                )}

                            
                            </div>
                        </>
                        )}
            </div>
    );
};

export default TransactionCards;