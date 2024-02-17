import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "../../store/transactions";
import { fetchAllAccounts } from "../../store/accounts";
import './TransactionsPage.css'
import TransactionCards from "../TransactionCards";
import TransactionOptions from "../TransactionOptions";
import Spinner from "../Spinner";
import { filterTransactions } from "../../utils/filterTransactions";

function TransactionsPage() {

    const dispatch = useDispatch()
    const accounts = useSelector(state => state.accounts.accounts);
    const transactions = useSelector(state => state.transactions?.transactions || []);
    const userId = useSelector(state => state.session.user.id)

    const [ isFilterLoaded, setIsFilterLoaded ] = useState(false);
    const [ isTransLoaded, setIsTransLoaded ] = useState(false);
    const [ isAccountsLoaded, setIsAccountsLoaded ] = useState(false);
    
    const [ selectedAccountId, setSelectedAccountId ] = useState(null);
    const [ selectedStatus, setSelectedStatus ] = useState(null);
    const [ transType, setTransType ] = useState(null);

    const [ filteredTransactions, setFilteredTransactions ] = useState([]);


    // HELPER FUNCTIONS

    const handleAccountChange = (e) => {
        setSelectedAccountId(e.target.value || null);
    };
    
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value || null);
    };

    const handleTypeChange =(e) => {
        setTransType(e.target.value || null);
    };

    // USE-EFFECTS

    useEffect(() => {
        dispatch(fetchAllTransactions())
            .then(() => setIsTransLoaded(true))
            .catch(error => {
                console.error(error);
                setIsTransLoaded(false);
            });
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAllAccounts())
        .then(() => setIsAccountsLoaded(true))
        .catch(error => {
            console.error(error);
            setIsAccountsLoaded(false);
        });
    }, [dispatch]);
    

    // FILTER TRANSACTIONS

    useEffect(() => {
        const transactionsArray = Array.isArray(transactions) ? transactions : Object.values(transactions);
        const filtered = filterTransactions(transactionsArray, selectedAccountId, selectedStatus, transType, userId, accounts);
        setFilteredTransactions(filtered);
        setIsFilterLoaded(true);
    }, [transactions, selectedAccountId, selectedStatus, transType, userId, accounts]);

    if (isAccountsLoaded === false || isTransLoaded === false || isFilterLoaded === false) {
        return <Spinner />
    };

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
                        <option value={account.id} key={account.id}> {account.accountName} </option>
                    ))}
                </select>
                
                        {selectedAccountId && 
                        <>
                            <select onChange={handleTypeChange} defaultValue="">
                                <option value="">All Types</option>
                                <option value="Withdrawal">Withdrawal</option>
                                <option value="Deposit">Deposit</option>
                            </select>

                            <select onChange={handleStatusChange} defaultValue="">
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Processing">Processing</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                        </>
                        }

                
                
                
            </div>
            <div>
                {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}:
            </div>

            <TransactionOptions />


            <div className='transaction-card__filtered_container'>
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                    <TransactionCards
                        key={transaction.id}
                        transaction={transaction}
                        accounts={accounts}
                        userId={userId}
                    />
                ))
            ) : (
                <div className="no-transactions__text">No transactions for this account</div>
            )}

            </div>
            

        </div>
            
        </>
    )
};

export default TransactionsPage