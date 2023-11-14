// Action Types

const ALL_ACCOUNTS = 'accounts/all_accounts'
const ONE_ACCOUNT = 'accounts/one_account'
const ADD_ACCOUNT = 'accounts/add_account'
const EDIT_ACCOUNT = 'accounts/edit_account'
const REMOVE_ACCOUNT = 'accounts/remove'

// Action Creators

const fetchAccounts = accounts => {
    console.log('fetchAccounts action creator', accounts);
    return {
        type: ALL_ACCOUNTS,
        payload: accounts
    };
};

const fetchAccountById = account => {
    console.log('fetchAccountById action creator', account);
    return {
        type: ONE_ACCOUNT,
        payload: account
    };
};

const addNewAccount = account => {
    console.log('addNewAccount action creator', account)
    return {
        type: ADD_ACCOUNT,
        payload: account
    };
};

const updateAccountDetails = account => {
    console.log('UpdateAccountDetails action creator', account)
    return {
        type: EDIT_ACCOUNT,
        payload: account
    };
};

const deleteAccountById = account => {
    console.log('deleteAccountById action creator', account)
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
        console.log('fetchAllAccounts Error,', error)
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
        console.log('fetchOneAccount error', error)
    };
};

export const createAccount = account => async dispatch => {
    try {
        const response = await fetch(`/api/accounts`, {
            method: 'POST',
            body: JSON.stringify(account)
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

export const updateAccount = (account, accountId) => async dispatch => {
    try {
        const response = await fetch(`/api/accounts/${accountId}`, {
            method: 'PUT',
            body: JSON.stringify(account)
        });

        if (response.ok) {
            const account = await response.json()
            dispatch(updateAccountDetails(account))
            return account
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
            const account = response.json()
            dispatch(deleteAccountById(account))
            return account
        }
    } catch (error) {
        console.log('deleteAccount error', error)
    }
}
// Initial State

const initialState = {
    accounts: {}
}

// Reduer

export default function reducer(state = initialState, action) {

    let newState = { ...state}

    switch (action.type) {
        case ALL_ACCOUNTS:
            newState.accounts = action.payload;
            return newState
        default:
            return state;
    }

}