// Action Types

const SET_MESSAGES = 'messages/set_messages';
const ADD_MESSAGE = 'messages/add_message';
const REMOVE_MESSAGE = 'messages/remove_message';

// Action Creators

const setMessages = (conversationId, messages) => ({
    type: SET_MESSAGES,
    payload: { conversationId, messages }
});

const addMessage = (conversationId, message) => ({
    type: ADD_MESSAGE,
    payload: { conversationId, message }
});

const removeMessage = (conversationId, messageId) => ({
    type: REMOVE_MESSAGE,
    payload: { conversationId, messageId }
});


// Thunks

export const fetchConversation = (userId, targetId) => async dispatch => {
    try {
        const response = await fetch(`/api/messages/${userId}/${targetId}`);
        if (!response.ok) {
            console.log({errorMessage: 'fetchConversation thunk response error', response});
            return;
        } else {
            const messages = await response.json();
            dispatch(setMessages( targetId, messages ));
        }
        
    } catch (error) {
        console.error({ errorMessage: error });
    };
};

export const deleteMessageThunk = (conversationId, messageId) => async dispatch => {
    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.log({errorMessage: 'deleteMessage thunk response error'});
        }
        else {
            dispatch(removeMessage({ conversationId, messageId }));
        }
    } catch (error) {
        console.error({ errorMessage: error });
    }
};


// Initial State

const initialState = {
    chats: {},
}

// Reducer

export default function reducer( state = initialState, action) {

    let newState = { ...state};

    switch(action.type) {
        case SET_MESSAGES:
            const { conversationId, messages } = action.payload;
            newState.chats[conversationId] = {  messages: Array.isArray(messages) ? [...messages] : []  };
            return newState;
        case ADD_MESSAGE:
            const { conversationId: targetId, message } = action.payload;
            const existingMessages = newState.chats[targetId]?.messages || [];
            newState.chats[targetId] = { messages: [...existingMessages, message] };
            return newState;
        case REMOVE_MESSAGE:
            const { conversationId: convoId, messageId } = action.payload;
            if (newState.chats[convoId]) {
                newState.chats[convoId].messages = newState.chats[convoId].messages.filter(msg => msg.id !== messageId);
            }
            return newState;
        default:
            return newState;
    };
};