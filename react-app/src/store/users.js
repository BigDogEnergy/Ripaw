// Action Types

const SET_USERS = 'users/set_users'

// Action Creators

const fetchUsers = (users) => {
    return {
        type: SET_USERS,
        payload: users
    };
};

// Thunks

export const fetchAllUsers = () => async dispatch => {
    try {
        const response = await fetch(`/api/users`);
        if (response.ok) {
            const data = await response.json();
            dispatch(fetchUsers(data.users));
            return data
        } else {
            console.log('fetchAllUsers response error', response)
        }
    } catch (error) {
        console.log('fetchAllUsers error,', error)
    };
}

// Initial State

const initialState = {
    availableUsers: [],
};

// Reducer

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                availableUsers: action.payload
            };
        default:
            return state;
    }
}
