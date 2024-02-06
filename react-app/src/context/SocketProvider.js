import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.disconnect();
        };
    }, [currentUser]);

    // send Message 
    const sendMessage = useCallback(({ receiver_id, sender_id, content }) => {
        if (socket.connected) {
            socket.emit('message', { 
                receiver_id, 
                sender_id, 
                content 
            });
        }
    }, [socket]);

    // delete Message
    const deleteMessage = useCallback((id) => {
        if (socket.connected) {
            socket.emit('delete_message', { id });
        }
    }, [socket]);

    const value = { socket, sendMessage, deleteMessage }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};