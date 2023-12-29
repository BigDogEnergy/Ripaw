import { useSocket } from "../../context/SocketProvider"
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editMessageThunk, fetchConversation } from "../../store/messages";
import { fetchAllUsers } from "../../store/users";
import UserTiles from "../MessagingUserTile";
import MessageContentTiles from "../MessagingContentTile";
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
    const [ usersLoading, setUsersLoading ] = useState(true);
    const [ convoLoading, setConvoLoading ] = useState(true);

    useEffect(() => {
        dispatch(fetchAllUsers()).then(() => {
            setUsersLoading(false);
        });

        const newMessageHandler = async (message) => {
            // console.log("Received message:", message);
        
            if ((message.receiver_id === targetUser || message.sender_id === targetUser) &&
            (message.receiver_id === currentUser || message.sender_id === currentUser)) {
                try {
                    setConvoLoading(true);
                    await dispatch(fetchConversation(currentUser, targetUser));
                    setConvoLoading(false);
                } catch (error) {
                    console.error('Error fetching conversation', {errorMessage: error} );
                    setConvoLoading(false);
                }
            }
        };

        const editMessageHandler = async (message) => {
            console.log('we are editing:', message)
            if (message.sender_id === currentUser) {
                try {
                    setConvoLoading(true);
                    await dispatch(editMessageThunk(message.id, message.content))
                    setConvoLoading(false);
                } catch (error) {
                    console.error('Error Updating conversation', {errorMessage: error} );
                    setConvoLoading(false);
                }
            }
        }
        

        socket.on('new_message', newMessageHandler);
        socket.on('edit_message', editMessageHandler);

        return () => {
            socket.off('new_message', newMessageHandler);
            socket.off('edit_message', editMessageHandler);
        };
    
    }, [dispatch, currentUser, targetUser, socket]);
    

    const handleConversationSelect = (targetUser) => {
        dispatch(fetchConversation(currentUser, targetUser)).then(() => {
            setActiveConversation(targetUser);
        });
    };
    
    const handleInputChange = (e) => {
        setContent(e.target.value);
    };

    if (!currentUser) {
        history.push('/')
        return null;
    }
    else {

        const sendMessage = () => {
            if (socket) {

                socket.emit('message', { 
                    receiver_id: targetUser,
                    sender_id: currentUser, 
                    content: content, 
                });
                setContent('');        
            } else {
                console.log('Socket not connected');
            }
        };

        // This is a PLACEHOLDER for presentation. Update later.
        // This line will get the messages for the active conversation
        // or return an empty array if there are no messages or if no conversation is selected
        const currentMessages = activeConversation ? conversations[activeConversation]?.messages.slice(-5) || [] : [];

        if (usersLoading) {
            return <div>Loading...</div>;
        };

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
                            <MessageContentTiles 
                                messages={currentMessages}
                            />
                        </div>
                        <div className='messenger-input__container'>
                            <input 
                                type='text' 
                                className='messenger-input__text'
                                value={content} 
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                            />
                            <button className='messenger-input__button' onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </>
        )



    } 

}
