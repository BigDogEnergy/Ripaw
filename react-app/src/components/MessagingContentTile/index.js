import './MessagingContentTile.css';
import React from 'react';
import { useSelector } from 'react-redux';


function MessageContentTiles({ messages }) {

    const currentUser = useSelector(state => state.session.user.id);

    return (
        <div className="message-tiles__container">
            {messages.map(message => (
                <div key={message.id} className={`message-tile${message.sender_id === currentUser ? '__sent' : '__received'}`}>
                    
                    <div className="message-tile__content">
                        {message.content}
                    </div>
                    <div className="message-tile__timestamp">
                        {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MessageContentTiles;