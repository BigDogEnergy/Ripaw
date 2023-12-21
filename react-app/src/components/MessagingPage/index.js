import { useSocket } from "../../context/SocketProvider"
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchConversation } from "../../store/messages";
import { fetchAllUsers } from "../../store/users";
import UserTiles from "../MessagingUserTile";

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
    

    if (!currentUser) {
        history.push('/')
        return null;
    }
    else if (currentUser) {

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

        return (
            <>
            <div className='messenger-main__container'>
                <div className='messenger-main__body'>
                    <div className='messenger-userlist__container'>
                        <UserTiles />
                    </div>
                    <div className='messenger-content__tile'>
                        Message Content Placeholder
                    </div>
                    <div className='messenger-input__container'>
                        Text input Container Placeholder
                    </div>
                </div>
                
            </div>
                {/* These are test buttons
                <button onClick={sendMessage}>Send Test Message</button>
                <button onClick={convoFetchTest}>Convo Fetch Button (assign targets)</button>
                <button onClick={userFetchTest}>User Fetch Button</button> */}

            </>
        )



    } else {
        return null
    }
    
    

}
