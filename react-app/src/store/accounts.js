// Action Types

const ALL_ACCOUNTS = 'accounts/all_accounts'
const ONE_ACCOUNT = 'accounts/one_account'
const ADD_ACCOUNT = 'accounts/add_account'
const EDIT_ACCOUNT = 'accounts/edit_account'
const REMOVE_ACCOUNT = 'accounts/remove'

// Action Creators

const fetchAccounts = accounts => {
    return {
        type: ALL_ACCOUNTS,
        payload: accounts
    };
};

const fetchAccountById = account => {
    return {
        type: ONE_ACCOUNT,
        payload: account
    };
};

const addNewAccount = accountName => {
    return {
        type: ADD_ACCOUNT,
        payload: accountName
    };
};

const updateAccountDetails = account => {
    return {
        type: EDIT_ACCOUNT,
        payload: account
    };
};

const deleteAccountById = account => {
    return {
        type: REMOVE_ACCOUNT,
        payload: account
    };
};

// Thunks

export const fetchAllAccounts = () => async dispatch => {
    try {
        const response = await fetch('/api/accounts');

        if (response.ok) {
            const data = await response.json();
            dispatch(fetchAccounts(data.accounts));
        }
    } catch (error) {
        console.error('fetchAllAccounts Error,', error)
    };
};

export const fetchOneAccount = accountId => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/${accountId}`)

        if (response.ok) {
            const account = await response.json();
            dispatch(fetchAccountById(account))
        }
    } catch (error) {
        console.error('fetchOneAccount error', error)
    };
};

export const createAccount = accountName => async dispatch => {
    try {
        const response = await fetch(`/api/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(accountName)
        });

        if (response.ok) {
            const newAccount = await response.json();
            dispatch(addNewAccount(newAccount))
            return newAccount
        };
    } catch (error) {
        console.log('createAccount error', error)
    };
};

export const updateAccount = (accountName, accountId) => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(accountName)
        });

        if (response.ok) {
            const targetUpdate = await response.json()
            dispatch(updateAccountDetails(targetUpdate))
            return targetUpdate
        };
    } catch (error) {
        console.log('updateAccount error', error)
    };
};

export const deleteAccount = (accountId) => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/${accountId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const account = await response.json()
            dispatch(deleteAccountById(account))
            return account
        }
    } catch (error) {
        console.log('deleteAccount error', error)
    }
}
// Initial State

const initialState = {
    accounts: {},
    singleAccount: {}
}

// Reducer

export default function reducer(state = initialState, action) {

    let newState = { ...state}

    switch (action.type) {
        case ALL_ACCOUNTS:
            newState.accounts = action.payload
            return newState
        case ONE_ACCOUNT:
            newState.singleAccount = action.payload
            return newState
        case ADD_ACCOUNT:
            newState.accounts[action.payload.id] = action.payload
            return newState
        case EDIT_ACCOUNT:
            newState.accounts[action.payload.id] = action.payload
            return newState
        case REMOVE_ACCOUNT:
            delete newState.accounts[action.payload.id]
            return newState
        default:
            return state;
    }

}