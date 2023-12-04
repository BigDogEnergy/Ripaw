// Action Types

const ALL_TRANSACTIONS = 'transactions/all_transactions'
const ONE_TRANSACTION = 'transactions/one_transactions'
const ACCOUNT_TRANSACTIONS = 'transactions/account_transactions'
const NEW_TRANSACTION = 'transactions/new_transactions'
const EDIT_TRANSACTION = 'transactions/edit_transaction'
const DELETE_TRANSACTION = 'transactions/delete_transaction'

// Action Creators

const fetchTransactions = transactions => {
    console.log('fetchTransactions action creator', transactions);
    return {
        type: ALL_TRANSACTIONS,
        payload: transactions
    };
};

// const fetchTransactionById = transaction => {
//     console.log('fetchTransactionById action creator', transaction);
//     return {
//         type: ONE_TRANSACTION,
//         payload: transaction
//     };
// };

const fetchAccountTransactions = ({ accountId, transactions}) => {
    console.log('fetchAccountTransactions action creator', transactions);
    return {
        type: ACCOUNT_TRANSACTIONS,
        payload: { 
            accountId, 
            transactions
        }
    };
};

const addNewTransaction = transaction => {
    console.log('addNewTransaction action creator', transaction);
    return {
        type: NEW_TRANSACTION,
        payload: transaction
    };
};

const updateTransaction = ({transactionId, updates}) => {
    console.log('updateTransaction action creator ID', transactionId);
    console.log('passed in updates for updateTransactionRequest', updates);
    return {
        type: EDIT_TRANSACTION,
        payload: {
            transactionId, 
            updates
        }
    };
};

// const cancelPendingTransaction = transaction => {
//     console.log('cancelPendingTransaction action creator', transaction);
//     return {
//         type: CANCEL_TRANSACTION,
//         payload: transaction
//     };
// };

const deleteTransaction = transactionId => {
    console.log('deleteTransaction action creator', transactionId);
    return {
        type: DELETE_TRANSACTION,
        payload: transactionId
    };
};

// Thunks

export const fetchAllTransactions = () => async dispatch => {
    try {
        const response = await fetch('/api/accounts/transactions');

        if (response.ok) {
            const data = await response.json();
            dispatch(fetchTransactions(data.transactions));
        }
    } catch (error) {
        console.log('fetchAllTransactions Error,', error)
    };
};

export const fetchTransactionsByAccountId = (accountId) => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/${accountId}/transactions`);

        if (response.ok) {
            const data = await response.json();
            dispatch(fetchAccountTransactions({accountId, transactions: data.transactions}));
        }
    } catch (error) {
        console.log(`fetchTransactionsByAccountId Error,`, error);
    }
};

export const transactionRequest = (transaction) => async dispatch => {
    try {
        console.log("passed in transaction for transcationRequest", transaction)
        const response = await fetch(`/api/accounts/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction)
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(addNewTransaction(data.data));
            return data
        } else {
            const errorData = await response.json()
            return { error: errorData }
        }
    } catch(error) {
        console.log(`transactionRequest error`, error);
    }
};

export const updateTransactionRequest = (transactionId, updates) => async dispatch => {
    try {
        console.log('passed in updates for updateTransactionRequest', updates)
        console.log('passed in transactionId for update', transactionId)
        const response = await fetch(`/api/accounts/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('updateTransactionRequest data', data)
            dispatch(updateTransaction({transactionId, updates}))
            return data
        } else {
            const errorData = await response.json()
            return { error: errorData }
        }

    } catch(error) {
        console.log('updateTransactionRequest error', error)
    }
};

export const deleteTransactionRequest = (transactionId) => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/transactions/${transactionId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const data = await response.json()
            console.log('deleteTransactionRequest id', transactionId)
            dispatch(deleteTransaction(transactionId))
            return data
        } else {
            const errorData = await response.json()
            return { error: errorData }
        }
    } catch(error) {
        console.log('deleteTransactionRequest error', error)
    }
}

// Initial State

const initialState = {
    transactions: {},
    singleTransaction: {},
    accountTransactions: {}
};

// Reducer

export default function reducer( state = initialState, action) {

    let newState = { ...state};

    switch(action.type) {
        case ALL_TRANSACTIONS:
            newState.transactions = action.payload
            return newState
        case ONE_TRANSACTION:
            newState.singleTransaction = action.payload
            return newState
        case ACCOUNT_TRANSACTIONS:
            const { accountId, transactions } = action.payload
            newState.accountTransactions[accountId] = transactions
            return newState
        case NEW_TRANSACTION:
            const { id } = action.payload
            newState.transactions[id] = action.payload
            return newState
        case EDIT_TRANSACTION:
            const { transactionId, updates } = action.payload
            newState.transactions[transactionId] = { ...newState.transactions[transactionId], ...updates };
            return newState
        case DELETE_TRANSACTION:
            delete newState.transactions[action.payload.id]
            return newState
        default:
            return newState   
    };
};