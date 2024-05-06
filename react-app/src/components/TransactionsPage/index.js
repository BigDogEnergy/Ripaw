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
    
    const [ selectedAccountId, setSelectedAccountId ] = useState("");
    const [ selectedStatus, setSelectedStatus ] = useState(null);
    const [ transType, setTransType ] = useState(null);

    const [ filteredTransactions, setFilteredTransactions ] = useState([]);

    const transactionsPerPage = 5; 
    const [currentPage, setCurrentPage] = useState(1);

    // HELPER FUNCTIONS

    const handleAccountChange = (e) => {
        setSelectedAccountId(e.target.value || null);
        setSelectedStatus(null);
        setTransType(null);
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

    useEffect(() => {
        if (accounts.length > 0) {
          setSelectedAccountId(accounts[0].id);
        }
      }, [accounts]);
    

    // FILTER TRANSACTIONS

    useEffect(() => {
        const transactionsArray = Array.isArray(transactions) ? transactions : Object.values(transactions);
        const filtered = filterTransactions(transactionsArray, selectedAccountId, selectedStatus, transType, userId, accounts);
        setFilteredTransactions(filtered);
        setIsFilterLoaded(true);
    }, [transactions, selectedAccountId, selectedStatus, transType, userId, accounts]);

    // PAGINATION-RELATED
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    //LOADING CHECK
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
                <select onChange={handleAccountChange} defaultValue={accounts.length > 0 ? accounts[0].id : ""}>
                    {accounts.map(account => (
                        <option value={account.id} key={account.id}> {account.id}:  {account.accountName} </option>
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



            {filteredTransactions.length > 0 ? (
                <>
                    <TransactionOptions />
                    {currentTransactions.map(transaction => (
                        <TransactionCards
                            key={transaction.id}
                            transaction={transaction}
                            accounts={accounts}
                            userId={userId}
                            chosenId={selectedAccountId}
                        />
                    ))}
                    {/* PAGINATION RELATED */}
                        <div className='transaction-pagination__main'>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button 
                                    key={index + 1} 
                                    onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                </>
            ) : (
                <div className="no-transactions__text">No transactions for this account</div>
            )}


            

        </div>
            
        </>
    )
};

export default TransactionsPage