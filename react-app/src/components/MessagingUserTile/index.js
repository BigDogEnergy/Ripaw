import React from 'react';
import { useSelector } from 'react-redux';
import './MessagingUserTile.css'

function UserTiles( {setTargetUser, handleConversationSelect} ) {
    
    const users = useSelector(state => state.users.availableUsers);

    const handleClick = (userId) => {
        setTargetUser(userId);
        handleConversationSelect(userId);
    };

    return (
        <div className="user-tile__container">
            {users.map(user => (
                <div key={user.id} className="user-tile__main" onClick={() => handleClick(user.id)}>
                    <div className="user-info__container">
                        <div className="user-info__username">
                            {user.username}
                            </div>
                        {user.type === 'Admin' && (
                            <div className="user-info__type">
                                {user.type}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UserTiles;
