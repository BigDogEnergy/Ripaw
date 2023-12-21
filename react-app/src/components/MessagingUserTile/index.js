import React from 'react';
import { useSelector } from 'react-redux';

function UserTiles() {
    const users = useSelector(state => state.users.availableUsers);

    return (
        <div className="user-tile__container">
            {users.map(user => (
                <div key={user.id} className="user-tile__main">
                    <div className="user-info__container">
                        <div className="user-info__username">{user.username}</div>
                        <div className="user-info__type">{user.type}</div>
                        {/* Placeholder data above */}
                    </div>
                    {/* TO DO: Add an onClick handler to start a conversation with this user */}
                </div>
            ))}
        </div>
    );
}

export default UserTiles;
