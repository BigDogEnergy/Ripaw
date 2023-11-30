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
    const transactions = useSelector(state => state.transactions.transactions)
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ selectedAccountId, setSelectedAccountId ] = useState(null);
    const [ selectedStatus, setSelectedStatus ] = useState(null);
    const [ filteredTransactions, setFilteredTransactions ] = useState([]);

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

        //Filter based on select account
        if (selectedAccountId) {
            filtered = filtered.filter(transaction => transaction.senderId === selectedAccountId || transaction.receiverId === selectedAccountId);
        }

        //Filter based on selected status
        if (selectedStatus) {
            filtered = filtered.filter(transaction => transaction.status === selectedStatus);
        }

        setFilteredTransactions(filtered);
    }, [selectedAccountId, selectedStatus, transactions]);

    if(!isLoaded) {
        return <div>Loading...</div>
    }

    const handleAccountChange = (e) => {
        const accountId = parseInt(e.target.value, 10);
        if (!isNaN(accountId)) {
            setSelectedAccountId(accountId);
        } else {
            setSelectedAccountId(null);
        }
    };
    
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    return (
        <>
            <div className="transaction-filter__dropdowns">
                <select onChange={handleAccountChange} defaultValue="">
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.accountName}</option>
                    ))}
                </select>
                <select onChange={handleStatusChange} defaultValue="">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div className='transaction-card__container'>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(transaction => (
                        <TransactionCards key={transaction.id} transaction={transaction} />
                    ))
                ) : (
                    <div className="no-transactions__text">No transactions for this account</div>
                )}
            </div>
            <div className="transaction-card__options">
                <TransactionOptions />
            </div>
        </>
    )
};

export default TransactionsPage