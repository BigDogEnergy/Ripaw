import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import './TransactionCardSingle.css';
import { splitDateTime, convertToAMPM } from '../../utils/dateUtils';
import { fetchSingleTransaction } from '../../store/transactions'

function TransactionCardSingle() {

    const { transactionId } = useParams();
    const dispatch = useDispatch()
    const history = useHistory
    const userId = useSelector(state => state.session.user.id);

    if (!userId) {
        history.push('/')
    };

    useEffect(()=> {
        dispatch(fetchSingleTransaction(transactionId))
    }, [dispatch, transactionId]);

    const transaction = useSelector(state => state.transactions.singleTransaction);
    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';
    const isWithdrawal = transaction.senderId === userId;
    const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';
    const cardClass = `transaction-card__container ${isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit'}`;
    const { date, time } = splitDateTime(transaction.completed_at)
    const { date: createdDate, time: createdTime } = splitDateTime(transaction.created_at)
    const formattedTime = convertToAMPM(time)

    return (
            <div className={cardClass}>
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
                </div>
            </div>
    );
};

export default TransactionCardSingle;