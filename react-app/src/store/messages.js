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

export const fetchConversation = (userId, senderId) => async dispatch => {
    try {
        const response = await fetch(`/api/messages/${userId}/${senderId}`);
        if (!response.ok) {
            throw new Error({'error': 'fetchConversation thunk response error'});
        }
        const messages = await response.json();
        dispatch(setMessages({ conversationId: senderId, messages }));
    } catch (error) {
        console.error({ errorMessage: error });
    };
};


// Initial State

const initialState = {
    chatData: {},
}

// Reducer

export default function reducer( state = initialState, action) {

    let newState = { ...state};

    switch(action.type) {
        case SET_MESSAGES:
            const { conversationId, messages } = action.payload;
            newState.chatData[conversationId] = { messages: [...messages] };
            return newState;
        case ADD_MESSAGE:
            const { conversationId: newId, message } = action.payload;
            const existingMessages = newState.chatData[newId]?.messages || [];
            newState.chatData[newId] = { messages: [...existingMessages, message] };
            return newState;
        case REMOVE_MESSAGE:
            const { conversationId: convoId, messageId } = action.payload;
            if (newState.chatData[convoId]) {
                newState.chatData[convoId].messages = newState.chatData[convoId].messages.filter(msg => msg.id !== messageId);
            }
            return newState;
            
            
    };
};