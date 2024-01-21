import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children, currentUser }) => {
    
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL;

        const newSocket = io(server, {
            // Options can be added here if any are needed in the future
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(`SocketProvider Connected on ${server}`);
            // Global Connection logic
            if (currentUser && currentUser.id) {
                newSocket.emit('join_room', { user_id: currentUser.id });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('SocketProvider Disconnected');
            // Global Disconnect logic
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};