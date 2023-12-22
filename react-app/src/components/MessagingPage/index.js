import { useSocket } from "../../context/SocketProvider"
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchConversation } from "../../store/messages";
import { fetchAllUsers } from "../../store/users";
import UserTiles from "../MessagingUserTile";
import './MessagingPage.css'

export default function MessagingPage() {

    const socket = useSocket();
    const history = useHistory();
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.messages.chatData);
    const currentUser = useSelector(state => state.session.user.id);
    const [ activeConversation, setActiveConversation ] = useState(null);
    const [ targetUser, setTargetUser ] = useState('');
    const [ content, setContent ] = useState('');
    const [ usersLoading, setUsersLoading ] = useState(true);
    // const [ conversationsLoading, setConversationsLoading ] = useState(true);

    useEffect(() => {
        dispatch(fetchAllUsers()).then(() => {
            setUsersLoading(false);
        });
    
    }, [dispatch]);
    

    const handleConversationSelect = (targetUser) => {
        dispatch(fetchConversation(currentUser, targetUser)).then( () => {
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
                console.log('sendMessage Triggered')
                socket.emit('message', { 
                    receiver_id: targetUser.id,
                    sender_id: currentUser, 
                    content: content, 
                });
            } else {
                console.log('Socket not connected');
            }
        };

        const convoFetch = () => {
            if (currentUser && targetUser) {
                dispatch(fetchConversation(currentUser, targetUser));
            };
        };

        if (usersLoading) {
            return <div>Loading...</div>;
        }

        return (
            <>
            <div className='messenger-main__container'>
                
                <div className='messenger-userlist__container'>
                    {!usersLoading && <UserTiles setTargetUser={setTargetUser} handleConversationSelect={handleConversationSelect} />}
                </div>

                <div className='messenger-convo__container'>
                    <div className='messenger-content__tile'>
                        Message Content Placeholder
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
                {/* These are test buttons
                <button onClick={sendMessage}>Send Test Message</button>
                <button onClick={convoFetchTest}>Convo Fetch Button (assign targets)</button>
                <button onClick={userFetchTest}>User Fetch Button</button> */}

            </>
        )



    } 

}
