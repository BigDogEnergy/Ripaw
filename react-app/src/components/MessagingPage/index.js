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
    const { sendMessage, deleteMessage, socket } = useSocket();

        // This is a PLACEHOLDER for presentation. Update later.
        // or return an empty array if there are no messages or if no conversation is selected
        const currentMessages = activeConversation ? conversations[activeConversation]?.messages || [] : [];

        // Identifying last message for Delete
        const sentMessages = currentMessages.filter(message => message.sender_id === currentUser);
        const lastMessageId = sentMessages.length > 0 
            ? sentMessages[sentMessages.length - 1].id 
            : null;


    //Fix this: We only want to grab friends. Need some more code to create that.
    useEffect(() => {
        dispatch(fetchAllUsers()).then(() => {
            setUsersLoading(false);
        });
    }, [currentUser])

    // ********** Messenger-related useEffect ********** //
    useEffect(() => {

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
    
    }, [dispatch, currentUser, targetUser, socket, conversations, convoLoading, errorMessage]);
    


    
    // ********** User Action Handlers ********** //
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

    const handleNewMessage = () => {
        sendMessage({
            receiver_id: targetUser,
            sender_id: currentUser,
            content: content
        });
        setContent('');
    };
    


    if (!currentUser) {
        history.push('/')
        return null;
    }
    else {

        if (usersLoading) {
            return <div>Loading...</div>;
        };

        return (
            <>
                <div className='messenger-main__container'>
                    
                    <div className='messenger-userlist__container'>
                        <div className='messenger-userlist__title'> 
                        Friends:
                        </div>
                        {!usersLoading && <UserTiles 
                            setTargetUser={setTargetUser} 
                            handleConversationSelect={handleConversationSelect} 
                        />}
                    </div>

                    <div className='messenger-convo__container'>
                        <div className='messenger-content__tile'>
                            {!convoLoading && activeConversation && 
                            <MessageContentTiles 
                                messages={currentMessages}
                            />}
                        </div>
                        
                        {activeConversation && (
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
                                    onClick={handleNewMessage} 
                                    aria-label="Send message button"
                                    disabled={!content}>
                                    <i className="fas fa-arrow-up"></i>
                                </button>
                            </div>
                         )}
                    </div>
                </div>
            </>
        )



    } 

}
