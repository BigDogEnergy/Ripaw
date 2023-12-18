import { useSocket } from "../../context/SocketProvider"
import React from "react";
import { useSelector } from "react-redux";

export default function MessagingPage() {

    const currentUser = useSelector(state => state.session.user)
    const socket = useSocket();


    if (currentUser) {
        console.log(currentUser)

        const sendMessage = () => {
            if (socket) {
                socket.emit('message', { 
                    receiver_id: currentUser.id,
                    sender_id: 2, 
                    content: 'Chihuahuas are just cats', 
                });
            } else {
                console.log('Socket not connected');
            }
        };

        return (
            <>
                <button onClick={sendMessage}>Send Test Message</button>
            </>
        )



    } else {
        return null
    }
    
    

}
