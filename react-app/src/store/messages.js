// Action Types

const SET_MESSAGES = 'messages/set_messages';
// const ADD_MESSAGE = 'messages/add_message';
const REMOVE_MESSAGE = 'messages/remove_message';
// const EDIT_MESSAGE = 'messages/edit_message'

// Action Creators

const setMessages = (conversationId, messages) => ({
    type: SET_MESSAGES,
    payload: { conversationId, messages }
});

// const addMessage = (conversationId, message) => ({
//     type: ADD_MESSAGE,
//     payload: { conversationId, message }
// });

const removeMessage = (conversationId, messageId) => ({
    type: REMOVE_MESSAGE,
    payload: { conversationId, messageId }
});

// const editMessage = (conversationId, messageId, newContent) => ({
//     type: EDIT_MESSAGE,
//     payload: { conversationId, messageId, newContent }
// });


// Thunks

// export const incomingMessage = (conversationId, message) => async dispatch => {
//     try {
//         dispatch(addMessage(conversationId, message));
//     } catch(error) { 
//         console.log(error)
//     }
// }

export const fetchConversation = (userId, targetId) => async dispatch => {
    try {
        const response = await fetch(`/api/messages/${userId}/${targetId}`);
        if (!response.ok) {
            console.log({errorMessage: 'fetchConversation thunk response error', response});
            return;
        } else {
            const messages = await response.json();
            dispatch(setMessages( targetId, messages ));
            return;
        }
        
    } catch (error) {
        console.error({ errorMessage: error });
    };
};

export const deleteMessageThunk = (messageId) => async dispatch => {
    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.log({errorMessage: 'deleteMessage thunk response error'});
        }
        else {
            dispatch(removeMessage(messageId));
        }
    } catch (error) {
        console.error({ errorMessage: error });
    }
};

// export const editMessageThunk = (messageId, newContent) => async dispatch => {
//     try {
//         const response = await fetch(`/api/messages/${messageId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({content: newContent})
//         });
//         if (!response.ok) {
//             console.log({errorMessage: 'editMessage thunk response error'});
//         }
//         else {
//             dispatch(editMessage(messageId, newContent));
//         }
//     }
//     catch (error) {
//         console.error({ errorMessage: error });
//     }
// }


// Initial State

const initialState = {
    chats: {},
}

// Reducer

export default function reducer(state = initialState, action) {
    let newState = { ...state };

    switch (action.type) {
        case SET_MESSAGES: {
            const { conversationId, messages } = action.payload;
            newState.chats[conversationId] = { messages: Array.isArray(messages) ? [...messages] : [] };
            return newState;
        }
        // case EDIT_MESSAGE: {
        //     const { conversationId, messageId, newContent } = action.payload;
        //     if (newState.chats[conversationId]) {
        //         newState.chats[conversationId].messages = newState.chats[conversationId].messages.map(message => {
        //             if (message.id === messageId) {
        //                 return { ...message, content: newContent };
        //             }
        //             return message;
        //         });
        //     }
        //     return newState;
        // }        
        case REMOVE_MESSAGE: {
            const { conversationId, messageId } = action.payload;
            if (newState.chats[conversationId]) {
                newState.chats[conversationId].messages = newState.chats[conversationId].messages.filter(msg => msg.id !== messageId);
            }
            return newState;
        }
        default:
            return newState;
    }
}
