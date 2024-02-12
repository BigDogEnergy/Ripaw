import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import './TransactionCardSingle.css';
import { splitDateTime, convertToAMPM } from '../../utils/dateUtils';
import { fetchSingleTransaction } from '../../store/transactions'
import { getAccountName, checkAccountOwner } from '../../utils/accountUtils';
import { fetchAllAccounts } from '../../store/accounts';
import Spinner from '../Spinner';

function TransactionCardSingle() {

    const [ isTransLoaded, setIsTransLoaded ] = useState(false);
    const [ isAccountLoaded, setIsAccountLoaded ] = useState(false);
    const [ isAuthorized, setIsAuthorized ] = useState(false);

    const accounts = useSelector(state => state.accounts.accounts);
    const userId = useSelector(state => state.session.user.id);

    const { transactionId } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()
    
    
    // USE EFFECTS FOR OUR DATA
    useEffect(()=> {
        dispatch(fetchSingleTransaction(transactionId)) 
        .then(() => setIsTransLoaded(true))
            .catch(error => {
                console.error(error)
                setIsTransLoaded(false)
            })
    }, [dispatch, transactionId])

    useEffect(() => {
        dispatch(fetchAllAccounts()) 
        .then(() => setIsAccountLoaded(true))
            .catch(error => {
                console.error(error)
                setIsAccountLoaded(false)
            })
    }, [dispatch])

    useEffect(()=> {
        if (!userId) {
            history.push('/')
        }
    }, [userId, history])


    // TRANSACTION + AUTHORIZATION RELATED 
    const transaction = useSelector(state => state.transactions?.singleTransaction);
    useEffect(() => {
        if (isTransLoaded && isAccountLoaded && transaction) {
            const senderAuthorized = checkAccountOwner(transaction.senderId, accounts, userId);
            const receiverAuthorized = checkAccountOwner(transaction.receiverId, accounts, userId);
            
            // User is authorized if they are the sender or receiver
            if (senderAuthorized || receiverAuthorized) {
                setIsAuthorized(true);
            } else {
                console.error('Unauthorized access attempt to transaction');
                setIsAuthorized(false); 
            }
        }
    }, [transaction, accounts, userId, isTransLoaded, isAccountLoaded, history]);

    if (isTransLoaded === false || isAccountLoaded === false) {
        return <Spinner />
    };

    if (!transaction) {
        return <div>Transaction not found</div>;
    };

    if (!isAuthorized) {
        return <div>Unauthorized Action</div>;
    }

    const isCompleted = transaction.status !== 'Pending' && transaction.status !== 'Processing' && transaction.status !== 'Cancelled';
    const isWithdrawal = transaction.senderId === userId;
    const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';
    const cardClass = `transaction-card__container ${isWithdrawal ? 'transaction-card__container--withdrawal' : 'transaction-card__container--deposit'}`;
    const { date, time } = splitDateTime(transaction.completed_at)
    const { date: createdDate, time: createdTime } = splitDateTime(transaction.created_at)
    const formattedTime = convertToAMPM(time)
    const senderAccount = getAccountName(transaction.senderId, accounts, userId);
    const receiverAccount = getAccountName(transaction.receiverId, accounts, userId);

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
                                From: #{transaction.senderId}, {senderAccount}
                            </div>
        
                            <div className='transaction-card__receiver'>
                                To: #{transaction.receiverId}, {receiverAccount}
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