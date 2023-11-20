// Action Types

const ALL_TRANSACTIONS = 'transactions/all_transactions'
const ONE_TRANSACTION = 'transactions/one_transactions'
const NEW_TRANSACTION = 'transactions/new_transactions'
const EDIT_TRANSACTION = 'transactions/edit_transaction'
const CANCEL_TRANSACTION = 'transactions/cancel_transaction'
const DELETE_TRANSACTION = 'transactions/delete_transaction'

// Action Creators

const fetchTransactions = transactions => {
    console.log('fetchTransactions action creator', transactions);
    return {
        type: ALL_TRANSACTIONS,
        payload: transactions
    };
};

const fetchTransactionById = transaction => {
    console.log('fetchTransactionById action creator', transaction);
    return {
        type: ONE_TRANSACTION,
        payload: transaction
    };
};

const addNewTransaction = transaction => {
    console.log('addNewTransaction action creator', transaction);
    return {
        type: NEW_TRANSACTION,
        payload: transaction
    };
};

const updateTransaction = transaction => {
    console.log('updateTransaction action creator', transaction);
    return {
        type: EDIT_TRANSACTION,
        payload: transaction
    };
};

const cancelPendingTransaction = transaction => {
    console.log('cancelPendingTransaction action creator', transaction);
    return {
        type: CANCEL_TRANSACTION,
        payload: transaction
    };
};

const deleteTransaction = transaction => {
    console.log('deleteTransaction action creator', transaction);
    return {
        type: DELETE_TRANSACTION,
        payload: transaction
    };
};

// Thunks

// Initial State

const initialState = {
    transactions: {}
};

// Reducer