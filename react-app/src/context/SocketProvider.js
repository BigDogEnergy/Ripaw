import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children, currentUser }) => {
    
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // const newSocket = io('localhost:5000', { 
        // });
        // setSocket(newSocket);

        const newSocket = io('ripbawbanking.onrender.com', { 
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('SocketProvider Connected');
            // Global Connection logic here
            if (currentUser && currentUser.id) {
                newSocket.emit('join_room', { user_id: currentUser.id });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('SocketProvider Disconnected');
            // Global Disconnect logic Here
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