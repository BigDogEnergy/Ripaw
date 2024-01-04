import { useSocket } from "../../context/SocketProvider"
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchConversation, deleteMessageThunk } from "../../store/messages";
import { fetchAllUsers } from "../../store/users";
import UserTiles from "../MessagingUserTile";
import MessageContentTiles from "../MessagingContentTile";
import MessageOptionsDropdownMenu from "../MessageOptionsDropdown";
import './MessagingPage.css'

export default function MessagingPage() {

    const socket = useSocket();
    const history = useHistory();
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.messages.chats);
    const currentUser = useSelector(state => state.session.user.id);
    const [ activeConversation, setActiveConversation ] = useState(null);
    const [ targetUser, setTargetUser ] = useState('');
    const [ content, setContent ] = useState('');
    const [ usersLoading, setUsersLoading ] = useState(false);
    const [ convoLoading, setConvoLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ showDropdown, setShowDropdown ] = useState(false);

    // Socket commands
    // TO DO:
    // These need to be moved into the socket provider so we can encapsulate things better.

    const sendMessage = () => {
        if (socket) {
            console.log('Socket Message')
            socket.emit('message', { 
                receiver_id: targetUser,
                sender_id: currentUser, 
                content: content, 
            });
            setContent('');   
            
            
        } else {
            setErrorMessage('Socket not connected')
            console.log(errorMessage);
        }
    };

    const deleteMessage = (messageId) => {
        if (socket) {
            socket.emit('delete_message', {
                id: messageId
            });
            console.log('delete_message', messageId)
        } else {
            setErrorMessage('Socket not connected')
            console.log(errorMessage);
        }
    };

    useEffect(() => {
        
        
        dispatch(fetchAllUsers()).then(() => {
            setUsersLoading(false);
        });

        const newMessageHandler = async (message) => {
        
            if ((message.receiver_id === targetUser || message.sender_id === targetUser) &&
            (message.receiver_id === currentUser || message.sender_id === currentUser)) {
                try {
                    setConvoLoading(true);
                    await dispatch(fetchConversation(currentUser, targetUser));
                    setConvoLoading(false);
                } catch (error) {
                    setErrorMessage(error)
                    console.log(errorMessage);
                }
            }
        };


        const deleteMessageHandler = async (message) => {
            if (currentUser) {
                try {
                    console.log('deleteMessageHandler', message.id)
                    setConvoLoading(true);
                    await dispatch(deleteMessageThunk(message.id))
                    setConvoLoading(false);
                } catch (error) {
                    setErrorMessage(error)
                    console.log(errorMessage)
                    setConvoLoading(false);
                }
            }

        };

        socket.on('new_message', newMessageHandler);
        socket.on('delete_message', deleteMessageHandler);

        return () => {
            socket.off('new_message', newMessageHandler);
            socket.off('delete_message', deleteMessageHandler);
        };
    
    }, [dispatch, currentUser, targetUser, socket, conversations, convoLoading]);
    
    // User Action Handlers

    const handleConversationSelect = (targetUser) => {
        dispatch(fetchConversation(currentUser, targetUser)).then(() => {
            setActiveConversation(targetUser);
        });
    };
    
    const handleInputChange = (e) => {
        setContent(e.target.value);
    };

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };


    if (!currentUser) {
        history.push('/')
        return null;
    }
    else {

        if (usersLoading) {
            return <div>Loading...</div>;
        };

        // This is a PLACEHOLDER for presentation. Update later.
        // This will get the messages for the active conversation
        // or return an empty array if there are no messages or if no conversation is selected
        const currentMessages = activeConversation ? conversations[activeConversation]?.messages || [] : [];

        // FOR DELETE
        const sentMessages = currentMessages.filter(message => message.sender_id === currentUser);
        const lastMessageId = sentMessages.length > 0 
            ? sentMessages[sentMessages.length - 1].id 
            : null;


        return (
            <>
                <div className='messenger-main__container'>
                    
                    <div className='messenger-userlist__container'>
                        {!usersLoading && <UserTiles 
                            setTargetUser={setTargetUser} 
                            handleConversationSelect={handleConversationSelect} 
                        />}
                    </div>

                    <div className='messenger-convo__container'>
                        <div className='messenger-content__tile'>
                            {!convoLoading && <MessageContentTiles 
                                messages={currentMessages}
                            />}
                        </div>
                            
                        <div className='messenger-input__container'>
                            <button
                             className='messenger-options__button'
                             onClick={toggleDropdown} 
                             aria-label="Open options"
                             >
                                <i className="fas fa-plus"></i>
                            </button>
                                {showDropdown && <MessageOptionsDropdownMenu 
                                    deleteMessage={deleteMessage}
                                    lastMessageId={lastMessageId} 
                                />}
                            <input 
                                type='text' 
                                className='messenger-input__text'
                                value={content} 
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                            />
                            <button 
                                className='messenger-input__button' 
                                onClick={sendMessage} 
                                aria-label="Send message button"
                                disabled={!content}>
                                <i className="fas fa-arrow-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )



    } 

}
