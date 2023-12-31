import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "../../store/transactions";
import { fetchAllAccounts } from "../../store/accounts";
import './TransactionsPage.css'
import TransactionCards from "../TransactionCards";
import TransactionOptions from "../TransactionOptions";

function TransactionsPage() {

    const dispatch = useDispatch()
    const accounts = useSelector(state => state.accounts.accounts);
    const transactions = useSelector(state => state.transactions.transactions);
    const userId = useSelector(state => state.session.user.id)
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ selectedAccountId, setSelectedAccountId ] = useState(null);
    const [ selectedStatus, setSelectedStatus ] = useState(null);
    const [ filteredTransactions, setFilteredTransactions ] = useState([]);
    const [ transType, setTransType ] = useState(null);

    function getAccountName(accountId, accounts, userId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account || account.userId !== userId) {
            return 'External Account';
        }
        return account.accountName;
    };
    

    useEffect(() => {
        Promise.all([dispatch(fetchAllTransactions()), dispatch(fetchAllAccounts())])
            .then(() => setIsLoaded(true))
            .catch(error => {
                console.log(error);
                setIsLoaded(false);
            });
    }, [dispatch]);
    

    useEffect(() => {
        let filtered = transactions;
        
        if (selectedAccountId) {
            filtered = filtered.filter(transaction => 
                transaction.senderId === selectedAccountId || transaction.receiverId === selectedAccountId
            );
    
            if (transType === 'Withdrawal') {
                filtered = filtered.filter(transaction => transaction.senderId === selectedAccountId);
            } else {
                filtered = filtered.filter(transaction => transaction.receiverId === selectedAccountId);
            }
        } else {
            setSelectedAccountId(null);
            setTransType(null);
        }
        
        if (selectedStatus) {
            filtered = filtered.filter(transaction => transaction.status === selectedStatus);
        } else {
            setSelectedStatus(null);
        }
        
        if (filtered.length > 0) {
            filtered.sort((a, b) => b.id - a.id)
        }
        
        setFilteredTransactions(filtered);
    }, [accounts, selectedAccountId, selectedStatus, transactions, transType]);

    if(!isLoaded) {
        return <div>Loading...</div>
    }

    const handleAccountChange = (e) => {
        const accountId = parseInt(e.target.value, 10);
        setSelectedAccountId(accountId ? parseInt(accountId, 10) : null);
    };
    
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value || null);
    };

    const handleTypeChange =(e) => {
        setTransType(e.target.value || null);
    }



    return (
        <>
        <div className="transaction-page__main">
            <div className="transaction-filter__dropdowns">
                <div className="transaction-filter__title">
                    Filters:         
                </div>
                <select onChange={handleAccountChange} defaultValue="">
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.accountName}</option>
                    ))}
                </select>
                {selectedAccountId && (
                    <select onChange={handleTypeChange} defaultValue="">
                        <option value="">All Types</option>
                        <option value="Withdrawal">Withdrawal</option>
                        <option value="Deposit">Deposit</option>
                    </select>
                )}
                <select onChange={handleStatusChange} defaultValue="">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div>
                {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}:
            </div>

            <div className='transaction-card__filtered_container'>
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                    <TransactionCards
                        key={transaction.id}
                        transaction={transaction}
                        getAccountName={getAccountName}
                        accounts={accounts}
                        userId={userId}
                    />
                ))
            ) : (
                <div className="no-transactions__text">No transactions for this account</div>
            )}

            </div>
            <div className="transaction-card__options">
                <TransactionOptions />
            </div>
        </div>
            
        </>
    )
};

export default TransactionsPage