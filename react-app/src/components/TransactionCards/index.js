import React, { useState } from 'react';
import './TransactionCards.css';

function TransactionCards({ transaction, getAccountName, accounts, userId }) {

    const [ showDetails, setShowDetails ] = useState(false);
    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';
    const isWithdrawal = transaction.senderId === userId;
    const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';
    const cardClass = `transaction-card__container ${isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit'}`;

    //HELPER FUNCTIONS
    function splitDateTime(dateTimeString) {

        if (!dateTimeString) {
            return { date: 'Incomplete', time: 'Incomplete' };
        }
        const [date, fullTime] = dateTimeString.split('T');
        const time = fullTime.split('.')[0]
        return { date, time };
    }

    function convertToAMPM(timeString) {
        const [hour, minute] = timeString.split(':');
        let amOrPm = 'AM';
        let adjustedHour = parseInt(hour, 10);

        if (adjustedHour >= 12) {
            amOrPm = 'PM';
            if (adjustedHour > 12) {
                adjustedHour -= 12;
            }
        }

        return `${adjustedHour}:${minute} ${amOrPm}`;
    };

    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    const { date, time } = splitDateTime(transaction.completed_at)
    const { date: createdDate, time: createdTime } = splitDateTime(transaction.created_at)
    const formattedTime = convertToAMPM(time)



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
                                From #: {transaction.senderId}
                            </div>
        
                            <div className='transaction-card__receiver'>
                                To #: {transaction.receiverId}
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